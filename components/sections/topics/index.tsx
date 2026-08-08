'use client';

import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Divide, Minus, Plus, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Draggable, Observer);
}

import { CapabilityStatusBadge } from '@/components/ui/capability-status';
import {
  CAPABILITY_STATUSES,
  type CapabilityStatus,
  SECTION_IDS,
  TOPICS_SECTION,
} from '@/lib/content/landing-copy';
import { TOPIC_AREAS } from '@/lib/content/landing-evidence';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { gsapEase, motionTokens } from '@/lib/motion-tokens';

const TOPIC_ICONS = [Plus, Minus, X, Divide, Plus, Minus];

/**
 * Renders a localized capabilities section with status filtering and an interactive topics carousel.
 *
 * @returns The capabilities section UI.
 */
export function TopicsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState<CapabilityStatus | 'all'>('all');
  const prefersReducedMotion = usePrefersReducedMotion();

  const visibleAreas =
    statusFilter === 'all' ? TOPIC_AREAS : TOPIC_AREAS.filter((t) => t.status === statusFilter);

  const filterChipClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium border transition-colors focus-ring-target min-h-[44px] ${
      active
        ? 'bg-primary text-text-inverse border-primary'
        : 'bg-card text-text-secondary border-border hover:border-primary'
    }`;

  // Filter change: jump back to the first card — stale indices/bounds would
  // otherwise point at cards that no longer exist.
  // biome-ignore lint/correctness/useExhaustiveDependencies: statusFilter is an intentional trigger — body never reads it, but the reset must run on every filter change.
  useEffect(() => {
    setActiveIndex(0);
    if (trackRef.current) gsap.set(trackRef.current, { x: 0 });
  }, [statusFilter]);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) {
      // Ensure section title is visible when motion is disabled
      const title = sectionRef.current.querySelector('.section-title');
      if (title) gsap.set(title, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const sectionTitle = sectionRef.current?.querySelector('.section-title');
      if (!sectionTitle) return;

      gsap.fromTo(
        sectionTitle,
        { y: motionTokens.distance.xl, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: motionTokens.duration.slow,
          ease: gsapEase(motionTokens.easing.smooth),
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: statusFilter is an intentional trigger — filter changes must rebuild Draggable even when visibleAreas.length coincides across filters.
  useEffect(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const trackParent = track.parentElement;
    if (!trackParent) return;

    const ctx = gsap.context(() => {
      Draggable.create(track, {
        type: 'x',
        bounds: {
          minX: -track.scrollWidth + trackParent.clientWidth,
          maxX: 0,
        },
        inertia: !prefersReducedMotion,
        throwResistance: 0.5,
        onDragEnd: function () {
          const range = track.scrollWidth - trackParent.clientWidth;
          if (range <= 0) {
            setActiveIndex(0);
            return;
          }
          const progress = Math.abs(this.x / range);
          const newIndex = Math.round(progress * (visibleAreas.length - 1));
          setActiveIndex(Math.min(newIndex, visibleAreas.length - 1));
        },
      });
    }, track);

    return () => ctx.revert();
  }, [prefersReducedMotion, statusFilter, visibleAreas.length]);

  // Extracted movement logic shared by scrollTo, handleDotClick, and the
  // Observer callbacks — uses gsap.set so Draggable shares the transform cache.
  const moveToIndex = useCallback(
    (index: number) => {
      if (!trackRef.current) return;
      setActiveIndex(index);

      const range =
        trackRef.current.scrollWidth - (trackRef.current.parentElement?.clientWidth ?? 0);
      // Single-card filter has no travel; guard the divide-by-zero too.
      const targetX =
        visibleAreas.length <= 1 || range <= 0 ? 0 : -(index / (visibleAreas.length - 1)) * range;

      if (prefersReducedMotion) {
        gsap.set(trackRef.current, { x: targetX });
      } else {
        gsap.killTweensOf(trackRef.current);
        gsap.to(trackRef.current, {
          x: targetX,
          duration: motionTokens.duration.normal,
          ease: gsapEase(motionTokens.easing.standard),
          overwrite: 'auto',
        });
      }
    },
    [prefersReducedMotion, visibleAreas.length],
  );

  const scrollTo = useCallback(
    (direction: 'prev' | 'next') => {
      if (!trackRef.current) return;
      const newIndex =
        direction === 'next'
          ? Math.min(activeIndex + 1, visibleAreas.length - 1)
          : Math.max(activeIndex - 1, 0);
      moveToIndex(newIndex);
    },
    [activeIndex, moveToIndex, visibleAreas.length],
  );

  // Stable ref so Observer callbacks don't need scrollTo / moveToIndex in deps
  const moveToIndexRef = useRef(moveToIndex);
  const activeIndexRef = useRef(activeIndex);

  // Keep both refs current after every committed render so Observer
  // callbacks always see the latest values without depending on them.
  useEffect(() => {
    moveToIndexRef.current = moveToIndex;
    activeIndexRef.current = activeIndex;
  });

  // Observer: horizontal wheel/swipe on carousel viewport → prev/next navigation
  useEffect(() => {
    if (!viewportRef.current || prefersReducedMotion) return;

    const viewport = viewportRef.current;

    const ctx = gsap.context(() => {
      Observer.create({
        target: viewport,
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        onRight: () =>
          moveToIndexRef.current(Math.min(activeIndexRef.current + 1, visibleAreas.length - 1)),
        onLeft: () => moveToIndexRef.current(Math.max(activeIndexRef.current - 1, 0)),
        tolerance: 20,
      });
    }, viewport);

    return () => ctx.revert();
  }, [prefersReducedMotion, visibleAreas.length]);

  const handleDotClick = (index: number) => {
    moveToIndex(index);
  };

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.capabilities}
      className='relative py-24 md:py-32 lg:py-40 bg-surface overflow-hidden'
    >
      <div className='absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-transparent pointer-events-none' />

      <div className='relative z-10'>
        {/* Section Title */}
        <div className='container mx-auto px-4 md:px-8 lg:px-16 mb-12 md:mb-16'>
          <div className='section-title text-center'>
            <span className='inline-block text-primary text-sm uppercase tracking-widest mb-4 font-mono'>
              Õppesisu
            </span>
            <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-primary mb-6'>
              {TOPICS_SECTION.heading}
            </h2>
            <p className='text-lg md:text-xl text-text-secondary max-w-2xl mx-auto'>
              {TOPICS_SECTION.description}
            </p>
          </div>
        </div>

        {/* Status filter */}
        <fieldset
          aria-label='Filtreeri teemasid staatuse järgi'
          className='container mx-auto px-4 md:px-8 lg:px-16 mb-10 flex flex-wrap justify-center gap-2'
        >
          <button
            type='button'
            onClick={() => setStatusFilter('all')}
            aria-pressed={statusFilter === 'all'}
            className={filterChipClass(statusFilter === 'all')}
          >
            Kõik
          </button>
          {CAPABILITY_STATUSES.map((status) => (
            <button
              key={status}
              type='button'
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
              className={filterChipClass(statusFilter === status)}
            >
              {status}
            </button>
          ))}
        </fieldset>

        {/* Topics Carousel */}
        <div className='relative'>
          {/* Nav Buttons */}
          <button
            type='button'
            onClick={() => scrollTo('prev')}
            className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-elevated border border-border flex items-center justify-center hover:border-primary transition-colors disabled:opacity-30 focus-ring-target'
            disabled={activeIndex === 0}
            aria-label='Eelmine teema'
          >
            <ChevronLeft className='w-6 h-6 text-text-primary' />
          </button>

          <button
            type='button'
            onClick={() => scrollTo('next')}
            className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-elevated border border-border flex items-center justify-center hover:border-primary transition-colors disabled:opacity-30 focus-ring-target'
            disabled={activeIndex === visibleAreas.length - 1}
            aria-label='Järgmine teema'
          >
            <ChevronRight className='w-6 h-6 text-text-primary' />
          </button>

          {/* Carousel Track */}
          <div ref={viewportRef} className='overflow-hidden px-4 md:px-8 lg:px-16'>
            <div
              ref={trackRef}
              className='flex gap-6 md:gap-8 cursor-grab active:cursor-grabbing'
              style={{ width: 'max-content' }}
            >
              {visibleAreas.map((topic, index) => {
                const Icon = TOPIC_ICONS[index % TOPIC_ICONS.length];

                return (
                  <div
                    key={topic.name}
                    className={`flex-shrink-0 w-[320px] md:w-[400px] group ${
                      index === activeIndex ? 'scale-100' : 'scale-95 opacity-70'
                    } transition-all duration-500`}
                  >
                    <div className='card h-full p-8 relative overflow-hidden group-hover:border-primary/30 transition-colors'>
                      {/* Status badge */}
                      <div className='absolute top-4 right-4'>
                        <CapabilityStatusBadge status={topic.status} />
                      </div>

                      {/* Icon */}
                      <div className='w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6'>
                        <Icon className='w-7 h-7 text-primary' />
                      </div>

                      {/* Title */}
                      <h3 className='text-2xl font-display font-bold text-text-primary mb-3'>
                        {topic.name}
                      </h3>

                      {/* Metadata */}
                      <div className='bg-elevated rounded-lg p-4 mb-4 border border-border'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-text-secondary'>{topic.grade}</span>
                          <span className='font-medium text-text-primary'>
                            {topic.skillCount} oskust
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className='text-text-secondary text-sm leading-relaxed'>
                        Harjutused katavad erinevaid raskusastmeid ja õppekava nõudeid.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className='flex justify-center gap-2 mt-8'>
            {visibleAreas.map((area, index) => (
              <button
                key={area.name}
                type='button'
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all focus-ring-target min-w-[44px] min-h-[44px] flex items-center justify-center`}
                aria-label={`Mine slaidile ${index + 1}`}
              >
                <span
                  className={`block w-2 h-2 rounded-full transition-all ${
                    index === activeIndex ? 'bg-primary w-6' : 'bg-border hover:bg-border-strong'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Status Legend */}
        <div className='container mx-auto px-4 md:px-8 lg:px-16 mt-12'>
          <div className='max-w-2xl mx-auto bg-card rounded-lg p-6 border border-border'>
            <div className='text-sm text-text-secondary text-center'>
              <span className='font-medium text-text-primary'>Staatus näitab teema küpsust:</span>{' '}
              Saadaval = kasutusvalmis, Piloodis = testimisel, Kavandatud = arenduses
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

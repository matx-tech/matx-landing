'use client';

import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useRegistration } from '@/components/providers/registration-provider';
import { CALENDLY_URL } from '@/lib/content/landing-copy';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { gsapEase, motionTokens, staggers } from '@/lib/motion-tokens';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
}

// MotionPathPlugin (~12KB) is only used by the decorative dot — keep it in its
// own on-demand chunk, fetched only when the section effect actually needs it.
// The promise is cached across mounts/effect re-runs; on failure it's dropped
// so a later mount can retry (callers attach their own rejection handler).
let motionPathPluginPromise: Promise<typeof import('gsap/MotionPathPlugin')> | null = null;
/**
 * Loads the GSAP MotionPathPlugin and reuses the pending or resolved load.
 *
 * @returns The loaded MotionPathPlugin module
 */
function loadMotionPathPlugin(): Promise<typeof import('gsap/MotionPathPlugin')> {
  if (!motionPathPluginPromise) {
    motionPathPluginPromise = import('gsap/MotionPathPlugin').catch((error) => {
      motionPathPluginPromise = null;
      throw error;
    });
  }
  return motionPathPluginPromise;
}

/**
 * Renders a call-to-action section for school registration and teacher consultations.
 */
export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const motionDotRef = useRef<SVGCircleElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { openRegistration } = useRegistration();

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const lines = titleRef.current.querySelectorAll('.cta-line');

    if (prefersReducedMotion) {
      gsap.set(lines, { y: 0, opacity: 1 });
      const statTargets = statsRef.current.filter(Boolean);
      if (statTargets.length > 0) {
        gsap.set(statTargets, { opacity: 1 });
      }
      return;
    }

    let cancelled = false;
    let motionTween: ReturnType<typeof gsap.to> | null = null;

    const ctx = gsap.context(() => {
      gsap.set(lines, { y: motionTokens.distance.xxl, opacity: 0 });

      // Pre-create title line tweens so they're tracked and reverted on unmount
      const titleTween = gsap.to(lines, {
        y: 0,
        opacity: 1,
        duration: motionTokens.duration.normal,
        stagger: staggers.card,
        ease: gsapEase(motionTokens.easing.emphasized),
        paused: true,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => titleTween.play(),
      });

      // Stat number scramble — triggers once when stats container enters viewport
      const statTargets = statsRef.current.filter(Boolean);
      const statEnterTween =
        statTargets.length > 0
          ? gsap.fromTo(
              statTargets,
              { opacity: 0, y: motionTokens.distance.md },
              {
                opacity: 1,
                y: 0,
                duration: motionTokens.duration.slow,
                ease: gsapEase(motionTokens.easing.smooth),
                paused: true,
              },
            )
          : null;

      if (statEnterTween) {
        ScrollTrigger.create({
          trigger: statsRef.current[0]?.parentElement,
          start: 'top 85%',
          onEnter: () => statEnterTween.play(),
        });
      }

      // Timing: when the stats section enters viewport, scramble each number
      // Derive target text from the element's rendered content so it stays in
      // sync with the JSX without duplicating literals.
      const statValues: { element: HTMLDivElement | null; target: string; chars: string }[] = [
        {
          element: statsRef.current[0],
          target: statsRef.current[0]?.textContent ?? '150+',
          chars: '0123456789+',
        },
        {
          element: statsRef.current[1],
          target: statsRef.current[1]?.textContent ?? '10',
          chars: '0123456789',
        },
      ];

      statValues.forEach(({ element, target, chars }) => {
        if (!element) return;

        const scrambleTween = gsap.to(element, {
          scrambleText: { text: target, chars, revealDelay: 0.3, speed: 0.6 },
          duration: motionTokens.duration.slow,
          paused: true,
        });

        ScrollTrigger.create({
          trigger: element,
          start: 'top 85%',
          onEnter: () => scrambleTween.play(),
        });
      });

      // CTA cards — staggered scroll-triggered entrance
      const cardTargets = ctaCardsRef.current.filter(Boolean);
      const ctaCardTween =
        cardTargets.length > 0
          ? gsap.fromTo(
              cardTargets,
              { y: motionTokens.distance.lg, opacity: 0, scale: 0.97 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: motionTokens.duration.slow,
                stagger: staggers.card,
                ease: gsapEase(motionTokens.easing.smooth),
                paused: true,
              },
            )
          : null;

      if (ctaCardTween && ctaCardsRef.current[0]) {
        ScrollTrigger.create({
          trigger: ctaCardsRef.current[0],
          start: 'top 85%',
          onEnter: () => ctaCardTween.play(),
        });
      }

      // Marquee SVG — fade in on scroll
      if (marqueeRef.current) {
        const marqueeTween = gsap.fromTo(
          marqueeRef.current,
          { opacity: 0, y: motionTokens.distance.md },
          {
            opacity: 1,
            y: 0,
            duration: motionTokens.duration.slow,
            ease: gsapEase(motionTokens.easing.smooth),
            paused: true,
          },
        );

        ScrollTrigger.create({
          trigger: marqueeRef.current,
          start: 'top 90%',
          onEnter: () => marqueeTween.play(),
        });
      }

      // MotionPath: decorative dot follows the SVG text curve on scroll.
      if (motionDotRef.current && document.querySelector('#ctaPath')) {
        void loadMotionPathPlugin()
          .then(({ MotionPathPlugin }) => {
            if (cancelled) return;
            gsap.registerPlugin(MotionPathPlugin);
            motionTween = gsap.to(motionDotRef.current, {
              motionPath: {
                path: '#ctaPath',
                align: '#ctaPath',
                alignOrigin: [0.5, 0.5],
              },
              duration: motionTokens.duration.crawl,
              ease: gsapEase(motionTokens.easing.linear),
              scrollTrigger: {
                trigger: marqueeRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1,
              },
            });
          })
          // Decorative dot — fail silently if the on-demand chunk can't load.
          .catch(() => {});
      }
    }, sectionRef);

    return () => {
      cancelled = true;
      // Kill the scrub ScrollTrigger before the tween — the trigger can
      // outlive the tween and keep a dead scrub attached to the marquee.
      motionTween?.scrollTrigger?.kill();
      motionTween?.kill();
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className='relative py-24 md:py-32 lg:py-40 bg-surface overflow-hidden'
    >
      {/* Background */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50' />
        <div className='absolute inset-0 bg-gradient-brand opacity-5' />
      </div>

      <div className='relative z-10 container mx-auto px-4 md:px-8 lg:px-16 text-center'>
        {/* Title */}
        <div ref={titleRef} className='max-w-4xl mx-auto mb-16'>
          <div className='cta-line'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text-primary mb-4'>
              Iga õpilane väärib personaalset matemaatikaõpetajat.
            </h2>
          </div>
          <div className='cta-line mt-4'>
            <p className='text-text-secondary'>
              Pilootkatsetus on 100% tasuta. Targa Tuleviku Fondi toetusel.
            </p>
          </div>
        </div>

        {/* Dual CTAs */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16'>
          {/* Student CTA */}
          <div
            ref={(el) => {
              ctaCardsRef.current[0] = el;
            }}
            className='card p-8 text-center hover:border-primary/30 transition-colors'
          >
            <GraduationCap className='w-10 h-10 text-primary mx-auto mb-4' />
            <h3 className='text-xl font-display font-semibold text-text-primary mb-2'>
              Koolide registreerimine
            </h3>
            <p className='text-text-secondary text-sm mb-6'>
              Liitu 10 pilootkooliga. Sügisesed klassid 7.-9. klassini.
            </p>
            <button
              type='button'
              onClick={openRegistration}
              className='w-full px-6 py-3 text-base rounded-xl bg-primary text-text-inverse font-semibold hover:bg-primary/90 transition-all focus-ring-target min-h-[44px]'
            >
              Registreeri kool
            </button>
            <div className='mt-4 flex justify-center gap-4 text-xs text-text-secondary'>
              <span>Tasuta</span>
              <span>·</span>
              <span>48h vastus</span>
            </div>
          </div>

          {/* Teacher CTA */}
          <div
            ref={(el) => {
              ctaCardsRef.current[1] = el;
            }}
            className='card p-8 text-center hover:border-secondary/30 transition-colors'
          >
            <Users className='w-10 h-10 text-secondary mx-auto mb-4' />
            <h3 className='text-xl font-display font-semibold text-text-primary mb-2'>
              Õpetajatele
            </h3>
            <p className='text-text-secondary text-sm mb-6'>
              Demostreerime platvormi ja vastame küsimustele.
            </p>
            <a
              href={CALENDLY_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='block w-full px-6 py-3 text-base rounded-xl bg-secondary text-text-inverse font-semibold hover:bg-secondary/90 transition-all focus-ring-target min-h-[44px]'
            >
              Broneeri 15-min vestlus
              <span className='sr-only'> (avaneb uues aknas)</span>
            </a>
            <div className='mt-4 flex justify-center gap-4 text-xs text-text-secondary'>
              <span>Video kõne</span>
              <span>·</span>
              <span>Kohandatud aeg</span>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div ref={marqueeRef} className='relative w-full overflow-hidden py-8'>
          <svg
            viewBox='0 0 600 30'
            className='w-full max-w-2xl mx-auto opacity-50'
            preserveAspectRatio='xMidYMid meet'
          >
            <title>MATx reklaamlint: Alusta tasuta, õpi mõistvalt, säästa aega</title>
            <path id='ctaPath' d='M 100 15 Q 300 5 500 15' fill='none' stroke='none' />
            <text fontSize='12' fill='var(--color-text-secondary)'>
              <textPath href='#ctaPath'>
                Alusta tasuta · Õpi mõistvalt · Säästa aega · 150+ ülesannet · Alusta tasuta · Õpi
                mõistvalt · Säästa aega · 150+ ülesannet ·
              </textPath>
            </text>
            <circle
              ref={motionDotRef}
              cx='0'
              cy='0'
              r='3'
              fill='var(--color-primary)'
              opacity='0.8'
            />
          </svg>
        </div>

        {/* Stats */}
        <div className='flex flex-wrap justify-center gap-8 mt-12'>
          <div className='text-center'>
            <div
              ref={(el) => {
                statsRef.current[0] = el;
              }}
              className='text-3xl md:text-4xl font-display font-bold text-primary'
            >
              150+
            </div>
            <div className='text-text-secondary text-sm'>ülesannet (Saadaval)</div>
          </div>
          <div className='text-center'>
            <div
              ref={(el) => {
                statsRef.current[1] = el;
              }}
              className='text-3xl md:text-4xl font-display font-bold text-secondary'
            >
              10
            </div>
            <div className='text-text-secondary text-sm'>kooli (Piloodis)</div>
          </div>
        </div>

        {/* Grant info */}
        <div className='mt-12 inline-flex items-center gap-4 px-6 py-3 rounded-xl bg-elevated border border-border'>
          <span className='text-text-secondary text-sm'>
            Taotlus esitatakse Targa Tuleviku Fondile — tähtaeg 31. august 2026
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * National Context Section
 * Provides relevance with source-linked facts, no fear-led statistics
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NATIONAL_CONTEXT, SECTION_IDS } from '@/lib/content/landing-copy';
import { TrendingDown, Clock, Minus } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { motionTokens, gsapEase, staggers } from '@/lib/motion-tokens';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CONTEXT_ICONS: Record<string, typeof TrendingDown | typeof Clock | typeof Minus> = {
  'trending-down': TrendingDown,
  'clock': Clock,
  'minus': Minus,
};

export function ContextSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) {
      // Ensure all animated elements are visible when motion is disabled
      const title = sectionRef.current.querySelector('.section-title');
      if (title) gsap.set(title, { opacity: 1, y: 0 });
      const cards = sectionRef.current.querySelectorAll('.context-card');
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Section heading scrub
      const sectionTitle = sectionRef.current!.querySelector('.section-title');
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
        }
      );

      // Context cards — batched ScrollTrigger
      const cards = gsap.utils.toArray<HTMLDivElement>('.context-card', sectionRef.current);

      ScrollTrigger.batch(cards, {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: motionTokens.distance.md },
            {
              opacity: 1,
              y: 0,
              duration: motionTokens.duration.slow,
              stagger: staggers.card,
              ease: gsapEase(motionTokens.easing.smooth),
            }
          );
        },
        onLeaveBack: (elements) => {
          gsap.to(elements, {
            opacity: 0,
            y: motionTokens.distance.md,
            duration: motionTokens.duration.fast,
            stagger: staggers.card,
            ease: gsapEase(motionTokens.easing.accelerate),
          });
        },
        start: 'top 85%',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.context}
      className="py-24 md:py-32 lg:py-40 bg-surface"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Miks MATx on asjakohane
          </h2>
          <p className="text-lg text-text-secondary">
            Eesti hariduskontekst, mis annab tausta meie tööle
          </p>
        </div>

        {/* Context cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {NATIONAL_CONTEXT.map((context) => {
            const Icon = CONTEXT_ICONS[context.icon];

            return (
              <div
                key={context.title}
                className="context-card bg-card rounded-xl p-6 shadow-sm border border-border"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center mb-4">
                  {Icon && <Icon className="w-5 h-5 text-text-secondary" />}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  {context.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary mb-4">
                  {context.description}
                </p>

                {/* Source */}
                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-text-secondary mb-1">
                    <span className="font-medium">Allikas:</span> {context.source}
                  </div>
                  <div className="text-xs text-amber-800 bg-amber-50 px-2 py-1 rounded mt-2 inline-block">
                    {context.limitation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-sm text-text-secondary">
            Need faktid annavad konteksti, miks hariduse toetamiseks on vaja uusi tööriistu.
            MATx ei väida, et on lahendanud neid probleeme – oleme üks katse aidata.
          </p>
        </div>
      </div>
    </section>
  );
}

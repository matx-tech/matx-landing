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
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Miks MATx on asjakohane
          </h2>
          <p className="text-lg text-muted-foreground">
            Eesti hariduskontekst, mis annab tausta meie tööle
          </p>
        </div>

        {/* Context cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {NATIONAL_CONTEXT.map((context, index) => {
            const Icon = CONTEXT_ICONS[context.icon];

            return (
              <div
                key={context.title}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="bg-card rounded-xl p-6 shadow-sm border border-border"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                  {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {context.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {context.description}
                </p>

                {/* Source */}
                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-1">
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
          <p className="text-sm text-muted-foreground">
            Need faktid annavad konteksti, miks hariduse toetamiseks on vaja uusi tööriistu.
            MATx ei väida, et on lahendanud neid probleeme – oleme üks katse aidata.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Evidence Loop Section
 * Four-stage workflow: answer → interpret → target → decide
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EVIDENCE_STAGES, SECTION_IDS } from '@/lib/content/landing-copy';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { motionTokens, gsapEase } from '@/lib/motion-tokens';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Renders the evidence workflow stages with responsive layout and scroll-based animations.
 */
export function EvidenceLoopSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stagesRef = useRef<(HTMLLIElement | null)[]>([]);
  const connectorRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) {
      // Ensure all animated elements are visible when motion is disabled
      stagesRef.current.forEach((stage) => {
        if (stage) gsap.set(stage, { opacity: 1, y: 0 });
      });
      if (connectorRef.current) gsap.set(connectorRef.current, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Animate stages sequentially
      stagesRef.current.forEach((stage) => {
        if (!stage) return;

        gsap.fromTo(
          stage,
          { opacity: 0, y: motionTokens.distance.lg },
          {
            opacity: 1,
            y: 0,
            duration: motionTokens.duration.slow,
            ease: gsapEase(motionTokens.easing.smooth),
            scrollTrigger: {
              trigger: stage,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Animate connector line
      if (connectorRef.current) {
        gsap.fromTo(
          connectorRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: motionTokens.duration.crawl,
            ease: gsapEase(motionTokens.easing.smooth),
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 40%',
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const caveatStyles: Record<string, string> = {
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    success: 'text-green-800 bg-green-50 border-green-200',
  };

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.workflow}
      className="py-24 md:py-32 lg:py-40 bg-canvas relative"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Kuidas töövoog toimib
          </h2>
          <p className="text-lg text-text-secondary">
            Neli sammu õpilase vastusest õpetaja otsuseni
          </p>
        </div>

        {/* Evidence stages */}
        <div className="max-w-4xl mx-auto relative">
          {/* Connector line */}
          <div
            ref={connectorRef}
            className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-green-400 origin-top hidden md:block"
            aria-hidden="true"
            style={{ transformOrigin: 'top' }}
          />

          {/* Stages list */}
          <ol className="space-y-8 relative">
            {EVIDENCE_STAGES.map((stage, index) => (
              <li
                key={stage.number}
                ref={(el) => {
                  stagesRef.current[index] = el;
                }}
                className="relative"
              >
                <div className="flex gap-6 items-start">
                  {/* Stage number */}
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-xl shadow-lg relative z-10"
                    aria-hidden="true"
                  >
                    {stage.number}
                  </div>

                  {/* Stage content */}
                  <div className="flex-1 bg-card rounded-xl p-6 shadow-sm border border-border">
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {stage.title}
                    </h3>
                    <p className="text-text-secondary">
                      {stage.description}
                    </p>

                    {/* Caveat (from centralized data) */}
                    {'caveat' in stage && (
                      <div className={`mt-3 text-sm px-3 py-2 rounded border ${caveatStyles[stage.tone] ?? caveatStyles.info}`}>
                        {stage.caveat}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

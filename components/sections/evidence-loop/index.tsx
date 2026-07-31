/**
 * Evidence Loop Section
 * Four-stage workflow: answer → interpret → target → decide
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EVIDENCE_STAGES } from '@/lib/content/landing-copy';
import { SECTION_IDS } from '@/lib/content/landing-copy';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function EvidenceLoopSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stagesRef = useRef<(HTMLLIElement | null)[]>([]);
  const connectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate stages sequentially
      stagesRef.current.forEach((stage, index) => {
        if (!stage) return;

        gsap.fromTo(
          stage,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
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
            duration: 1.2,
            ease: 'power2.inOut',
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.workflow}
      className="py-24 md:py-32 lg:py-40 bg-background relative"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Kuidas töövoog toimib
          </h2>
          <p className="text-lg text-muted-foreground">
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
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {stage.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {stage.description}
                    </p>

                    {/* Special notes for specific stages */}
                    {stage.number === 2 && (
                      <div className="mt-3 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded border border-blue-200">
                        Signaal on võimalik veamuster, mitte lõplik diagnoos
                      </div>
                    )}
                    {stage.number === 4 && (
                      <div className="mt-3 text-sm text-green-600 bg-green-50 px-3 py-2 rounded border border-green-200">
                        Õpetaja võib soovituse vastu võtta, muuta või eirata
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Accessibility: Text-only version for screen readers */}
        <div className="sr-only">
          <h3>Töövogu sammud:</h3>
          <ol>
            {EVIDENCE_STAGES.map((stage) => (
              <li key={stage.number}>
                <strong>{stage.title}:</strong> {stage.description}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/**
 * Student Section
 * Explains learner benefit without promising mastery
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STUDENT_STORY, SECTION_IDS } from '@/lib/content/landing-copy';
import { PRODUCT_FIXTURE } from '@/lib/content/landing-evidence';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function StudentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step, index) => {
        if (!step) return;

        gsap.fromTo(
          step,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.student}
      className="py-24 md:py-32 lg:py-40 bg-surface"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {STUDENT_STORY.heading}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {STUDENT_STORY.description}
            </p>

            {/* Student flow steps */}
            <ol className="space-y-6">
              <li
                ref={(el) => {
                  stepsRef.current[0] = el;
                }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Õpilane lahendab ülesande</h3>
                  <p className="text-sm text-muted-foreground">
                    Digitaalselt või paberil, oma tempos
                  </p>
                </div>
              </li>

              <li
                ref={(el) => {
                  stepsRef.current[1] = el;
                }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Saab arusaadava tagasiside</h3>
                  <p className="text-sm text-muted-foreground">
                    Selge selgitus, mitte ainult "vale" märge
                  </p>
                </div>
              </li>

              <li
                ref={(el) => {
                  stepsRef.current[2] = el;
                }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Proovib sihitud harjutust</h3>
                  <p className="text-sm text-muted-foreground">
                    Järgmine samm on selge ja asjakohane
                  </p>
                </div>
              </li>

              <li
                ref={(el) => {
                  stepsRef.current[3] = el;
                }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Jätkab harjutamist</h3>
                  <p className="text-sm text-muted-foreground">
                    Üks õige kordus ei tähenda veel valdamist
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Right: Example visualization */}
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              {PRODUCT_FIXTURE.label}
            </div>

            {/* Original task */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-foreground mb-2">Ülesanne</div>
              <div className="p-4 bg-surface rounded-lg border border-border">
                <div className="text-base font-medium text-foreground">
                  {PRODUCT_FIXTURE.task.question}
                </div>
              </div>
            </div>

            {/* Student response */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-foreground mb-2">Õpilase vastus</div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-base font-mono text-red-700">
                  {PRODUCT_FIXTURE.answer.submitted}
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-foreground mb-2">Tagasiside</div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  Oled proovinud liita lugejaid ja nimetajaid eraldi. Murdude liitmisel tuleb esmalt leida ühine nimetaja.
                </p>
              </div>
            </div>

            {/* Next exercise */}
            <div>
              <div className="text-sm font-semibold text-foreground mb-2">Järgmine harjutus</div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-base font-medium text-green-900">
                  {PRODUCT_FIXTURE.retry.question}
                </div>
                <div className="text-xs text-green-700 mt-2">
                  Proovi sama meetodit lihtsamal ülesandel
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility fallback */}
        <div className="sr-only">
          <h3>Õpilase töövoog:</h3>
          <ol>
            <li>Õpilane lahendab ülesande digitaalselt või paberil</li>
            <li>Saab arusaadava tagasiside</li>
            <li>Proovib sihitud harjutust</li>
            <li>Jätkab harjutamist - üks õige kordus ei tähenda veel valdamist</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

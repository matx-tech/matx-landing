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
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { motionTokens, gsapEase } from '@/lib/motion-tokens';
import { InlineFractionalExpression } from '@/components/ui/fraction';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function StudentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLLIElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) {
      // Ensure all animated elements are visible when motion is disabled
      stepsRef.current.forEach((step) => {
        if (step) gsap.set(step, { opacity: 1, x: 0 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step) => {
        if (!step) return;

        gsap.fromTo(
          step,
          { opacity: 0, x: -motionTokens.distance.md },
          {
            opacity: 1,
            x: 0,
            duration: motionTokens.duration.slow,
            ease: gsapEase(motionTokens.easing.smooth),
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
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.student}
      className="py-24 md:py-32 lg:py-40 bg-surface section-fade-from-canvas"
    >
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {STUDENT_STORY.heading}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {STUDENT_STORY.description}
            </p>

            {/* Student flow steps — data-driven */}
            <ol className="space-y-6">
              {STUDENT_STORY.steps.map((step, index) => (
                <li
                  key={step.title}
                  ref={(el) => {
                    stepsRef.current[index] = el;
                  }}
                  className="flex gap-4"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${step.badgeClass}`}>
                    {step.badge}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
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
                  <InlineFractionalExpression expression={PRODUCT_FIXTURE.task.question} />
                </div>
              </div>
            </div>

            {/* Student response */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-foreground mb-2">Õpilase vastus</div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-base font-mono text-red-700">
                  <InlineFractionalExpression expression={PRODUCT_FIXTURE.answer.submitted} />
                </div>
              </div>
            </div>

            {/* Feedback — from fixture */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-foreground mb-2">Tagasiside</div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  {PRODUCT_FIXTURE.feedback.text}
                </p>
              </div>
            </div>

            {/* Next exercise */}
            <div>
              <div className="text-sm font-semibold text-foreground mb-2">Järgmine harjutus</div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-base font-medium text-green-900">
                  <InlineFractionalExpression expression={PRODUCT_FIXTURE.retry.question} />
                </div>
                <div className="text-xs text-green-700 mt-2">
                  {PRODUCT_FIXTURE.retry.hint}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

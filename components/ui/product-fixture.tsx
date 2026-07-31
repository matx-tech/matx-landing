/**
 * Product fixture component
 * Reusable animated workflow: answer → signal → retry → teacher action
 * Used consistently across hero, evidence loop, student, and teacher sections
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCT_FIXTURE } from '@/lib/content/landing-evidence';
import { InlineFractionalExpression } from '@/components/ui/fraction';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProductFixtureProps {
  animated?: boolean;
  triggerId?: string;
  className?: string;
}

export function ProductFixture({
  animated = true,
  triggerId,
  className = ''
}: ProductFixtureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const retryRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const elements = [answerRef.current, signalRef.current, retryRef.current, actionRef.current];

    if (prefersReducedMotion) {
      // Set all panels to their final visible state
      gsap.set(elements, { opacity: 1, y: 0 });
      return;
    }

    // Set initial state
    gsap.set(elements, { opacity: 0, y: 20 });

    const timeline = gsap.timeline({
      scrollTrigger: triggerId ? {
        trigger: `#${triggerId}`,
        start: 'top center',
        end: 'bottom center',
        toggleActions: 'play none none reverse',
      } : undefined,
    });

    timeline
      .to(answerRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
      .to(signalRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '+=0.3')
      .to(retryRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '+=0.3')
      .to(actionRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '+=0.3');

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, [animated, triggerId, prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className={`space-y-4 ${className}`}
      aria-labelledby="workflow-fixture-title"
    >
      {/* Label */}
      <h2 id="workflow-fixture-title" className="text-xs font-medium text-text-secondary uppercase tracking-wider">
        {PRODUCT_FIXTURE.label}
      </h2>

      {/* Student answer */}
      <div
        ref={answerRef}
        className="p-4 bg-card rounded-lg border border-border"
        style={animated ? { opacity: 0 } : undefined}
      >
        <div className="text-sm font-medium text-foreground mb-2">
          <InlineFractionalExpression expression={PRODUCT_FIXTURE.task.question} />
        </div>
        <div className="text-sm text-muted-foreground mb-1">
          Õpilase vastus:{' '}<span className="font-mono text-destructive"><InlineFractionalExpression expression={PRODUCT_FIXTURE.answer.submitted} /></span>
        </div>
        <div className="text-xs text-muted-foreground">
          Oskus: {PRODUCT_FIXTURE.task.skill}
        </div>
      </div>

      {/* Signal detection */}
      <div
        ref={signalRef}
        className="p-4 bg-info-surface rounded-lg border border-info-border"
        style={animated ? { opacity: 0 } : undefined}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-info uppercase tracking-wider">
            {PRODUCT_FIXTURE.signal.label}
          </span>
          <span className="text-xs text-info">
            {PRODUCT_FIXTURE.signal.confidence}
          </span>
        </div>
        <div className="text-sm font-medium text-info-strong">
          {PRODUCT_FIXTURE.signal.pattern}
        </div>
      </div>

      {/* Targeted retry */}
      <div
        ref={retryRef}
        className="p-4 bg-card rounded-lg border border-border"
        style={animated ? { opacity: 0 } : undefined}
      >
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Järgmine harjutus
        </div>
        <div className="text-sm font-medium text-foreground mb-2">
          <InlineFractionalExpression expression={PRODUCT_FIXTURE.retry.question} />
        </div>
        <div className="text-xs text-muted-foreground">
          {PRODUCT_FIXTURE.retry.rationale}
        </div>
      </div>

      {/* Teacher action */}
      <div
        ref={actionRef}
        className="p-4 bg-success-surface rounded-lg border border-success-border"
        style={animated ? { opacity: 0 } : undefined}
      >
        <div className="text-xs font-medium text-success uppercase tracking-wider mb-2">
          Õpetaja otsustab
        </div>
        <div className="text-sm font-medium text-success-strong mb-2">
          {PRODUCT_FIXTURE.teacherAction.recommendation}
        </div>
        <div className="text-xs text-success mb-3">
          Põhjendus: {PRODUCT_FIXTURE.teacherAction.evidence}
        </div>
        <div className="flex gap-2 flex-wrap">
          {PRODUCT_FIXTURE.teacherAction.options.map((option) => (
            <button
              key={option.action}
              className="px-3 py-1.5 text-xs font-medium rounded border border-success-border bg-surface text-success-strong opacity-60 cursor-default"
              type="button"
              disabled
              aria-disabled="true"
              title="Näidisandmed — tegevus ei ole selles vaates aktiivne"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

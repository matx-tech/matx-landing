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

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const elements = [answerRef.current, signalRef.current, retryRef.current, actionRef.current];

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
      timeline.kill();
    };
  }, [animated, triggerId]);

  return (
    <div
      ref={containerRef}
      className={`space-y-4 ${className}`}
      aria-label="Töövogu näide"
    >
      {/* Label */}
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {PRODUCT_FIXTURE.label}
      </div>

      {/* Student answer */}
      <div
        ref={answerRef}
        className="p-4 bg-card rounded-lg border border-border"
        style={animated ? { opacity: 0 } : undefined}
      >
        <div className="text-sm font-medium text-foreground mb-2">
          {PRODUCT_FIXTURE.task.question}
        </div>
        <div className="text-sm text-muted-foreground mb-1">
          Õpilase vastus: <span className="font-mono text-destructive">{PRODUCT_FIXTURE.answer.submitted}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Oskus: {PRODUCT_FIXTURE.task.skill}
        </div>
      </div>

      {/* Signal detection */}
      <div
        ref={signalRef}
        className="p-4 bg-blue-50 rounded-lg border border-blue-200"
        style={animated ? { opacity: 0 } : undefined}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-800 uppercase tracking-wider">
            {PRODUCT_FIXTURE.signal.label}
          </span>
          <span className="text-xs text-blue-600">
            {PRODUCT_FIXTURE.signal.confidence}
          </span>
        </div>
        <div className="text-sm font-medium text-blue-900">
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
          {PRODUCT_FIXTURE.retry.question}
        </div>
        <div className="text-xs text-muted-foreground">
          {PRODUCT_FIXTURE.retry.rationale}
        </div>
      </div>

      {/* Teacher action */}
      <div
        ref={actionRef}
        className="p-4 bg-green-50 rounded-lg border border-green-200"
        style={animated ? { opacity: 0 } : undefined}
      >
        <div className="text-xs font-medium text-green-800 uppercase tracking-wider mb-2">
          Õpetaja otsustab
        </div>
        <div className="text-sm font-medium text-green-900 mb-2">
          {PRODUCT_FIXTURE.teacherAction.recommendation}
        </div>
        <div className="text-xs text-green-700 mb-3">
          Põhjendus: {PRODUCT_FIXTURE.teacherAction.evidence}
        </div>
        <div className="flex gap-2 flex-wrap">
          {PRODUCT_FIXTURE.teacherAction.options.map((option) => (
            <button
              key={option.action}
              className="px-3 py-1.5 text-xs font-medium rounded border border-green-300 bg-white text-green-800 hover:bg-green-100 transition-colors"
              disabled
              aria-label={option.label}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Product fixture component
 * Reusable animated workflow: answer → signal → retry → teacher action
 * Used consistently across hero, evidence loop, student, and teacher sections
 */

'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { InlineFractionalExpression } from '@/components/ui/fraction';
import { PRODUCT_FIXTURE } from '@/lib/content/landing-evidence';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { gsapEase, motionTokens } from '@/lib/motion-tokens';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProductFixtureProps {
  animated?: boolean;
  triggerId?: string;
  /** Seconds to wait before the panel stagger begins — use to sequence
   *  the fixture after left-side headline / text animations complete. */
  delay?: number;
  className?: string;
}

/**
 * Renders an educational workflow showing a student answer, detected signal, targeted retry, and teacher action.
 *
 * @param animated - Whether to animate the workflow panels.
 * @param triggerId - The ID of the element that triggers the panel animation on scroll.
 * @param delay - The initial delay before revealing the first panel.
 * @param className - Additional CSS classes for the workflow container.
 * @returns The rendered educational workflow.
 */
export function ProductFixture({
  animated = true,
  triggerId,
  delay = 0,
  className = '',
}: ProductFixtureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const retryRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Panels render fully visible (SSR/no-JS safe) — the hidden initial state is
  // applied by GSAP just before animation in the effect below, never in the
  // server HTML, so content can't get stuck invisible if JS fails.
  useGSAP(
    () => {
      if (!animated || !containerRef.current) return;

      const elements = [answerRef.current, signalRef.current, retryRef.current, actionRef.current];

      if (prefersReducedMotion) {
        // Content is already visible via the CSS fallback — hand control back
        // from the !important rule so inline state matches the DOM.
        const visibleElements = elements.filter((el): el is HTMLDivElement => el !== null);
        visibleElements.forEach((el) => {
          el.classList.remove('gsap-animate-on-mount');
        });
        gsap.set(visibleElements, { opacity: 1, y: 0 });
        return;
      }

      // Filter out any null refs before passing to GSAP (defensive against
      // React commit-order edge cases where a child ref hasn't attached yet).
      const validElements = elements.filter((el): el is HTMLDivElement => el !== null);
      if (validElements.length === 0) return;

      // Strip the CSS fallback before gsap.set — .gsap-animate-on-mount has
      // opacity: 1 !important which overrides GSAP inline styles (keeps panels
      // visible through SSR/hydration until the animation takes over).
      validElements.forEach((el) => {
        el.classList.remove('gsap-animate-on-mount');
      });

      // Set initial state
      gsap.set(validElements, { opacity: 0, y: motionTokens.distance.md });

      // Validate the trigger element exists in the DOM before passing selector to ScrollTrigger
      let scrollTriggerConfig: ScrollTrigger.Vars | undefined;
      if (triggerId) {
        const triggerEl = document.getElementById(triggerId);
        if (triggerEl) {
          scrollTriggerConfig = {
            trigger: triggerEl,
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse',
          };
        }
      }

      const timeline = gsap.timeline({
        defaults: {
          duration: motionTokens.duration.slow,
          ease: gsapEase(motionTokens.easing.smooth),
        },
        scrollTrigger: scrollTriggerConfig,
      });

      // Guard individual refs before building the timeline chain — GSAP warns
      // on null targets even inside a timeline.
      const targets = {
        answer: answerRef.current,
        signal: signalRef.current,
        retry: retryRef.current,
        action: actionRef.current,
      };

      timeline
        .to(targets.answer, { opacity: 1, y: 0 }, delay > 0 ? `+=${delay}` : undefined)
        .to(targets.signal, { opacity: 1, y: 0 }, '+=0.3')
        .to(targets.retry, { opacity: 1, y: 0 }, '+=0.3')
        .to(targets.action, { opacity: 1, y: 0 }, '+=0.3');
    },
    {
      scope: containerRef,
      dependencies: [animated, triggerId, delay, prefersReducedMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={containerRef}
      className={`space-y-4 ${className}`}
      aria-labelledby='workflow-fixture-title'
    >
      {/* Label */}
      <h2
        id='workflow-fixture-title'
        className='text-xs font-medium text-text-secondary uppercase tracking-wider'
      >
        {PRODUCT_FIXTURE.label}
      </h2>

      {/* Student answer */}
      <div
        ref={answerRef}
        className='gsap-animate-on-mount p-4 bg-card rounded-lg border border-border'
      >
        <div className='text-sm font-medium text-text-primary mb-2'>
          <InlineFractionalExpression expression={PRODUCT_FIXTURE.task.question} />
        </div>
        <div className='text-sm text-text-secondary mb-1'>
          Õpilase vastus:{' '}
          <span className='font-mono text-alert'>
            <InlineFractionalExpression expression={PRODUCT_FIXTURE.answer.submitted} />
          </span>
        </div>
        <div className='text-xs text-text-secondary'>Oskus: {PRODUCT_FIXTURE.task.skill}</div>
      </div>

      {/* Signal detection */}
      <div
        ref={signalRef}
        className='gsap-animate-on-mount p-4 bg-info-surface rounded-lg border border-info-border'
      >
        <div className='flex items-center justify-between mb-2'>
          <span className='text-xs font-medium text-info uppercase tracking-wider'>
            {PRODUCT_FIXTURE.signal.label}
          </span>
          <span className='text-xs text-info'>{PRODUCT_FIXTURE.signal.confidence}</span>
        </div>
        <div className='text-sm font-medium text-info-strong'>{PRODUCT_FIXTURE.signal.pattern}</div>
      </div>

      {/* Targeted retry */}
      <div
        ref={retryRef}
        className='gsap-animate-on-mount p-4 bg-card rounded-lg border border-border'
      >
        <div className='text-xs font-medium text-text-secondary uppercase tracking-wider mb-2'>
          Järgmine harjutus
        </div>
        <div className='text-sm font-medium text-text-primary mb-2'>
          <InlineFractionalExpression expression={PRODUCT_FIXTURE.retry.question} />
        </div>
        <div className='text-xs text-text-secondary'>{PRODUCT_FIXTURE.retry.rationale}</div>
      </div>

      {/* Teacher action */}
      <div
        ref={actionRef}
        className='gsap-animate-on-mount p-4 bg-success-surface rounded-lg border border-success-border'
      >
        <div className='text-xs font-medium text-success uppercase tracking-wider mb-2'>
          Õpetaja otsustab
        </div>
        <div className='text-sm font-medium text-success-strong mb-2'>
          {PRODUCT_FIXTURE.teacherAction.recommendation}
        </div>
        <div className='text-xs text-success mb-3'>
          Põhjendus: {PRODUCT_FIXTURE.teacherAction.evidence}
        </div>
        <div className='flex gap-2 flex-wrap'>
          {PRODUCT_FIXTURE.teacherAction.options.map((option) => (
            <button
              key={option.action}
              className='px-3 py-1.5 text-xs font-medium rounded border border-success-border bg-surface text-success-strong opacity-60 cursor-default'
              type='button'
              aria-disabled='true'
              title='Näidisandmed — tegevus ei ole selles vaates aktiivne'
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { motionTokens, gsapEase, staggers } from '@/lib/motion-tokens';

interface AnimatedHeadlineProps {
  children: string;
  className?: string;
  stagger?: number;
  delay?: number;
}

/**
 * Schedules a callback using requestIdleCallback (with rAF fallback) so
 * expensive layout operations don't block the first paint or contribute
 * to Total Blocking Time (TBT).
 *
 * The 108ms forced-reflow Lighthouse audit traces to SplitText.create()
 * which synchronously reads layout properties then mutates the DOM.  By
 * deferring it past the initial render we let the browser paint text
 * immediately (backed by the `.gsap-animate-on-mount` CSS fallback) and
 * then apply the reveal animation on idle time.
 */
function scheduleIdle(cb: () => void): () => void {
  let cancelled = false;
  if (typeof requestIdleCallback !== 'undefined') {
    const id = requestIdleCallback(() => { if (!cancelled) cb(); });
    return () => { cancelled = true; cancelIdleCallback(id); };
  }
  // requestIdleCallback is not available in Safari < 15.4,
  // so fall back to a rAF + macrotask which still defers past paint.
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const raf = requestAnimationFrame(() => {
    if (cancelled) return;
    timeoutId = setTimeout(() => { if (!cancelled) cb(); }, 0);
  });
  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  };
}

export function AnimatedWordReveal({
  children,
  className = '',
  stagger = staggers.word,
  delay = 0.5,
}: AnimatedHeadlineProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const mm = gsap.matchMedia();

      // Reduced motion: text is already visible via CSS fallback.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        containerRef.current?.classList.remove('gsap-animate-on-mount');
      });

      // Full animation: defer SplitText past first paint to avoid forced reflow.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const el = containerRef.current!;
        let split: ReturnType<typeof SplitText.create> | null = null;
        let revealTween: gsap.core.Tween | null = null;
        const cancelIdle = scheduleIdle(() => {
          split = SplitText.create(el, {
            type: 'words',
            wordsClass: 'inline-block overflow-hidden',
            // Don't let SplitText stamp aria-label on the element (GSAP 3.13+
            // default `aria: "auto"`): the hero headline is a plain <h1>/<p>
            // where aria-label is a prohibited attribute (Lighthouse
            // aria-prohibited-attr). The split pieces stay real text nodes,
            // so assistive tech reads them in DOM order without the label.
            aria: 'none',
          });

          // Strip the CSS fallback before gsap.set — .gsap-animate-on-mount
          // has opacity: 1 !important which overrides GSAP inline styles.
          el.classList.remove('gsap-animate-on-mount');

          gsap.set(split.words, {
            y: motionTokens.distance.xxl,
            rotateX: -90,
            transformOrigin: 'center bottom',
          });

          revealTween = gsap.to(split.words, {
            y: 0,
            rotateX: 0,
            duration: motionTokens.duration.normal,
            stagger,
            ease: gsapEase(motionTokens.easing.emphasized),
            delay,
          });
        });

        return () => {
          cancelIdle();
          // Deferred tween isn't tracked by the context, so kill it explicitly.
          revealTween?.kill();
          split?.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [stagger, delay, children], revertOnUpdate: true },
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <h1
        ref={containerRef}
        className="gsap-animate-on-mount relative leading-none"
        style={{ perspective: '400px' }}
      >
        {children}
      </h1>
    </div>
  );
}

interface AnimatedSublineProps {
  children: string;
  className?: string;
}

export function AnimatedCharacterReveal({ children, className = '' }: AnimatedSublineProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        containerRef.current?.classList.remove('gsap-animate-on-mount');
      });

      // Whole-element slide, transform only. No SplitText: this <p> is the
      // LCP element, and char-splitting replaces its text node with ~110
      // spans at idle time — a fresh contentful paint that re-fires LCP
      // (~3.8s on throttled mobile vs 0.26s real). Transform-only keeps the
      // original paint as LCP. delay=0: this is the LCP element, nothing
      // should hold its settle back.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const el = containerRef.current!;
        let revealTween: gsap.core.Tween | null = null;
        // Apply the reveal start in the layout effect (before first paint)
        // so the deferred idle tween doesn't visibly snap the element down
        // 16px from its rest position when it runs.
        gsap.set(el, { y: motionTokens.distance.md });
        const cancelIdle = scheduleIdle(() => {
          el.classList.remove('gsap-animate-on-mount');
          revealTween = gsap.to(el, {
            y: 0,
            duration: motionTokens.duration.normal,
            ease: gsapEase(motionTokens.easing.emphasized),
          });
        });

        return () => {
          cancelIdle();
          // Deferred tween isn't tracked by the context, so kill it explicitly.
          revealTween?.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [children], revertOnUpdate: true },
  );

  return (
    <p ref={containerRef} className={`gsap-animate-on-mount ${className}`}>
      {children}
    </p>
  );
}

export function MATxLogoAnimation({ delay = 0 }: { delay?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        lettersRef.current.forEach((letter) => letter.classList.remove('gsap-animate-on-mount'));
        gsap.set(lettersRef.current, { scale: 1, opacity: 1, rotation: 0 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const letters = lettersRef.current;

        // Strip CSS fallback before gsap.set — .gsap-animate-on-mount has
        // opacity: 1 !important which overrides GSAP inline styles.
        letters.forEach((letter) => letter.classList.remove('gsap-animate-on-mount'));

        gsap.set(letters, {
          scale: 0,
          opacity: 0,
          rotation: -180,
          transformOrigin: 'center center',
        });

        gsap.to(letters, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: motionTokens.duration.normal,
          stagger: staggers.word,
          ease: gsapEase(motionTokens.easing.emphasized),
          delay,
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [delay], revertOnUpdate: true },
  );

  return (
    <div ref={containerRef} className="inline-flex items-center">
      {'MATx'.split('').map((char, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) lettersRef.current[index] = el;
          }}
          className={`gsap-animate-on-mount inline-block ${
            char === 'x' ? 'text-secondary' : 'text-primary'
          }`}
          style={{ display: 'inline-block' }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

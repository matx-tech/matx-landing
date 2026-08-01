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
  // so fall back to a rAF + microtask which still defers past paint.
  const raf = requestAnimationFrame(() => {
    if (!cancelled) setTimeout(cb, 0);
  });
  return () => { cancelled = true; cancelAnimationFrame(raf); };
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
        const cancelIdle = scheduleIdle(() => {
          split = SplitText.create(el, {
            type: 'words',
            wordsClass: 'inline-block overflow-hidden',
          });

          gsap.set(split.words, {
            y: motionTokens.distance.xxl,
            opacity: 0,
            rotateX: -90,
            transformOrigin: 'center bottom',
          });

          gsap.to(split.words, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: motionTokens.duration.normal,
            stagger,
            ease: gsapEase(motionTokens.easing.emphasized),
            delay,
          });

          // Remove CSS fallback right before GSAP hides text for animation.
          el.classList.remove('gsap-animate-on-mount');
        });

        return () => { cancelIdle(); split?.revert(); };
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
  delay?: number;
}

export function AnimatedCharacterReveal({ children, className = '', delay = 1.5 }: AnimatedSublineProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        containerRef.current?.classList.remove('gsap-animate-on-mount');
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const el = containerRef.current!;
        let split: ReturnType<typeof SplitText.create> | null = null;
        const cancelIdle = scheduleIdle(() => {
          split = SplitText.create(el, {
            type: 'chars',
            charsClass: 'inline-block',
          });

          gsap.set(split.chars, {
            opacity: 0,
            y: motionTokens.distance.md,
          });

          gsap.to(split.chars, {
            opacity: 1,
            y: 0,
            duration: motionTokens.duration.fast,
            stagger: staggers.character,
            ease: gsapEase(motionTokens.easing.emphasized),
            delay,
          });

          el.classList.remove('gsap-animate-on-mount');
        });

        return () => { cancelIdle(); split?.revert(); };
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [delay, children], revertOnUpdate: true },
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
        gsap.set(lettersRef.current, { scale: 1, opacity: 1, rotation: 0 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const letters = lettersRef.current;

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

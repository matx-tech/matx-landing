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

      // Reduced motion: instant visibility, no animation
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(containerRef.current, { opacity: 1 });
      });

      // Full animation: word-by-word 3D reveal
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(containerRef.current!, {
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

        // Cleanup: revert SplitText when this query stops matching
        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [stagger, delay, children], revertOnUpdate: true },
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <h1
        ref={containerRef}
        className="relative leading-none"
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
        gsap.set(containerRef.current, { opacity: 1 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(containerRef.current!, {
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

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [delay, children], revertOnUpdate: true },
  );

  return (
    <p ref={containerRef} className={className}>
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
          className={`inline-block ${
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

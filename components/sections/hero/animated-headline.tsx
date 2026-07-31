'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface AnimatedHeadlineProps {
  children: string;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function AnimatedWordReveal({
  children,
  className = '',
  stagger = 0.1,
  delay = 0.5,
}: AnimatedHeadlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Show content immediately without animation
      gsap.set(wordsRef.current, { y: 0, opacity: 1, rotateX: 0 });
      return;
    }

    const words = wordsRef.current;

    gsap.set(words, {
      y: 100,
      opacity: 0,
      rotateX: -90,
      transformOrigin: 'center bottom',
    });

    gsap.to(words, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.3,
      stagger,
      ease: 'cubic-bezier(0.2, 0, 0, 1)',
      delay,
    });

    return () => {
      gsap.killTweensOf(words);
    };
  }, [stagger, delay]);

  const words = children.trim().split(/\s+/);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <h1 className="relative leading-none">
        {words.map((word, index) => (
          <span
            key={index}
            ref={(el) => {
              if (el) wordsRef.current[index] = el;
            }}
            className="inline-block"
            style={{ display: 'inline-block', transformStyle: 'preserve-3d' }}
          >
            {word}
            {index < words.length - 1 && '\u00A0'}
          </span>
        ))}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Show content immediately without animation
      gsap.set(charsRef.current, { opacity: 1, y: 0 });
      return;
    }

    const chars = charsRef.current;

    gsap.set(chars, {
      opacity: 0,
      y: 20,
    });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.2,
      stagger: 0.025,
      ease: 'cubic-bezier(0.2, 0, 0, 1)',
      delay,
    });

    return () => {
      gsap.killTweensOf(chars);
    };
  }, [delay]);

  return (
    <div ref={containerRef} className={className}>
      {children.split('').map((char, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) charsRef.current[index] = el;
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

export function MATxLogoAnimation({ delay = 0 }: { delay?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Show content immediately without animation
      gsap.set(lettersRef.current, { scale: 1, opacity: 1, rotation: 0 });
      return;
    }

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
      duration: 0.3,
      stagger: 0.08,
      ease: 'cubic-bezier(0.2, 0, 0, 1)',
      delay,
    });

    return () => {
      gsap.killTweensOf(letters);
    };
  }, [delay]);

  // CVI colors: Public Service Blue for "MAT", Learning Teal for "x"
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

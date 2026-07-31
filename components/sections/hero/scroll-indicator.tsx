'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { SCROLL_INDICATOR_LABEL } from '@/lib/content/landing-copy';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';

interface ScrollIndicatorProps {
  /** Hides the text label for compact contexts (between-beat indicators). */
  hideLabel?: boolean;
}

export function ScrollIndicator({ hideLabel = false }: ScrollIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const mouse = mouseRef.current;
    if (!container || !mouse) return;

    if (prefersReducedMotion) {
      // Show indicator without animation
      gsap.set(container, { opacity: 1, y: 0 });
      gsap.set(mouse, { y: 0 });
      return;
    }

    gsap.set(container, { opacity: 0, y: -20 });
    gsap.to(container, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      delay: 3.2,
      ease: 'cubic-bezier(0.2, 0, 0, 1)',
    });

    gsap.to(mouse, {
      y: 8,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    });

    return () => {
      gsap.killTweensOf(container);
      gsap.killTweensOf(mouse);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      role="img"
      aria-label={SCROLL_INDICATOR_LABEL}
    >
      {!hideLabel && (
        <span className="text-text-secondary text-sm tracking-wider uppercase">
          {SCROLL_INDICATOR_LABEL}
        </span>
      )}
      <div className="w-6 h-10 rounded-full border-2 border-text-secondary/50 flex items-start justify-center p-1">
        <div
          ref={mouseRef}
          className="w-1.5 h-3 rounded-full bg-accent"
        />
      </div>
    </div>
  );
}

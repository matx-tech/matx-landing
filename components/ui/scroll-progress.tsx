'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Displays a progress bar that tracks the document's scroll position.
 *
 * @returns The rendered scroll progress bar
 */
export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (progressRef.current) {
          // Instant set — avoid GSAP tween when reduced motion is preferred
          if (prefersReducedMotion) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          } else {
            gsap.set(progressRef.current, { scaleX: self.progress });
          }
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div className='fixed top-0 left-0 right-0 h-0.5 bg-border z-50'>
      <div
        ref={progressRef}
        className='h-full bg-gradient-brand origin-left'
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (progressRef.current) {
          gsap.to(progressRef.current, {
            scaleX: self.progress,
            duration: 0.1,
            ease: 'none',
          });
        }
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-border z-50">
      <div
        ref={progressRef}
        className="h-full bg-gradient-brand origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

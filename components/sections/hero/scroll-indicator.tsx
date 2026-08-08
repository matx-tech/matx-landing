'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useRef } from 'react';
import { SCROLL_INDICATOR_LABEL } from '@/lib/content/landing-copy';
import { customEases, gsapEase, motionTokens } from '@/lib/motion-tokens';

// customEases (motion-tokens) need CustomEase registered — this section is
// the only consumer, so register it here at module scope.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
}

interface ScrollIndicatorProps {
  hideLabel?: boolean;
}

export function ScrollIndicator({ hideLabel = false }: ScrollIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const mouse = mouseRef.current;
      if (!container || !mouse) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(container, { opacity: 1, y: 0 });
        gsap.set(mouse, { y: 0 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(container, { opacity: 0, y: -motionTokens.distance.md });
        gsap.to(container, {
          opacity: 1,
          y: 0,
          duration: motionTokens.duration.normal,
          delay: 3.2,
          ease: gsapEase(motionTokens.easing.emphasized),
        });

        gsap.to(mouse, {
          y: motionTokens.distance.sm,
          duration: motionTokens.duration.crawl,
          repeat: -1,
          yoyo: true,
          ease: customEases.bounce,
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2'
      role='img'
      aria-label={SCROLL_INDICATOR_LABEL}
    >
      {!hideLabel && (
        <span className='text-text-secondary text-sm tracking-wider uppercase'>
          {SCROLL_INDICATOR_LABEL}
        </span>
      )}
      <div className='w-6 h-10 rounded-full border-2 border-text-secondary/50 flex items-start justify-center p-1'>
        <div ref={mouseRef} className='w-1.5 h-3 rounded-full bg-accent' />
      </div>
    </div>
  );
}

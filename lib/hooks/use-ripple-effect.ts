'use client';

import gsap from 'gsap';
import { useCallback } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { gsapEase, motionTokens } from '@/lib/motion-tokens';

/**
 * Shared ripple effect — consumes motionTokens.
 * Called by RippleButton and MATxButton to avoid the triplicated logic.
 */
export function useRippleEffect(disabled = false) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (disabled || prefersReducedMotion) return;

      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      ripple.className = 'absolute rounded-full pointer-events-none';
      ripple.style.width = `${diameter}px`;
      ripple.style.height = `${diameter}px`;
      ripple.style.left = `${event.clientX - rect.left - radius}px`;
      ripple.style.top = `${event.clientY - rect.top - radius}px`;
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';

      target.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: motionTokens.scale.ripple,
          opacity: 0,
          duration: motionTokens.duration.normal,
          ease: gsapEase(motionTokens.easing.standard),
          onComplete: () => ripple.remove(),
        },
      );
    },
    [disabled, prefersReducedMotion],
  );

  return createRipple;
}

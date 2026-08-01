'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ⚠ DEPRECATED — use `useRippleEffect` from @/lib/hooks/use-ripple-effect instead.
 *
 * This creates a DOM ripple + GSAP tween without reduced-motion awareness.
 * Kept for backward compatibility with any code that may import it directly.
 */
export const createRippleEffect = (element: HTMLElement) => {
  const createRipple = (event: MouseEvent) => {
    const button = element;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.className = 'absolute rounded-full bg-white/30 animate-ripple pointer-events-none';

    button.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 1 },
      {
        scale: 2.5,
        opacity: 0,
        duration: 0.3,
        ease: 'cubic-bezier(0, 0, 0.2, 1)',
        onComplete: () => ripple.remove(),
      }
    );
  };

  return createRipple;
};

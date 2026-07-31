'use client';

import { useEffect, useState } from 'react';

/**
 * Hook that subscribes to `prefers-reduced-motion` media-query changes.
 * Use in GSAP/SVG animation effects so triggers rebuild when the OS preference toggles.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
    };

    // Sync in case the lazy initializer was a stale server value
    handler(mql);

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

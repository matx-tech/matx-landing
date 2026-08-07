'use client';

import { useEffect, useRef, createContext, useContext, useCallback } from 'react';
import type Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';

// Only register plugins that are needed across the entire site.
// Per-section plugins (SplitText, CustomEase, Draggable, Observer, Flip,
// MotionPathPlugin) are registered locally in their respective components
// to keep the initial JS bundle lean.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface LenisContextValue {
  scrollTo: (target: string | number | HTMLElement, options?: { focusHeading?: boolean }) => void;
}

const LenisContext = createContext<LenisContextValue>({
  scrollTo: () => {},
});

export const useLenis = () => useContext(LenisContext);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotionRef = useRef(false);
  const tickerCbRef = useRef<((time: number) => void) | null>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Share one rAF cycle between Lenis and GSAP — eliminates duplicate
    // animation loops and reduces jank.
    gsap.ticker.lagSmoothing(false);
    reducedMotionRef.current = prefersReducedMotion;

    let disposed = false;
    let lenisInstance: Lenis | null = null;

    // Lenis is a smooth-scroll enhancement, not a prerequisite for content.
    // Load it lazily so the library stays out of the initial JS bundle.
    void import('lenis').then(({ default: LenisClass }) => {
      if (disposed) return;

      function createLenis(rm: boolean) {
        return new LenisClass({
          lerp: rm ? 0 : 0.1,
          duration: rm ? 0 : 1.2,
          smoothWheel: !rm,
          touchMultiplier: rm ? 1 : 2,
          autoRaf: false,
        });
      }

      // The hook value is the render-time preference; if it changed while the
      // chunk was in flight, the effect re-runs (dep below), disposes this
      // closure and rebuilds with the fresh value.
      lenisInstance = createLenis(prefersReducedMotion);
      lenisRef.current = lenisInstance;

      function registerRaf(instance: Lenis) {
        // Remove previous callback first so we never double-register
        if (tickerCbRef.current) gsap.ticker.remove(tickerCbRef.current);
        const cb = (time: number) => instance.raf(time * 1000);
        tickerCbRef.current = cb;
        gsap.ticker.add(cb);
      }

      registerRaf(lenisInstance);
      lenisInstance.on('scroll', ScrollTrigger.update);
    })
    // Lenis is a progressive enhancement: if the lazy chunk fails to load,
    // keep native scrolling — nothing depends on the instance.
    .catch(() => {});

    return () => {
      disposed = true;
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      if (tickerCbRef.current) gsap.ticker.remove(tickerCbRef.current);
      lenisInstance?.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement, options?: { focusHeading?: boolean }) => {
    const targetElement = typeof target === 'string'
      ? document.querySelector(target)
      : target instanceof HTMLElement
        ? target
        : null;

    // Lenis is a progressive enhancement: while the lazy chunk is still
    // loading (or if it failed — the .catch above never retries), fall back
    // to native scrolling so direct scrollTo() consumers (adoption route
    // cards, nav links) never swallow clicks.
    if (!lenisRef.current) {
      const behavior: ScrollBehavior = reducedMotionRef.current ? 'auto' : 'smooth';
      if (targetElement instanceof HTMLElement) {
        // Same fixed-nav offset as the Lenis path (-80).
        const top = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(top, 0), behavior });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior });
      }
      return;
    }

    if (targetElement instanceof HTMLElement) {
      lenisRef.current.scrollTo(targetElement, {
        offset: -80, // Account for fixed nav height
        duration: reducedMotionRef.current ? 0 : 1.2,
      });

      // Focus the section heading after scroll animation completes
      if (options?.focusHeading !== false) {
        if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
        focusTimerRef.current = setTimeout(() => {
          // SectionGate swaps its id-bearing placeholder for the mounted
          // section while we scroll, detaching the element captured above.
          // Re-resolve the selector so the heading lives in the real section.
          const liveTarget =
            typeof target === 'string'
              ? document.querySelector(target)
              : targetElement.isConnected
                ? targetElement
                : null;

          const heading = liveTarget?.querySelector('h2, h1');

          if (heading instanceof HTMLElement) {
            // Ensure heading can receive focus
            if (!heading.hasAttribute('tabindex')) {
              heading.setAttribute('tabindex', '-1');
            }
            heading.focus({ preventScroll: true });
          }
          focusTimerRef.current = null;
        }, reducedMotionRef.current ? 0 : 1400); // Slightly longer than scroll duration
      }
    } else if (typeof target === 'number') {
      lenisRef.current.scrollTo(target);
    }
  }, []);

  // Handle anchor link clicks for focus management
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Early exit: only intercept clicks on anchor elements with hash hrefs
      if (!(e.target instanceof HTMLElement)) return;
      const anchor = e.target.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute('href');
      // If the lazy Lenis chunk hasn't arrived yet, let the browser do the
      // native anchor jump instead of swallowing the click.
      if (href && href.length > 1 && lenisRef.current) {
        e.preventDefault();
        scrollTo(href, { focusHeading: true });
      }
    };

    document.addEventListener('click', handleClick as EventListener);
    return () => {
      document.removeEventListener('click', handleClick as EventListener);
    };
  }, [scrollTo]);

  return (
    <LenisContext.Provider value={{ scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}

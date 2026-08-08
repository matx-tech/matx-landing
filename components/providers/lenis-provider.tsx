'use client';

import { useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
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

/**
 * Provides application-wide scrolling through Lenis with native scrolling fallback.
 *
 * @param children - The content rendered within the provider.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotionRef = useRef(false);
  const tickerCbRef = useRef<((time: number) => void) | null>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectorPollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Mirror the render-time preference before paint — the effect-driven ref
  // would lag by a render, letting the first interaction (anchor click,
  // scrollTo) read a stale value.
  useLayoutEffect(() => {
    reducedMotionRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  useEffect(() => {
    // Share one rAF cycle between Lenis and GSAP — eliminates duplicate
    // animation loops and reduces jank.
    gsap.ticker.lagSmoothing(false);

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
      if (selectorPollTimerRef.current) clearTimeout(selectorPollTimerRef.current);
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
    // A new navigation supersedes any pending work from a previous one:
    // cancel the pending heading-focus timer and any in-flight selector
    // poll so stale callbacks can't fire after the user moved on.
    if (focusTimerRef.current) {
      clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }
    if (selectorPollTimerRef.current) {
      clearTimeout(selectorPollTimerRef.current);
      selectorPollTimerRef.current = null;
    }

    const targetElement = typeof target === 'string'
      ? document.querySelector(target)
      : target instanceof HTMLElement
        ? target
        : null;

    // Focus the section heading after the scroll settles (default on) —
    // shared by the Lenis and native-fallback paths so both behave the same
    // for direct consumers (adoption route cards, nav links).
    const focusHeading = () => {
      if (options?.focusHeading === false) return;
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      focusTimerRef.current = setTimeout(() => {
        // SectionGate swaps its id-bearing placeholder for the mounted
        // section while we scroll, detaching the element captured above.
        // Re-resolve the selector so the heading lives in the real section.
        const liveTarget =
          typeof target === 'string'
            ? document.querySelector(target)
            : targetElement?.isConnected
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
    };

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
        focusHeading();
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

      focusHeading();
    } else if (typeof target === 'number') {
      lenisRef.current.scrollTo(target);
    } else if (typeof target === 'string') {
      // The target isn't in the DOM yet — a gated section whose chunk is
      // still loading (its id-bearing placeholder was already swapped for
      // the skeleton, which carries the id too). Poll briefly for the real
      // element instead of dropping the scroll entirely.
      const poll = (remaining: number) => {
        const el = document.querySelector(target);
        if (el instanceof HTMLElement) {
          selectorPollTimerRef.current = null;
          if (!lenisRef.current) {
            const behavior: ScrollBehavior = reducedMotionRef.current ? 'auto' : 'smooth';
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: Math.max(top, 0), behavior });
          } else {
            lenisRef.current.scrollTo(el, {
              offset: -80, // Account for fixed nav height
              duration: reducedMotionRef.current ? 0 : 1.2,
            });
          }
          focusHeading();
          return;
        }
        if (remaining <= 0) {
          selectorPollTimerRef.current = null;
          return;
        }
        selectorPollTimerRef.current = setTimeout(() => poll(remaining - 1), 200);
      };
      poll(15);
    }
  }, []);

  // Handle anchor link clicks for focus management
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Let modified clicks (Cmd/Ctrl/Shift/Alt) and non-primary buttons
      // keep native browser behavior (open in new tab, etc.).
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      // Early exit: only intercept clicks on anchor elements with hash hrefs
      if (!(e.target instanceof HTMLElement)) return;
      const anchor = e.target.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute('href');
      // Intercept on both the Lenis and native paths — scrollTo handles
      // each (nav offset + heading focus), so a missing Lenis chunk no
      // longer drops the focus behavior.
      if (href && href.length > 1) {
        e.preventDefault();
        scrollTo(href, { focusHeading: true });
      }
    };

    document.addEventListener('click', handleClick as EventListener);
    return () => {
      document.removeEventListener('click', handleClick as EventListener);
    };
  }, [scrollTo]);

  // scrollTo is stable (useCallback with no deps), so the context value object
  // is created once — consumers don't re-render when the provider re-renders.
  const contextValue = useMemo(() => ({ scrollTo }), [scrollTo]);

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
}

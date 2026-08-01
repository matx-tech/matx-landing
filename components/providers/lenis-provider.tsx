'use client';

import { useEffect, useRef, createContext, useContext, useCallback } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { Flip } from 'gsap/Flip';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { Observer } from 'gsap/Observer';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP, SplitText, ScrambleTextPlugin, Flip, ScrollToPlugin, CustomEase, Observer, MotionPathPlugin, Draggable, InertiaPlugin);
}

interface LenisContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: { focusHeading?: boolean }) => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export const useLenis = () => useContext(LenisContext);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    reducedMotionRef.current = reducedMotion;

    function createLenis(rm: boolean) {
      return new Lenis({
        lerp: rm ? 0 : 0.1,
        duration: rm ? 0 : 1.2,
        smoothWheel: !rm,
        touchMultiplier: rm ? 1 : 2,
        autoRaf: true,
      });
    }

    let lenis = createLenis(reducedMotion);
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    // Subscribe to live reduced-motion changes
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      const rm = e.matches;
      reducedMotionRef.current = rm;

      // Destroy current instance and recreate with updated options
      lenis.destroy();
      lenis = createLenis(rm);
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.refresh();
    };
    mql.addEventListener('change', handleChange);

    return () => {
      mql.removeEventListener('change', handleChange);
      lenis.destroy();
    };
  }, []);

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
    if (!lenisRef.current) return;

    const targetElement = typeof target === 'string'
      ? document.querySelector(target)
      : target instanceof HTMLElement
        ? target
        : null;

    if (targetElement instanceof HTMLElement) {
      lenisRef.current.scrollTo(targetElement, {
        offset: -80, // Account for fixed nav height
        duration: reducedMotionRef.current ? 0 : 1.2,
      });

      // Focus the section heading after scroll animation completes
      if (options?.focusHeading !== false) {
        setTimeout(() => {
          const heading = targetElement.querySelector('h2, h1');

          if (heading instanceof HTMLElement) {
            // Ensure heading can receive focus
            if (!heading.hasAttribute('tabindex')) {
              heading.setAttribute('tabindex', '-1');
            }
            heading.focus({ preventScroll: true });
          }
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

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}

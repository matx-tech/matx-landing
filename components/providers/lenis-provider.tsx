'use client';

import { useEffect, useRef, createContext, useContext, useCallback } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
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

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop: function(value) {
        if (arguments.length && lenis) {
          lenis.scrollTo(value as number);
        }
        return lenis ? lenis.scroll : 0;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: 'transform',
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
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
        duration: 1.2,
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
        }, 1400); // Slightly longer than scroll duration
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

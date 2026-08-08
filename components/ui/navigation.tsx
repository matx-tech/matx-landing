'use client';

import { useGSAP } from '@gsap/react';
import * as Dialog from '@radix-ui/react-dialog';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CALENDLY_URL, LANDING_NAV_ITEMS, SECTION_IDS } from '@/lib/content/landing-copy';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { gsapEase, motionTokens, staggers } from '@/lib/motion-tokens';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const navItems = LANDING_NAV_ITEMS;

const PILOT_HREF = `#${SECTION_IDS.pilot}`;

// Mobile menu exit animation duration (ms) — single source so the close
// delay (below) can never drift from the animation it waits on.
const MOBILE_MENU_EXIT_MS = 500;

/**
 * Renders responsive navigation with desktop links, mobile menu controls, and calls to action.
 */
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuItemsRef = useRef<HTMLDivElement[]>([]);
  const pendingHashTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Layout-phase (useGSAP) so the entrance state is applied before paint —
  // a passive useEffect would let the nav flash at its final position.
  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;

      if (prefersReducedMotion) {
        nav.classList.remove('gsap-animate-on-mount');
        gsap.set(nav, { y: 0, opacity: 1 });
        return;
      }

      // Initial entrance: strip CSS fallback so GSAP inline opacity takes effect.
      nav.classList.remove('gsap-animate-on-mount');
      gsap.set(nav, { y: -motionTokens.distance.xxl, opacity: 0 });
      gsap.to(nav, {
        y: 0,
        opacity: 1,
        duration: motionTokens.duration.normal,
        delay: 0.5,
        ease: gsapEase(motionTokens.easing.emphasized),
      });

      // Scroll-driven hide/show via ScrollTrigger — uses quickTo for performance
      const yTo = gsap.quickTo(nav, 'y', {
        duration: motionTokens.duration.fast,
        ease: gsapEase(motionTokens.easing.standard),
      });
      const opacityTo = gsap.quickTo(nav, 'opacity', {
        duration: motionTokens.duration.fast,
        ease: gsapEase(motionTokens.easing.standard),
      });

      let wasHidden = false;
      const st = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        onUpdate: (self) => {
          const isHidden = self.scroll() > 100 && self.direction === 1;
          if (isHidden === wasHidden) return;
          wasHidden = isHidden;

          if (isHidden) {
            yTo(-motionTokens.distance.xxl);
            opacityTo(0.5);
          } else {
            yTo(0);
            opacityTo(1);
          }

          // Hidden nav must leave the tab order + AT tree: translated
          // offscreen links would otherwise be focusable while invisible.
          nav.inert = isHidden;
          nav.setAttribute('aria-hidden', String(isHidden));
        },
      });

      return () => {
        st.kill();
        gsap.killTweensOf(nav);
      };
    },
    { dependencies: [prefersReducedMotion] },
  );

  useEffect(() => {
    const items = menuItemsRef.current.filter(Boolean);

    // Guard: on initial load the mobile menu is closed and Radix's Portal
    // doesn't mount the content, so ref callbacks haven't fired yet.
    if (items.length === 0) return;

    if (isOpen) {
      if (prefersReducedMotion) {
        gsap.set(items, { opacity: 1, x: 0 });
        return;
      }
      gsap.set(items, {
        opacity: 0,
        x: -motionTokens.distance.lg,
      });

      gsap.to(items, {
        opacity: 1,
        x: 0,
        duration: motionTokens.duration.normal,
        stagger: staggers.menuItem,
        ease: gsapEase(motionTokens.easing.emphasized),
      });
    } else {
      if (prefersReducedMotion) {
        gsap.set(items, { opacity: 0, x: -motionTokens.distance.lg });
        return;
      }
      gsap.to(items, {
        opacity: 0,
        x: -motionTokens.distance.lg,
        duration: motionTokens.duration.fast,
        stagger: staggers.menuItemExit,
        ease: gsapEase(motionTokens.easing.accelerate),
      });
    }
  }, [isOpen, prefersReducedMotion]);

  const handleOpenChange = useCallback((open: boolean) => {
    // Any menu-state change supersedes a pending hash jump: closing without a
    // link click, or reopening within the 650ms window before the jump fires.
    if (pendingHashTimerRef.current) {
      window.clearTimeout(pendingHashTimerRef.current);
      pendingHashTimerRef.current = null;
    }
    setIsOpen(open);
  }, []);

  /**
   * Mobile menu links: closing the dialog unmounts the clicked anchor before
   * the browser follows the hyperlink, which cancels navigation entirely
   * (spec: following a hyperlink on a disconnected node is a no-op). So the
   * default action is prevented and navigation is done manually:
   * - internal anchors scroll after the dialog's exit animation releases the
   *   body scroll lock;
   * - external links open immediately, while the click is still a user
   *   gesture (window.open in a timeout would be popup-blocked).
   *
   * ponytail: fixed delay tuned to the exit animation; replace with an
   * onOpenChange(false)-driven scroll if it ever flakes.
   */
  const handleMenuLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    // Modified clicks (ctrl/cmd/shift/alt/middle) keep native browser
    // behavior — e.g. ctrl+click opens the link in a new tab.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const href = event.currentTarget.getAttribute('href');
    // External = absolute http(s) or protocol-relative (//…); hash anchors
    // are the only internal menu links. Anything else (mailto:, tel:)
    // classifies internal and is a no-op hash — acceptable: the menu has
    // no such links, and window.open can't open them meaningfully either.
    const isExternal = /^(https?:)?\/\//.test(href ?? '');
    event.preventDefault();
    setIsOpen(false);

    // A later click supersedes a pending jump from an earlier one.
    if (pendingHashTimerRef.current) {
      window.clearTimeout(pendingHashTimerRef.current);
      pendingHashTimerRef.current = null;
    }

    if (isExternal && href) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    pendingHashTimerRef.current = window.setTimeout(() => {
      pendingHashTimerRef.current = null;
      if (href) window.location.hash = href;
    }, MOBILE_MENU_EXIT_MS + 150);
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <nav
        ref={navRef}
        className='gsap-animate-on-mount fixed top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-12 py-3 bg-surface border-b border-border'
      >
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='inline-flex items-center gap-2 focus-ring-target rounded-md'>
            <span className='text-2xl font-display font-bold'>
              <span className='text-primary'>MAT</span>
              <span className='text-secondary'>x</span>
            </span>
            <div className='hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-elevated border border-border'>
              <Award className='w-3 h-3 text-warning' />
              <span className='text-xs text-text-secondary'>FELLIN HÄKK</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className='hidden xl:flex items-center gap-5 2xl:gap-8'>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className='text-text-secondary hover:text-text-primary text-sm transition-colors relative group focus-ring-target rounded-md min-h-[44px] flex items-center'
              >
                {item.label}
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300' />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className='hidden md:flex items-center gap-2 xl:gap-4'>
            <a
              href={PILOT_HREF}
              className='px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors focus-ring-target min-h-[44px] flex items-center whitespace-nowrap'
            >
              Liitu piloodiga
            </a>
            <a
              href={CALENDLY_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='btn-primary px-4 xl:px-6 py-2 rounded-lg text-sm font-medium focus-ring-target min-h-[44px] whitespace-nowrap'
            >
              Broneeri vestlus
              <span className='sr-only'> (avaneb uues aknas)</span>
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button - Dialog Trigger */}
          <Dialog.Trigger asChild>
            <button
              type='button'
              className='xl:hidden w-11 h-11 rounded-lg bg-elevated flex items-center justify-center focus-ring-target'
              aria-label='Ava menüü'
            >
              {isOpen ? (
                <X className='w-5 h-5 text-text-primary' />
              ) : (
                <Menu className='w-5 h-5 text-text-primary' />
              )}
            </button>
          </Dialog.Trigger>
        </div>
      </nav>

      {/* Mobile Menu - Radix Dialog */}
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-canvas/95 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <Dialog.Content
          className='fixed inset-0 z-50 flex flex-col items-start justify-center h-full px-8 md:px-16 focus:outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0'
          style={{ animationDuration: `${MOBILE_MENU_EXIT_MS}ms` }}
        >
          <Dialog.Title className='sr-only'>Navigatsioonimenüü</Dialog.Title>
          <Dialog.Description className='sr-only'>
            Valige menüüst soovitud osa või sulgege menüü
          </Dialog.Description>

          {navItems.map((item, index) => (
            <div
              key={item.label}
              ref={(el) => {
                if (el) menuItemsRef.current[index] = el;
              }}
              className='overflow-hidden mb-6'
            >
              <a
                href={item.href}
                onClick={handleMenuLinkClick}
                className='text-3xl md:text-4xl font-display font-bold text-text-primary hover:text-primary transition-colors focus-ring-target rounded-md'
              >
                {item.label}
              </a>
            </div>
          ))}

          <div
            ref={(el) => {
              if (el) menuItemsRef.current[navItems.length] = el;
            }}
            className='overflow-hidden mt-8 flex flex-col gap-4'
          >
            <a
              href={PILOT_HREF}
              onClick={handleMenuLinkClick}
              className='px-6 py-3 rounded-lg bg-primary text-text-inverse font-semibold focus-ring-target min-h-[44px] text-center'
            >
              Liitu piloodiga
            </a>
            <a
              href={CALENDLY_URL}
              target='_blank'
              rel='noopener noreferrer'
              onClick={handleMenuLinkClick}
              className='px-6 py-3 rounded-lg border border-border text-text-primary font-semibold hover:bg-surface transition-colors text-center focus-ring-target min-h-[44px]'
            >
              Broneeri vestlus
              <span className='sr-only'> (avaneb uues aknas)</span>
            </a>
            <ThemeToggle className='self-start' />
          </div>

          {/* Close button for keyboard users */}
          <Dialog.Close asChild>
            <button
              type='button'
              className='absolute top-4 right-4 w-11 h-11 rounded-lg bg-elevated flex items-center justify-center focus-ring-target'
              aria-label='Sulge menüü'
            >
              <X className='w-5 h-5 text-text-primary' />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

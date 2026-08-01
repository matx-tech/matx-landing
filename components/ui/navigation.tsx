'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, Award } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { LANDING_NAV_ITEMS, SECTION_IDS, CALENDLY_URL } from '@/lib/content/landing-copy';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { motionTokens, gsapEase, staggers } from '@/lib/motion-tokens';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const navItems = LANDING_NAV_ITEMS;

const PILOT_HREF = `#${SECTION_IDS.pilot}`;

interface NavigationProps {}

export function Navigation(_props: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuItemsRef = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
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
    const yTo = gsap.quickTo(nav, 'y', { duration: motionTokens.duration.fast, ease: gsapEase(motionTokens.easing.standard) });
    const opacityTo = gsap.quickTo(nav, 'opacity', { duration: motionTokens.duration.fast, ease: gsapEase(motionTokens.easing.standard) });

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
      },
    });

    return () => {
      st.kill();
      gsap.killTweensOf(nav);
    };
  }, [prefersReducedMotion]);

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
    setIsOpen(open);
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <nav
        ref={navRef}
        className="gsap-animate-on-mount fixed top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-12 py-3 bg-surface border-b border-border"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="inline-flex items-center gap-2 focus-ring-target rounded-md">
            <span className="text-2xl font-display font-bold">
              <span className="text-primary">MAT</span>
              <span className="text-secondary">x</span>
            </span>
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-elevated border border-border">
              <Award className="w-3 h-3 text-warning" />
              <span className="text-xs text-text-secondary">FELLIN HÄKK</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-5 2xl:gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-text-secondary hover:text-text-primary text-sm transition-colors relative group focus-ring-target rounded-md min-h-[44px] flex items-center"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2 xl:gap-4">
            <a
              href={PILOT_HREF}
              className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors focus-ring-target min-h-[44px] flex items-center whitespace-nowrap"
            >
              Liitu piloodiga
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-4 xl:px-6 py-2 rounded-lg text-sm font-medium focus-ring-target min-h-[44px] whitespace-nowrap"
            >
              Broneeri vestlus
            </a>
          </div>

          {/* Mobile Menu Button - Dialog Trigger */}
          <Dialog.Trigger asChild>
            <button
              className="xl:hidden w-11 h-11 rounded-lg bg-elevated flex items-center justify-center focus-ring-target"
              aria-label="Ava menüü"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-text-primary" />
              )}
            </button>
          </Dialog.Trigger>
        </div>
      </nav>

      {/* Mobile Menu - Radix Dialog */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-canvas/95 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col items-start justify-center h-full px-8 md:px-16 focus:outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          style={{ animationDuration: '0.5s' }}
        >
          <Dialog.Title className="sr-only">Navigatsioonimenüü</Dialog.Title>
          <Dialog.Description className="sr-only">
            Valige menüüst soovitud osa või sulgege menüü
          </Dialog.Description>

          {navItems.map((item, index) => (
            <div
              key={item.label}
              ref={(el) => {
                if (el) menuItemsRef.current[index] = el;
              }}
              className="overflow-hidden mb-6"
            >
              <a
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl md:text-4xl font-display font-bold text-text-primary hover:text-primary transition-colors focus-ring-target rounded-md"
              >
                {item.label}
              </a>
            </div>
          ))}

          <div
            ref={(el) => {
              if (el) menuItemsRef.current[navItems.length] = el;
            }}
            className="overflow-hidden mt-8 flex flex-col gap-4"
          >
            <a
              href={PILOT_HREF}
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 rounded-lg bg-primary text-text-inverse font-semibold focus-ring-target min-h-[44px] text-center"
            >
              Liitu piloodiga
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 rounded-lg border border-border text-text-primary font-semibold hover:bg-surface transition-colors text-center focus-ring-target min-h-[44px]"
            >
              Broneeri vestlus
            </a>
          </div>

          {/* Close button for keyboard users */}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 w-11 h-11 rounded-lg bg-elevated flex items-center justify-center focus-ring-target"
              aria-label="Sulge menüü"
            >
              <X className="w-5 h-5 text-text-primary" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

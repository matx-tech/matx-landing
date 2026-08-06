'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AnimatedWordReveal, AnimatedCharacterReveal, MATxLogoAnimation } from './animated-headline';
import { HERO_COPY, SECTION_IDS } from '@/lib/content/landing-copy';
import { Award, GraduationCap } from 'lucide-react';
import { useRegistration } from '@/components/providers/registration-provider';
import { motionTokens, gsapEase, staggers } from '@/lib/motion-tokens';

// Lazy-load the product fixture (right column visual) — it's below the fold
// on mobile and to the right of the hero text on desktop.  Deferring it
// removes GSAP ScrollTrigger + layout work from the critical path. The
// fixture is SSR-safe (module-scope guards in product-fixture.tsx), so the
// above-the-fold visual is present in the server-rendered HTML.
const ProductFixture = dynamic(
  () => import('@/components/ui/product-fixture').then((mod) => mod.ProductFixture),
  {
    loading: () => (
      <div
        className="hidden lg:block w-full aspect-[4/3] rounded-2xl bg-surface/50 animate-pulse"
        aria-hidden="true"
      />
    ),
  }
);

// Decorative bounce arrow — not needed for first paint.
const ScrollIndicator = dynamic(
  () => import('./scroll-indicator').then((mod) => mod.ScrollIndicator),
  {
    ssr: false,
    // Reserve the indicator's slot (absolute bottom-center) while the chunk
    // loads so it doesn't pop in; the fallback is purely decorative.
    loading: () => (
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-10 rounded-full border-2 border-text-secondary/50"
      />
    ),
  }
);

export function HeroSection() {
  const ctasRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const { openRegistration } = useRegistration();

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Reduced motion: instant visibility for CTAs, trust line, badges
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const elements = [
        ...Array.from(ctasRef.current?.children ?? []),
        trustRef.current,
        ...Array.from(badgesRef.current?.children ?? []),
      ].filter(Boolean);
      gsap.set(elements, { opacity: 1, y: 0 });
    });

    // Full animation: staggered reveal after headline completes
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const elements = [
        ...Array.from(ctasRef.current?.children ?? []),
        trustRef.current,
        ...Array.from(badgesRef.current?.children ?? []),
      ].filter(Boolean) as (Element | HTMLDivElement)[];

      gsap.set(elements, { opacity: 0, y: motionTokens.distance.md });

      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: motionTokens.duration.normal,
        delay: 2.2,
        stagger: staggers.card,
        ease: gsapEase(motionTokens.easing.emphasized),
      });
    });

    return () => mm.revert();
  }, { scope: ctasRef });

  return (
    <section id={SECTION_IDS.hero} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-canvas">
      <div className="absolute inset-0 hero-blueprint-bg" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-canvas/40 to-canvas pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-24 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="text-center lg:text-left">
            <div className="mb-6 lg:mb-8">
              <div className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight">
                <MATxLogoAnimation delay={0.3} />
              </div>
            </div>

            <AnimatedWordReveal
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-text-primary tracking-tight mb-6"
              stagger={0.08}
              delay={0.6}
            >
              {HERO_COPY.headline}
            </AnimatedWordReveal>

            <div className="mb-10">
              <AnimatedCharacterReveal
                className="text-lg md:text-xl text-text-secondary leading-relaxed"
              >
                {HERO_COPY.support}
              </AnimatedCharacterReveal>
            </div>

            <div ref={ctasRef} className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-4 mb-8">
              <button
                type="button"
                onClick={openRegistration}
                className="btn-primary min-w-[240px] sm:min-w-[280px] px-8 py-4 text-lg rounded-xl font-semibold focus-ring-target min-h-[44px]"
              >
                {HERO_COPY.primaryCTA}
              </button>

              <a
                href={`#${SECTION_IDS.workflow}`}
                className="btn-secondary min-w-[240px] sm:min-w-[280px] px-8 py-4 text-lg rounded-xl font-semibold group focus-ring-target min-h-[44px]"
              >
                {HERO_COPY.secondaryCTA}
                <span className="ml-2 inline-block transition-transform group-hover:translate-y-1">↓</span>
              </a>
            </div>

            <p ref={trustRef} className="text-sm text-text-secondary/80 italic mb-8">
              {HERO_COPY.trustLine}
            </p>

            <div ref={badgesRef} className="flex flex-wrap justify-center lg:justify-start gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs">
                <Award className="w-3.5 h-3.5 text-warning" />
                <span className="font-medium text-text-primary">FELLIN HÄKK 2026 — I koht</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs">
                <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                <span className="font-medium text-text-primary">Presidendi Häkaton 2026</span>
              </div>
            </div>
          </div>

          <div className="lg:pl-8">
            <ProductFixture animated={true} triggerId={SECTION_IDS.hero} delay={2.5} />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

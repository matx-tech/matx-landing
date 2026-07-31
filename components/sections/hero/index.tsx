'use client';

import { AnimatedWordReveal, AnimatedCharacterReveal, MATxLogoAnimation } from './animated-headline';
import { ScrollIndicator } from './scroll-indicator';
import { ProductFixture } from '@/components/ui/product-fixture';
import { HERO_COPY, SECTION_IDS } from '@/lib/content/landing-copy';
import { Award, GraduationCap } from 'lucide-react';

interface HeroSectionProps {
  onOpenRegistration: () => void;
}

export function HeroSection({ onOpenRegistration }: HeroSectionProps) {
  return (
    <section id={SECTION_IDS.hero} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-canvas">
      {/* CVI-compliant blueprint grid background */}
      <div className="absolute inset-0 hero-blueprint-bg" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-canvas/40 to-canvas pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-24 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left: Hero message and CTAs */}
          <div className="text-center lg:text-left">
            {/* Logo */}
            <div className="mb-6 lg:mb-8">
              <div className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight">
                <MATxLogoAnimation delay={0.3} />
              </div>
            </div>

            {/* Main Headline - Locked narrative */}
            <AnimatedWordReveal
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-text-primary tracking-tight mb-6"
              stagger={0.08}
              delay={0.6}
            >
              {HERO_COPY.headline}
            </AnimatedWordReveal>

            {/* Support copy - Locked narrative */}
            <div className="mb-10">
              <AnimatedCharacterReveal
                className="text-lg md:text-xl text-text-secondary leading-relaxed"
                delay={1.8}
              >
                {HERO_COPY.support}
              </AnimatedCharacterReveal>
            </div>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-4 mb-8">
              <button
                type="button"
                onClick={onOpenRegistration}
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

            {/* Trust line */}
            <p className="text-sm text-text-secondary/80 italic mb-8">
              {HERO_COPY.trustLine}
            </p>

            {/* Achievement Badges - Secondary proof */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
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

          {/* Right: Product fixture */}
          <div className="lg:pl-8">
            <ProductFixture animated={true} triggerId={SECTION_IDS.hero} />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}

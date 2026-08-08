'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Award, GraduationCap } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRegistration } from '@/components/providers/registration-provider';
import { CALENDLY_URL, HERO_COPY, SECTION_IDS, TECH_OVERVIEW } from '@/lib/content/landing-copy';
import { gsapEase, motionTokens, staggers } from '@/lib/motion-tokens';
import {
  AnimatedCharacterReveal,
  AnimatedWordReveal,
  MATxLogoAnimation,
} from './animated-headline';

// Lazy-load the product fixture (right column visual) — it's below the fold
// on mobile and to the right of the hero text on desktop.  Deferring it
// removes GSAP ScrollTrigger + layout work from the critical path. The
// fixture is SSR-safe (module-scope guards in product-fixture.tsx), so the
// above-the-fold visual is present in the server-rendered HTML.
const ProductFixture = dynamic(
  () => import('@/components/ui/product-fixture').then((mod) => mod.ProductFixture),
  {
    // Match the fixture's real stack geometry (label + 4 panels) at every
    // breakpoint — the old hidden-on-mobile box reserved nothing, so the
    // fixture popped in (~400px CLS) when its chunk hydrated.
    loading: () => (
      <div className='w-full space-y-4' aria-hidden='true'>
        <div className='h-4 w-24 rounded bg-border/40 animate-pulse motion-reduce:animate-none' />
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className='h-24 rounded-lg bg-border/40 animate-pulse motion-reduce:animate-none'
          />
        ))}
      </div>
    ),
  },
);

// Decorative bounce arrow — not needed for first paint.
const ScrollIndicator = dynamic(
  () => import('./scroll-indicator').then((mod) => mod.ScrollIndicator),
  {
    // SSR'd so the indicator + its a11y label exist without JS (the chunk
    // is tiny). The fallback matches the real component's initial state
    // (opacity 0 until the 3.2s entrance) so the slot never flashes a
    // visible circle that then disappears.
    loading: () => (
      <div aria-hidden='true' className='absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0' />
    ),
  },
);

// Persona picker — the primary CTA adapts to who is reading. Labels mirror
// the ADOPTION_ROUTES vocabulary on the landing page.
const PERSONA_OPTIONS = [
  { id: 'teacher', label: 'Õpetaja' },
  { id: 'principal', label: 'Koolijuht' },
  { id: 'procurement', label: 'Hankija/IT' },
] as const;

type PersonaId = (typeof PERSONA_OPTIONS)[number]['id'];

const PRIMARY_CTA_CLASS =
  'btn-primary min-w-[240px] sm:min-w-[280px] px-8 py-4 text-lg rounded-xl font-semibold focus-ring-target min-h-[44px]';

/**
 * Renders the landing page hero section with animated branding, introductory content, registration and workflow CTAs, achievement badges, and a product preview.
 */
export function HeroSection() {
  const ctasRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const { openRegistration } = useRegistration();
  const [persona, setPersona] = useState<PersonaId>('teacher');

  useGSAP(
    () => {
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

        // Set the hidden state at mount, then reveal after the headline
        // sequence — the previous immediateRender: false version showed the
        // finished CTAs until 2.2s and then snapped them hidden, a visible
        // blink on every load. The tradeoff (CTA hidden until the reveal)
        // matches the headline's own delayed reveal.
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
    },
    { scope: ctasRef },
  );

  return (
    <section
      id={SECTION_IDS.hero}
      className='relative min-h-screen flex items-center justify-center overflow-hidden bg-canvas'
    >
      <div className='absolute inset-0 hero-blueprint-bg' aria-hidden='true' />
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-canvas/40 to-canvas pointer-events-none' />

      <div className='relative z-10 container mx-auto px-4 md:px-8 py-24 md:py-32 lg:py-40'>
        <div className='grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto'>
          <div className='text-center lg:text-left'>
            <div className='mb-6 lg:mb-8'>
              <div className='text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight'>
                <MATxLogoAnimation delay={0.3} />
              </div>
            </div>

            <AnimatedWordReveal
              className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-text-primary tracking-tight mb-6'
              stagger={0.08}
              delay={0.6}
            >
              {HERO_COPY.headline}
            </AnimatedWordReveal>

            <div className='mb-10'>
              <AnimatedCharacterReveal className='text-lg md:text-xl text-text-secondary leading-relaxed'>
                {HERO_COPY.support}
              </AnimatedCharacterReveal>
            </div>

            <div ref={ctasRef} className='flex flex-col gap-4 mb-8'>
              {/* Persona picker — personalize the primary CTA */}
              <div className='flex flex-wrap items-center justify-center lg:justify-start gap-2'>
                <span className='text-sm text-text-secondary mr-1'>Ma olen:</span>
                {PERSONA_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type='button'
                    onClick={() => setPersona(option.id)}
                    aria-pressed={persona === option.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors focus-ring-target min-h-[44px] ${
                      persona === option.id
                        ? 'bg-primary text-text-inverse border-primary'
                        : 'bg-surface text-text-secondary border-border hover:border-primary'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className='flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-4'>
                {persona === 'teacher' && (
                  <button type='button' onClick={openRegistration} className={PRIMARY_CTA_CLASS}>
                    {HERO_COPY.primaryCTA}
                  </button>
                )}
                {persona === 'principal' && (
                  <a
                    href={CALENDLY_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={PRIMARY_CTA_CLASS}
                  >
                    Broneeri demokõne
                    <span className='sr-only'> (avaneb uues aknas)</span>
                  </a>
                )}
                {persona === 'procurement' && (
                  <Link href={TECH_OVERVIEW.href} className={PRIMARY_CTA_CLASS}>
                    Vaata tehnilist ülevaadet
                  </Link>
                )}

                <a
                  href={`#${SECTION_IDS.workflow}`}
                  className='btn-secondary min-w-[240px] sm:min-w-[280px] px-8 py-4 text-lg rounded-xl font-semibold group focus-ring-target min-h-[44px]'
                >
                  {HERO_COPY.secondaryCTA}
                  <span
                    aria-hidden='true'
                    className='ml-2 inline-block transition-transform group-hover:translate-y-1'
                  >
                    ↓
                  </span>
                </a>
              </div>
            </div>

            <p ref={trustRef} className='text-sm text-text-secondary/80 italic mb-8'>
              {HERO_COPY.trustLine}
            </p>

            <div ref={badgesRef} className='flex flex-wrap justify-center lg:justify-start gap-3'>
              <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs'>
                <Award className='w-3.5 h-3.5 text-warning' />
                <span className='font-medium text-text-primary'>FELLIN HÄKK 2026 — I koht</span>
              </div>
              <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs'>
                <GraduationCap className='w-3.5 h-3.5 text-secondary' />
                <span className='font-medium text-text-primary'>Presidendi Häkaton 2026</span>
              </div>
            </div>
          </div>

          <div className='lg:pl-8'>
            <ProductFixture animated={true} triggerId={SECTION_IDS.hero} delay={2.5} />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, FileText, Shield } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { SECTION_IDS, TRUST_PILLARS } from '@/lib/content/landing-copy';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { gsapEase, motionTokens, staggers } from '@/lib/motion-tokens';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TRUST_ICONS: Record<string, typeof Shield | typeof Eye | typeof FileText> = {
  shield: Shield,
  eye: Eye,
  'file-text': FileText,
};

/**
 * Presents MATx’s trust principles, recommendation transparency workflow, and adoption guidance.
 */
export function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) {
      // Ensure all animated elements are visible when motion is disabled
      const title = sectionRef.current.querySelector('.section-title');
      if (title) gsap.set(title, { opacity: 1, y: 0 });
      const pillars = sectionRef.current.querySelectorAll('.trust-pillar');
      gsap.set(pillars, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const sectionTitle = sectionRef.current?.querySelector('.section-title');
      if (!sectionTitle) return;

      gsap.fromTo(
        sectionTitle,
        { y: motionTokens.distance.xl, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: motionTokens.duration.slow,
          ease: gsapEase(motionTokens.easing.smooth),
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        },
      );

      // Pillar cards — batched ScrollTrigger for staggered entrance
      const cards = gsap.utils.toArray<HTMLDivElement>('.trust-pillar', sectionRef.current);

      // Initialize hidden state so cards don't flash visible before ScrollTrigger
      // fires onEnter.  ctx.revert() restores inline styles during cleanup.
      gsap.set(cards, { y: motionTokens.distance.lg, opacity: 0, scale: 0.95 });

      ScrollTrigger.batch(cards, {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { y: motionTokens.distance.lg, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: motionTokens.duration.slow,
              stagger: staggers.card,
              ease: gsapEase(motionTokens.easing.smooth),
            },
          );
        },
        onLeaveBack: (elements) => {
          gsap.to(elements, {
            y: motionTokens.distance.lg,
            opacity: 0,
            scale: 0.95,
            duration: motionTokens.duration.fast,
            stagger: staggers.card,
            ease: gsapEase(motionTokens.easing.accelerate),
          });
        },
        start: 'top 85%',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.trust}
      className='relative py-24 md:py-32 lg:py-40 bg-canvas overflow-hidden'
    >
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl' />
      </div>

      <div className='relative z-10 container mx-auto px-4 md:px-8 lg:px-16'>
        {/* Section Title */}
        <div className='section-title text-center mb-16'>
          <span className='inline-block text-primary text-sm uppercase tracking-widest mb-4 font-mono'>
            Usaldus
          </span>
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-primary mb-6'>
            Kuidas toetame õpetaja kontrolli
          </h2>
          <p className='text-lg md:text-xl text-text-secondary max-w-3xl mx-auto'>
            MATx toetab õpetaja otsust kolme põhimõtte kaudu
          </p>
        </div>

        {/* Trust Pillars */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto'>
          {TRUST_PILLARS.map((pillar) => {
            const Icon = TRUST_ICONS[pillar.icon];

            return (
              <div key={pillar.title} className='trust-pillar card p-8 text-center group'>
                <div className='w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center bg-primary/10 group-hover:scale-110 transition-transform'>
                  {Icon && <Icon className='w-8 h-8 text-primary' />}
                </div>
                <h3 className='text-xl font-display font-semibold text-text-primary mb-3'>
                  {pillar.title}
                </h3>
                <p className='text-text-secondary leading-relaxed'>{pillar.description}</p>
              </div>
            );
          })}
        </div>

        {/* Example workflow transparency */}
        <div className='max-w-3xl mx-auto'>
          <div className='bg-elevated rounded-xl p-6 border border-border'>
            <h3 className='text-lg font-display font-semibold text-text-primary mb-4'>
              Näide: Kuidas õpetaja näeb soovituse põhjendust
            </h3>

            <div className='space-y-4'>
              <div className='p-4 bg-card rounded-lg border border-border'>
                <div className='text-xs font-medium text-text-secondary uppercase tracking-wider mb-2'>
                  Andmed
                </div>
                <div className='text-sm text-text-primary'>
                  Õpilane on viimase kolme ülesande puhul liitnud murdude lugejad ja nimetajad
                  eraldi
                </div>
              </div>

              <div className='p-4 bg-card rounded-lg border border-border'>
                <div className='text-xs font-medium text-text-secondary uppercase tracking-wider mb-2'>
                  Tuvastatud signaal
                </div>
                <div className='text-sm text-text-primary'>
                  Võimalik veamuster: „Liidab lugejad ja nimetajad eraldi{'\u201c'} (kontrollitav
                  signaal)
                </div>
              </div>

              <div className='p-4 bg-success-surface rounded-lg border border-success-border'>
                <div className='text-xs font-medium text-success uppercase tracking-wider mb-2'>
                  Soovitus
                </div>
                <div className='text-sm text-success-strong mb-3'>
                  Harjuta murdarvu liitmist sammu-sammult
                </div>
                <div className='flex gap-2 flex-wrap'>
                  <span className='px-3 py-1 text-xs font-medium rounded bg-card border border-success-border text-success'>
                    Võta vastu
                  </span>
                  <span className='px-3 py-1 text-xs font-medium rounded bg-card border border-success-border text-success'>
                    Muuda
                  </span>
                  <span className='px-3 py-1 text-xs font-medium rounded bg-card border border-success-border text-success'>
                    Ignoreeri
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Link to adoption section with procurement/IT info */}
        <div className='text-center mt-12'>
          <p className='text-text-secondary mb-4'>
            IT-juhile ja hankeametnikule: Kuidas alustada ja tehnilised detailid
          </p>
          <a
            href={`#${SECTION_IDS.pilot}`}
            className='inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors focus-ring-target rounded-md min-h-[44px] px-4'
          >
            <span>Vaata alustamise marsruute</span>
            <span aria-hidden='true'>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

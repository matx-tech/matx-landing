'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Eye, FileText } from 'lucide-react';
import { TRUST_PILLARS, SECTION_IDS } from '@/lib/content/landing-copy';

const TRUST_ICONS: Record<string, typeof Shield | typeof Eye | typeof FileText> = {
  shield: Shield,
  eye: Eye,
  'file-text': FileText,
};

export function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      sectionRef.current.querySelector('.section-title'),
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="usaldus" className="relative py-24 md:py-32 lg:py-40 bg-canvas overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Title */}
        <div className="section-title text-center mb-16">
          <span className="inline-block text-primary text-sm uppercase tracking-widest mb-4 font-mono">
            Usaldus
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-primary mb-6">
            Kuidas toetame õpetaja kontrolli
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
            MATx toetab õpetaja otsust kolme põhimõtte kaudu
          </p>
        </div>

        {/* Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = TRUST_ICONS[pillar.icon];

            return (
              <div key={pillar.title} className="card p-8 text-center group">
                <div className="w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center bg-primary/10 group-hover:scale-110 transition-transform">
                  {Icon && <Icon className="w-8 h-8 text-primary" />}
                </div>
                <h3 className="text-xl font-display font-semibold text-text-primary mb-3">
                  {pillar.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        {/* Example workflow transparency */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-elevated rounded-xl p-6 border border-border">
            <h3 className="text-lg font-display font-semibold text-text-primary mb-4">
              Näide: Kuidas õpetaja näeb soovituse põhjendust
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Andmed
                </div>
                <div className="text-sm text-text-primary">
                  Õpilane on viimase kolme ülesande puhul liitnud murdude lugejad ja nimetajad eraldi
                </div>
              </div>

              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Tuvastatud signaal
                </div>
                <div className="text-sm text-text-primary">
                  Võimalik veamuster: „Liidab lugejad ja nimetajad eraldi\u201c (kontrollitav signaal)
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xs font-medium text-green-800 uppercase tracking-wider mb-2">
                  Soovitus
                </div>
                <div className="text-sm text-green-900 mb-3">
                  Harjuta murdarvu liitmist sammu-sammult
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 text-xs font-medium rounded bg-white border border-green-300 text-green-800">
                    Võta vastu
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded bg-white border border-green-300 text-green-800">
                    Muuda
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded bg-white border border-green-300 text-green-800">
                    Ignoreeri
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Link to adoption section with procurement/IT info */}
        <div className="text-center mt-12">
          <p className="text-text-secondary mb-4">
            IT-juhile ja hankeametnikule: Kuidas alustada ja tehnilised detailid
          </p>
          <a
            href={`#${SECTION_IDS.pilot}`}
            className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors focus-ring-target rounded-md min-h-[44px] px-4"
          >
            <span>Vaata alustamise marsruute</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

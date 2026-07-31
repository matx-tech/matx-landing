'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Users } from 'lucide-react';

interface CTASectionProps {
  onOpenRegistration: () => void;
}

export function CTASection({ onOpenRegistration }: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      const lines = titleRef.current!.querySelectorAll('.cta-line');

      gsap.set(lines, { y: 60, opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => {
          gsap.to(lines, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.12,
            ease: 'cubic-bezier(0.2, 0, 0, 1)',
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 lg:py-40 bg-surface overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 bg-gradient-brand opacity-5" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 text-center">
        {/* Title */}
        <div ref={titleRef} className="max-w-4xl mx-auto mb-16">
          <div className="cta-line">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
              Iga õpilane väärib personaalset matemaatikaõpetajat.
            </h2>
          </div>
          <div className="cta-line mt-4">
            <p className="text-text-secondary">
              Pilootkatsetus on 100% tasuta. Targa Tuleviku Fondi toetusel.
            </p>
          </div>
        </div>

        {/* Dual CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
          {/* Student CTA */}
          <div className="card p-8 text-center hover:border-primary/30 transition-colors">
            <GraduationCap className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
              Koolide registreerimine
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              Liitu 10 pilootkooliga. Sügisesed klassid 7.-9. klassini.
            </p>
            <button
              onClick={onOpenRegistration}
              className="w-full px-6 py-3 text-base rounded-xl bg-primary text-text-inverse font-semibold hover:bg-primary/90 transition-all focus-ring-target min-h-[44px]"
            >
              Registreeri kool
            </button>
            <div className="mt-4 flex justify-center gap-4 text-xs text-text-secondary">
              <span>Tasuta</span>
              <span>·</span>
              <span>48h vastus</span>
            </div>
          </div>

          {/* Teacher CTA */}
          <div className="card p-8 text-center hover:border-secondary/30 transition-colors">
            <Users className="w-10 h-10 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
              Õpetajatele
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              Demostreerime platvormi ja vastame küsimustele.
            </p>
            <a
              href="https://calendly.com/matx-ee/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-6 py-3 text-base rounded-xl bg-secondary text-text-inverse font-semibold hover:bg-secondary/90 transition-all focus-ring-target min-h-[44px]"
            >
              Broneeri 15-min vestlus
            </a>
            <div className="mt-4 flex justify-center gap-4 text-xs text-text-secondary">
              <span>Video kõne</span>
              <span>·</span>
              <span>Kohandatud aeg</span>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative w-full overflow-hidden py-8">
          <svg
            viewBox="0 0 600 30"
            className="w-full max-w-2xl mx-auto opacity-50"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              id="ctaPath"
              d="M 100 15 Q 300 5 500 15"
              fill="none"
              stroke="none"
            />
            <text fontSize="12" fill="var(--color-text-secondary)">
              <textPath href="#ctaPath">
                Alusta tasuta · Õpi mõistvalt · Säästa aega · 150+ ülesannet · BKT mootor · EU AI Act ·
                Alusta tasuta · Õpi mõistvalt · Säästa aega · 150+ ülesannet · BKT mootor · EU AI Act ·
              </textPath>
            </text>
          </svg>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-primary">150+</div>
            <div className="text-text-secondary text-sm">ülesannet</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-secondary">85%</div>
            <div className="text-text-secondary text-sm">mastery rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-accent">2.3×</div>
            <div className="text-text-secondary text-sm">kiirem progress</div>
          </div>
        </div>

        {/* Grant info */}
        <div className="mt-12 inline-flex items-center gap-4 px-6 py-3 rounded-xl bg-elevated border border-border">
          <span className="text-text-secondary text-sm">
            Taotlus esitatakse Targa Tuleviku Fondile — tähtaeg 31. august 2026
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * Adoption Routes Section
 * Audience-specific paths: teachers, principals, procurement, IT
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ADOPTION_ROUTES, SECTION_IDS, CALENDLY_URL, type AudienceId } from '@/lib/content/landing-copy';
import { BookOpen, School, FileText, Server } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AUDIENCE_ICONS: Record<AudienceId, typeof BookOpen | typeof School | typeof FileText | typeof Server> = {
  teacher: BookOpen,
  principal: School,
  procurement: FileText,
  it: Server,
};

interface AdoptionRoutesProps {
  onOpenRegistration?: () => void;
}

export function AdoptionSection({ onOpenRegistration }: AdoptionRoutesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleCTAClick = (action: string) => {
    if (action === 'registration' && onOpenRegistration) {
      onOpenRegistration();
    } else if (action === 'calendly') {
      const newWin = window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
      if (newWin) newWin.opener = null;
    } else if (action === 'procurement') {
      // Route to adoption section (anchor: pilot) — procurement info lives there
      const el = document.getElementById(SECTION_IDS.pilot);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'technical') {
      // Route to adoption section (anchor: pilot) — technical overview lives there
      const el = document.getElementById(SECTION_IDS.pilot);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.pilot}
      className="py-24 md:py-32 lg:py-40 bg-canvas"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Kuidas alustada
          </h2>
          <p className="text-lg text-muted-foreground">
            Vali oma rolliga sobiv marsruut
          </p>
        </div>

        {/* Adoption route cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {ADOPTION_ROUTES.map((route, index) => {
            const Icon = AUDIENCE_ICONS[route.audienceId];

            return (
              <div
                key={route.audience}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {Icon && <Icon className="w-6 h-6" />}
                </div>

                {/* Audience label */}
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  {route.audience}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {route.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6">
                  {route.description}
                </p>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => handleCTAClick(route.ctaAction)}
                  className="w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-text-inverse hover:bg-primary/90 transition-colors focus-ring-target min-h-[44px]"
                  aria-label={`${route.cta} - ${route.audience}`}
                >
                  {route.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Additional note */}
        <div className="max-w-2xl mx-auto text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Kõik marsruudid algavad vestlusega, et hinnata MATx-i sobivust teie vajaduste jaoks.
            Piloodi käigus kogume tagasisidet ja täiendame funktsionaalsust.
          </p>
        </div>
      </div>
    </section>
  );
}

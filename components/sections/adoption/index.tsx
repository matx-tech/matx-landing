/**
 * Adoption Routes Section
 * Audience-specific paths: teachers, principals, procurement, IT
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ADOPTION_ROUTES, SECTION_IDS } from '@/lib/content/landing-copy';
import { BookOpen, School, FileText, Server } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AUDIENCE_ICONS = {
  'Õpetajale': BookOpen,
  'Koolijuhile': School,
  'Hankele': FileText,
  'IT-le': Server,
} as const;

interface AdoptionRoutesProps {
  onOpenRegistration?: () => void;
}

export function AdoptionSection({ onOpenRegistration }: AdoptionRoutesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  }, []);

  const handleCTAClick = (action: string) => {
    if (action === 'registration' && onOpenRegistration) {
      onOpenRegistration();
    } else if (action === 'calendly') {
      window.open('https://calendly.com/matx-demo', '_blank');
    }
    // Other actions would need implementation
  };

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.pilot}
      className="py-24 md:py-32 lg:py-40 bg-background"
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
            const Icon = AUDIENCE_ICONS[route.audience as keyof typeof AUDIENCE_ICONS];

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
                  onClick={() => handleCTAClick(route.ctaAction)}
                  className="w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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

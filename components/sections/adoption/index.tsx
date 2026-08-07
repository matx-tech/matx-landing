/**
 * Adoption Routes Section
 * Audience-specific paths: teachers, principals, procurement, IT
 */

'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ADOPTION_ROUTES, SECTION_IDS, CALENDLY_URL, type AudienceId } from '@/lib/content/landing-copy';
import { BookOpen, School, FileText, Server } from 'lucide-react';
import { useLenis } from '@/components/providers/lenis-provider';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { motionTokens, gsapEase, staggers } from '@/lib/motion-tokens';

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
  const { scrollTo } = useLenis();
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) {
      // Ensure all animated elements are visible when motion is disabled
      const cards = sectionRef.current.querySelectorAll('.adoption-card');
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Adoption route cards — batched ScrollTrigger
      const cards = gsap.utils.toArray<HTMLDivElement>('.adoption-card', sectionRef.current);

      ScrollTrigger.batch(cards, {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: motionTokens.distance.lg },
            {
              opacity: 1,
              y: 0,
              duration: motionTokens.duration.slow,
              stagger: staggers.card,
              ease: gsapEase(motionTokens.easing.smooth),
            }
          );
        },
        onLeaveBack: (elements) => {
          gsap.to(elements, {
            opacity: 0,
            y: motionTokens.distance.lg,
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

  const handleCTAClick = (action: string) => {
    const route = ADOPTION_ROUTES.find((r) => r.ctaAction === action)?.ctaRoute;
    if (route) {
      router.push(route);
      return;
    }
    if (action === 'registration' && onOpenRegistration) {
      onOpenRegistration();
    } else if (action === 'calendly') {
      const newWin = window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
      if (newWin) newWin.opener = null;
    } else if (action === 'procurement') {
      const el = document.getElementById(SECTION_IDS.pilot);
      if (el) scrollTo(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.pilot}
      className="py-24 md:py-32 lg:py-40 bg-canvas section-fade-from-surface"
    >
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16">
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
                className="adoption-card bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
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

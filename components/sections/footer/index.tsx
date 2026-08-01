'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, GraduationCap, Mail, MessageCircle, Building2, GitBranch } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { motionTokens, gsapEase, staggers } from '@/lib/motion-tokens';
import { SECTION_IDS } from '@/lib/content/landing-copy';

export function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!footerRef.current) return;
    if (prefersReducedMotion) {
      // Ensure all animated elements are visible when motion is disabled
      sectionsRef.current.forEach((section) => {
        if (section) gsap.set(section, { opacity: 1, y: 0 });
      });
      if (bottomRef.current) gsap.set(bottomRef.current, { opacity: 1 });
      if (gradientRef.current) gsap.set(gradientRef.current, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Staggered entrance for all footer grid sections — one tween with
      // stagger instead of a per-section loop so a single ScrollTrigger
      // controls the entire entrance + reversal.
      const sectionTargets = sectionsRef.current.filter(Boolean);
      if (sectionTargets.length > 0) {
        gsap.fromTo(
          sectionTargets,
          { y: motionTokens.distance.lg, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionTokens.duration.slow,
            stagger: staggers.card,
            ease: gsapEase(motionTokens.easing.smooth),
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Bottom bar
      if (bottomRef.current) {
        gsap.fromTo(
          bottomRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: motionTokens.duration.normal,
            delay: 0.4,
            ease: gsapEase(motionTokens.easing.smooth),
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Brand gradient line — scrub width on scroll
      if (gradientRef.current) {
        gsap.fromTo(
          gradientRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: motionTokens.duration.crawl,
            ease: 'none',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 90%',
              end: 'bottom bottom',
              scrub: 0.5,
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <footer ref={footerRef} className="relative bg-canvas border-t border-border section-fade-from-surface">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div
            ref={(el) => { sectionsRef.current[0] = el; }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-display font-bold">
                <span className="text-primary">MAT</span>
                <span className="text-secondary">x</span>
              </span>
            </div>
            <p className="text-text-secondary text-sm max-w-md mb-4">
              Adaptiivne matemaatikaõpikeskkond Eesti põhikoolidele. Andmepõhine õpitee, teaduslikel alustel.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-elevated border border-border">
                <Award className="w-3 h-3 text-warning" />
                <span className="text-xs text-text-secondary">FELLIN HÄKK 2026</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-elevated border border-border">
                <GraduationCap className="w-3 h-3 text-secondary" />
                <span className="text-xs text-text-secondary">Presidendi Häkaton</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div ref={(el) => { sectionsRef.current[1] = el; }}>
            <h3 className="text-text-primary font-display font-semibold mb-4 text-sm">Navigatsioon</h3>
            <ul className="space-y-2">
              <li>
                <a href="#probleem" className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  Probleem
                </a>
              </li>
              <li>
                <a href={`#${SECTION_IDS.workflow}`} className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  Töövoog
                </a>
              </li>
              <li>
                <a href={`#${SECTION_IDS.capabilities}`} className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  Teemad
                </a>
              </li>
              <li>
                <a href={`#${SECTION_IDS.student}`} className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  Õpitee
                </a>
              </li>
              <li>
                <a href={`#${SECTION_IDS.teacher}`} className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  Õpetajale
                </a>
              </li>
              <li>
                <a href={`#${SECTION_IDS.faq}`} className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  KKK
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div ref={(el) => { sectionsRef.current[2] = el; }}>
            <h3 className="text-text-primary font-display font-semibold mb-4 text-sm">Kontakt</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:andri@matx.ee"
                  className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md"
                  style={{ textDecoration: 'underline' }}
                >
                  andri@matx.ee
                </a>
              </li>
              <li>
                <a
                  href="https://calendly.com/matx-ee/15min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-secondary transition-colors text-sm focus-ring-target rounded-md"
                  style={{ textDecoration: 'underline' }}
                >
                  Broneeri vestlus
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://twitter.com/matx_ee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-elevated border border-border flex items-center justify-center hover:bg-surface transition-colors focus-ring-target"
                aria-label="MATx Twitter"
              >
                <MessageCircle className="w-4 h-4 text-text-secondary" />
              </a>
              <a
                href="https://linkedin.com/company/matx-ee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-elevated border border-border flex items-center justify-center hover:bg-surface transition-colors focus-ring-target"
                aria-label="MATx LinkedIn"
              >
                <Building2 className="w-4 h-4 text-text-secondary" />
              </a>
              <a
                href="https://github.com/matx-ee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-elevated border border-border flex items-center justify-center hover:bg-surface transition-colors focus-ring-target"
                aria-label="MATx GitHub"
              >
                <GitBranch className="w-4 h-4 text-text-secondary" />
              </a>
              <a
                href="mailto:andri@matx.ee"
                className="w-11 h-11 rounded-lg bg-elevated border border-border flex items-center justify-center hover:bg-surface transition-colors focus-ring-target"
                aria-label="MATx meil"
              >
                <Mail className="w-4 h-4 text-text-secondary" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div ref={bottomRef} className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-xs">
            © 2026 MATx. Kõik õigused kaitstud. Targa Tuleviku Fondi toetatud.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <a href="#" className="hover:text-primary transition-colors focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
              Privaatsuspoliitika
            </a>
            <a href="#" className="hover:text-primary transition-colors focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
              Teenuse tingimused
            </a>
            <a href="#" className="hover:text-primary transition-colors focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
              GDPR
            </a>
          </div>
        </div>

        {/* Brand gradient line */}
        <div ref={gradientRef} className="mt-8 h-1 bg-gradient-brand rounded-full opacity-30" style={{ transformOrigin: 'left' }} />
      </div>
    </footer>
  );
}

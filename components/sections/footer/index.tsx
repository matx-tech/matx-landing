'use client';

import { Award, GraduationCap, Twitter, Linkedin, Github, Mail } from 'lucide-react';

export function FooterSection() {
  return (
    <footer className="relative bg-canvas border-t border-border section-fade-from-surface">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
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
          <div>
            <h3 className="text-text-primary font-display font-semibold mb-4 text-sm">Navigatsioon</h3>
            <ul className="space-y-2">
              <li>
                <a href="#probleem" className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  Probleem
                </a>
              </li>
              <li>
                <a href="#erinevus" className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  Erinevus
                </a>
              </li>
              <li>
                <a href="#teemad" className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  Teemad
                </a>
              </li>
              <li>
                <a href="#opitee" className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  Õpitee
                </a>
              </li>
              <li>
                <a href="#opetajale" className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  Õpetajale
                </a>
              </li>
              <li>
                <a href="#kkk" className="text-text-secondary hover:text-primary transition-colors text-sm focus-ring-target rounded-md" style={{ textDecoration: 'underline' }}>
                  KKK
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
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
                <Twitter className="w-4 h-4 text-text-secondary" />
              </a>
              <a
                href="https://linkedin.com/company/matx-ee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-elevated border border-border flex items-center justify-center hover:bg-surface transition-colors focus-ring-target"
                aria-label="MATx LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-text-secondary" />
              </a>
              <a
                href="https://github.com/matx-ee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-elevated border border-border flex items-center justify-center hover:bg-surface transition-colors focus-ring-target"
                aria-label="MATx GitHub"
              >
                <Github className="w-4 h-4 text-text-secondary" />
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
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
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
        <div className="mt-8 h-1 bg-gradient-brand rounded-full opacity-30" />
      </div>
    </footer>
  );
}

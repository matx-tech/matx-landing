'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollIndicator } from '@/components/sections/hero/scroll-indicator';
import { PRODUCT_FIXTURE } from '@/lib/content/landing-evidence';
import { Fraction, InlineFractionalExpression } from '@/components/ui/fraction';

const storyBeats = [
  {
    id: 1,
    title: 'Õpilane eksib',
    subtitle: 'Klassiruumis',
    description: 'Õpilane teeb vea matemaatika ülesandes, kuid ei tea, mis järgmisena harjutada. Vastus on vale, aga põhjus jääb ebaselgeks.',
    visual: 'answer',
    color: 'primary',
  },
  {
    id: 2,
    title: 'Muster kordub',
    subtitle: 'Veamuster',
    description: 'Sama viga ilmneb erinevates ülesannetes, kuid jääb märkamata. Õpilane harjutab edasi, kuid ei paranda põhiprobleemi.',
    visual: 'pattern',
    color: 'accent',
  },
  {
    id: 3,
    title: 'Õpetaja vajab järgmist sammu',
    subtitle: 'Õpetaja otsustab',
    description: 'Õpetaja näeb tulemusi, kuid ei tea, milline harjutus aitaks kõige paremini. Individuaalne toetus nõuab aega ja struktuuri.',
    visual: 'teacher',
    color: 'secondary',
  },
];

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<HTMLDivElement[]>([]);
  const textRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const beats = beatRefs.current;
    const texts = textRefs.current;

    const ctx = gsap.context(() => {
      beats.forEach((beat, index) => {
        if (!beat) return;

        const text = texts[index];
        if (!text) return;

        gsap.set(text.children, { y: 50, opacity: 0 });

        ScrollTrigger.create({
          trigger: beat,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            gsap.to(text.children, {
              y: 0,
              opacity: 1,
              duration: 0.3,
              stagger: 0.08,
              ease: 'cubic-bezier(0.2, 0, 0, 1)',
            });
          },
          onLeaveBack: () => {
            gsap.to(text.children, {
              y: 50,
              opacity: 0,
              duration: 0.25,
              stagger: 0.05,
              ease: 'cubic-bezier(0.4, 0, 1, 1)',
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="probleem" className="relative bg-surface">
      <div ref={containerRef}>
        {storyBeats.map((beat, index) => (
          <div
            key={beat.id}
            ref={(el) => {
              if (el) beatRefs.current[index] = el;
            }}
            className="relative min-h-screen flex items-center justify-center py-20"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-canvas via-surface to-canvas opacity-50" />

            <div
              ref={(el) => {
                if (el) textRefs.current[index] = el;
              }}
              className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 max-w-5xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left: Text */}
                <div className="text-center lg:text-left max-w-prose">
                  <span className={`inline-block text-sm uppercase tracking-widest mb-4 font-mono ${
                    beat.color === 'primary' ? 'text-primary' :
                    beat.color === 'accent' ? 'text-accent' :
                    'text-secondary'
                  }`}>
                    {beat.subtitle}
                  </span>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-primary mb-6 leading-tight">
                    {beat.title}
                  </h2>

                  <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8">
                    {beat.description}
                  </p>
                </div>

                {/* Right: Visual */}
                <div className="flex justify-center">
                  <div className="relative w-full max-w-md min-h-0 rounded-xl bg-elevated border border-border p-4 md:p-6">
                    <div className={`absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl ${
                      beat.color === 'primary' ? 'bg-primary/15' :
                      beat.color === 'accent' ? 'bg-accent/15' :
                      'bg-secondary/15'
                    }`} />
                    <div className={`absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl ${
                      beat.color === 'primary' ? 'bg-secondary/10' :
                      beat.color === 'accent' ? 'bg-primary/10' :
                      'bg-primary/10'
                    }`} />

                    <div className="relative z-10">
                      {/* Visual content based on beat type */}
                      {beat.visual === 'answer' && (
                        <div className="space-y-4">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{PRODUCT_FIXTURE.label}</div>
                          <div className="p-4 bg-card rounded-lg border border-border">
                            <div className="text-sm font-medium mb-2"><InlineFractionalExpression expression={PRODUCT_FIXTURE.task.question} /></div>
                            <div className="text-sm text-muted-foreground">Õpilase vastus:{' '}<span className="font-mono text-destructive"><InlineFractionalExpression expression={PRODUCT_FIXTURE.answer.submitted} /></span></div>
                          </div>
                          <div className="text-xs text-muted-foreground italic">
                            Õpilane ei tea, mida järgmisena harjutada
                          </div>
                        </div>
                      )}

                      {beat.visual === 'pattern' && (
                        <div className="space-y-4">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{PRODUCT_FIXTURE.label}</div>
                          <div className="space-y-2">
                            {PRODUCT_FIXTURE.patternExamples.map((example) => (
                              <div key={example.expression} className="p-3 bg-card rounded border border-border text-xs">
                                <span className="text-muted-foreground"><InlineFractionalExpression expression={example.expression} /> = </span>
                                <span className="font-mono text-destructive"><InlineFractionalExpression expression={example.wrongAnswer} /></span>
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded border border-amber-200">
                            Võimalik veamuster: liidab lugejad ja nimetajad eraldi
                          </div>
                        </div>
                      )}

                      {beat.visual === 'teacher' && (
                        <div className="space-y-4">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Õpetaja vaade</div>
                          <div className="p-4 bg-card rounded-lg border border-border">
                            <div className="text-sm font-medium mb-2">Mis järgmisena?</div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div>• Kas harjutada ühist nimetajat?</div>
                              <div>• Kas kinnistada lihtsamat näidet?</div>
                              <div>• Kas võrrelda visuaalsete mudeliga?</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground italic">
                            Vajab struktuuri ja aega individuaalseks toetuseks
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {index < storyBeats.length - 1 && <ScrollIndicator hideLabel />}
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}

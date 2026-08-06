'use client';

import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { FAQ_ENTRIES, SECTION_IDS } from '@/lib/content/landing-copy';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { motionTokens, gsapEase, staggers } from '@/lib/motion-tokens';

export function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const flippingRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) {
      // Ensure all animated elements are visible when motion is disabled
      itemsRef.current.forEach((item) => {
        if (item) gsap.set(item, { opacity: 1, y: 0 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        gsap.fromTo(
          item,
          { y: motionTokens.distance.lg, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionTokens.duration.normal,
            delay: index * staggers.card,
            ease: gsapEase(motionTokens.easing.emphasized),
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Flip animation on accordion toggle
  useLayoutEffect(() => {
    if (!flipStateRef.current || prefersReducedMotion) return;

    Flip.from(flipStateRef.current, {
      duration: motionTokens.duration.normal,
      ease: gsapEase(motionTokens.easing.smooth),
      absolute: true,
      onComplete: () => {
        flippingRef.current = false;
      },
    });

    flipStateRef.current = null;
  }, [openIndex, prefersReducedMotion]);

  const handleToggle = (index: number) => {
    if (prefersReducedMotion) {
      setOpenIndex(openIndex === index ? null : index);
      return;
    }

    // Capture current layout state for ALL accordion panels before toggling,
    // so both the previously-open panel and the newly-opened panel animate.
    const allPanels = gsap.utils.toArray<HTMLElement>('[id^="faq-panel-"]');
    if (allPanels.length === 0) {
      setOpenIndex(openIndex === index ? null : index);
      return;
    }

    flipStateRef.current = Flip.getState(allPanels);
    flippingRef.current = true;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} id={SECTION_IDS.faq} className="relative py-24 md:py-32 bg-surface overflow-hidden section-fade-from-canvas">
      <div className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 max-w-4xl">
        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="inline-block text-primary text-sm uppercase tracking-widest mb-4 font-mono">
            Korduma kippuvad küsimused
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            KKK
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {FAQ_ENTRIES.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) itemsRef.current[index] = el;
                }}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-surface/50 transition-colors focus-ring-target min-h-[44px]"
                >
                  <span className="text-lg font-display font-semibold text-text-primary pr-4">
                    {item.question}
                  </span>
                  <span
                    className="text-primary transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  className="grid"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 text-text-secondary leading-relaxed">
                      {item.answerLink ? (
                        <>
                          {item.answer}{' '}
                          <a
                            href={item.answerLink.href}
                            className="text-primary hover:text-secondary underline transition-colors"
                          >
                            {item.answerLink.label}
                          </a>
                        </>
                      ) : (
                        item.answer
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-text-secondary mb-4">
            Teil on muid küsimusi?
          </p>
          <a
            href="mailto:andri@matx.ee"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors focus-ring-target rounded-md min-h-[44px] px-2"
            style={{ textDecoration: 'underline' }}
          >
            <span>andri@matx.ee</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

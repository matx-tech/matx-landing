'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FAQ_ENTRIES, SECTION_IDS } from '@/lib/content/landing-copy';

export function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    itemsRef.current.forEach((item, index) => {
      if (!item) return;

      gsap.fromTo(
        item,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'cubic-bezier(0.2, 0, 0, 1)',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.1,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleToggle = (index: number) => {
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
                  className="grid transition-all duration-200 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 text-text-secondary leading-relaxed">
                      {'answerLink' in item ? (
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

'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { TEACHER_STORY, SECTION_IDS } from '@/lib/content/landing-copy';
import { PRODUCT_FIXTURE } from '@/lib/content/landing-evidence';
import { CapabilityStatusBadge } from '@/components/ui/capability-status';

// Teacher-facing signals tied to the evidence fixture
const teacherSignals = [
  {
    icon: AlertTriangle,
    label: 'Veamuster tuvastatud',
    description: 'Liidab lugejad ja nimetajad eraldi',
    status: 'Saadaval' as const,
  },
  {
    icon: TrendingUp,
    label: 'Soovitus genereeritud',
    description: 'Harjuta murdarvu liitmist sammu-sammult',
    status: 'Saadaval' as const,
  },
  {
    icon: Clock,
    label: 'Reaalajas jälgimine',
    description: 'Tunni ajal õpilaste edusammud',
    status: 'Kavandatud' as const,
  },
];

// Heatmap level labels for accessibility
const heatmapLevelLabels = [
  'Madal',
  'Alla keskmise',
  'Keskmine',
  'Üle keskmise',
  'Kõrge',
];

export function TeacherSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const signalCardsRef = useRef<HTMLDivElement[]>([]);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);

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

    signalCardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(
        card,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'cubic-bezier(0, 0, 0.2, 1)',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.08,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const students = 22;
  const skills = 9;

  const getCellLevel = (row: number, col: number) => {
    return (row * 13 + col * 7) % 5;
  };

  return (
    <section ref={sectionRef} id={SECTION_IDS.teacher} className="relative py-24 md:py-32 lg:py-40 bg-surface overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Title */}
        <div className="section-title text-center mb-16">
          <span className="inline-block text-secondary text-sm uppercase tracking-widest mb-4 font-mono">
            Õpetajatele
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-primary mb-6">
            {TEACHER_STORY.heading}
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-4">
            {TEACHER_STORY.description}
          </p>
        </div>

        {/* Interactive Heatmap */}
        <div ref={heatmapRef} className="mb-16">
          <div className="relative mx-auto max-w-4xl bg-elevated rounded-xl p-6 border border-border overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-display font-semibold text-text-primary">
                  Klassi soorituskaart
                </h3>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {TEACHER_STORY.heatmapLabel}
                </span>
              </div>
              <span className="text-text-secondary text-sm font-mono">22 õpilast · 9 oskust</span>
            </div>

            {/* Skill names row */}
            <div className="mb-2 text-xs text-muted-foreground">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${skills}, minmax(0, 1fr))`, minWidth: '500px' }}>
                <span>Liitm.</span>
                <span>Lahut.</span>
                <span>Korr.</span>
                <span>Jag.</span>
                <span>Murrud</span>
                <span>Küm.m.</span>
                <span>Prose.</span>
                <span>Võrr.</span>
                <span>Geom.</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="relative overflow-x-auto">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${skills}, minmax(0, 1fr))`,
                  minWidth: '500px',
                }}
                role="grid"
                aria-label="Klassi soorituskaart: 22 õpilast, 9 oskust"
              >
                {Array.from({ length: students }).map((_, row) =>
                  Array.from({ length: skills }).map((_, col) => {
                    const level = getCellLevel(row, col) + 1;
                    const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;
                    const isFocused = focusedCell?.row === row && focusedCell?.col === col;
                    const isActive = isHovered || isFocused;

                    return (
                      <button
                        key={`${row}-${col}`}
                        type="button"
                        className={`aspect-square rounded-sm transition-transform focus:outline-none heatmap-cell-${level}`}
                        style={{
                          opacity: isActive ? 1 : 0.6,
                          transform: isActive ? 'scale(1.3)' : 'scale(1)',
                        }}
                        onMouseEnter={() => setHoveredCell({ row, col })}
                        onMouseLeave={() => setHoveredCell(null)}
                        onFocus={() => setFocusedCell({ row, col })}
                        onBlur={() => setFocusedCell(null)}
                        aria-label={`Õpilane ${row + 1}, Oskus ${col + 1}: ${heatmapLevelLabels[level - 1]}`}
                        role="gridcell"
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* Legend with text labels */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-xs text-text-secondary">Madal</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div key={level} className={`w-6 h-3 rounded-sm heatmap-cell-${level}`} style={{ opacity: 0.6 }} />
                ))}
              </div>
              <span className="text-xs text-text-secondary">Kõrge</span>
            </div>

            {/* Hover/Focus tooltip */}
            {(hoveredCell || focusedCell) && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${(((hoveredCell?.col ?? focusedCell?.col ?? 0) + 0.5) / skills) * 100}% ${(((hoveredCell?.row ?? focusedCell?.row ?? 0) + 0.5) / students) * 100}%, rgba(30, 90, 138, 0.1), transparent 30%)`,
                }}
              />
            )}
          </div>
        </div>

        {/* Teacher Signals */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-xl font-display font-semibold text-text-primary">
              Õpetaja signaalid
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teacherSignals.map((signal, index) => (
              <div
                key={signal.label}
                ref={(el) => {
                  if (el) signalCardsRef.current[index] = el;
                }}
                className="bg-elevated rounded-xl p-6 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <signal.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CapabilityStatusBadge status={signal.status} />
                </div>
                <div className="text-sm font-medium text-text-primary mb-2">
                  {signal.label}
                </div>
                <p className="text-xs text-text-secondary">
                  {signal.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Intervention Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900">Õpetaja sekkumine</h3>
              <CapabilityStatusBadge status="Saadaval" />
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="text-xs font-medium text-green-800 uppercase tracking-wider mb-1">Soovitus</div>
                <div className="text-sm text-green-900">{PRODUCT_FIXTURE.teacherAction.recommendation}</div>
              </div>

              <div>
                <div className="text-xs font-medium text-green-800 uppercase tracking-wider mb-1">Põhjendus</div>
                <div className="text-sm text-green-700">{PRODUCT_FIXTURE.teacherAction.evidence}</div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap pt-4 border-t border-green-200">
              <div className="text-xs font-medium text-green-800 uppercase tracking-wider">Õpetaja valikud:</div>
              {PRODUCT_FIXTURE.teacherAction.options.map((option) => (
                <button
                  key={option.action}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-green-300 bg-white text-green-800 hover:bg-green-100 transition-colors"
                  type="button"
                  aria-disabled="true"
                  title="Näidisandmed — tegevus ei ole selles vaates aktiivne"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

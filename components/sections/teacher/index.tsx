'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { TEACHER_STORY, SECTION_IDS } from '@/lib/content/landing-copy';
import { PRODUCT_FIXTURE } from '@/lib/content/landing-evidence';
import { CapabilityStatusBadge } from '@/components/ui/capability-status';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { motionTokens, gsapEase, staggers } from '@/lib/motion-tokens';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Skill names matching the heatmap columns
const SKILL_NAMES = [
  'Liitmine', 'Lahutamine', 'Korrutamine', 'Jagamine',
  'Murrud', 'Kümnendmurrud', 'Protsendid', 'Võrrandid', 'Geomeetria',
] as const;

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

/**
 * Renders an interactive teacher-focused section with class performance insights and intervention information.
 */
export function TeacherSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const signalCardsRef = useRef<HTMLDivElement[]>([]);
  const gradientOverlayRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[][]>([]);

  // Roving focus state for the heatmap grid
  const [activeRow, setActiveRow] = useState(0);
  const [activeCol, setActiveCol] = useState(0);
  const pendingFocusRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const students = 22;
  const skills = SKILL_NAMES.length;

  const getCellLevel = (row: number, col: number) => {
    return (row * 13 + col * 7) % 5;
  };

  // Ensure refs matrix is populated before we need it
  const getCellRefs = useCallback(() => {
    if (cellRefs.current.length === 0) {
      cellRefs.current = Array.from({ length: students }, () => []);
    }
    return cellRefs.current;
  }, []);

  const setCellRef = useCallback((row: number, col: number, el: HTMLButtonElement | null) => {
    const refs = getCellRefs();
    refs[row][col] = el;
  }, [getCellRefs]);

  const focusCell = useCallback((row: number, col: number) => {
    const refs = getCellRefs();
    const cell = refs[row]?.[col];
    if (cell) cell.focus();
  }, [getCellRefs]);

  const handleHeatmapKeyDown = useCallback((e: React.KeyboardEvent) => {
    let nextRow = activeRow;
    let nextCol = activeCol;

    switch (e.key) {
      case 'ArrowRight':
        nextCol = Math.min(activeCol + 1, skills - 1);
        break;
      case 'ArrowLeft':
        nextCol = Math.max(activeCol - 1, 0);
        break;
      case 'ArrowDown':
        nextRow = Math.min(activeRow + 1, students - 1);
        break;
      case 'ArrowUp':
        nextRow = Math.max(activeRow - 1, 0);
        break;
      default:
        return;
    }

    e.preventDefault();
    if (nextRow !== activeRow || nextCol !== activeCol) {
      pendingFocusRef.current = true;
      setActiveRow(nextRow);
      setActiveCol(nextCol);
    }
  }, [activeRow, activeCol, students, skills]);

  // Focus the active cell only after keyboard navigation, not on initial mount
  useEffect(() => {
    if (pendingFocusRef.current) {
      pendingFocusRef.current = false;
      focusCell(activeRow, activeCol);
    }
  }, [activeRow, activeCol, focusCell]);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) {
      // Ensure all animated elements are visible when motion is disabled
      const title = sectionRef.current.querySelector('.section-title');
      if (title) gsap.set(title, { opacity: 1, y: 0 });
      signalCardsRef.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 1, y: 0 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      const sectionTitle = sectionRef.current!.querySelector('.section-title');
      if (sectionTitle) {
        gsap.fromTo(
          sectionTitle,
          { y: motionTokens.distance.xl, opacity: 0 },
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
      }

      signalCardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { y: motionTokens.distance.lg, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionTokens.duration.normal,
            delay: index * staggers.card,
            ease: gsapEase(motionTokens.easing.standard),
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Pin the heatmap while signal cards scroll into view underneath
      if (heatmapRef.current) {
        ScrollTrigger.create({
          trigger: heatmapRef.current,
          start: 'top 80%',
          end: '+=800',
          pin: true,
          pinSpacing: true,
          markers: false,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);


  return (
    <section ref={sectionRef} id={SECTION_IDS.teacher} className="relative py-24 md:py-32 lg:py-40 bg-surface overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-transparent pointer-events-none" />

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
          <div className="relative mx-auto max-w-4xl bg-elevated rounded-xl p-3 sm:p-6 border border-border overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-display font-semibold text-text-primary whitespace-nowrap">
                  Klassi soorituskaart
                </h3>
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  {TEACHER_STORY.heatmapLabel}
                </span>
              </div>
              <span className="text-text-secondary text-sm font-mono">{students} õpilast · {skills} oskust</span>
            </div>

            {/* Unified scroll container for headers + grid */}
            <div className="overflow-x-auto">
              <div style={{ minWidth: '620px' }}>
                {/* Skill names row */}
                <div className="mb-2 text-xs text-text-secondary">
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${skills}, minmax(0, 1fr))` }}>
                    {SKILL_NAMES.map((name) => (
                      <span key={name}>{name}</span>
                    ))}
                  </div>
                </div>

                {/* Heatmap Grid */}
                <div
                  className="flex flex-col gap-1"
                  role="grid"
                  aria-label={`Klassi soorituskaart: ${students} õpilast, ${skills} oskust`}
                  onKeyDown={handleHeatmapKeyDown}
                  onMouseMove={(e) => {
                    if (!gradientOverlayRef.current) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    gradientOverlayRef.current.style.setProperty('--heatmap-x', `${x}%`);
                    gradientOverlayRef.current.style.setProperty('--heatmap-y', `${y}%`);
                    gradientOverlayRef.current.style.opacity = '1';
                  }}
                  onMouseLeave={() => {
                    if (gradientOverlayRef.current) {
                      gradientOverlayRef.current.style.opacity = '0';
                    }
                  }}
                >
                  {Array.from({ length: students }).map((_, row) => (
                    <div key={`row-${row}`} role="row" className="grid gap-1" style={{ gridTemplateColumns: `repeat(${skills}, minmax(0, 1fr))` }}>
                      {Array.from({ length: skills }).map((_, col) => {
                        const level = getCellLevel(row, col) + 1;
                        const isActive = row === activeRow && col === activeCol;

                        return (
                          <button
                            key={`${row}-${col}`}
                            ref={(el) => setCellRef(row, col, el)}
                            type="button"
                            tabIndex={isActive ? 0 : -1}
                            onFocus={() => { setActiveRow(row); setActiveCol(col); }}
                            className={`aspect-square rounded-sm transition-[opacity,transform] duration-150 focus:outline-none heatmap-cell-${level} opacity-60 hover:opacity-100 hover:[transform:scale(1.3)] focus-visible:opacity-100 focus-visible:[transform:scale(1.3)]`}
                            aria-label={`Õpilane ${row + 1}, ${SKILL_NAMES[col]}: ${heatmapLevelLabels[level - 1]}`}
                            role="gridcell"
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend with text labels */}
            <div className="flex items-center justify-center gap-4 mt-3 pt-3">
              <span className="text-xs text-text-secondary">Madal</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div key={level} className={`w-6 h-3 rounded-sm heatmap-cell-${level}`} style={{ opacity: 0.6 }} />
                ))}
              </div>
              <span className="text-xs text-text-secondary">Kõrge</span>
            </div>

            {/* Hover gradient overlay — positioned via CSS custom property set on mouse move */}
            <div
              ref={gradientOverlayRef}
              className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-150"
              style={{
                background: 'radial-gradient(circle at var(--heatmap-x, 50%) var(--heatmap-y, 50%), rgba(30, 90, 138, 0.1), transparent 30%)',
              }}
            />
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
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 dark:bg-surface dark:border-success-border">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900 dark:text-success-strong">Õpetaja sekkumine</h3>
              <CapabilityStatusBadge status="Saadaval" />
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="text-xs font-medium text-green-800 uppercase tracking-wider mb-1 dark:text-success-strong">Soovitus</div>
                <div className="text-sm text-green-900 dark:text-success-strong">{PRODUCT_FIXTURE.teacherAction.recommendation}</div>
              </div>

              <div>
                <div className="text-xs font-medium text-green-800 uppercase tracking-wider mb-1 dark:text-success-strong">Põhjendus</div>
                <div className="text-sm text-green-700 dark:text-success-strong">{PRODUCT_FIXTURE.teacherAction.evidence}</div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap pt-4 border-t border-green-200 dark:border-success-border">
              <div className="text-xs font-medium text-green-800 uppercase tracking-wider dark:text-success-strong">Õpetaja valikud:</div>
              {PRODUCT_FIXTURE.teacherAction.options.map((option) => (
                <button
                  key={option.action}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-green-300 bg-white text-green-800 hover:bg-green-100 transition-colors dark:bg-surface dark:border-success-border dark:text-success-strong dark:hover:bg-success-surface"
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

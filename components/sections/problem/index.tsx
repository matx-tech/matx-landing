'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fragment, useEffect, useRef } from 'react';
import { InlineFractionalExpression } from '@/components/ui/fraction';
import { CAVEAT_STYLES } from '@/lib/caveat-styles';
import { EVIDENCE_STAGES, SECTION_IDS } from '@/lib/content/landing-copy';
import { PRODUCT_FIXTURE } from '@/lib/content/landing-evidence';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { gsapEase, motionTokens } from '@/lib/motion-tokens';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const storyBeats = [
  {
    id: 1,
    title: 'Õpilane eksib',
    subtitle: 'Klassiruumis',
    description:
      'Õpilane teeb vea matemaatika ülesandes, kuid ei tea, mis järgmisena harjutada. Vastus on vale, aga põhjus jääb ebaselgeks.',
    visual: 'answer',
    color: 'primary',
  },
  {
    id: 2,
    title: 'Muster kordub',
    subtitle: 'Veamuster',
    description:
      'Sama viga ilmneb erinevates ülesannetes, kuid jääb märkamata. Õpilane harjutab edasi, kuid ei paranda põhiprobleemi.',
    visual: 'pattern',
    color: 'accent',
  },
  {
    id: 3,
    title: 'Õpilane vajab järgmist sammu',
    subtitle: 'Puuduv suund',
    description:
      'Õpilane ei tea, mida järgmisena harjutada. Tagasiside on ebaselge või puudub täielikult.',
    visual: 'confused',
    color: 'accent',
  },
  {
    id: 4,
    title: 'Õpetaja vajab struktuuri',
    subtitle: 'Otsus vajab tuge',
    description:
      'Õpetaja näeb tulemusi, kuid ei tea, milline harjutus aitaks kõige paremini. Individuaalne toetus nõuab aega ja struktuuri.',
    visual: 'teacher',
    color: 'secondary',
  },
] as const;

const BEAT_COLORS = {
  primary: { chip: 'bg-primary/15 text-primary', mono: 'text-primary' },
  accent: { chip: 'bg-accent/15 text-accent', mono: 'text-accent' },
  secondary: { chip: 'bg-secondary/15 text-secondary', mono: 'text-secondary' },
} as const;

type Beat = (typeof storyBeats)[number];
type Stage = (typeof EVIDENCE_STAGES)[number];

/**
 * Pairing of problem beats (4) with evidence-loop stages (4).
 * One-to-one horizontal alignment: each beat maps to one stage.
 */
const comparisonRows = [
  { beat: storyBeats[0], stages: [EVIDENCE_STAGES[0]] },
  { beat: storyBeats[1], stages: [EVIDENCE_STAGES[1]] },
  { beat: storyBeats[2], stages: [EVIDENCE_STAGES[2]] },
  { beat: storyBeats[3], stages: [EVIDENCE_STAGES[3]] },
] as const;

/**
 * Renders a problem-story card with its associated visual evidence.
 *
 * @param beat - The problem-story beat and visual content to display.
 */
function BeatCard({ beat }: { beat: Beat }) {
  return (
    <div className='bg-card rounded-xl border border-border p-6 md:p-8 flex flex-col h-full'>
      <div className='flex items-center gap-4 mb-4'>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${BEAT_COLORS[beat.color].chip}`}
        >
          {beat.id}
        </span>
        <div>
          <div
            className={`text-xs uppercase tracking-widest font-mono font-semibold ${BEAT_COLORS[beat.color].mono}`}
          >
            {beat.subtitle}
          </div>
          <h3 className='text-xl font-display font-bold text-text-primary'>{beat.title}</h3>
        </div>
      </div>

      <p className='text-text-secondary leading-relaxed mb-6 flex-1'>{beat.description}</p>

      {beat.visual === 'answer' && (
        <div className='space-y-4'>
          <div className='p-4 bg-elevated rounded-lg border border-border'>
            <div className='text-sm font-medium mb-2'>
              <InlineFractionalExpression expression={PRODUCT_FIXTURE.task.question} />
            </div>
            <div className='text-sm text-text-secondary'>
              Õpilase vastus:{' '}
              <span className='font-mono text-alert'>
                <InlineFractionalExpression expression={PRODUCT_FIXTURE.answer.submitted} />
              </span>
            </div>
          </div>
          <div className='text-xs text-text-secondary italic'>
            Õpilane ei tea, mida järgmisena harjutada
          </div>
        </div>
      )}

      {beat.visual === 'pattern' && (
        <div className='space-y-4'>
          <div className='space-y-2'>
            {PRODUCT_FIXTURE.patternExamples.map((example) => (
              <div
                key={example.expression}
                className='p-3 bg-elevated rounded border border-border text-xs'
              >
                <span className='text-text-secondary'>
                  <InlineFractionalExpression expression={example.expression} /> ={' '}
                </span>
                <span className='font-mono text-alert'>
                  <InlineFractionalExpression expression={example.wrongAnswer} />
                </span>
              </div>
            ))}
          </div>
          <div className='text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded border border-amber-200 dark:bg-surface dark:text-amber-400 dark:border-amber-400/40'>
            {PRODUCT_FIXTURE.signal.label}: {PRODUCT_FIXTURE.signal.pattern}
          </div>
        </div>
      )}

      {beat.visual === 'confused' && (
        <div className='space-y-4'>
          <div className='p-4 bg-elevated rounded-lg border border-border'>
            <div className='text-sm font-medium mb-2'>Mida nüüd harjutada?</div>
            <div className='text-xs text-text-secondary italic'>
              Tagasiside puudub või on ebaselge
            </div>
          </div>
          <div className='text-xs text-text-secondary italic'>Õpilane jääb järgmise sammuta</div>
        </div>
      )}

      {beat.visual === 'teacher' && (
        <div className='space-y-4'>
          <div className='p-4 bg-elevated rounded-lg border border-border'>
            <div className='text-sm font-medium mb-2'>Mis järgmisena?</div>
            <div className='text-xs text-text-secondary space-y-1'>
              <div>• Kas harjutada protsente lihtsamate arvudega?</div>
              <div>• Kas kinnistada lihtsamat näidet?</div>
              <div>• Kas võrrelda visuaalsete mudeliga?</div>
            </div>
          </div>
          <div className='text-xs text-text-secondary italic'>
            Vajab struktuuri ja aega individuaalseks toetuseks
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Renders an evidence-loop stage card with its descriptive content, visual evidence, and optional caveat.
 *
 * @param stage - The evidence-loop stage to display.
 */
function StageCard({ stage }: { stage: Stage }) {
  return (
    <div className='bg-card rounded-xl border border-border p-6 md:p-8 flex flex-col h-full'>
      <div className='flex items-center gap-4 mb-4'>
        <span className='w-8 h-8 rounded-full bg-secondary/15 text-secondary text-sm font-semibold flex items-center justify-center shrink-0'>
          {stage.number}
        </span>
        <div>
          <div className='text-xs uppercase tracking-widest font-mono font-semibold text-secondary'>
            {stage.eyebrow}
          </div>
          <h3 className='text-xl font-display font-bold text-text-primary'>{stage.title}</h3>
        </div>
      </div>

      <div className='flex-1 flex flex-col'>
        <p className='text-text-secondary leading-relaxed mb-6'>{stage.description}</p>

        {stage.visual === 'answer' && (
          <div className='p-3 bg-elevated rounded-lg border border-border text-sm'>
            <InlineFractionalExpression expression={PRODUCT_FIXTURE.task.question} /> ={' '}
            <span className='font-mono text-secondary'>
              <InlineFractionalExpression expression={PRODUCT_FIXTURE.answer.submitted} />
            </span>
          </div>
        )}

        {stage.visual === 'signal' && (
          <div className='p-3 bg-elevated rounded-lg border border-border text-xs space-y-1'>
            <div className='font-mono text-secondary'>{PRODUCT_FIXTURE.signal.pattern}</div>
            <div className='text-text-secondary'>{PRODUCT_FIXTURE.signal.label}</div>
          </div>
        )}

        {stage.visual === 'retry' && (
          <div className='p-3 bg-elevated rounded-lg border border-border text-sm'>
            <InlineFractionalExpression expression={PRODUCT_FIXTURE.retry.question} />
            <div className='text-xs text-text-secondary mt-1'>
              {PRODUCT_FIXTURE.retry.rationale}
            </div>
          </div>
        )}

        {stage.visual === 'decision' && (
          <div className='p-3 bg-elevated rounded-lg border border-border text-xs space-y-1'>
            <div className='font-medium text-text-primary'>
              {PRODUCT_FIXTURE.teacherAction.recommendation}
            </div>
            <div className='text-text-secondary'>{PRODUCT_FIXTURE.teacherAction.evidence}</div>
          </div>
        )}

        {'caveat' in stage && (
          <div
            className={`mt-3 text-sm px-3 py-2 rounded border ${CAVEAT_STYLES[stage.tone] ?? CAVEAT_STYLES.info}`}
          >
            {stage.caveat}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renders the problem story alongside the MATx evidence loop in four paired rows.
 *
 * @returns The problem and evidence section.
 */
export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;

    if (prefersReducedMotion) {
      gsap.set(gridRef.current, { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current,
        { y: motionTokens.distance.lg, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: motionTokens.duration.slow,
          ease: gsapEase(motionTokens.easing.smooth),
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.problem}
      className='relative bg-surface py-24 md:py-32 lg:py-40 scroll-mt-20'
    >
      <div className='absolute inset-0 bg-gradient-to-b from-canvas via-surface to-transparent opacity-10' />

      <div
        ref={gridRef}
        className='relative z-10 container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl'
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-6 items-stretch'>
          {/* Praegu — the three problem beats, stacked */}
          <div>
            <span className='inline-block text-primary text-sm uppercase tracking-widest mb-2 font-mono'>
              Praegu
            </span>
            <h2 className='text-2xl md:text-3xl font-display font-bold text-text-primary'>
              Neli sammu, kus õpilane jääb toeta
            </h2>
          </div>

          {/* MATx-iga — the evidence loop, same workflow with visible stages */}
          <div>
            <span className='inline-block text-secondary text-sm uppercase tracking-widest mb-2 font-mono'>
              MATx-iga
            </span>
            <h2 className='text-2xl md:text-3xl font-display font-bold text-text-primary'>
              Sama töövoog, neli jälgitavat sammu
            </h2>
          </div>

          {/* Paired rows: each problem beat aligns horizontally with one stage */}
          {comparisonRows.map((row) => (
            <Fragment key={row.beat.id}>
              <BeatCard beat={row.beat} />
              <StageCard stage={row.stages[0]} />
            </Fragment>
          ))}
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent' />
    </section>
  );
}

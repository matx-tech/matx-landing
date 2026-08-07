'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { SectionGate } from '@/components/ui/section-gate';
import { SECTION_IDS } from '@/lib/content/landing-copy';

// Placeholder shown while a gated section's chunk loads — mirrors the
// section's background/padding so SectionGate keeps layout stable and
/**
 * Renders a layout-preserving placeholder or retry interface for a deferred section.
 *
 * @param error - Whether loading failed and the retry interface should be shown.
 * @param retry - Callback invoked to retry loading the section.
 * @param id - Anchor ID applied to the section.
 * @returns The section placeholder or loading-error interface.
 */
function SectionSkeleton({
  error,
  retry,
  id,
  bgClass = 'bg-surface',
  heightClass = 'h-96',
  sectionClass = 'py-24 md:py-32 lg:py-40',
}: {
  /** True when the chunk fetch failed — render the retry UI instead. */
  error?: boolean;
  /** Re-triggers the failed chunk fetch (only set on the error state). */
  retry?: () => void;
  id?: string;
  bgClass?: string;
  heightClass?: string;
  sectionClass?: string;
}) {
  if (error) {
    // Failed chunk fetch: surface a retry instead of an eternal skeleton.
    // Keeping the anchor id here also preserves nav links while retrying.
    return (
      <section id={id} className={`${sectionClass} ${bgClass}`}>
        <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
          <div className={`${heightClass} flex flex-col items-center justify-center gap-4 rounded-2xl bg-border/40`}>
            <p className="text-text-secondary">Sektsiooni laadimine ebaõnnestus.</p>
            <button
              type="button"
              onClick={retry}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-text-inverse transition-colors hover:bg-primary/90 focus-ring-target min-h-[44px]"
            >
              Proovi uuesti
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Decorative loading placeholder — hidden from assistive tech (an empty
  // landmark would be announced) and keeps the section anchor id live.
  return (
    <section id={id} className={`${sectionClass} ${bgClass}`} aria-hidden="true">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
        <div className={`${heightClass} bg-border/40 rounded-2xl animate-pulse motion-reduce:animate-none`} />
      </div>
    </section>
  );
}

interface SectionLoaderProps {
  /** Dynamic import for the section chunk (a webpack-split module). */
  loader: () => Promise<{ default: ComponentType }>;
  skeletonProps: {
    id?: string;
    bgClass?: string;
    heightClass?: string;
    sectionClass?: string;
  };
  /** Called when the user retries after a failed chunk fetch. */
  onRetry: () => void;
}

// next/dynamic's App Router `loading` fallback never receives `error`/`retry`
// (lazy-dynamic/loadable.js renders it with `{ isLoading, pastDelay, error:
// null }`), so a failed chunk would show an eternal skeleton with no way to
// retry. Instead, fetch the chunk ourselves in an effect and track the
/**
 * Loads and renders a deferred section with loading and retry states.
 *
 * @param loader - Loads the section component.
 * @param skeletonProps - Props used to render the section placeholder.
 * @param onRetry - Restarts loading after a failure.
 * @returns The loaded section, a loading placeholder, or a retry interface.
 */
function SectionLoader({ loader, skeletonProps, onRetry }: SectionLoaderProps) {
  const [Section, setSection] = useState<ComponentType | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loader()
      .then((mod) => {
        if (!cancelled) setSection(() => mod.default);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [loader]);

  if (hasError) {
    return <SectionSkeleton {...skeletonProps} error retry={onRetry} />;
  }

  if (!Section) {
    return <SectionSkeleton {...skeletonProps} />;
  }

  return <Section />;
}

/**
 * Creates a section component that loads its content dynamically and supports retrying failed loads.
 *
 * @param loader - Loads the section component.
 * @param skeletonProps - Configures the loading and error placeholders.
 * @returns A section component that renders the loaded content or an appropriate placeholder.
 */
function createLazySection(
  loader: () => Promise<{ default: ComponentType }>,
  skeletonProps: SectionLoaderProps['skeletonProps']
): ComponentType {
  // `key` remounts the loader on retry so it fetches the chunk again from a
  // clean loading/error state.
  function LazySection() {
    const [attempt, setAttempt] = useState(0);
    return (
      <SectionLoader
        key={attempt}
        loader={loader}
        skeletonProps={skeletonProps}
        onRetry={() => setAttempt((n) => n + 1)}
      />
    );
  }
  return LazySection;
}

// Below-fold sections: lazy-loaded so their chunks (and GSAP setup) load on
// demand when the user scrolls near them, not in the initial bundle. This
// whole tree lives in one client island so the page itself stays a Server
// Component with only the hero rendered statically.
const EvidenceLoopSection = createLazySection(
  () =>
    import('@/components/sections/evidence-loop').then((mod) => ({
      default: mod.EvidenceLoopSection,
    })),
  { id: SECTION_IDS.workflow, bgClass: 'bg-canvas' }
);

const StudentSection = createLazySection(
  () =>
    import('@/components/sections/student').then((mod) => ({
      default: mod.StudentSection,
    })),
  { id: SECTION_IDS.student }
);

const ProblemSection = createLazySection(
  () =>
    import('@/components/sections/problem').then((mod) => ({
      default: mod.ProblemSection,
    })),
  { id: SECTION_IDS.problem, bgClass: 'bg-surface', heightClass: 'h-[80vh]' }
);

const TeacherSection = createLazySection(
  () =>
    import('@/components/sections/teacher').then((mod) => ({
      default: mod.TeacherSection,
    })),
  { id: SECTION_IDS.teacher, heightClass: 'h-[90vh]' }
);

const ContextSection = createLazySection(
  () =>
    import('@/components/sections/context').then((mod) => ({
      default: mod.ContextSection,
    })),
  { id: SECTION_IDS.context }
);

const TopicsSection = createLazySection(
  () =>
    import('@/components/sections/topics').then((mod) => ({
      default: mod.TopicsSection,
    })),
  { id: SECTION_IDS.capabilities }
);

const AdoptionSection = createLazySection(
  () =>
    import('@/components/sections/adoption').then((mod) => ({
      default: mod.AdoptionSection,
    })),
  { id: SECTION_IDS.pilot, bgClass: 'bg-canvas' }
);

const TrustSection = createLazySection(
  () =>
    import('@/components/sections/trust').then((mod) => ({
      default: mod.TrustSection,
    })),
  { id: SECTION_IDS.trust, bgClass: 'bg-canvas' }
);

const FAQSection = createLazySection(
  () =>
    import('@/components/sections/faq').then((mod) => ({
      default: mod.FAQSection,
    })),
  { id: SECTION_IDS.faq, heightClass: 'h-64' }
);

const CTASection = createLazySection(
  () =>
    import('@/components/sections/cta').then((mod) => ({
      default: mod.CTASection,
    })),
  { heightClass: 'h-[70vh]' }
);

const FooterSection = createLazySection(
  () =>
    import('@/components/sections/footer').then((mod) => ({
      default: mod.FooterSection,
    })),
  { bgClass: 'bg-canvas', sectionClass: 'py-16', heightClass: 'h-64' }
);

/**
 * Renders the below-the-fold landing-page sections in narrative order.
 *
 * @returns The grouped deferred landing-page section elements.
 */
export function DeferredSections() {
  return (
    <>
      {/* Narrative order: hero → evidence loop → student → problem → teacher → context → topics → adoption → trust → faq → cta */}
      <SectionGate id={SECTION_IDS.workflow} placeholderClassName="min-h-[36rem] md:min-h-[40rem] lg:min-h-[44rem]">
        <EvidenceLoopSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.student} placeholderClassName="min-h-[36rem] md:min-h-[40rem] lg:min-h-[44rem]">
        <StudentSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.problem} placeholderClassName="min-h-[calc(80vh+12rem)] md:min-h-[calc(80vh+16rem)] lg:min-h-[calc(80vh+20rem)]">
        <ProblemSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.teacher} placeholderClassName="min-h-[calc(90vh+12rem)] md:min-h-[calc(90vh+16rem)] lg:min-h-[calc(90vh+20rem)]">
        <TeacherSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.context} placeholderClassName="min-h-[36rem] md:min-h-[40rem] lg:min-h-[44rem]">
        <ContextSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.capabilities} placeholderClassName="min-h-[36rem] md:min-h-[40rem] lg:min-h-[44rem]">
        <TopicsSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.pilot} placeholderClassName="min-h-[36rem] md:min-h-[40rem] lg:min-h-[44rem]">
        <AdoptionSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.trust} placeholderClassName="min-h-[36rem] md:min-h-[40rem] lg:min-h-[44rem]">
        <TrustSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.faq} placeholderClassName="min-h-[28rem] md:min-h-[32rem] lg:min-h-[36rem]">
        <FAQSection />
      </SectionGate>
      <SectionGate placeholderClassName="min-h-[calc(70vh+12rem)] md:min-h-[calc(70vh+16rem)] lg:min-h-[calc(70vh+20rem)]">
        <CTASection />
      </SectionGate>
    </>
  );
}

// Rendered outside <main> so the <footer> landmark keeps its contentinfo role
/**
 * Renders the deferred footer section outside the main content landmark.
 *
 * @returns The gated footer section
 */
export function DeferredFooter() {
  return (
    <SectionGate placeholderClassName="min-h-[24rem]">
      <FooterSection />
    </SectionGate>
  );
}

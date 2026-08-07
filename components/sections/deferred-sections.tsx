'use client';

import dynamic, { type DynamicOptionsLoadingProps } from 'next/dynamic';
import { SectionGate } from '@/components/ui/section-gate';
import { SECTION_IDS } from '@/lib/content/landing-copy';

// Placeholder shown while a gated section's chunk loads — mirrors the
// section's background/padding so SectionGate keeps layout stable and
// the reveal doesn't shift CLS.
function SectionSkeleton({
  error,
  retry,
  id,
  bgClass = 'bg-surface',
  heightClass = 'h-96',
  sectionClass = 'py-24 md:py-32 lg:py-40',
}: DynamicOptionsLoadingProps & {
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

// Below-fold sections: dynamic + SectionGate so their chunks (and GSAP setup)
// load on demand when the user scrolls near them, not in the initial bundle.
// This whole tree lives in one client island so the page itself stays a
// Server Component with only the hero rendered statically.
const EvidenceLoopSection = dynamic(
  () => import('@/components/sections/evidence-loop').then((mod) => mod.EvidenceLoopSection),
  {
    loading: (loadingProps) => <SectionSkeleton {...loadingProps} id={SECTION_IDS.workflow} bgClass="bg-canvas" />,
  }
);

const StudentSection = dynamic(
  () => import('@/components/sections/student').then((mod) => mod.StudentSection),
  {
    loading: (loadingProps) => <SectionSkeleton {...loadingProps} id={SECTION_IDS.student} />,
  }
);

const ProblemSection = dynamic(
  () => import('@/components/sections/problem').then((mod) => mod.ProblemSection),
  {
    loading: (loadingProps) => <SectionSkeleton {...loadingProps} id={SECTION_IDS.problem} bgClass="bg-surface" heightClass="h-[80vh]" />,
  }
);

const TeacherSection = dynamic(
  () => import('@/components/sections/teacher').then((mod) => mod.TeacherSection),
  {
    loading: (loadingProps) => <SectionSkeleton {...loadingProps} id={SECTION_IDS.teacher} heightClass="h-[90vh]" />,
  }
);

const ContextSection = dynamic(
  () => import('@/components/sections/context').then((mod) => mod.ContextSection),
  {
    loading: (loadingProps) => <SectionSkeleton {...loadingProps} id={SECTION_IDS.context} />,
  }
);

const TopicsSection = dynamic(
  () => import('@/components/sections/topics').then((mod) => mod.TopicsSection),
  {
    loading: (loadingProps) => <SectionSkeleton {...loadingProps} id={SECTION_IDS.capabilities} />,
  }
);

const AdoptionSection = dynamic(
  () => import('@/components/sections/adoption').then((mod) => mod.AdoptionSection),
  {
    loading: (loadingProps) => <SectionSkeleton {...loadingProps} id={SECTION_IDS.pilot} bgClass="bg-canvas" />,
  }
);

const TrustSection = dynamic(
  () => import('@/components/sections/trust').then((mod) => mod.TrustSection),
  {
    loading: (loadingProps) => <SectionSkeleton {...loadingProps} id={SECTION_IDS.trust} bgClass="bg-canvas" />,
  }
);

const FAQSection = dynamic(
  () => import('@/components/sections/faq').then((mod) => mod.FAQSection),
  {
    loading: (loadingProps) => <SectionSkeleton {...loadingProps} id={SECTION_IDS.faq} heightClass="h-64" />,
  }
);

const CTASection = dynamic(
  () => import('@/components/sections/cta').then((mod) => mod.CTASection),
  {
    loading: (loadingProps) => <SectionSkeleton {...loadingProps} heightClass="h-[70vh]" />,
  }
);

const FooterSection = dynamic(
  () => import('@/components/sections/footer').then((mod) => mod.FooterSection),
  {
    loading: (loadingProps) => <SectionSkeleton {...loadingProps} bgClass="bg-canvas" sectionClass="py-16" heightClass="h-64" />,
  }
);

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
// instead of being nested inside the main landmark.
export function DeferredFooter() {
  return (
    <SectionGate placeholderClassName="min-h-[24rem]">
      <FooterSection />
    </SectionGate>
  );
}

'use client';

import dynamic from 'next/dynamic';
import { SectionGate } from '@/components/ui/section-gate';
import { SECTION_IDS } from '@/lib/content/landing-copy';

// Placeholder shown while a gated section's chunk loads — mirrors the
// section's background/padding so SectionGate keeps layout stable and
// the reveal doesn't shift CLS.
function SectionSkeleton({
  bgClass = 'bg-surface',
  heightClass = 'h-96',
  sectionClass = 'py-24 md:py-32 lg:py-40',
}: {
  bgClass?: string;
  heightClass?: string;
  sectionClass?: string;
}) {
  return (
    <section className={`${sectionClass} ${bgClass}`}>
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
    loading: () => <SectionSkeleton bgClass="bg-canvas" />,
  }
);

const StudentSection = dynamic(
  () => import('@/components/sections/student').then((mod) => mod.StudentSection),
  {
    loading: () => <SectionSkeleton />,
  }
);

const ProblemSection = dynamic(
  () => import('@/components/sections/problem').then((mod) => mod.ProblemSection),
  {
    loading: () => <SectionSkeleton bgClass="bg-surface" heightClass="h-[80vh]" />,
  }
);

const TeacherSection = dynamic(
  () => import('@/components/sections/teacher').then((mod) => mod.TeacherSection),
  {
    loading: () => <SectionSkeleton heightClass="h-[90vh]" />,
  }
);

const ContextSection = dynamic(
  () => import('@/components/sections/context').then((mod) => mod.ContextSection),
  {
    loading: () => <SectionSkeleton />,
  }
);

const TopicsSection = dynamic(
  () => import('@/components/sections/topics').then((mod) => mod.TopicsSection),
  {
    loading: () => <SectionSkeleton />,
  }
);

const AdoptionSection = dynamic(
  () => import('@/components/sections/adoption').then((mod) => mod.AdoptionSection),
  {
    loading: () => <SectionSkeleton bgClass="bg-canvas" />,
  }
);

const TrustSection = dynamic(
  () => import('@/components/sections/trust').then((mod) => mod.TrustSection),
  {
    loading: () => <SectionSkeleton bgClass="bg-canvas" />,
  }
);

const FAQSection = dynamic(
  () => import('@/components/sections/faq').then((mod) => mod.FAQSection),
  {
    loading: () => <SectionSkeleton heightClass="h-64" />,
  }
);

const CTASection = dynamic(
  () => import('@/components/sections/cta').then((mod) => mod.CTASection),
  {
    loading: () => <SectionSkeleton heightClass="h-[70vh]" />,
  }
);

const FooterSection = dynamic(
  () => import('@/components/sections/footer').then((mod) => mod.FooterSection),
  {
    loading: () => <SectionSkeleton bgClass="bg-canvas" sectionClass="py-16" heightClass="h-64" />,
  }
);

export function DeferredSections() {
  return (
    <>
      {/* Narrative order: hero → evidence loop → student → problem → teacher → context → topics → adoption → trust → faq → cta */}
      <SectionGate id={SECTION_IDS.workflow}>
        <EvidenceLoopSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.student}>
        <StudentSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.problem}>
        <ProblemSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.teacher}>
        <TeacherSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.context}>
        <ContextSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.capabilities}>
        <TopicsSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.pilot}>
        <AdoptionSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.trust}>
        <TrustSection />
      </SectionGate>
      <SectionGate id={SECTION_IDS.faq}>
        <FAQSection />
      </SectionGate>
      <SectionGate>
        <CTASection />
      </SectionGate>
    </>
  );
}

// Rendered outside <main> so the <footer> landmark keeps its contentinfo role
// instead of being nested inside the main landmark.
export function DeferredFooter() {
  return (
    <SectionGate>
      <FooterSection />
    </SectionGate>
  );
}

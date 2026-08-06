import dynamic from 'next/dynamic';
import { Navigation } from '@/components/ui/navigation';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { SectionGate } from '@/components/ui/section-gate';
import { HeroSection } from '@/components/sections/hero';
import { RegistrationProvider } from '@/components/providers/registration-provider';
import { SECTION_IDS } from '@/lib/content/landing-copy';

// Below-fold sections: dynamic + SectionGate so their chunks (and GSAP setup)
// load on demand when the user scrolls near them, not in the initial bundle.
const EvidenceLoopSection = dynamic(
  () => import('@/components/sections/evidence-loop').then((mod) => mod.EvidenceLoopSection)
);

const StudentSection = dynamic(
  () => import('@/components/sections/student').then((mod) => mod.StudentSection)
);

const ProblemSection = dynamic(
  () => import('@/components/sections/problem').then((mod) => mod.ProblemSection)
);

const TeacherSection = dynamic(
  () => import('@/components/sections/teacher').then((mod) => mod.TeacherSection)
);

const ContextSection = dynamic(
  () => import('@/components/sections/context').then((mod) => mod.ContextSection)
);

const TopicsSection = dynamic(
  () => import('@/components/sections/topics').then((mod) => mod.TopicsSection),
  {
    loading: () => (
      <section className="py-24 md:py-32 lg:py-40 bg-surface">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
          <div className="h-96 bg-card/30 rounded-2xl animate-pulse" />
        </div>
      </section>
    ),
  }
);

const AdoptionSection = dynamic(
  () => import('@/components/sections/adoption').then((mod) => mod.AdoptionSection)
);

const TrustSection = dynamic(
  () => import('@/components/sections/trust').then((mod) => mod.TrustSection)
);

const FAQSection = dynamic(
  () => import('@/components/sections/faq').then((mod) => mod.FAQSection)
);

const CTASection = dynamic(
  () => import('@/components/sections/cta').then((mod) => mod.CTASection)
);

const FooterSection = dynamic(
  () => import('@/components/sections/footer').then((mod) => mod.FooterSection)
);

export default function Home() {
  return (
    <RegistrationProvider>
      <ScrollProgress />
      <Navigation />
      <main id="main" className="relative pt-16">
        {/* Narrative order: hero → evidence loop → student → problem → teacher → context → topics → adoption → trust → faq → cta */}
        <HeroSection />
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
        <SectionGate>
          <FooterSection />
        </SectionGate>
      </main>
    </RegistrationProvider>
  );
}

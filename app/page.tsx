'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Navigation } from '@/components/ui/navigation';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { HeroSection } from '@/components/sections/hero';
import { ProblemSection } from '@/components/sections/problem';
import { TrustSection } from '@/components/sections/trust';
import { FAQSection } from '@/components/sections/faq';
import { CTASection } from '@/components/sections/cta';
import { FooterSection } from '@/components/sections/footer';

const EvidenceLoopSection = dynamic(
  () => import('@/components/sections/evidence-loop').then((mod) => mod.EvidenceLoopSection)
);

const StudentSection = dynamic(
  () => import('@/components/sections/student').then((mod) => mod.StudentSection)
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

// Modal — only its JS ships when the user actually opens the form.
const RegistrationForm = dynamic(
  () => import('@/components/ui/registration-form').then((mod) => mod.RegistrationForm),
  {
    ssr: false,
  }
);

export default function Home() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const handleOpenRegistration = () => {
    setIsRegistrationOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false);
  };

  return (
    <>
      <ScrollProgress />
      <Navigation />
      <main id="main" className="relative pt-16">
        {/* New narrative order: hero → evidence loop → student → problem → teacher → context → topics → adoption → trust → faq → cta */}
        <HeroSection onOpenRegistration={handleOpenRegistration} />
        <EvidenceLoopSection />
        <StudentSection />
        <ProblemSection />
        <TeacherSection />
        <ContextSection />
        <TopicsSection />
        <AdoptionSection onOpenRegistration={handleOpenRegistration} />
        <TrustSection />
        <FAQSection />
        <CTASection onOpenRegistration={handleOpenRegistration} />
      </main>
      <FooterSection />
      {isRegistrationOpen && (
        <RegistrationForm isOpen onClose={handleCloseRegistration} />
      )}
    </>
  );
}

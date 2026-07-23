'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Navigation } from '@/components/ui/navigation';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { HeroSection } from '@/components/sections/hero';
import { EvidenceLoopSection } from '@/components/sections/evidence-loop';
import { StudentSection } from '@/components/sections/student';
import { ProblemSection } from '@/components/sections/problem';
import { TeacherSection } from '@/components/sections/teacher';
import { ContextSection } from '@/components/sections/context';
import { AdoptionSection } from '@/components/sections/adoption';
import { TrustSection } from '@/components/sections/trust';
import { CTASection } from '@/components/sections/cta';
import { FAQSection } from '@/components/sections/faq';
import { FooterSection } from '@/components/sections/footer';
import { RegistrationForm } from '@/components/ui/registration-form';

const TopicsSection = dynamic(
  () => import('@/components/sections/topics').then((mod) => mod.TopicsSection),
  {
    ssr: false,
    loading: () => (
      <section className="py-24 md:py-32 lg:py-40 bg-surface">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
          <div className="h-96 bg-card/30 rounded-2xl animate-pulse" />
        </div>
      </section>
    ),
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
      <Navigation onOpenRegistration={handleOpenRegistration} />
      <main id="main" className="relative">
        {/* New narrative order: hero → evidence loop → student → teacher → context → topics → adoption → trust → faq → cta */}
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
      <RegistrationForm isOpen={isRegistrationOpen} onClose={handleCloseRegistration} />
    </>
  );
}

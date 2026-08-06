'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
    // First open fetches the chunk on a slow connection; show a lightweight
    // overlay so the CTA click never looks dead.
    loading: () => (
      <div
        role="status"
        className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/95"
      >
        <div
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
        />
        <span className="sr-only">Laadime registreerimisvormi…</span>
      </div>
    ),
  }
);

export default function Home() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  // Keep the dialog mounted briefly after close so Radix Presence can play
  // the exit fade before the lazy chunk unmounts.
  const [isRegistrationClosing, setIsRegistrationClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenRegistration = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsRegistrationClosing(false);
    setIsRegistrationOpen(true);
  }, []);

  const handleCloseRegistration = useCallback(() => {
    setIsRegistrationClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsRegistrationOpen(false);
      setIsRegistrationClosing(false);
      closeTimerRef.current = null;
    }, 200); // slightly longer than the overlay's 150ms fade-out
  }, []);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    []
  );

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
        <RegistrationForm isOpen={!isRegistrationClosing} onClose={handleCloseRegistration} />
      )}
    </>
  );
}

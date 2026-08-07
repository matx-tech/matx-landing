import { Navigation } from '@/components/ui/navigation';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { HeroSection } from '@/components/sections/hero';
import { DeferredSections, DeferredFooter } from '@/components/sections/deferred-sections';
import { RegistrationProvider } from '@/components/providers/registration-provider';

export default function Home() {
  return (
    <RegistrationProvider>
      <ScrollProgress />
      <Navigation />
      <main id="main" className="relative pt-16">
        <HeroSection />
        <DeferredSections />
      </main>
      <DeferredFooter />
    </RegistrationProvider>
  );
}

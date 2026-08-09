import { RegistrationProvider } from '@/components/providers/registration-provider';
import { DeferredFooter, DeferredSections } from '@/components/sections/deferred-sections';
import { HeroSection } from '@/components/sections/hero';
import { Navigation } from '@/components/ui/navigation';
import { ScrollProgress } from '@/components/ui/scroll-progress';

/**
 * Renders the home page with registration context, navigation, primary content, and deferred sections.
 */
export default function Home() {
  return (
    <RegistrationProvider>
      <ScrollProgress />
      <Navigation />
      <main id='main' className='relative pt-16'>
        <HeroSection />
        <DeferredSections />
      </main>
      <DeferredFooter />
    </RegistrationProvider>
  );
}

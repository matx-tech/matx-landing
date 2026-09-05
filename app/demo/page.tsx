import type { Metadata } from 'next';
import { DemoSection } from '@/components/sections/demo';
import { Navigation } from '@/components/ui/navigation';

export const metadata: Metadata = {
  title: 'Näidistund — MATx',
  description:
    'Skriptitud näidistund, mitte päris AI: kakskümmend minutit Steniga, 7. klassi õpilasega. Vali, mida ta vastab, ja näe, mida MATx sellises kohas teeb.',
  openGraph: {
    title: 'Näidistund — MATx',
    description:
      'Skriptitud näidistund, mis illustreerib MATx-i tõendusloogi ilma registreerimiseta.',
    url: 'https://matx.ee/demo',
  },
  alternates: {
    canonical: 'https://matx.ee/demo',
  },
};

/**
 * Renders the standalone /demo page: navigation plus the scripted sample lesson.
 */
export default function DemoPage() {
  return (
    <>
      <Navigation />
      <main id='main' className='relative pt-16'>
        <DemoSection />
      </main>
    </>
  );
}

'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Root 404 page. The 404 event fires through the shared queue: this effect
 * runs before the layout's AnalyticsProvider init, so track() buffers the
 * event until the tracker is ready (docs: error-pages-tracking-404).
 */
export default function NotFound() {
  useEffect(() => {
    track(EVENTS.notFound);
  }, []);

  return (
    <main className='flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center'>
      <p className='font-mono text-sm text-text-secondary'>404</p>
      <h1 className='font-display text-3xl font-bold text-text-primary md:text-4xl'>
        Lehte ei leitud
      </h1>
      <p className='max-w-md text-text-secondary'>
        See aadress ei eksisteeri või on teisaldatud. Otsitava lehe leiate esilehelt.
      </p>
      <Link
        href='/'
        className='mt-2 rounded-lg bg-primary px-6 py-3 font-semibold text-text-inverse transition-colors hover:bg-primary/90 focus-ring-target min-h-[44px]'
      >
        Tagasi esilehele
      </Link>
    </main>
  );
}

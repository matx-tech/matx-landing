import { headers } from 'next/headers';
import Link from 'next/link';

/**
 * Root 404 page — renders inside the root layout (fonts, theme, CSP nonce).
 * The inline script fires Plausible's '404' event per the docs' 404 tracking
 * snippet (error-pages-tracking-404.md); the guard makes it a no-op while
 * analytics is unconfigured. Requires the matching '404' goal in the
 * Plausible dashboard (Goals → Custom event → "404").
 */
export default async function NotFound() {
  const nonce = (await headers()).get('x-nonce') ?? '';

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
      <script
        nonce={nonce}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Plausible 404 tracking, official docs snippet
        dangerouslySetInnerHTML={{
          __html: `document.addEventListener('DOMContentLoaded', function () { if (window.plausible) window.plausible('404'); });`,
        }}
      />
    </main>
  );
}

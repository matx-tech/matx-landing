import './globals.css';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter, Public_Sans } from 'next/font/google';
import { headers } from 'next/headers';
import { LenisProvider } from '@/components/providers/lenis-provider';
import { SITE_META } from '@/lib/content/landing-copy';

// Plausible tracker URL (docs' personalized /js/pa-XXXXX.js) — set to enable
// analytics; while unset neither the script tag nor the next.config rewrites
// are emitted.
const plausibleScriptUrl = process.env.PLAUSIBLE_SCRIPT_URL;

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
  // Only weights actually used: every font-display element is font-bold or font-semibold.
  weight: ['600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-next',
  // optional + preload:false — body text paints in the system fallback
  // immediately; if Inter misses the optional window it is never swapped in,
  // eliminating the late font-swap flash/CLS on slow devices. The hero display
  // font (Public Sans) is preloaded separately and keeps `swap`.
  display: 'optional',
  preload: false,
  weight: ['400', '500', '600'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  // All 10 font-mono usages are default-weight.
  weight: ['400'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_META.url),
  title: SITE_META.title,
  description: SITE_META.shortDescription,
  keywords: [
    'matemaatika',
    'Eesti',
    'kool',
    'õppimine',
    'harjutamine',
    'adaptiivne',
    'põhikool',
    'õpetaja',
  ],
  authors: [{ name: 'MATx' }, { name: 'Andri Suga' }, { name: 'Tom Kristian Abel' }],
  openGraph: {
    title: SITE_META.title,
    description: SITE_META.shortDescription,
    url: SITE_META.url,
    siteName: 'MATx',
    type: 'website',
    locale: SITE_META.locale,
  },
  twitter: {
    card: 'summary',
    title: SITE_META.title,
    description: SITE_META.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_META.url,
    languages: {
      'et-EE': SITE_META.url,
    },
  },
};

/**
 * Defines the root document structure and wraps page content with the site's scrolling provider.
 *
 * @returns The root HTML document containing page content and MATx metadata.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? '';

  return (
    <html
      lang='et'
      // The inline theme script below sets data-theme on <html> before React
      // hydrates; suppress the resulting attribute mismatch (the script's
      // value is authoritative — React must not patch or warn on it).
      suppressHydrationWarning
      className={`${publicSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        {/* Structural data for search engines */}
        <script
          nonce={nonce}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: inline theme bootstrap, must run before React hydrates
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('matx-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <script
          type='application/ld+json'
          nonce={nonce}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data, static schema.org content
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'MATx',
              description: SITE_META.longDescription,
              url: SITE_META.url,
              foundingDate: '2026',
              founders: [
                { '@type': 'Person', name: 'Andri Suga' },
                { '@type': 'Person', name: 'Tom Kristian Abel' },
              ],
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'EE',
                addressLocality: 'Estonia',
              },
              sameAs: [
                'https://twitter.com/matx_ee',
                'https://linkedin.com/company/matx-ee',
                'https://github.com/matx-ee',
              ],
              award: 'FELLIN HÄKK 2026',
            }),
          }}
        />
        {/* Plausible analytics — first-party proxy (rewrites in next.config.js).
            Rendered only when PLAUSIBLE_SCRIPT_URL is set. The init call stays
            inline so events queue before the async script arrives; the nonce
            satisfies the CSP. Official snippet per plausible.io/docs. */}
        {plausibleScriptUrl && (
          <>
            <script async src='/js/script.js' />
            <script
              nonce={nonce}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Plausible tracker bootstrap, official docs snippet
              dangerouslySetInnerHTML={{
                __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init(${JSON.stringify(
                  {
                    endpoint: '/api/event',
                    outboundLinks: true,
                    formSubmissions: true,
                    ...(process.env.NODE_ENV === 'development' ? { captureOnLocalhost: true } : {}),
                  },
                )});`,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.className} antialiased`}>
        <a href='#main' className='skip-link'>
          Jäta navigatsioon vahele
        </a>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

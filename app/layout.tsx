import './globals.css';
import type { Metadata } from 'next';
import { Public_Sans, Inter, IBM_Plex_Mono } from 'next/font/google';
import { LenisProvider } from '@/components/providers/lenis-provider';
import { SITE_META } from '@/lib/content/landing-copy';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et" className={`${publicSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        {/* Structural data for search engines */}
        <script
          type="application/ld+json"
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
      </head>
      <body className={`${inter.className} antialiased`}>
        <a href="#main" className="skip-link">
          Jäta navigatsioon vahele
        </a>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

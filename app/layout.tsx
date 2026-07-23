import './globals.css';
import type { Metadata } from 'next';
import { Public_Sans, Inter, IBM_Plex_Mono } from 'next/font/google';
import { LenisProvider } from '@/components/providers/lenis-provider';
import 'katex/dist/katex.min.css';

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://matx.ee'),
  title: 'MATx — Õpilase harjutamine ja õpetaja otsus ühes töövoos',
  description:
    'MATx seob õpilase vastused, jälgitavad signaalid ja õpetaja tegevussoovituse üheks läbipaistvaks töövooks. Piloot Eesti põhikoolides.',
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
    title: 'MATx — Õpilase harjutamine ja õpetaja otsus ühes töövoos',
    description: 'Seob õpilase vastused, jälgitavad signaalid ja õpetaja tegevussoovituse üheks läbipaistvaks töövooks.',
    url: 'https://matx.ee',
    siteName: 'MATx',
    type: 'website',
    locale: 'et_EE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MATx — Õpilase harjutamine ja õpetaja otsus ühes töövoos',
    description: 'Seob õpilase vastused, jälgitavad signaalid ja õpetaja tegevussoovituse üheks läbipaistvaks töövooks.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://matx.ee',
    languages: {
      'et-EE': 'https://matx.ee',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et" className={`${publicSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'MATx',
              description: 'Seob õpilase harjutamise, arusaadava tagasiside ja õpetaja tegevussoovituse üheks jälgitavaks töövooks',
              url: 'https://matx.ee',
              logo: 'https://matx.ee/logo.png',
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

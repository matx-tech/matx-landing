import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_META } from '@/lib/content/landing-copy';

// Legal documents. Content is intentionally minimal and honest: these pages
// exist so every legal link on the site resolves to a real route. The full
// documents are being finalized by the MATx team — replace the body copy as
// they land, keep the routes stable.
const LEGAL_DOCS = {
  privaatsus: {
    title: 'Privaatsuspoliitika',
    description: 'Kuidas MATx käsitleb isikuandmeid.',
    updated: 'Dokument koostamisel — oodatav valmimine: piloodi alguseks (august 2026).',
    sections: [
      {
        heading: 'Mida me kogume',
        body: 'Piloodi registreerimisel kooli nimi, kontaktisiku nimi, roll, e-post, telefoninumber ja klassirühmade arv. Õpilase andmeid registreerimisleht ei kogu.',
      },
      {
        heading: 'Milleks me andmeid kasutame',
        body: 'Ainult piloodi registreerimise menetlemiseks ja kooliga ühenduse võtmiseks. Andmeid ei müüda ega edastata kolmandatele isikutele.',
      },
      {
        heading: 'Kontakt',
        body: 'Küsimuste korral: andri@matx.ee.',
      },
    ],
  },
  tingimused: {
    title: 'Teenuse tingimused',
    description: 'MATx-i kasutustingimused.',
    updated: 'Dokument koostamisel — oodatav valmimine: piloodi alguseks (august 2026).',
    sections: [
      {
        heading: 'Pilootprogramm',
        body: 'MATx on piloodifaasis. Osalemine on tasuta ja kohustusteta; sobivuse hindame vestluse käigus.',
      },
      {
        heading: 'Vastutus',
        body: 'Süsteemi soovitused toetavad õpetaja otsust, mitte ei asenda seda. Õpetaja kontroll säilib.',
      },
      {
        heading: 'Kontakt',
        body: 'Küsimuste korral: andri@matx.ee.',
      },
    ],
  },
  gdpr: {
    title: 'GDPR',
    description: 'Isikuandmete kaitse üldmääruse (GDPR) põhimõtted MATx-is.',
    updated: 'Dokument koostamisel — oodatav valmimine: piloodi alguseks (august 2026).',
    sections: [
      {
        heading: 'Õiguslik alus',
        body: 'Registreerimisandmeid töödeldakse nõusoleku alusel; nõusoleku saab igal ajal tagasi võtta, kirjutades andri@matx.ee.',
      },
      {
        heading: 'Õigused',
        body: 'Kontaktisikul on õigus oma andmetele ligi pääseda, neid parandada, kustutada ja töötlemist piirata.',
      },
      {
        heading: 'Kontakt',
        body: 'Andmekaitse küsimused: andri@matx.ee.',
      },
    ],
  },
} as const;

type LegalSlug = keyof typeof LEGAL_DOCS;

/**
 * Generates the supported legal-document route parameters for static rendering.
 *
 * @returns An array of route parameter objects containing each legal-document slug.
 */
export function generateStaticParams() {
  return Object.keys(LEGAL_DOCS).map((legal) => ({ legal }));
}

export const dynamicParams = false;

/**
 * Builds metadata for a legal document page.
 *
 * @param params - Route parameters containing the legal document slug
 * @returns Metadata derived from the selected legal document
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ legal: string }>;
}): Promise<Metadata> {
  const { legal } = await params;
  const doc = LEGAL_DOCS[legal as LegalSlug];
  // dynamicParams=false 404s unknown slugs at routing, so doc is defined.
  return {
    title: `${doc.title} — MATx`,
    description: doc.description,
    openGraph: {
      title: `${doc.title} — MATx`,
      description: doc.description,
      url: `${SITE_META.url}/${legal}`,
      siteName: SITE_META.title,
      locale: SITE_META.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${doc.title} — MATx`,
      description: doc.description,
    },
  };
}

/**
 * Renders the selected legal document with its metadata, sections, and a link to the homepage.
 *
 * @param params - The route parameters containing the legal document slug.
 */
export default async function LegalPage({ params }: { params: Promise<{ legal: string }> }) {
  const { legal } = await params;
  const doc = LEGAL_DOCS[legal as LegalSlug];

  return (
    <main id='main' className='pt-16 min-h-screen'>
      <div className='container mx-auto px-4 md:px-8 lg:px-16 py-16 max-w-3xl'>
        <p className='text-xs font-medium text-text-secondary uppercase tracking-wider mb-3'>
          MATx · Õiguslik teave
        </p>
        <h1 className='text-3xl md:text-4xl font-display font-bold text-text-primary mb-2'>
          {doc.title}
        </h1>
        <p className='text-text-secondary mb-6'>{doc.updated}</p>

        <div className='space-y-6'>
          {doc.sections.map((section) => (
            <section
              key={section.heading}
              className='p-6 bg-surface rounded-xl border border-border'
            >
              <h2 className='text-lg font-display font-semibold text-text-primary mb-2'>
                {section.heading}
              </h2>
              <p className='text-text-secondary text-sm leading-relaxed'>{section.body}</p>
            </section>
          ))}
        </div>

        <Link
          href='/'
          className='inline-block mt-10 text-primary hover:text-secondary transition-colors text-sm focus-ring-target rounded-md underline'
        >
          ← Tagasi avalehele
        </Link>
      </div>
    </main>
  );
}

/**
 * Landing page content contract
 * Single source of truth for all public-facing copy
 */

// Capability maturity status — single source of truth for the status
// vocabulary used across the landing page and the technical overview.
export const CAPABILITY_STATUSES = ['Saadaval', 'Piloodis', 'Kavandatud'] as const;
export type CapabilityStatus = (typeof CAPABILITY_STATUSES)[number];

// Prohibited phrases that must not appear in public copy
export const PROHIBITED_PHRASES = [
  'täielik kooskõla',
  'A+ usaldusskoor',
  '99.9% uptime',
  'garanteeritud',
  '2.3× kiirem',
  'säästa 10 tundi',
  'EU AI Act — täielik kooskõla',
  'NIS2 vastavus',
  'Iga neljas ebaõnnestub',
  '1.9× nõudlus-pakkumise lõhe',
  'Olemasolevad ei tööta',
] as const;

// Shared UI labels
export const SCROLL_INDICATOR_LABEL = 'Keri alla' as const;

// Registration dialog chunk-fallback overlay
export const REGISTRATION_COPY = {
  error: 'Registreerimisvormi laadimine ebaõnnestus.',
  retry: 'Proovi uuesti',
  close: 'Sulge',
  loading: 'Laadime registreerimisvormi…',
  cancel: 'Tühista',
} as const;

// Shared URLs
export const CALENDLY_URL = 'https://calendly.com/matx-ee/15min' as const;

// Technical overview page — single source for its URL and navigation label
export const TECH_OVERVIEW = { href: '/tehniline', label: 'Tehniline ülevaade' } as const;

// Site metadata — single source for OG/Twitter/JSON-LD
export const SITE_META = {
  title: 'MATx — Õpilase harjutamine ja õpetaja otsus ühes töövoos',
  shortDescription:
    'Seob õpilase vastused, jälgitavad signaalid ja õpetaja tegevussoovituse üheks läbipaistvaks töövooks.',
  longDescription:
    'Seob õpilase harjutamise, arusaadava tagasiside ja õpetaja tegevussoovituse üheks jälgitavaks töövooks',
  url: 'https://matx.ee',
  locale: 'et_EE' as const,
} as const;

// Locked narrative strings
export const HERO_COPY = {
  headline: 'Iga vastus aitab leida järgmise sammu.',
  support:
    'matx.ee seob õpilase harjutamise, arusaadava tagasiside ja õpetaja tegevussoovituse üheks jälgitavaks töövooks.',
  primaryCTA: 'Liitu kooli piloodiga',
  secondaryCTA: 'Vaata töövoogu',
  trustLine: 'Soovitused toetavad õpetaja otsust. Õpetaja kontroll säilib.',
} as const;

// Evidence loop stages
export const EVIDENCE_STAGES = [
  {
    number: 1,
    title: 'Õpilane vastab',
    description:
      'Õpilane lahendab ülesande digitaalselt või paberil. Vastus registreeritakse süsteemis.',
    eyebrow: 'Registreeritud',
    visual: 'answer' as const,
  },
  {
    number: 2,
    title: 'Vastust tõlgendatakse',
    description: 'Süsteem tuvastab võimaliku veamustri õpilase vastuses.',
    caveat: 'Signaal on võimalik veamuster, mitte lõplik diagnoos',
    tone: 'info' as const,
    eyebrow: 'Kontrollitav signaal',
    visual: 'signal' as const,
  },
  {
    number: 3,
    title: 'Harjutus sihitakse',
    description: 'Õpilasele pakutakse järgmine harjutus, mis aitab veamustrit täpsustada.',
    eyebrow: 'Järgmine samm',
    visual: 'retry' as const,
  },
  {
    number: 4,
    title: 'Õpetaja otsustab',
    description: 'Õpetaja vaatab soovituse üle koos tõendusmaterjaliga.',
    caveat: 'Õpetaja võib soovituse vastu võtta, muuta või eirata',
    tone: 'success' as const,
    eyebrow: 'Õpetaja otsus',
    visual: 'decision' as const,
  },
] as const;

// Problem section beats
export const PROBLEM_BEATS = [
  {
    title: 'Õpilane eksib',
    description: 'Õpilane teeb vea, kuid ei tea, mis järgmisena harjutada.',
  },
  {
    title: 'Muster kordub',
    description: 'Sama viga ilmneb erinevates ülesannetes, kuid jääb märkamata.',
  },
  {
    title: 'Õpetaja vajab järgmist sammu',
    description: 'Õpetaja näeb tulemusi, kuid ei tea, milline harjutus aitaks kõige paremini.',
  },
] as const;

// Student story
export const STUDENT_STORY = {
  heading: 'Õpilane näeb, mida järgmisena harjutada.',
  description:
    'Õpilane saab selge tagasiside ja konkreetse järgmise sammu. Üks õige kordus ei tähenda veel valdamist — süsteem jätkab jälgimist.',
  steps: [
    {
      title: 'Õpilane lahendab ülesande',
      description: 'Digitaalselt või paberil, oma tempos',
      badge: '1',
      badgeClass: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Saab arusaadava tagasiside',
      description: 'Selge selgitus, mitte ainult „vale\u201c märge',
      badge: '2',
      badgeClass: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Proovib sihitud harjutust',
      description: 'Järgmine samm on selge ja asjakohane',
      badge: '3',
      badgeClass: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Jätkab harjutamist',
      description: 'Üks õige kordus ei tähenda veel valdamist',
      badge: '\u2713',
      badgeClass: 'bg-green-100 text-green-700',
    },
  ],
} as const;

// Teacher story
export const TEACHER_STORY = {
  heading: 'Õpetaja vaatab soovituse üle ja otsustab',
  description:
    'Õpetaja näeb õpilaste töid, tuvastatud veamustreid ja süsteemi soovitusi. Õpetaja võib soovituse vastu võtta, muuta või eirata.',
  heatmapLabel: 'Näidisandmed',
} as const;

// Capability/Topics section
export const TOPICS_SECTION = {
  heading: 'Mida saab MATx-is harjutada?',
  description:
    'Praegune õppesisu katab valitud põhikooli matemaatika oskusi. Uued teemad lisatakse piloodi käigus.',
} as const;

// National context cards
export const NATIONAL_CONTEXT = [
  {
    title: 'Eesti õpilaste matemaatikaoskus',
    description: 'PISA 2022 tulemused näitavad võrdluses varasemate aastatega langust.',
    source: 'PISA 2022',
    limitation: 'Ainult kontekst. MATx ei ole põhjus ega tagajärg.',
    icon: 'trending-down' as const,
  },
  {
    title: 'Õpetajate ajakoormus',
    description:
      'Õpetajad raporteerivad suurt halduskoormust ja piiratud aega individuaalseks toetuseks.',
    source: 'Haridus- ja Teadusministeerium, 2023',
    limitation: 'Ainult kontekst. MATx ei ole põhjus ega tagajärg.',
    icon: 'clock' as const,
  },
  {
    title: 'Ebavõrdne juurdepääs toele',
    description:
      'Kõik koolid ei oma võrdset juurdepääsu täiendavatele õppematerjalidele ja tööriistadele.',
    source: 'Eesti Hariduse Infosüsteem, 2024',
    limitation: 'Ainult kontekst. MATx ei ole põhjus ega tagajärg.',
    icon: 'minus' as const,
  },
] as const;

// Trust pillars
export const TRUST_PILLARS = [
  {
    title: 'Õpetaja kontroll säilib',
    description: 'Soovitused toetavad otsust, ei asenda seda. Õpetaja võib alati sekkuda.',
    icon: 'shield' as const,
  },
  {
    title: 'Läbipaistev andmevoog',
    description: 'Õpetaja näeb, millistel andmetel soovitus põhineb ja kuidas see genereeriti.',
    icon: 'eye' as const,
  },
  {
    title: 'Väidete, staatuse ja allika nähtavus',
    description:
      'Iga väide on märgistatud staatusega (Saadaval, Piloodis, Kavandatud) ja allikaga.',
    icon: 'file-text' as const,
  },
] as const;

// Audience ID type
export type AudienceId = 'teacher' | 'principal' | 'procurement' | 'it';

// Adoption routes
export const ADOPTION_ROUTES = [
  {
    audience: 'Õpetajale',
    audienceId: 'teacher' as const,
    title: 'Liitu õpetajana',
    description: 'Proovi MATx-i oma klassis ja anna tagasisidet.',
    cta: 'Registreeru piloodile',
    ctaAction: 'registration',
    ctaRoute: null as string | null,
  },
  {
    audience: 'Koolijuhile',
    audienceId: 'principal' as const,
    title: 'Liitu koolina',
    description: 'Hinda, kuidas MATx sobib teie kooli õppekavasse ja toetussüsteemi.',
    cta: 'Broneeri demokõne',
    ctaAction: 'calendly',
    ctaRoute: null as string | null,
  },
  {
    audience: 'Hankele',
    audienceId: 'procurement' as const,
    title: 'Hankeinfo',
    // Enne avalikustamist kontrolli piirmäärad ja tingimused hankepartneriga —
    // RHS muudatused jõustuvad 01.11.2026.
    description: 'Riigihangete seaduse piirmäärad ja hinnakiri ühel lehel.',
    cta: 'Vaata hankeinfot',
    ctaAction: 'procurement',
    ctaRoute: TECH_OVERVIEW.href,
  },
  {
    audience: 'IT-le',
    audienceId: 'it' as const,
    title: 'Tehniline ülevaade',
    description:
      'Arhitektuur, turvameetmed ja vastavusstaatus ühel lehel: identiteet ja sessioonid, pseudonüümimine, integratsioonid ja hankeinfo.',
    cta: 'Vaata ülevaadet',
    ctaAction: 'technical',
    ctaRoute: TECH_OVERVIEW.href,
  },
] as const;

// FAQ entry shape — answerLink is optional; only rendered when present
export interface FAQEntry {
  question: string;
  answer: string;
  answerLink?: { href: string; label: string };
}

// FAQ entries
export const FAQ_ENTRIES: readonly FAQEntry[] = [
  {
    question: 'Kellele MATx on mõeldud?',
    answer:
      'MATx on loodud põhikooli matemaatikaõpetajatele ja õpilastele. Praegu oleme piloodifaasis valitud koolidega.',
  },
  {
    question: 'Kuidas õpetaja soovitusi üle vaatab?',
    answer:
      'Õpetaja näeb iga soovituse juures õpilase vastust, tuvastatud veamustrit ja põhjendust. Õpetaja võib soovituse vastu võtta, muuta või eirata.',
  },
  {
    question: 'Milliseid oskusi saab praegu harjutada?',
    answer:
      'Praegu katame valitud põhikooli matemaatika oskusi: liitmine, lahutamine, korrutamine, jagamine ja murdude põhitehted. Uued teemad lisatakse piloodi käigus.',
  },
  {
    question: 'Mis on Saadaval, Piloodis ja Kavandatud?',
    answer:
      'Saadaval tähendab, et funktsioon on kasutamiseks valmis. Piloodis tähendab, et funktsioon on kasutusel valitud koolidega testimiseks. Kavandatud tähendab, et funktsioon on plaanis, kuid pole veel arendatud.',
  },
  {
    question: 'Kuidas andmeid kasutatakse?',
    answer:
      'Õpilase vastused ja veamustrid jäävad õpetajale nähtavaks. Andmeid kasutatakse soovituste genereerimiseks. Pilootfaasis saad täpse andmekaitse info piloodilepingust.',
  },
  {
    question: 'Kuidas piloodiga liituda?',
    answer: 'Registreeru piloodile või broneeri demokõne. Hindame sobivust ja võtame ühendust.',
  },
  {
    question: 'Kas MATx asendab õpetajat?',
    answer:
      'Ei. MATx toetab õpetaja otsust, andes struktuuri õpilase töö jälgimisele ja järgmise sammu soovitamisele. Õpetaja kontroll säilib.',
  },
] as const;

// Final CTA
export const FINAL_CTA = {
  heading: 'Alusta piloodiga',
  description: 'Registreeru või broneeri demokõne, et hinnata MATx-i sobivust oma kooli jaoks.',
  primaryCTA: 'Liitu kooli piloodiga',
  secondaryCTA: 'Broneeri demokõne',
} as const;

// Navigation labels
export const NAV_LABELS = {
  forTeachers: 'Õpetajale',
  forPrincipals: 'Koolijuhile',
  forProcurement: 'Hankele',
  forIT: 'IT-le',
  pilot: 'Piloot',
  faq: 'KKK',
} as const;

// Section IDs for navigation
export const SECTION_IDS = {
  hero: 'hero',
  problem: 'probleem',
  workflow: 'töövoog',
  student: 'õpilasele',
  teacher: 'õpetajale',
  context: 'kontekst',
  capabilities: 'võimekused',
  pilot: 'piloot',
  trust: 'usaldus',
  faq: 'kkk',
} as const;

export const LANDING_NAV_ITEMS = [
  { label: 'Kuidas töötab', href: `#${SECTION_IDS.workflow}` },
  { label: 'Õpilasele', href: `#${SECTION_IDS.student}` },
  { label: 'Õpetajale', href: `#${SECTION_IDS.teacher}` },
  { label: 'Teemad', href: `#${SECTION_IDS.capabilities}` },
  { label: 'Usaldus', href: `#${SECTION_IDS.trust}` },
  { label: 'KKK', href: `#${SECTION_IDS.faq}` },
] as const;

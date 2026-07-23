/**
 * Landing page content contract
 * Single source of truth for all public-facing copy
 */

// Capability maturity status
export type CapabilityStatus = 'Saadaval' | 'Piloodis' | 'Kavandatud';

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

// Locked narrative strings
export const HERO_COPY = {
  headline: 'Iga vastus aitab leida järgmise sammu.',
  support: 'matx.ee seob õpilase harjutamise, arusaadava tagasiside ja õpetaja tegevussoovituse üheks jälgitavaks töövooks.',
  primaryCTA: 'Liitu kooli piloodiga',
  secondaryCTA: 'Vaata töövoogu',
  trustLine: 'Soovitused toetavad õpetaja otsust. Õpetaja kontroll säilib.',
} as const;

// Evidence loop stages
export const EVIDENCE_STAGES = [
  {
    number: 1,
    title: 'Õpilane vastab',
    description: 'Õpilane lahendab ülesande digitaalselt või paberil. Vastus registreeritakse süsteemis.',
  },
  {
    number: 2,
    title: 'Vastust tõlgendatakse',
    description: 'Süsteem tuvastab võimaliku veamustri. Signaal on kontrollitav, mitte lõplik diagnoos.',
  },
  {
    number: 3,
    title: 'Harjutus sihitakse',
    description: 'Õpilasele pakutakse järgmine harjutus, mis aitab veamustrit täpsustada.',
  },
  {
    number: 4,
    title: 'Õpetaja otsustab',
    description: 'Õpetaja vaatab soovituse üle ja võib selle vastu võtta, muuta või eirata.',
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
  description: 'Õpilane saab selge tagasiside ja konkreetse järgmise sammu. Üks õige kordus ei tähenda veel valdamist — süsteem jätkab jälgimist.',
} as const;

// Teacher story
export const TEACHER_STORY = {
  heading: 'Õpetaja vaatab soovituse üle ja otsustab',
  description: 'Õpetaja näeb õpilaste töid, tuvastatud veamustreid ja süsteemi soovitusi. Õpetaja võib soovituse vastu võtta, muuta või eirata.',
  heatmapLabel: 'Näidisandmed',
} as const;

// Capability/Topics section
export const TOPICS_SECTION = {
  heading: 'Mida saab MATx-is harjutada?',
  description: 'Praegune õppesisu katab valitud põhikooli matemaatika oskusi. Uued teemad lisatakse piloodi käigus.',
} as const;

// National context cards
export const NATIONAL_CONTEXT = [
  {
    title: 'Eesti õpilaste matemaatikaoskus',
    description: 'PISA 2022 tulemused näitavad võrdluses varasemate aastatega langust.',
    source: 'PISA 2022',
    limitation: 'Ainult kontekst. MATx ei ole põhjus ega tagajärg.',
  },
  {
    title: 'Õpetajate ajakoormus',
    description: 'Õpetajad raporteerivad suurt halduskoormust ja piiratud aega individuaalseks toetuseks.',
    source: 'Haridus- ja Teadusministeerium, 2023',
    limitation: 'Ainult kontekst. MATx ei ole põhjus ega tagajärg.',
  },
  {
    title: 'Ebavõrdne juurdepääs toele',
    description: 'Kõik koolid ei oma võrdset juurdepääsu täiendavatele õppematerjalidele ja tööriistadele.',
    source: 'Eesti Hariduse Infosüsteem, 2024',
    limitation: 'Ainult kontekst. MATx ei ole põhjus ega tagajärg.',
  },
] as const;

// Trust pillars
export const TRUST_PILLARS = [
  {
    title: 'Õpetaja kontroll säilib',
    description: 'Soovitused toetavad otsust, ei asenda seda. Õpetaja võib alati sekkuda.',
  },
  {
    title: 'Läbipaistev andmevoog',
    description: 'Õpetaja näeb, millistel andmetel soovitus põhineb ja kuidas see genereeriti.',
  },
  {
    title: 'Väidete, staatuse ja allika nähtavus',
    description: 'Iga väide on märgistatud staatusega (Saadaval, Piloodis, Kavandatud) ja allikaga.',
  },
] as const;

// Adoption routes
export const ADOPTION_ROUTES = [
  {
    audience: 'Õpetajale',
    title: 'Liitu õpetajana',
    description: 'Proovi MATx-i oma klassis ja anna tagasisidet.',
    cta: 'Registreeru piloodile',
    ctaAction: 'registration',
  },
  {
    audience: 'Koolijuhile',
    title: 'Liitu koolina',
    description: 'Hinda, kuidas MATx sobib teie kooli õppekavasse ja toetussüsteemi.',
    cta: 'Broneeri demokõne',
    ctaAction: 'calendly',
  },
  {
    audience: 'Hankele',
    title: 'Hankeinfo',
    description: 'Vaata hinnakirja, lepingutingimusi ja tehnilisi nõudeid.',
    cta: 'Vaata hankeinfot',
    ctaAction: 'procurement',
  },
  {
    audience: 'IT-le',
    title: 'Tehniline ülevaade',
    description: 'Tutvu arhitektuuri, turvalisuse ja integratsioonivõimalustega.',
    cta: 'Vaata tehnilist dokumentatsiooni',
    ctaAction: 'technical',
  },
] as const;

// FAQ entries
export const FAQ_ENTRIES = [
  {
    question: 'Kellele MATx on mõeldud?',
    answer: 'MATx on loodud põhikooli matemaatikaõpetajatele ja õpilastele. Praegu oleme piloodifaasis valitud koolidega.',
  },
  {
    question: 'Kuidas õpetaja soovitusi üle vaatab?',
    answer: 'Õpetaja näeb iga soovituse juures õpilase vastust, tuvastatud veamustrit ja põhjendust. Õpetaja võib soovituse vastu võtta, muuta või eirata.',
  },
  {
    question: 'Milliseid oskusi saab praegu harjutada?',
    answer: 'Praegu katame valitud põhikooli matemaatika oskusi: liitmine, lahutamine, korrutamine, jagamine ja murdude põhitehted. Uued teemad lisatakse piloodi käigus.',
  },
  {
    question: 'Mis on Saadaval, Piloodis ja Kavandatud?',
    answer: 'Saadaval tähendab, et funktsioon on kasutamiseks valmis. Piloodis tähendab, et funktsioon on kasutusel valitud koolidega testimiseks. Kavandatud tähendab, et funktsioon on plaanis, kuid pole veel arendatud.',
  },
  {
    question: 'Kuidas andmeid kasutatakse?',
    answer: 'Õpilase vastused ja veamustrid jäävad õpetajale nähtavaks. Andmeid kasutatakse soovituste genereerimiseks. Täpne andmekaitse poliitika on siin [link].',
  },
  {
    question: 'Kuidas piloodiga liituda?',
    answer: 'Registreeru piloodile või broneeri demokõne. Hindame sobivust ja võtame ühendust.',
  },
  {
    question: 'Kas MATx asendab õpetajat?',
    answer: 'Ei. MATx toetab õpetaja otsust, andes struktuuri õpilase töö jälgimisele ja järgmise sammu soovitamisele. Õpetaja kontroll säilib.',
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
  workflow: 'töövoog',
  student: 'õpilasele',
  teacher: 'õpetajale',
  context: 'kontekst',
  capabilities: 'võimekused',
  pilot: 'piloot',
  faq: 'kkk',
} as const;

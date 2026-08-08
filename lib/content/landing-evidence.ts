/**
 * Landing page evidence and synthetic fixtures
 * Product proof data with "Näidisandmed" label
 */

import type { CapabilityStatus } from './landing-copy';

// Synthetic product fixture - used consistently across all sections
export const PRODUCT_FIXTURE = {
  label: 'Näidisandmed',

  // Student answer
  task: {
    question: '3/4 + 1/2 = ?',
    skill: 'Murdude liitmine erineva nimetajaga',
  },

  // Student response
  answer: {
    submitted: '4/6',
    isCorrect: false,
  },

  // Feedback shown to the student
  feedback: {
    text: 'Oled proovinud liita lugejaid ja nimetajaid eraldi. Murdude liitmisel tuleb esmalt leida ühine nimetaja.',
  },

  // Signal detection
  signal: {
    pattern: 'Liidab lugejad ja nimetajad eraldi',
    patternCode: 'FRAC_ADD_SEPARATE',
    label: 'Võimalik veamuster',
    confidence: 'Kontrollitav signaal',
  },

  // Targeted retry
  retry: {
    question: '1/3 + 1/6 = ?',
    rationale: 'Lihtsam ülesanne sama mustri kontrollimiseks',
    hint: 'Proovi sama meetodit lihtsamal ülesandel',
    expectedPattern: 'Kas õpilane liidab jälle lugejad ja nimetajad eraldi?',
  },

  // Teacher action
  teacherAction: {
    recommendation: 'Harjuta murdarvu liitmist sammu-sammult',
    evidence: 'Õpilane on kahe viimase ülesande puhul liitnud lugejad ja nimetajad eraldi',
    options: [
      { label: 'Võta vastu', action: 'accept' },
      { label: 'Muuda', action: 'modify' },
      { label: 'Ignoreeri', action: 'ignore' },
    ],
  },

  // Recurring error-pattern examples for the problem-section pattern visual
  patternExamples: [
    { expression: '3/4 + 1/2', wrongAnswer: '4/6' },
    { expression: '1/3 + 1/6', wrongAnswer: '2/9' },
    { expression: '2/5 + 1/10', wrongAnswer: '3/15' },
  ],
} as const;

// Capability records with status, source, and boundaries
export interface CapabilityRecord {
  name: string;
  status: CapabilityStatus;
  description: string;
  sourceNote: string; // Internal metadata
  boundaryNote: string; // Public limitation
}

export const CAPABILITIES: CapabilityRecord[] = [
  {
    name: 'Digitaalsed harjutused',
    status: 'Saadaval',
    description: 'Õpilane saab lahendada harjutusi brauseris',
    sourceNote: 'Production feature, verified in pilot schools',
    boundaryNote: 'Valitud matemaatika oskuste piires',
  },
  {
    name: 'Paberitöö skaneerimine',
    status: 'Piloodis',
    description: 'Õpetaja saab üles laadida õpilase paberitööd',
    sourceNote: 'Testing with pilot schools',
    boundaryNote: 'Käekirja tuvastamine on piiratud täpsusega',
  },
  {
    name: 'Veamustri tuvastamine',
    status: 'Saadaval',
    description: 'Süsteem tuvastab võimalikud veamustrid vastustes',
    sourceNote: 'Production feature, rule-based detection',
    boundaryNote: 'Kontrollitav signaal, mitte lõplik diagnoos',
  },
  {
    name: 'Sihitud harjutuse soovitamine',
    status: 'Saadaval',
    description: 'Süsteem soovitab järgmise harjutuse veamustri põhjal',
    sourceNote: 'Production feature, skill-graph based',
    boundaryNote: 'Õpetaja vaatab soovituse üle',
  },
  {
    name: 'Õpetaja ülevaade',
    status: 'Saadaval',
    description: 'Õpetaja näeb õpilaste töid ja soovitusi ühes vaates',
    sourceNote: 'Production feature',
    boundaryNote: 'Piloodikohtades',
  },
  {
    name: 'Reaalajas jälgimine',
    status: 'Kavandatud',
    description: 'Õpetaja näeb õpilaste edusamme reaalajas tunni ajal',
    sourceNote: 'Planned feature',
    boundaryNote: 'Ei ole veel arendatud',
  },
  {
    name: 'Vanemale teadete genereerimine',
    status: 'Kavandatud',
    description: 'Süsteem aitab koostada kokkuvõtteid vanematele',
    sourceNote: 'Planned feature',
    boundaryNote: 'Ei ole veel arendatud',
  },
];

// Topic/skill areas with maturity status. Declared as a literal (as const)
// so TopicId is a derived union: the icon Record keyed by id in the topics
// section stays exhaustive at compile time, and a copy edit can never shuffle
// a topic's icon or key.
export const TOPIC_AREAS = [
  {
    id: 'addition-subtraction',
    name: 'Liitmine ja lahutamine',
    status: 'Saadaval',
    skillCount: 24,
    grade: '1.-6. klass',
  },
  {
    id: 'multiplication-division',
    name: 'Korrutamine ja jagamine',
    status: 'Saadaval',
    skillCount: 18,
    grade: '2.-6. klass',
  },
  {
    id: 'fractions',
    name: 'Murdarvud',
    status: 'Saadaval',
    skillCount: 16,
    grade: '4.-6. klass',
  },
  {
    id: 'decimals',
    name: 'Kümnendmurrud',
    status: 'Piloodis',
    skillCount: 12,
    grade: '5.-6. klass',
  },
  {
    id: 'percentages',
    name: 'Protsendid',
    status: 'Kavandatud',
    skillCount: 8,
    grade: '6.-9. klass',
  },
  {
    id: 'equations',
    name: 'Võrrandid',
    status: 'Kavandatud',
    skillCount: 14,
    grade: '7.-9. klass',
  },
] as const;

export type TopicId = (typeof TOPIC_AREAS)[number]['id'];

export interface TopicRecord {
  /** Stable id — React key and TOPIC_ICONS lookup, stable across copy changes. */
  id: TopicId;
  name: string;
  status: CapabilityStatus;
  skillCount: number;
  grade: string;
}

// Error pattern taxonomy (public wording)
export const ERROR_PATTERNS = {
  label: 'Kontrollitav veamuster',
  description: 'Süsteem tuvastab võimalikke veamustreid, mitte lõplikke diagnoose',
  note: 'Täpne mustrite arv on piloodi käigus täpsustamisel',
} as const;

// Signal confidence levels (public language)
export const SIGNAL_CONFIDENCE = {
  high: 'Tugev signaal',
  medium: 'Keskmine signaal',
  low: 'Nõrk signaal',
  label: 'Kontrollitav signaal',
} as const;

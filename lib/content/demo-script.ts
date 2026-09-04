/**
 * Näidistund demo script — content contract
 *
 * Single source of truth for the scripted sample lesson. Transcribed verbatim
 * (2026-09-04) from the frozen prototype `docs/research/naidistund/naidistund.html`.
 * Data and types only: the replay engine lives in `lib/demo-engine.ts` (story 1.2),
 * the contract tests in `tests/unit/demo-script.test.ts` (story 1.3).
 *
 * Erasable TypeScript — no enum/namespace/decorators — so it imports directly
 * under `node --experimental-strip-types` with no build step.
 */

// ---- flags -------------------------------------------------------------
// Six closed two-value domains. Every flag is optional: a resolvable field
// called mid-lesson (before that flag is set) takes its default branch.
export type DemoGoal = 'paanika' | 'tööleht';
export type DemoEq = 'käsklus' | 'ok';
export type DemoNeg = 'ei-saa' | 'ok';
export type DemoSulud = 'vale' | 'ok';
export type DemoHintAsked = 'jah' | 'ei';
export type DemoMetaphor = 'termomeeter' | 'väravad';

export type DemoFlags = {
  goal?: DemoGoal;
  eq?: DemoEq;
  neg?: DemoNeg;
  sulud?: DemoSulud;
  hintAsked?: DemoHintAsked;
  metaphor?: DemoMetaphor;
};

/** The closed domain of every flag — story 1.3 walks all 64 combinations. */
export const DEMO_FLAG_DOMAINS = {
  goal: ['paanika', 'tööleht'],
  eq: ['käsklus', 'ok'],
  neg: ['ei-saa', 'ok'],
  sulud: ['vale', 'ok'],
  hintAsked: ['jah', 'ei'],
  metaphor: ['termomeeter', 'väravad'],
} as const;

// ---- node graph --------------------------------------------------------
export type Resolvable<T> = T | ((flags: DemoFlags) => T);

export type DemoChoice = {
  label: string;
  next?: string;
  set?: DemoFlags;
  /** Terminal choice: opens the teacher view instead of advancing the graph. */
  teacher?: boolean;
};

export type DemoCard =
  | { kind: 'task'; kicker: string; eq: string }
  /** `line` marks the student's error with [brackets]; the renderer strikes it. */
  | { kind: 'solution'; kicker: string; line: string; caption: string };

export type DemoNode = {
  tutor: Resolvable<string>;
  card?: DemoCard;
  log?: Resolvable<string>;
  choices?: Resolvable<DemoChoice[]>;
  /** Auto-advance target when the node has no choices. */
  next?: Resolvable<string>;
};

const TASK = 'Ülesanne · Võrrandid';

export const DEMO_SCRIPT: Record<string, DemoNode> = {
  s0: {
    tutor: 'Tere, Sten. Sul on täna 20 minutit. Mille peale sa tahad, et me need kulutame?',
    choices: [
      { label: 'Ma ei tea. Ema tahab, et hinded paremaks läheks.', next: 's0-ema' },
      {
        label: 'Et ma ei tunneks ennast tunnis lollina, kui õps küsib.',
        next: 's1-intro',
        set: { goal: 'paanika' },
      },
      { label: 'Võrrandid. Ma ei saa üldse pihta.', next: 's1-intro', set: { goal: 'tööleht' } },
    ],
  },
  's0-ema': {
    tutor:
      'See on ema soov, mina küsisin sinu oma. Kui pead valima: kas tahad, et tööleht saaks tehtud, või et tunnis ei tuleks paanikat, kui õpetaja küsib?',
    choices: [
      { label: 'Et ei tuleks paanikat.', next: 's1-intro', set: { goal: 'paanika' } },
      { label: 'Tööleht.', next: 's1-intro', set: { goal: 'tööleht' } },
    ],
  },
  's1-intro': {
    tutor:
      'Kirjutan selle üles, see on meie mõõdupuu — mitte hinne. Enne töölehte kolm kiiret küsimust, hindeid pole.',
    next: 's1-q1',
  },
  's1-q1': {
    tutor: 'Kas niimoodi tohib kirjutada: 8 = 5 + 3?',
    choices: [
      { label: 'Ei, vastus peaks lõpus olema.', next: 's1-q2', set: { eq: 'käsklus' } },
      { label: 'Vist ei tohi?', next: 's1-q2', set: { eq: 'käsklus' } },
      { label: 'Tohib, mõlemal pool on kaheksa.', next: 's1-q2', set: { eq: 'ok' } },
    ],
  },
  's1-q2': {
    tutor: 'Aitäh, järgmine. Mis on 3 − 7?',
    choices: [
      {
        label: 'Seda ei saa, väiksemast ei saa suuremat lahutada.',
        next: 's1-q3',
        set: { neg: 'ei-saa' },
      },
      { label: '−4', next: 's1-q3', set: { neg: 'ok' } },
      { label: '4', next: 's1-q3', set: { neg: 'ei-saa' } },
    ],
  },
  's1-q3': {
    tutor: 'Aitäh, järgmine. Ava sulud: 2(x − 4).',
    choices: [
      { label: '2x − 4', next: 's2', set: { sulud: 'vale' } },
      { label: '2x − 8', next: 's2', set: { sulud: 'ok' } },
      { label: 'Ma ei tea.', next: 's2', set: { sulud: 'vale' } },
    ],
  },
  s2: {
    // The four branches are built by lower-casing the first character of the
    // shared `eqHole` sentence — transcribed as-is from the prototype.
    tutor: (f) => {
      const eqHole =
        'Sa arvad, et võrdusmärk on käsklus „arvuta“. Tegelikult on ta väide: vasakul ja paremal on ühepalju.';
      if (f.eq === 'käsklus' && f.sulud === 'vale')
        return `Sinu mõtlemisel ei ole midagi viga. Vundamendis on kaks auku — ja auk on koht, mitte omadus. Kohta saab täita. Esimene: ${eqHole.charAt(0).toLowerCase()}${eqHole.slice(1)}`;
      if (f.eq === 'käsklus')
        return `Sinu mõtlemisel ei ole midagi viga. Vundamendis on üks auk — ja auk on koht, mitte omadus. Kohta saab täita. ${eqHole}`;
      if (f.sulud === 'vale')
        return 'Sinu mõtlemisel ei ole midagi viga. Võrdusmärk on sul paigas. Üks koht vajab täitmist — sulgude avamine. Selle juurde jõuame töölehel, mitte praegu.';
      return 'Kõik kolm paigas — ja kindlalt. Siis kohe töölehe juurde.';
    },
    next: (f) => (f.eq === 'käsklus' ? 's3' : 's4'),
  },
  s3: {
    tutor:
      'Unustame korraks võrrandi. Kaal: vasakus kausis kolm ühesugust pakki ja 5-grammine raskus, paremas 20 grammi. Tasakaalus. Võtan vasakult viie ära — mida pead paremal tegema?',
    choices: [
      { label: 'Ka viis ära võtma.', next: 's3-miks' },
      { label: 'Ma ei tea.', next: 's3-samm' },
    ],
  },
  's3-miks': {
    tutor: 'Miks just viis?',
    choices: [
      { label: 'Sest sa võtsid vasakult viis.', next: 's3-reegel' },
      { label: 'Sest muidu ei ole enam tasakaalus.', next: 's3-reegel' },
    ],
  },
  's3-samm': {
    tutor: 'Väiksem samm. Kui vasak kauss läheb kergemaks, kummale poole kaal kaldub?',
    choices: [
      { label: 'Paremale.', next: 's3-tasakaal' },
      { label: 'Raskem pool vajub alla… paremale.', next: 's3-tasakaal' },
    ],
  },
  's3-tasakaal': {
    tutor: 'Ja et tasakaal tagasi tuleks?',
    choices: [
      { label: 'Võtan paremalt ka ära.', next: 's3-reegel' },
      { label: 'Võtan paremalt sama palju — viis.', next: 's3-reegel' },
    ],
  },
  's3-reegel': {
    tutor: 'See lause ongi võrrandite kõige tähtsam reegel: mida teed ühel pool, teed ka teisel.',
    next: 's4',
  },
  s4: {
    tutor: 'Sama lugu matemaatika keeles. Pakk on muutuja x. Mis on su esimene käik?',
    card: { kind: 'task', kicker: TASK, eq: '3x + 5 = 20' },
    choices: [
      { label: 'Võtan mõlemalt poolt 5 ära: 3x = 15. Jagan kolmega: x = 5.', next: 's4-ok' },
      { label: '3x = 25, x = 8,33', next: 's4-vale' },
      { label: '3x = 15. Edasi ei tea.', next: 's4-pool' },
      { label: 'Ütle lihtsalt vastus.', next: 's4-vastus', set: { hintAsked: 'jah' } },
    ],
  },
  's4-ok': { tutor: 'Klapib.', next: 's4-kontroll' },
  's4-vale': {
    tutor: 'Vaata oma esimest rida.',
    card: {
      kind: 'solution',
      kicker: 'Sinu lahendus',
      line: '3x = [25]',
      caption: 'Vaata veel kord, mis juhtus viiega — vasakult võtsid ära, paremale liitsid juurde.',
    },
    choices: [
      {
        label: 'Ah, paremalt pean ka ära võtma: 3x = 15. Jagan kolmega: x = 5.',
        next: 's4-kontroll',
      },
      { label: 'Ma ei saa aru.', next: 's4-vastus' },
    ],
  },
  's4-pool': {
    tutor: 'Kolm ühesugust pakki kaaluvad kokku 15. Kuidas ühe paki kaalu teada saad?',
    choices: [
      { label: 'Jagan kolmega, x = 5.', next: 's4-kontroll' },
      { label: 'Lahutan kolm, x = 12.', next: 's4-jaga' },
    ],
  },
  's4-jaga': {
    tutor: 'Kolm pakki on kolm korda pakk. Mis tehe teeb korrutamise tagasi?',
    choices: [
      { label: 'Jagamine. 15 : 3 = 5, x = 5.', next: 's4-kontroll' },
      { label: 'Jagamine… x = 5.', next: 's4-kontroll' },
    ],
  },
  's4-vastus': {
    tutor:
      'Vastust ma ette ei ütle — aga annan vihje, millega ise kohale jõuad: pakid tahad üksi jätta. Mis segab neid vasakul kausil?',
    choices: [
      {
        label: 'See viis. Võtan ta mõlemalt poolt ära: 3x = 15. Jagan kolmega: x = 5.',
        next: 's4-kontroll',
      },
      { label: 'See viis. Võtan ära: 3x = 15. Edasi ei tea.', next: 's4-pool' },
    ],
  },
  's4-kontroll': {
    tutor: 'Ja kuidas sa ise teada saad, et see õige on — ilma minult küsimata?',
    choices: [
      { label: 'Panen viie tagasi: 3 · 5 + 5 = 20. Klapib.', next: 's4-done' },
      { label: 'Ei tea.', next: 's4-vihje' },
    ],
  },
  's4-vihje': {
    tutor: 'Pane vastus algsesse võrrandisse tagasi ja vaata, kas klapib.',
    choices: [
      { label: '3 · 5 + 5 = 20. Klapib.', next: 's4-done' },
      { label: '15 + 5 = 20. Jah, klapib.', next: 's4-done' },
    ],
  },
  's4-done': {
    tutor: 'Sa kontrollisid ise ära. Ma ei öelnud ühtegi sammu ette — need olid sinu käigud.',
    log: 'mõlemale poole sama tehe — õige · jagamine mõlemal pool — õige · kontroll asendamisega — õige',
    next: 's5',
  },
  s5: {
    tutor: (f) =>
      f.sulud === 'vale'
        ? 'See on sama kuju, mille sa alguses avasid. Enne lahendamist kontrolli: pane x asemele 5 ja vaata, kas 2(x − 4) ja sinu avatud kuju annavad sama.'
        : 'Järgmine. Ava sulud ja lahenda.',
    card: { kind: 'task', kicker: TASK, eq: '2(x − 4) = 10' },
    choices: (f) =>
      f.sulud === 'vale'
        ? [
            {
              label:
                '5 − 4 = 1, 2 · 1 = 2. Aga 2 · 5 − 4 = 6. Ei anna sama. Siis pean nelja ka kahega korrutama: 2x − 8.',
              next: 's5-katse',
            },
            { label: '2x − 4 = 10, 2x = 14, x = 7.', next: 's5-vale' },
          ]
        : [
            { label: '2x − 8 = 10, 2x = 18, x = 9. Kontroll: 2 · (9 − 4) = 10.', next: 's5-probe' },
            { label: '2x − 4 = 10, 2x = 14, x = 7.', next: 's5-vale' },
          ],
  },
  's5-katse': {
    tutor: 'Sa ei vaielnud arvamusega — sa katsetasid. Lahenda lõpuni.',
    choices: [
      { label: '2x = 18, x = 9. Kontroll: 2 · (9 − 4) = 10. Klapib.', next: 's5-done' },
      { label: '2x = 18. Jagan kahega: x = 9. Kontroll: 2 · 5 = 10. Klapib.', next: 's5-done' },
    ],
  },
  's5-probe': {
    tutor: 'Miks korrutasid nelja ka kahega?',
    choices: [
      { label: 'Sest sulu ees olev kaks käib mõlema liikme kohta.', next: 's5-done' },
      { label: 'Ei tea, nii lihtsalt on.', next: 's5-miks' },
    ],
  },
  's5-miks': {
    tutor: 'Pane x asemele 5: 2(5 − 4) on kaks korda üks. Ja 2 · 5 − 4?',
    choices: [
      { label: 'Kuus. Ei ole sama — kaks peab käima mõlema liikme kohta.', next: 's5-done' },
      {
        label: 'Kuus. Ahah, siis nelja peab ka korrutama: 2x − 8 = 10, x = 9.',
        next: 's5-done',
      },
    ],
  },
  's5-vale': {
    tutor: 'Vaata oma esimest rida.',
    card: {
      kind: 'solution',
      kicker: 'Sinu lahendus',
      line: '2x − [4] = 10',
      caption:
        'Vaata veel kord, mis juhtus neljaga sulu avamisel — kahega korrutasid muutuja x, aga nelja mitte.',
    },
    choices: [
      { label: 'Ah, kaks käib ka nelja kohta: 2x − 8 = 10, 2x = 18, x = 9.', next: 's5-done' },
      { label: 'Ma ei saa aru.', next: 's5-miks' },
    ],
  },
  's5-done': {
    tutor: (f) =>
      f.sulud === 'vale'
        ? 'Kontroll asendamisega päästis su — sa ei uskunud, sa katsetasid.'
        : 'Klapib — ja sa teadsid, miks.',
    log: (f) =>
      f.sulud === 'vale'
        ? 'sulgude avamine — korda veel · kontroll asendamisega — õige'
        : 'sulgude avamine — õige · põhjendus — õige',
    next: (f) => (f.neg === 'ei-saa' ? 's6-pre' : 's6'),
  },
  's6-pre': {
    tutor:
      'Väljas on kolm kraadi sooja, öösel läheb seitse kraadi külmemaks. Mitu kraadi hommikul?',
    choices: [
      { label: 'Miinus neli.', next: 's6-pilt' },
      { label: 'Neli külma… miinus neli.', next: 's6-pilt' },
    ],
  },
  's6-pilt': {
    tutor:
      'Sa arvutasid just 3 − 7. Sama tehe, millele sa enne ütlesid „ei saa“. Numbrid ei muutunud, pilt muutus. Kumb pilt on sinu oma — termomeeter või jalgpalli väravate vahe?',
    choices: [
      { label: 'Termomeeter.', next: 's6', set: { metaphor: 'termomeeter' } },
      { label: 'Väravate vahe.', next: 's6', set: { metaphor: 'väravad' } },
    ],
  },
  s6: {
    tutor: 'Viimane täna. Nüüd räägi ise endaga — mina kuulan.',
    card: { kind: 'task', kicker: TASK, eq: '7 − 2x = 15' },
    choices: [
      { label: 'Ma ei tea.', next: 's6-eitea' },
      {
        label: 'Keda tahan üksi jätta… 2x. Võtan 7 ära: −2x = 8. Jagan −2-ga: x = −4.',
        next: 's6-ise',
      },
      { label: 'x = 4', next: 's6-vale' },
    ],
  },
  's6-eitea': {
    tutor: 'Ütle üks asi, mida sa selle ülesande kohta tead.',
    choices: [
      { label: 'Et pean mõlemal pool sama tegema.', next: 's6-uks' },
      { label: 'Et keegi tuleb üksi jätta.', next: 's6-uks' },
    ],
  },
  's6-uks': {
    tutor: 'Ja keda tahad üksi jätta?',
    choices: [
      { label: '2x. Aga tal on miinus ees.', next: 's6-julge' },
      { label: 'Muutujat x.', next: 's6-julge' },
    ],
  },
  's6-julge': {
    tutor: (f) => {
      const m =
        f.metaphor === 'termomeeter'
          ? ' Miinus on termomeetri alumine pool, mitte viga.'
          : f.metaphor === 'väravad'
            ? ' Miinus on lihtsalt väravate vahe teistpidi, mitte viga.'
            : '';
      return `Proovi julgelt. Kui untsu läheb, näeme, kus.${m}`;
    },
    choices: [
      {
        label: '−2x = 8, x = −4. Kontroll: 7 − 2 · (−4) = 7 + 8 = 15. Klapib.',
        next: 's6-done',
      },
      { label: '−2x = 8, x = 4.', next: 's6-vale' },
    ],
  },
  's6-ise': {
    tutor: 'Kas arvad või tead?',
    choices: [
      { label: 'Tean: 7 − 2 · (−4) = 7 + 8 = 15.', next: 's6-done' },
      { label: 'Arvan.', next: 's6-arvan' },
    ],
  },
  's6-arvan': {
    tutor: 'Pane −4 tagasi ja vaata.',
    choices: [
      { label: '7 − 2 · (−4) = 7 + 8 = 15. Klapib. Tean.', next: 's6-done' },
      { label: '7 + 8 = 15. Klapib.', next: 's6-done' },
    ],
  },
  's6-vale': {
    tutor: 'Pane 4 tagasi: 7 − 2 · 4. Kas klapib?',
    choices: [
      { label: '−1. Ei klapi.', next: 's6-mark' },
      { label: '7 − 8 = −1. Ei.', next: 's6-mark' },
    ],
  },
  's6-mark': {
    tutor: 'Kus märk kadus?',
    choices: [
      {
        label: 'Seitse ära: −2x = 8. Miinus jäi kahe ette. Jagan −2-ga: x = −4.',
        next: 's6-done',
      },
      { label: 'Jagamisel: 8 jagatud −2-ga on −4.', next: 's6-done' },
    ],
  },
  's6-done': {
    tutor: 'Kontrollisid ise, ilma et ma küsinud oleks.',
    log: (f) =>
      `${f.neg === 'ei-saa' ? 'negatiivsed arvud — vaatame veel' : 'negatiivsed arvud — õige'} · kontroll asendamisega — õige`,
    next: 's7',
  },
  s7: {
    tutor:
      'Enne kui lõpetame: seleta oma sõnadega, mis on võrrandi lahendamise kõige tähtsam reegel.',
    choices: [
      {
        label: 'Mis ma ühel pool teen, teen teisel pool ka. Ja lõpus panen vastuse tagasi.',
        next: 's7-kokkuvote',
      },
      { label: 'Vii teisele poole ja muuda märki.', next: 's7-otsetee' },
    ],
  },
  's7-otsetee': {
    tutor: 'See on otsetee, mis peidab kaalu ära. Mida „vii teisele poole“ päriselt tähendab?',
    choices: [
      { label: 'Võta mõlemast kausist sama palju.', next: 's7-kokkuvote' },
      { label: 'Et mõlemal pool sama tehe.', next: 's7-kokkuvote' },
    ],
  },
  's7-kokkuvote': {
    tutor: (f) =>
      `Täna: mõlemale poole sama tehe — kindel. Kontroll tagasi pannes — sinu enda harjumus.${
        f.sulud === 'vale' ? ' Sulgude avamine — korda veel.' : ''
      }${f.neg === 'ei-saa' ? ' Negatiivsed arvud — vaatame veel.' : ''} Järgmine kord alustame sellest, mida sina mäletad. Millal sul homme kuus minutit on?`,
    choices: [
      { label: 'Pärast trenni, seitsme ajal.', next: 's7-aeg' },
      { label: 'Hommikul bussis.', next: 's7-aeg' },
    ],
  },
  's7-aeg': {
    tutor: 'Kirjutasin üles.',
    next: (f) => (f.goal === 'paanika' ? 's7-paanika' : 'end'),
  },
  's7-paanika': {
    tutor:
      'Alguses ütlesid, et tahad, et ei tuleks paanikat, kui õpetaja küsib. Ma just küsisin. Kus paanika oli?',
    choices: [
      { label: '…Ei olnudki.', next: 'end' },
      { label: 'Ei tulnud. Ma teadsin, mida öelda.', next: 'end' },
    ],
  },
  end: {
    tutor: 'Aitäh, Sten. Homme näeme.',
    choices: [{ label: 'Vaata, mida õpetaja sellest tunnist näeb', teacher: true }],
  },
};

// ---- beats -------------------------------------------------------------
/** Beat name per node-id prefix (`id.split('-')[0]`). */
export const DEMO_BEATS: Record<string, string> = {
  s0: 'Avamine',
  s1: 'Diagnostika',
  s2: 'Leid',
  s3: 'Kaal',
  s4: 'Ülesanne 1',
  s5: 'Ülesanne 2',
  s6: 'Ülesanne 3',
  s7: 'Lõpp',
  end: 'Lõpp',
};

/** Progress order — includes the teacher view as the final beat. */
export const DEMO_BEAT_ORDER = [
  'Avamine',
  'Diagnostika',
  'Leid',
  'Kaal',
  'Ülesanne 1',
  'Ülesanne 2',
  'Ülesanne 3',
  'Lõpp',
  'Õpetaja vaade',
] as const;

// ---- user-visible copy outside the conversation -------------------------
export const DEMO_COPY = {
  pageTitle: 'MATx näidistund — Sten, 20 minutit',
  brand: 'MATx',
  brandTag: 'Näidistund',
  controls: {
    back: 'Samm tagasi',
    reset: 'Alusta uuesti',
    showLog: 'Näita, mida süsteem salvestab',
    /** Prefix the renderer puts before every log line. */
    logPrefix: 'Salvestati: ',
  },
  cover: {
    eyebrow: 'Näidistund · ette kirjutatud, mitte päris AI',
    title: '„Ma ei tea.”',
    sub: 'Sten, 7. klass. Kakskümmend minutit. Sina valid, mida ta vastab.',
    // `briefEmphasis` renders bold, then a space, then `brief`.
    briefEmphasis: 'Sten',
    brief:
      'on väljamõeldud õpilane. Hinded matemaatikas 2 ja 3, harjumus öelda „ma ei tea“, veendumus, et ta „lihtsalt ei ole mata-inimene“. Koduseks on jäänud tööleht võrranditest. Iga sinu valik näitab, mida MATx sellises kohas teeb.',
    honest:
      'Päris MATx-is genereerib ülesanded kood ja vestlust juhib AI, mida piiravad samad reeglid. Siin on kõik ette kirjutatud, andmeid ei koguta.',
    start: 'Alusta tundi',
  },
  lesson: {
    label: 'Näidistund',
    choicesLabel: 'Steni vastus',
    // Speaker labels and avatar initials — never hardcoded in the renderer.
    tutorName: 'MATx',
    tutorInitial: 'M',
    studentName: 'Sten',
    studentInitial: 'S',
  },
  teacher: {
    label: 'Õpetaja vaade',
    handoff: 'Vestlus lõppes. Allpool on sama tund õpetaja töölaual.',
    eyebrow: 'Teine vaatus',
    heading: 'Mida õpetaja näeb',
    intro:
      'Sama tund, teine ekraan. Kõik siin on tuletatud sinu valikutest — mitte vestluse sisust, vaid oskuste seisust.',
    classHeading: 'Klassi pilt',
    classBadge: 'Näidisandmed',
    classCaption: '7.b · 22 õpilast · 5 oskust',
    studentColumn: 'Õpilane',
    /** Sten's own row: the only row derived from the player's choices. */
    stenInitials: 'ST',
    stateLabels: {
      k: 'korda veel',
      s: 'seljakotis',
      l: 'läbitud',
      p: 'proovimata',
    },
    cardHeading: 'Õpilase kaart: Sten',
    cardStrengths: 'Tugevused: mõlemale poole sama tehe, kontroll asendamisega.',
    cardBlockerSulud:
      'Takistused: sulgude avamine — sellest sõltub kuus edasist oskust (abivalemid, tegurdamine, …).',
    cardBlockerNoneNegOk: 'Takistused: praegu ei ole. Negatiivsed arvud on paigas.',
    cardBlockerNoneNegWeak: 'Takistused: praegu ei ole. Negatiivsed arvud vajavad kordamist.',
    cardHintAsked: 'Vihjeid: küsis ise ühe.',
    cardHintNone: 'Vihjeid: ei küsinud.',
    cardPrivacy: 'Vestluse sisu õpetaja ei näe — ainult oskuste seis.',
    boardHeading: 'Diagnostika-laud',
    boardBadge: 'Kavandatud',
    boardSkill: 'Sulgude avamine',
    boardStuck: (count: number) => `${count} õpilast on siin kinni`,
    boardCluster: (names: string[]) =>
      `Klaster: korrutab ainult esimest liiget · ${names.join(', ')}`,
    boardPropose: 'Koosta ettepanek',
    boardProposal: (count: number) =>
      `Anna neile ${count} õpilasele neli ülesannet kujul a(x − b) = c ja lase igaühel enne lahendamist kontrollida sulgude avamist asendamisega.`,
    boardAccept: 'Võta vastu',
    boardEdit: 'Muuda',
    boardIgnore: 'Eira',
    boardAccepted: (count: number) => `Määratud · ${count} õpilast · homseks`,
    boardEdited: 'Muutmine — päris tootes avaneb siin ülesannete redaktor.',
    boardIgnored: 'Eiratud · ettepanek jääb logisse',
    decisionPrefix: 'Õpetaja otsus: ',
  },
  foot: 'Näidistund — ette kirjutatud. Sten on väljamõeldud. Päris MATx-is genereerib ülesanded kood ja vestlust juhib AI, mida piiravad samad reeglid. Andmeid ei koguta.',
} as const;

// ---- teacher-view fixtures ---------------------------------------------
/** One skill state letter per skill column; see `DEMO_COPY.teacher.stateLabels`. */
export type DemoSkillState = 'k' | 's' | 'l' | 'p';

/** Five state letters, one per `DEMO_SKILLS` column, in column order. */
export type DemoSkillStates =
  `${DemoSkillState}${DemoSkillState}${DemoSkillState}${DemoSkillState}${DemoSkillState}`;

export type DemoClassRow = {
  initials: string;
  states: DemoSkillStates;
};

/** 21 fixture classmates. Sten's row is derived at runtime (story 1.2). */
export const DEMO_CLASS_ROWS: DemoClassRow[] = [
  { initials: 'AK', states: 'lllsp' },
  { initials: 'AM', states: 'lkkll' },
  { initials: 'BT', states: 'llllp' },
  { initials: 'EP', states: 'slksp' },
  { initials: 'HR', states: 'lllll' },
  { initials: 'JK', states: 'lkkpp' },
  { initials: 'KL', states: 'llslp' },
  { initials: 'KM', states: 'ssklp' },
  { initials: 'LP', states: 'lllsp' },
  { initials: 'LT', states: 'lllll' },
  { initials: 'MK', states: 'lslpp' },
  { initials: 'MR', states: 'llllp' },
  { initials: 'MS', states: 'lllll' },
  { initials: 'NN', states: 'lllpp' },
  { initials: 'OT', states: 'sllpp' },
  { initials: 'PK', states: 'llllp' },
  { initials: 'RL', states: 'lllsp' },
  { initials: 'RV', states: 'lkkkp' },
  { initials: 'SS', states: 'llllp' },
  { initials: 'TA', states: 'lllll' },
  { initials: 'TK', states: 'lslpp' },
];

export type DemoSkill = {
  label: string;
  /** Story 3.2 replaces null with an ID from the frozen taxonomy. */
  taxonomyId: string | null;
};

/** The five skill columns, in table order. */
export const DEMO_SKILLS: DemoSkill[] = [
  { label: 'Võrduse omadused', taxonomyId: null },
  { label: 'Kontroll asendamisega', taxonomyId: null },
  { label: 'Sulgude avamine', taxonomyId: null },
  { label: 'Negatiivsed arvud', taxonomyId: null },
  { label: 'Murrud', taxonomyId: null },
];

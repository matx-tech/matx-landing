import { ChevronDown, GitBranch } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExportMarkdown } from '@/components/tehniline/export-markdown';
import { StatusCard, type StatusRow, TechText } from '@/components/tehniline/status-card';
import { StatusFilterSection } from '@/components/tehniline/status-filter';
import { CapabilityStatusBadge } from '@/components/ui/capability-status';
import { CopyButton } from '@/components/ui/copy-button';
import { TechnicalTOC } from '@/components/ui/technical-toc';
import type { CapabilityStatus } from '@/lib/content/landing-copy';

export const metadata: Metadata = {
  title: 'Tehniline ülevaade — MATx',
  description:
    'MATx-i arhitektuur, turvameetmed ja vastavusstaatus IT- ja hanketiimidele: identiteet ja sessioonid, pseudonüümimine, integratsioonid ja hankedokumendid.',
  openGraph: {
    title: 'Tehniline ülevaade — MATx',
    description: 'MATx-i arhitektuur, turvameetmed ja vastavusstaatus IT- ja hanketiimidele.',
    url: 'https://matx.ee/tehniline',
  },
  alternates: {
    canonical: 'https://matx.ee/tehniline',
  },
};

// Freshness anchor — updated whenever claims on this page change.
const LAST_UPDATED = '08.08.2026';

// Status legend used across the page. Stated plainly, not as a promise.
// Typed against the shared CapabilityStatus union so a renamed status is
// a compile error here, not a dead legend entry.
const LEGEND: { status: CapabilityStatus; meaning: string }[] = [
  { status: 'Saadaval', meaning: 'on praegu kasutusel' },
  { status: 'Piloodis', meaning: 'kasutusel valitud koolidega testimiseks' },
  { status: 'Kavandatud', meaning: 'sihtseis — plaanis, pole veel kasutusele võetud' },
];

// Section anchors — also used by the on-page table of contents.
const SECTIONS = [
  { id: 'kokkuvõte', label: 'Kokkuvõte' },
  { id: 'arhitektuur', label: 'Arhitektuur' },
  { id: 'turvameetmed', label: 'Turvameetmed' },
  { id: 'vastavus', label: 'Vastavus' },
  { id: 'integratsioonid', label: 'Integratsioonid' },
  { id: 'hanked', label: 'Hanked' },
  { id: 'allikad', label: 'Allikad ja kontroll' },
  { id: 'glossar', label: 'Glossar' },
  { id: 'kontakt', label: 'Kontakt' },
] as const;

// KPI accent per status — shares the badge token colors so the band reads
// as one system.
const STATUS_ACCENT: Record<StatusRow['status'], string> = {
  Saadaval: 'text-success-strong',
  Piloodis: 'text-warning-strong',
  Kavandatud: 'text-text-secondary',
};

// Segmented ratio-bar fills — same palette as the badges and KPI accents.
const STATUS_BAR_FILL: Record<StatusRow['status'], string> = {
  Saadaval: 'bg-success-strong',
  Piloodis: 'bg-warning',
  Kavandatud: 'bg-borderStrong',
};

/**
 * Renders a section heading with an optional introductory description.
 *
 * @param id - The anchor identifier for the section
 * @param title - The section heading text
 * @param lead - Optional introductory description
 */
function SectionHeading({ id, title, lead }: { id: string; title: string; lead?: string }) {
  return (
    <div id={id} className='scroll-mt-24 mb-6'>
      <h2 id={`${id}-heading`} className='text-2xl font-semibold text-text-primary'>
        {title}
      </h2>
      {lead && <p className='text-sm text-text-secondary leading-relaxed mt-2'>{lead}</p>}
    </div>
  );
}

// Target-state security controls. Statuses reflect TODAY's real deployment,
// not the end-state. Items locked to the compliance branch are marked
// Kavandatud until merged — see the notes and the sources section.
const SECURITY_CONTROLS: StatusRow[] = [
  {
    title: 'Post-kvantum allkirjad (ML-DSA-65)',
    detail: 'EATF-i tõendite ja BKT hetktõmmiste allkirjastamine.',
    status: 'Piloodis',
    note: 'Allkirjastamisteekonnad on piloodis kasutusel.',
  },
  {
    title: 'Sessioonid PostgreSQL-is (PgStore)',
    detail:
      'httpOnly, sameSite=strict, IP+UA sõrmejälg, CSRF double-submit konstantaegse võrdlusega.',
    status: 'Kavandatud',
    note: 'Sessioonihaldus on testimisel eraldi turbearendusharus; ühendamine põhiharuga enne piloodi laiendamist.',
  },
  {
    title: 'Sessiooni absoluutne eluiga rollide kaupa',
    detail: 'Õpilane 8h, õpetaja/admin 12h + idle timeout; sõrmejälje lahknevus lõpetab sessiooni.',
    status: 'Kavandatud',
    note: 'Piirid on osaliselt testimisel turbearendusharus; täismahus kehtestamine on kavandatud.',
  },
  {
    title: 'Rollipõhine juurdepääs (requireRole)',
    detail: 'Rollid: õpilane, õpetaja, admin, DPO. Iga lõpp-punkt kontrollib rolli.',
    status: 'Kavandatud',
    note: 'Rollimudel ja DPO/DSR-teekonnad on testimisel turbearendusharus; ühendamine on kavandatud.',
  },
  {
    title: 'Pseudonüümimine (HMAC-lüüs)',
    detail:
      'Õpilase isikustatud ID-d pseudonüümitakse käitumistabelites; DSR puhul de-pseudonüümimine.',
    status: 'Kavandatud',
    note: 'Pseudonüümimislüüs on testimisel turbearendusharus; ühendamine on kavandatud.',
  },
  {
    title: 'Egress-lüüs kogu väljuvale liiklusele',
    detail:
      'Üks väljuv kontrollpunkt (AI, OCR, analüütika, veebihaagid), deny-by-default, DNS-rebindingi kaitse.',
    status: 'Kavandatud',
    note: 'Katab praegu AI- ja OCR-teekondi; laiendamine kogu väljuvale liiklusele on kavandatud.',
  },
  {
    title: 'Per-endpoint rate limiting (Redis)',
    detail: 'Sisselogimine, AI lõpp-punktid, DSR ekspordid, /api/graph — piirid Redis-poes.',
    status: 'Kavandatud',
    note: 'Limiiter on testimisel turbearendusharus; põhiharuga ühendamine on kavandatud.',
  },
  {
    title: 'MFA õpetajale/adminile (Smart-ID/Mobiil-ID)',
    detail: 'Privilegeeritud rollidele mitmikautentimine Eesti ID-vahenditega.',
    status: 'Kavandatud',
    note: 'Kasutuselevõtt on kavandatud enne piloodi laiendamist.',
  },
  {
    title: 'HarID/TAAT OIDC + PKCE',
    detail: 'Koolide identiteediföderatsioon; joiner/mover/leaver elutsükli käsitlus.',
    status: 'Kavandatud',
    note: 'Pole veel kasutusele võetud.',
  },
  {
    title: 'Tarneahela turve',
    detail:
      'pnpm audit + Dependabot CI-lüüsid, SBOM, submodule kinnitatud releasile, avalikustamispoliitika.',
    status: 'Kavandatud',
    note: 'SIEM-i ja tarneahela lüüsid on kavandatud; SBOM ja avalikustamispoliitika on koostamisel.',
  },
  {
    title: 'Sandbox-isolatsioon',
    detail: 'Mitte-root kasutaja, seccomp, no-new-privileges, pids-limit, image digesti kinnitus.',
    status: 'Kavandatud',
    note: 'Täismahus sandbox (mitte-root, seccomp, pids-piirangud, image digesti kinnitus) on kavandatud.',
  },
  {
    title: 'Varukoopiad ja taaste',
    detail:
      'PostgreSQL PITR + krüpteeritud väljaspoole varukoopiad, RPO ≤ 24h / RTO ≤ 4h, kvartaalne taastetest.',
    status: 'Kavandatud',
    note: 'Varukoopia- ja taasteprogramm on kavandatud, pole veel paigas.',
  },
  {
    title: 'Logid ja SIEM',
    detail:
      'Logid ainult metaandmetega (mitte vastuste kehad), SIEM-sissekanne, 72h intsidentide tähtaeg.',
    status: 'Kavandatud',
    note: 'Logide maht kitsendatakse metaandmetele; parandus on kavandatud.',
  },
  {
    title: 'Helmet, CSP, HSTS',
    detail: 'Turvapäised, sisu turvapoliitika, HSTS preload.',
    status: 'Kavandatud',
    note: 'Taastamine ja kinnitamine on kavandatud enne piloodi laiendamist.',
  },
  {
    title: 'Puhkeoleku krüpteerimine',
    detail: 'Andmebaasi ja varukoopiate krüpteerimine koos võtmehaldusega.',
    status: 'Kavandatud',
  },
  {
    title: 'Andmete säilitamine ja kustutamine',
    detail:
      'Säilitustähtajad õppeaasta ja õpilase kaupa, kustutamine DSR-i alusel ja lepingu lõppedes.',
    status: 'Kavandatud',
  },
  {
    title: 'Intsidentide käsitlus',
    detail: 'Intsidentide register, GDPR Art. 33 72h teavitus, DPO kontakt.',
    status: 'Kavandatud',
  },
  {
    title: 'Vastutustundlik avalikustamine',
    detail: 'security@matx.ee; vastuse aeg ja PGP-võti avalikustatakse koos poliitikaga.',
    status: 'Kavandatud',
  },
];

// Compliance status per regime. Honest scope: NIS2/DORA are NOT in legal
// scope for education — stated as such, not claimed.
const COMPLIANCE_ROWS: StatusRow[] = [
  {
    title: 'EU AI Act (2024/1689)',
    detail:
      'Kohanduv õpimootor (BKT) kuulub Annex III punkti 3 haridusvaldkonna kohaldamisalasse; Art. 6(3)(c) enesehindamine (kas kõrge riski klass on välistatud) on pooleli. Õpetaja inimese-kontroll säilib.',
    status: 'Piloodis',
    note: 'FRIA ja ulatuse otsused on testimisel; allkirjastamine ja Art. 49 registreerimine on kavandatud.',
  },
  {
    title: 'NIS2 (2022/2555)',
    detail:
      'Haridus ei kuulu lisadesse I/II — otsene kohustus ei laiene. NIS2-põhiseid meetmeid rakendatakse pilootfaasis hea tavana.',
    status: 'Piloodis',
    note: 'Siht on NIS2-põhine baastase, mitte formaalne vastavus.',
  },
  {
    title: 'GDPR (2016/679)',
    detail:
      'Kohaldub juba pilootfaasis — staatus kajastab vastavusprogrammi valmidust, mitte seaduse kohaldumist. Rollid sõltuvad iga töötlustegevuse sisust: kool/omavalitsus on vastutav töötleja; MATx on volitatud töötleja dokumenteeritud juhiste alusel töötlemisel, muidu sõltumatu või kaasvastutav töötleja. Rollimaatriks tegevuse kaupa ja andmetöötluslepingu kooskõlastamine enne pilootlepinguid. Art. 8 alaealiste erikaitse (Eestis vanusepiir 13+, vanema nõusolek) kehtib juhul, kui õiguslikuks aluseks on nõusolek (art 6 lg 1 p a) infoühiskonna teenuse puhul, mida pakutakse otse lapsele.',
    status: 'Kavandatud',
    note: 'Alaealiste andmete kaitse on pilootfaasi põhirõhk; täismahus vastavus sihtseisus.',
  },
  {
    title: 'DORA (2022/2554)',
    detail:
      'Finantssektori määrus — MATx-ile ei kohaldu. Distsipliin (varukoopiad, BCM) on laenatud hea tavana.',
    status: 'Kavandatud',
    note: 'Ei ole õiguslik nõue.',
  },
  {
    title: 'ISO 27001 / 27701',
    detail: 'Soovituslik raamistik; ISMS-i skelett ja SoA on sihtseisus.',
    status: 'Kavandatud',
    note: 'Sertifitseerimise siht on 2027.',
  },
  {
    title: 'E-ITS (Eesti infoturbestandard)',
    detail: 'RIA-ga kooskõlas olev baasraamistik; kaardistamine sihtseisus.',
    status: 'Kavandatud',
    note: 'E-ITS on ISO/IEC 27001-ga ühilduv.',
  },
  {
    title: 'Eesti õigus (IKS, PGS, AKI)',
    detail:
      'IKS digitaalne nõusolek alates 13. eluaastast (kehtib nõusolekupõhise infoühiskonna teenuse puhul, mida pakutakse otse lapsele), isikuandmete kaitse seadus, AKI koolide juhendmaterjalid.',
    status: 'Kavandatud',
    note: 'Nõusoleku- ja vanusepiiri loogika on testimisel turbearendusharus; ühendamine on kavandatud.',
  },
];

// Integration status. Integrations are future-state — no overclaiming.
const INTEGRATION_ROWS: StatusRow[] = [
  {
    title: 'Käsikirja OCR',
    detail: 'Käsikirja tuvastus egress-lüüsi taga; EL/Eesti pakkuja kaalumisel.',
    status: 'Piloodis',
  },
  {
    title: 'AI-töötlus (OpenAI, Anthropic)',
    detail: 'Käsikirja OCR ja õpianalüüsi tekstitöötlus kolmanda osapoole AI-teenustega.',
    status: 'Piloodis',
    note: 'Andmetöötluse tingimused kinnitatakse enne pilootlepinguid.',
  },
  {
    title: 'EATF allkirjastamine',
    detail: 'Tõendite ja BKT hetktõmmiste ajaallkirjastamine EATF-i kaudu (RSA-4096 + ML-DSA-65).',
    status: 'Piloodis',
  },
  {
    title: 'Kolmandad osapooled (leht)',
    detail:
      'Landing-lehel jälgijaid pole; ainus väline teenus lehel on demobroneering (Calendly). Platvormi kolmandad osapooled on loetletud ülal.',
    status: 'Saadaval',
  },
  {
    title: 'HarID/TAAT OIDC',
    detail: 'Koolide identiteediföderatsioon (PKCE, elutsükli käsitlus).',
    status: 'Kavandatud',
  },
  {
    title: 'EHIS (Eesti Hariduse Infosüsteem)',
    detail: 'Hariduse infosüsteemi liidestused on kaalumisel.',
    status: 'Kavandatud',
  },
];

// Hankeinfo — reference data for procurement teams. Sources at the end of the
// "Hanked" section. Statuses describe MATx's own deliverables, not the law.
// Two regimes side by side: current RHS (kuni 31.10.2026) and the amended RHS
// (alates 01.11.2026, RT I, 03.07.2026, 3). Separate tables so "which rule
// applies when" is unambiguous. ponytail: on 01.11.2026 delete the old-regime
// array, its table and the header below — the new-regime data stays.
type ProcurementRoute = { band: string; route: string; note: string };

const PROCUREMENT_ROUTES: ProcurementRoute[] = [
  {
    band: 'Kuni 30 000 €',
    route: 'Otsetellimine — riigihangete seadus ei kohaldu; ost hankekorra järgi.',
    note: 'Ühe kooli tarkvaralitsentside ostud jäävad tihti alla piirmäära ega kajastu registris; täpset jaotust registriandmetest hinnata ei saa.',
  },
  {
    band: '30 000–59 999 €',
    route: 'Lihthange — pakkumuste tähtaeg min 10 päeva.',
    note: 'Keskmine kestus teatest lepinguni 2025. aastal: 47 päeva (RaM 2025, tabel 1).',
  },
  {
    band: '60 000–139 999 € (riik) / 60 000–215 999 € (omavalitsus)',
    route: 'Avatud hankemenetlus — pakkumuste tähtaeg min 15 päeva.',
    note: 'Keskmine kestus teatest lepinguni 2025. aastal: 72 päeva (RaM 2025, tabel 1).',
  },
  {
    band: 'Alates 140 000 € (riik) / 216 000 € (omavalitsus)',
    route:
      'Rahvusvaheline (EL) menetlus — teade ka EL Teatajas (TED), pakkumuste tähtaeg min 30 päeva.',
    note: 'EL piirmäärad 2026–2027: 140 000 € (keskvalitsus) / 216 000 € (kohalikud omavalitsused).',
  },
];

const PROCUREMENT_ROUTES_NEW: ProcurementRoute[] = [
  {
    band: 'Kuni 50 000 €',
    route: 'Otsetellimine — riigihangete seadus ei kohaldu; ost hankekorra järgi.',
    note: 'Ühe kooli tarkvaralitsentside ostud jäävad tihti alla piirmäära ega kajastu registris; täpset jaotust registriandmetest hinnata ei saa.',
  },
  {
    band: '50 000–139 999 € (riik) / 50 000–215 999 € (omavalitsus)',
    route: 'Lihthange — pakkumuste tähtaeg min 15 päeva.',
    note: 'Siseriiklik avatud hankemenetlus kaob — lihthange jääb ülemiseks siseriiklikuks menetluseks.',
  },
  {
    band: 'Alates 140 000 € (riik) / 216 000 € (omavalitsus)',
    route:
      'Rahvusvaheline (EL) menetlus — teade ka EL Teatajas (TED), pakkumuste tähtaeg min 30 päeva.',
    note: 'EL piirmäärad 2026–2027: 140 000 € (keskvalitsus) / 216 000 € (kohalikud omavalitsused).',
  },
];

// Anti-splitting and value aggregation. Kehtib mõlemas režiimis — muutmisseadus
// RHS § 28 ega § 23 lg 2 p 1 ei muuda. Rendered on the page and in the Markdown
// export from the same constant, so neither can drift.
const PROCUREMENT_SPLIT_RULE =
  'Hankelepingut ei või piirmäärast allapoole jäämise eesmärgil osadeks jagada (RHS § 28 lg 2); eeldatavasse maksumusse arvestatakse ka lepingu uuendamine ja tulevased kohustused (RHS § 23 lg 2 p 1).';

// Build-time staleness guard for the comment above: this page is statically
// prerendered, so once a build runs after the expiry date the build fails
// until the old-regime data is deleted — a loud error instead of stale
// procurement rules staying live.
if (Date.now() > new Date('2026-11-01T00:00:00+02:00').getTime()) {
  throw new Error(
    'Old-regime procurement data expired — delete PROCUREMENT_ROUTES, its RouteTable usage and the "Kehtib kuni 31.10.2026" header.',
  );
}

/**
 * Renders procurement routes in an accessible, horizontally scrollable table.
 *
 * @param rows - Procurement routes to display.
 * @param ariaLabel - Accessible label for the table region.
 */
function RouteTable({ rows, ariaLabel }: { rows: ProcurementRoute[]; ariaLabel: string }) {
  return (
    <section
      className='rounded-xl border border-border bg-card overflow-x-auto shadow-card'
      aria-label={ariaLabel}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must stay keyboard-reachable (WAI-ARIA scrollable-region pattern)
      tabIndex={0}
    >
      <table className='w-full min-w-[680px] text-sm'>
        <thead>
          <tr className='border-b border-border text-left text-text-primary'>
            <th scope='col' className='px-5 py-3 font-semibold'>
              Piirmäär
            </th>
            <th scope='col' className='px-5 py-3 font-semibold'>
              Menetlus
            </th>
            <th scope='col' className='px-5 py-3 font-semibold'>
              Märkus
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((route) => (
            <tr key={route.band} className='border-b border-border last:border-0 odd:bg-canvas'>
              <td className='px-5 py-3 text-text-primary font-medium align-top'>
                <TechText text={route.band} />
              </td>
              <td className='px-5 py-3 text-text-secondary leading-relaxed align-top'>
                <TechText text={route.route} />
              </td>
              <td className='px-5 py-3 text-text-secondary text-xs leading-relaxed align-top'>
                {route.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

const PRICE_BENCHMARKS: {
  label: string;
  median: string;
  mean: string;
  note: string;
  anchor?: boolean;
}[] = [
  {
    label: 'Kõik lepingud',
    median: '67 000 €',
    mean: '401 000 €',
    note: 'n≈4 000 lepinguteadet',
  },
  { label: 'Tarkvara (CPV 48*)', median: '68 000 €', mean: '246 000 €', note: 'n=134' },
  { label: 'IT-teenused (CPV 72*)', median: '121 000 €', mean: '349 000 €', note: 'n=181' },
  {
    label: 'Haridus- ja koolitusteenused (CPV 80*)',
    median: '46 000 €',
    mean: '98 000 €',
    note: 'n=105',
  },
  {
    label: 'Tarkvarapaketid (CPV 48900000)',
    median: '59 000 €',
    mean: '279 000 €',
    note: 'n=70',
  },
  {
    label: 'Õpikeskkonna hinnaankur: Opiq koolipakett 2026/27',
    median: '5,10 €/õpilane/kuu',
    mean: '≈31–51 €/õpilane/aasta',
    note: 'Avalik hinnakiri (opiq.ee), mitte registristatistika. Soodushind 4,10 €/kuu (≥50% õpilastest, ≥9 kuud); algklassid 3,10 €/kuu. Aastas 10 arvelduskuud.',
    anchor: true,
  },
];

const CONTRACT_NORMS = [
  {
    title: 'Kestus',
    detail:
      'RHS ei piira tavalise hankelepingu kestust — lepinguvabadus. Tarkvaralitsentside lepingud on Eesti praktikas tavaliselt 12–36 kuud; raamlepingud üldjuhul kuni 4 aastat (RHS § 29 lg 2; direktiiv 2014/24/EL art 33), pikem tähtaeg vajab põhjendust.',
  },
  {
    title: 'Maksetähtaeg',
    detail:
      'Tavaliselt kuni 30 kalendripäeva (hilinenud maksete direktiiv 2011/7/EL); kuni 60 päeva vaid erandina, kui see on sõnaselgelt kokku lepitud ja objektiivselt põhjendatud.',
  },
  {
    title: 'Intellektuaalomand',
    detail:
      'Alates 01.11.2026 võib hankija IP-korra määrata alusdokumentides (uus RHS § 77 lg 6²). MATx-i puhul jääb platvormi ja õppevara intellektuaalomand MATx-ile, kool saab kasutuslitsentsi.',
  },
  {
    title: 'Garantii ja leppetrahv',
    detail:
      'Õiguskaitsevahendid — leppetrahv, hinna alandamine ja kahju hüvitamine VÕS-i ja lepingutingimuste alusel; hankelepingu ülesütlemine ja taganemine RHS § 124 alusel. Määrad on lepinguvabadus ja määratakse hanke alusdokumentides.',
  },
  {
    title: 'Lepingu lõpp',
    detail:
      'Andmete eksport ja kustutamine lepingu lõppedes — vt „Andmete säilitamine ja kustutamine“ turvameetmete all.',
  },
];

const TENDER_TECH_REQUIREMENTS = [
  {
    title: 'Juurdepääsetavus',
    detail:
      'EN 301 549 / WCAG 2.1 AA — avaliku sektori veebidele ja rakendustele kohustuslik alates 2019 (direktiiv 2016/2102, üle võetud avaliku teabe seadusesse; järelevalve TTJA). Ka lepingu alusel avalikke ülesandeid täitvad eraõiguslikud teenuseosutajad peavad vastama. MATx-i enda siht on sama tase; juurdepääsetavuse seisukoht ja auditi kuupäev avaldatakse koos hankepaketiga.',
  },
  {
    title: 'Andmekaitse',
    detail:
      'GDPR art 8 (nõusolek alates 13. eluaastast, kui õiguslikuks aluseks on nõusolek infoühiskonna teenuse puhul, mida pakutakse otse lapsele) ja IKS; vastutava, volitatud ja kaasvastutava töötleja rollid hinnatakse töötlustegevuse kaupa ja dokumenteeritakse andmetöötluslepingus. Andmete asukohariik avaldatakse enne pilootlepinguid.',
  },
  {
    title: 'Identiteet ja integratsioonid',
    detail: 'HarID/TAAT OIDC ja EHIS — staatused integratsioonide tabelis.',
  },
  {
    title: 'AI-komponent',
    detail:
      'Kohanduv õpimootor (BKT) — EU AI Act 2024/1689 III lisa punkt 3 hõlmab kindlaksmääratud hariduslikke kasutusjuhte; Art 6(3) erand võib välistada kõrge riski klassi, kui süsteem ei kujuta olulist riski, otsuseid oluliselt ei mõjutata ja vähemalt üks punktides a–d toodud tingimus on täidetud; profileerimise korral erand ei kohaldu; enesehindamine pooleli, õpetaja kontroll säilib — staatus vastavuse tabelis.',
  },
  {
    title: 'Turve',
    detail:
      'E-ITS baastase, NIS2 hea tava, turvapäised (CSP/HSTS), pseudonüümimine — staatused turvameetmete tabelis.',
  },
];

// Hankeinfo allikad — üks allikas rea kohta; sama andmeallikas, mida kasutab
// nii lehe allikaloend kui ka Markdowni eksport.
const HANKE_SOURCES: { title: string; detail: string }[] = [
  {
    title: 'Piirmäärad ja menetlused',
    detail:
      'Riigihangete seadus § 14–15, § 23 ja § 28 (RT I, 01.07.2017, 1) ja riigihangete seaduse ja teiste seaduste muutmise seadus (RT I, 03.07.2026, 3; jõustub 01.11.2026); EL piirmäärad 2026–2027: komisjoni delegeeritud määrus (EL) 2025/2152.',
  },
  {
    title: 'Hinnaklassid',
    detail:
      'Riigihangete registri avaandmed (lepinguteated, 2026. a veebruar–juuli; mediaanid ja keskmised arvutatud maksumusega teadetest). Ühe kooli alla 30 000 € ostud ei kajastu registris.',
  },
  {
    title: 'Õpikeskkonna hinnaankur',
    detail:
      'Opiq koolipakett 2026/27 (opiq.ee); soodushind alates 50% õpilastest vähemalt 9 kuuks.',
  },
  {
    title: 'Menetluse kestused ja pakkujate arv',
    detail:
      'Rahandusministeeriumi riigihangete valdkonna statistika ja kokkuvõte 2025, tabel 1 „Menetluse aeg“ (fin.ee).',
  },
  {
    title: 'Juurdepääsetavus ja maksetähtaeg',
    detail:
      'Direktiiv (EL) 2016/2102, EN 301 549 V3.2.1; järelevalve TTJA (ttja.ee). Maksetähtaeg: direktiiv 2011/7/EL.',
  },
];

// Architecture facts that are true today (verified against the repo).
// as const + satisfies: the array stays checked against StatusRow, while
// the literal ids feed the ArchId union so AT_A_GLANCE_IDS and the diagram
// below cannot reference a row id that doesn't exist.
const ARCHITECTURE_ROWS = [
  {
    id: 'esikiht',
    title: 'Esikiht',
    detail: 'React 18, TypeScript, Tailwind; landing-leht Next.js, platvormi klient Vite.',
    status: 'Saadaval',
  },
  {
    id: 'tagakiht',
    title: 'Tagakiht',
    detail: 'Express, TypeScript, Drizzle ORM',
    status: 'Saadaval',
  },
  {
    id: 'andmebaas',
    title: 'Andmebaas',
    detail: 'PostgreSQL (relatsiooniline), Redis (järjekorrad; limiidid).',
    status: 'Saadaval',
  },
  {
    id: 'oppimootor',
    title: 'Kohanduv õpimootor',
    detail: 'BKT valdamismudel, reeglipõhine ja selgitatav — soovitus, mitte diagnoos',
    status: 'Piloodis',
  },
  {
    id: 'koodigraaf',
    title: 'Koodigraaf',
    detail: 'ts-morph indekseerija, SQLite, BullMQ, Docker-sandbox',
    status: 'Piloodis',
  },
  {
    id: 'paigaldus',
    title: 'Paigaldus',
    detail: 'Docker Compose + Caddy (isemajutatud, HTTPS); hallatud pilv on avatud otsus',
    status: 'Piloodis',
  },
  {
    id: 'andmete-asukoht',
    title: 'Andmete asukoht',
    detail: 'Isemajutatud paigaldus; andmete asukohariik avalikustatakse enne pilootlepinguid.',
    status: 'Kavandatud',
  },
] as const satisfies readonly (StatusRow & { id: string })[];

type ArchId = (typeof ARCHITECTURE_ROWS)[number]['id'];
type ArchRow = (typeof ARCHITECTURE_ROWS)[number];

const ALL_ROWS = [
  ...ARCHITECTURE_ROWS,
  ...SECURITY_CONTROLS,
  ...COMPLIANCE_ROWS,
  ...INTEGRATION_ROWS,
];

const STATUS_COUNTS = LEGEND.map(({ status }) => ({
  status,
  count: ALL_ROWS.filter((row) => row.status === status).length,
}));

// Glossary — terms used on this page, expanded once for non-security readers.
const GLOSSARY: { term: string; definition: string }[] = [
  {
    term: 'BKT',
    definition:
      'MATx-i kohanduv õpimootor: reeglipõhine valdamismudel, mis annab soovituse, mitte diagnoosi (platvormisisene lühend).',
  },
  {
    term: 'EATF',
    definition:
      'Eesti Ajatempliteenus — aja- ja allkirjatemplid tõenditele ning BKT hetktõmmistele.',
  },
  {
    term: 'DSR',
    definition:
      'Data Subject Request — GDPR-i andmesubjekti taotlus (juurdepääs, parandus, kustutamine, kaasaskantavus).',
  },
  {
    term: 'PITR',
    definition: 'Point-in-Time Recovery — andmebaasi taastamine suvalisse ajahetke.',
  },
  {
    term: 'RPO',
    definition: 'Recovery Point Objective — maksimaalne aktsepteeritav andmekadu (siht ≤ 24 h).',
  },
  {
    term: 'RTO',
    definition: 'Recovery Time Objective — maksimaalne aktsepteeritav taasteaeg (siht ≤ 4 h).',
  },
  {
    term: 'SBOM',
    definition: 'Software Bill of Materials — tarkvara koostisosade (sh teekide) nimekiri.',
  },
  { term: 'SIEM', definition: 'Turbeinfo- ja sündmushaldus — logide koondamine ja analüüs.' },
  {
    term: 'HMAC',
    definition: 'Võtmealuseline räsi — pseudonüümimislüüs isikustatud ID-de maskeerimiseks.',
  },
  {
    term: 'OIDC',
    definition:
      'OpenID Connect — identiteediföderatsiooni protokoll (sisselogimine kooli id-teenuse kaudu).',
  },
  { term: 'PKCE', definition: 'Proof Key for Code Exchange — OIDC-voo kaitse koodi vahetamisel.' },
  { term: 'HarID', definition: 'Eesti haridusvaldkonna identiteediteenus.' },
  { term: 'IKS', definition: 'Isikuandmete kaitse seadus.' },
  { term: 'PGS', definition: 'Põhikooli- ja gümnaasiumiseadus.' },
  { term: 'AKI', definition: 'Andmekaitse Inspektsioon — Eesti andmekaitse järelevalveasutus.' },
  {
    term: 'ML-DSA-65',
    definition:
      'NIST-i postkvantum-allkirjaalgoritm (turvakategooria 3) — tulevakindlad allkirjad.',
  },
  {
    term: 'seccomp',
    definition: 'Linuxi tuumamehhanism, mis piirab sandbox-protsesside süsteemikutseid.',
  },
  { term: 'PgStore', definition: 'PostgreSQL-põhine sessioonihoidla.' },
];

const GITHUB_URL = 'https://github.com/matx-ee';

// Subset of architecture rows promoted to the "At a glance" metric grid in
// the summary. Same data source as the full list — no duplication. Typed
// against ArchId so a renamed row id is a compile error, not a silently
// missing card.
const AT_A_GLANCE_IDS: readonly ArchId[] = [
  'esikiht',
  'tagakiht',
  'andmebaas',
  'oppimootor',
  'paigaldus',
  'andmete-asukoht',
];

/**
 * Renders the layered system architecture with deployment and side components.
 *
 * Omits architecture entries that are not defined in the source data.
 */
function ArchitectureDiagram() {
  const layerIds: readonly ArchId[] = ['esikiht', 'tagakiht', 'andmebaas'];
  const sideIds: readonly ArchId[] = ['oppimootor', 'koodigraaf'];

  const layers = layerIds
    .map((id) => ARCHITECTURE_ROWS.find((row) => row.id === id))
    .filter((row): row is ArchRow => row !== undefined);
  const sides = sideIds
    .map((id) => ARCHITECTURE_ROWS.find((row) => row.id === id))
    .filter((row): row is ArchRow => row !== undefined);
  const deploy = ARCHITECTURE_ROWS.find((row) => row.id === 'paigaldus');

  return (
    <div className='rounded-xl border border-border bg-elevated p-6'>
      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]'>
        <div>
          {layers.map((row, index) => (
            <div key={row.title}>
              <div className='rounded-lg border border-border bg-surface p-4 shadow-card'>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <h3 className='text-sm font-semibold text-text-primary'>{row.title}</h3>
                    <p className='text-xs text-text-secondary mt-0.5 leading-relaxed'>
                      <TechText text={row.detail} />
                    </p>
                  </div>
                  <CapabilityStatusBadge status={row.status} />
                </div>
              </div>
              {index < layers.length - 1 && (
                <div className='flex justify-center py-1.5' aria-hidden='true'>
                  <ChevronDown className='w-4 h-4 text-borderStrong' />
                </div>
              )}
            </div>
          ))}
          {deploy && (
            <div className='rounded-lg border border-dashed border-border bg-surface p-4 mt-1.5'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <h3 className='text-sm font-semibold text-text-primary'>{deploy.title}</h3>
                  <p className='text-xs text-text-secondary mt-0.5 leading-relaxed'>
                    <TechText text={deploy.detail} />
                  </p>
                </div>
                <CapabilityStatusBadge status={deploy.status} />
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className='text-xs font-medium text-text-secondary uppercase tracking-wide mb-2'>
            Külgkomponendid
          </h3>
          <ul className='space-y-3'>
            {sides.map((row) => (
              <li
                key={row.title}
                className='rounded-lg border border-border bg-surface p-4 shadow-card'
              >
                <div className='flex items-center justify-between gap-2 mb-1'>
                  <h4 className='text-sm font-semibold text-text-primary'>{row.title}</h4>
                  <CapabilityStatusBadge status={row.status} />
                </div>
                <p className='text-xs text-text-secondary leading-relaxed'>
                  <TechText text={row.detail} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders the MATx technical overview, including its architecture, security, compliance, integrations, procurement information, and contact details.
 */
export default function TechnicalOverviewPage() {
  return (
    <main id='main' className='min-h-screen bg-canvas'>
      <div className='container mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24 max-w-6xl'>
        <div className='xl:grid xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-12'>
          {/* Content column — must be a single grid child, otherwise CSS grid
            auto-placement spreads each section across both columns and the
            sticky rail loses its column (seen: header squeezed into the
            260px rail at xl widths). */}
          <div className='min-w-0'>
            {/* Breadcrumb */}
            <nav aria-label='Leivajälg' className='mb-8'>
              <Link
                href='/'
                className='text-sm text-text-secondary hover:text-primary transition-colors'
              >
                ← Tagasi avalehele
              </Link>
            </nav>

            {/* Header */}
            <header className='mb-12'>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4'>
                Tehniline ülevaade
              </h1>
              <p className='text-lg text-text-secondary leading-relaxed'>
                MATx-i arhitektuur, turvameetmed ja vastavusstaatus IT- ja hanketiimidele. Kõik
                väited on märgistatud staatusega ja allikapõhised — mitte lubadused. Väited
                põhinevad platvormi avalikul lähtekoodil, mis on kontrollitav repositooriumis.
                Ajakohastatud: {LAST_UPDATED}.
              </p>
              <div className='flex flex-wrap items-center gap-3 mt-6'>
                <a
                  href={GITHUB_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:border-borderStrong hover:shadow-card-hover transition-all focus-ring-target'
                >
                  <GitBranch className='w-4 h-4 text-text-secondary' aria-hidden='true' />
                  github.com/matx-ee
                </a>
                <CopyButton
                  value={GITHUB_URL}
                  label='Kopeeri lingi aadress'
                  className='inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:border-borderStrong hover:text-text-primary transition-colors focus-ring-target'
                >
                  Kopeeri link
                </CopyButton>
                <ExportMarkdown
                  lastUpdated={LAST_UPDATED}
                  githubUrl={GITHUB_URL}
                  sections={[
                    { heading: 'Arhitektuur', rows: ARCHITECTURE_ROWS },
                    { heading: 'Turvameetmed', rows: SECURITY_CONTROLS },
                    { heading: 'Vastavus', rows: COMPLIANCE_ROWS },
                    { heading: 'Integratsioonid', rows: INTEGRATION_ROWS },
                    {
                      heading: 'Ostuteed ja piirmäärad (kuni 31.10.2026)',
                      rows: PROCUREMENT_ROUTES.map((r) => ({
                        title: r.band,
                        detail: r.route,
                        note: r.note,
                      })),
                    },
                    {
                      heading: 'Ostuteed ja piirmäärad (alates 01.11.2026)',
                      rows: [
                        ...PROCUREMENT_ROUTES_NEW.map((r) => ({
                          title: r.band,
                          detail: r.route,
                          note: r.note,
                        })),
                        {
                          title: 'Piirmäärast allapoole jäämise vältimine',
                          detail: PROCUREMENT_SPLIT_RULE,
                        },
                      ],
                    },
                    {
                      heading: 'Hinnaklassid',
                      rows: PRICE_BENCHMARKS.map((r) => ({
                        title: r.label,
                        detail: r.anchor
                          ? `Hind: ${r.median} · Aastahind: ${r.mean}`
                          : `Mediaan: ${r.median} · Keskmine: ${r.mean}`,
                        note: r.note,
                      })),
                    },
                    { heading: 'Lepingupraktika', rows: CONTRACT_NORMS },
                    { heading: 'Tehnilised nõuded', rows: TENDER_TECH_REQUIREMENTS },
                    { heading: 'Hankeinfo allikad', rows: HANKE_SOURCES },
                  ]}
                  glossary={GLOSSARY}
                />
              </div>
            </header>

            {/* Table of contents — sticky chip row on mobile/tablet; desktop uses
            the sticky rail. Stays put while the evaluator scrolls. */}
            <nav
              aria-label='Sisukord'
              className='xl:hidden sticky top-0 z-40 -mx-4 px-4 py-3 mb-12 bg-canvas/90 backdrop-blur-sm'
            >
              <h2 className='text-sm font-semibold text-text-primary mb-2'>Sellel lehel</h2>
              <ul className='flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                {SECTIONS.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className='inline-flex items-center whitespace-nowrap rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary hover:text-primary hover:border-borderStrong transition-colors focus-ring-target'
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Executive summary — the 10-second answer for an evaluator */}
            <section
              id='kokkuvõte'
              aria-labelledby='kokkuvõte-heading'
              className='scroll-mt-24 mb-12'
            >
              <h2 id='kokkuvõte-heading' className='text-2xl font-semibold text-text-primary mb-4'>
                Kokkuvõte
              </h2>
              <div className='rounded-xl border border-border bg-elevated p-6 shadow-card'>
                {/* KPI band — the trust signal an evaluator needs in the first
                ten seconds: how much is live vs target-state today. */}
                <h3 className='text-sm font-semibold text-text-primary mb-3'>
                  Staatus ühel pilgul
                </h3>
                <dl className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8'>
                  {STATUS_COUNTS.map(({ status, count }) => {
                    const meaning = LEGEND.find((item) => item.status === status)?.meaning ?? '';
                    return (
                      <div key={status} className='rounded-lg border border-border bg-surface p-4'>
                        <dt className='flex items-center justify-between gap-2'>
                          <CapabilityStatusBadge status={status} />
                        </dt>
                        <dd
                          className={`mt-3 text-3xl font-bold tabular-nums ${STATUS_ACCENT[status]}`}
                        >
                          {count}
                        </dd>
                        <dd className='text-xs text-text-secondary mt-1'>{meaning}</dd>
                      </div>
                    );
                  })}
                </dl>

                {/* Ratio bar — same STATUS_COUNTS data, drawn instead of
                described; the count tiles above stay the semantic source. */}
                <div
                  role='img'
                  aria-label={`Kokku ${ALL_ROWS.length} meedet: ${STATUS_COUNTS.map(({ status, count }) => `${status} ${count}`).join(', ')}`}
                  className='flex h-2.5 w-full overflow-hidden rounded-full border border-border mb-8'
                >
                  {STATUS_COUNTS.map(({ status, count }) => (
                    <span
                      key={status}
                      aria-hidden='true'
                      className={STATUS_BAR_FILL[status]}
                      style={{ width: `${(count / ALL_ROWS.length) * 100}%` }}
                    />
                  ))}
                </div>

                <ul className='space-y-3 text-sm text-text-secondary leading-relaxed'>
                  <li>
                    <strong className='text-text-primary'>Mis see on.</strong> Adaptiivne
                    matemaatikaõpikeskkond Eesti põhikoolile. Kohanduv õpimootor (BKT) annab
                    õpetajale kontrollitava soovituse — otsus jääb õpetajale.
                  </li>
                  <li>
                    <strong className='text-text-primary'>Faas.</strong> Piloot. Täna on kasutusel
                    esikiht, tagakiht ja andmebaas; suurem osa turvameetmetest on sihtseisus, mitte
                    veel põhiharul.
                  </li>
                  <li>
                    <strong className='text-text-primary'>Kontrollitavus.</strong> Lähtekood on
                    avalik{' '}
                    <a
                      href={GITHUB_URL}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary hover:text-secondary underline transition-colors'
                    >
                      GitHubis
                    </a>
                    ; iga väite juures on märge selle hetkeseisu kohta.
                  </li>
                </ul>

                {/* At a glance — key facts as scannable metrics, same data as the full list */}
                <h3 className='text-sm font-semibold text-text-primary mt-6 mb-3'>Ühe pilguga</h3>
                <dl className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                  {ARCHITECTURE_ROWS.filter((row) => AT_A_GLANCE_IDS.includes(row.id)).map(
                    (row) => (
                      <div
                        key={row.title}
                        className='rounded-lg border border-border bg-surface p-4'
                      >
                        <div className='flex items-start justify-between gap-2 mb-1.5'>
                          <dt className='text-sm font-semibold text-text-primary min-w-0'>
                            {row.title}
                          </dt>
                          <CapabilityStatusBadge status={row.status} />
                        </div>
                        <dd className='text-xs text-text-secondary leading-relaxed'>
                          <TechText text={row.detail} />
                        </dd>
                      </div>
                    ),
                  )}
                </dl>
              </div>
            </section>

            {/* Status legend */}
            <section aria-label='Staatuste legend' className='mb-12'>
              <h2 className='text-xl font-semibold text-text-primary mb-4'>Staatuste tähendus</h2>
              <ul className='space-y-2'>
                {LEGEND.map((item) => (
                  <li key={item.status} className='flex items-center gap-3'>
                    <CapabilityStatusBadge status={item.status} />
                    <span className='text-sm text-text-secondary'>{item.meaning}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Honesty note */}
            <section aria-label='Sihtseisu märkus' className='mb-12'>
              <div className='rounded-xl border border-border bg-elevated p-6'>
                <h2 className='text-lg font-semibold text-text-primary mb-2'>
                  Sihtseis, mitte hetkeseis
                </h2>
                <p className='text-sm text-text-secondary leading-relaxed'>
                  MATx on pilootfaasis. Osa allpool kirjeldatud turvameetmetest on veel
                  väljatöötamisel ja testimisel. „Kavandatud&ldquo; tähendab sihtseisu, mitte
                  lubadust, et meede on täna kasutuses. Piloodi laiendamine saab toimuda alles
                  pärast kohalduvate kavandatud meetmete kasutuselevõttu — sihtseisu tingimus, mitte
                  lubadust, et kõik meetmed valmivad.
                </p>
              </div>
            </section>

            {/* Architecture */}
            <section aria-labelledby='arhitektuur-heading' className='mb-12'>
              <SectionHeading
                id='arhitektuur'
                title='Arhitektuur'
                lead='Kihiline paigaldus, mis on täna kasutusel. Selgitatav õpimootor — soovitus, mitte musta kasti hinnang.'
              />
              <ArchitectureDiagram />
            </section>

            {/* Security controls */}
            <section aria-labelledby='turvameetmed-heading' className='mb-12'>
              <SectionHeading
                id='turvameetmed'
                title='Turvameetmed'
                lead='Täna kasutusel olevad meetmed on üleval täiskaaluga; sihtseisu meetmed on kokkuvolditud. Staatused kajastavad tegelikku paigaldust, mitte lubadust.'
              />
              <StatusFilterSection
                rows={SECURITY_CONTROLS}
                plannedLabel='Kavandatud turvameetmed'
              />
            </section>

            {/* Compliance */}
            <section aria-labelledby='vastavus-heading' className='mb-12'>
              <SectionHeading
                id='vastavus'
                title='Vastavus'
                lead='NIS2 ja DORA ei ole haridussektorile kohalduvad nõuded — seda öeldakse välja, mitte ei väideta vastavust. GDPR kohaldub: rollid sõltuvad töötlustegevusest ja dokumenteeritakse andmetöötluslepingus.'
              />
              <StatusFilterSection
                rows={COMPLIANCE_ROWS}
                plannedLabel='Kavandatud vastavustegevused'
              />
            </section>

            {/* Integrations */}
            <section aria-labelledby='integratsioonid-heading' className='mb-12'>
              <SectionHeading
                id='integratsioonid'
                title='Integratsioonid'
                lead='Aktiivsed liidestused on üleval; kavandatud föderatsioonid on kokkuvolditud.'
              />
              <StatusFilterSection rows={INTEGRATION_ROWS} plannedLabel='Kavandatud liidestused' />
            </section>

            {/* Hankeinfo — reference data for procurement teams */}
            <section aria-labelledby='hanked-heading' className='mb-12'>
              <SectionHeading
                id='hanked'
                title='Hanked'
                lead='Taustinfo hanketiimidele: ostuteed ja piirmäärad, hinnaklassid ning lepingupraktika Eesti avalikus sektoris. MATx-i hankepakett ise on koostamisel — allolev on raamistik, mille alusel seda hinnata.'
              />

              <h3 className='text-lg font-semibold text-text-primary mb-3'>
                Ostuteed ja piirmäärad (asjad ja teenused, ilma käibemaksuta)
              </h3>
              {/* Two regimes, two tables — the subheadings carry the validity
              period so the band cells stay short and no row needs a date in
              its label. */}
              <div className='mb-4'>
                <h4 className='text-sm font-semibold text-text-primary mb-2'>
                  Kehtib kuni 31.10.2026
                </h4>
                <RouteTable
                  rows={PROCUREMENT_ROUTES}
                  ariaLabel='Ostuteed ja piirmäärad kuni 31.10.2026 — tabel, horisontaalselt keritav'
                />
              </div>
              <div className='mb-3'>
                <h4 className='text-sm font-semibold text-text-primary mb-2'>
                  Alates 01.11.2026 (muudetud RHS)
                </h4>
                <RouteTable
                  rows={PROCUREMENT_ROUTES_NEW}
                  ariaLabel='Ostuteed ja piirmäärad alates 01.11.2026 — tabel, horisontaalselt keritav'
                />
              </div>
              <p className='text-xs text-text-secondary leading-relaxed mb-8'>
                <span className='font-medium text-text-primary'>
                  Piirmäärast allapoole jäämise vältimine:
                </span>{' '}
                <TechText text={PROCUREMENT_SPLIT_RULE} />
              </p>

              <h3 className='text-lg font-semibold text-text-primary mb-3'>Hinnaklassid</h3>
              {/* Registry-coverage caveat up front: the table's small-n rows
              are the second caveat, this one shapes how the whole table is
              read. The same warning stays in the row notes so the Markdown
              export remains self-contained. */}
              <div className='rounded-lg border border-warning-border bg-warning-surface px-4 py-3 text-xs text-text-secondary leading-relaxed mb-4'>
                Riigihangete registri avaandmed kajastavad peamiselt üle piirmäära jäävaid oste —
                ühe kooli tarkvaralitsentside ostud jäävad tihti alla piirmäära ega kajastu
                registris, mistõttu täpset jaotust registriandmetest hinnata ei saa.
              </div>
              {/* Horizontal scroll on narrow viewports: the table keeps its
              column widths (min-w) and scrolls instead of crushing text —
              no column gets clipped by the card boundary. */}
              <section
                className='rounded-xl border border-border bg-card overflow-x-auto mb-8 shadow-card'
                aria-label='Hinnaklasside võrdlustabel — horisontaalselt keritav'
                // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must stay keyboard-reachable (WAI-ARIA scrollable-region pattern)
                tabIndex={0}
              >
                <table className='w-full min-w-[680px] text-sm'>
                  <thead>
                    <tr className='border-b border-border text-left text-text-primary'>
                      <th scope='col' className='px-5 py-3 font-semibold'>
                        Kategooria
                      </th>
                      <th scope='col' className='px-5 py-3 font-semibold text-right'>
                        Mediaan
                      </th>
                      <th scope='col' className='px-5 py-3 font-semibold text-right'>
                        Keskmine
                      </th>
                      <th scope='col' className='px-5 py-3 font-semibold'>
                        Märkus
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICE_BENCHMARKS.filter((row) => !row.anchor).map((row) => (
                      <tr
                        key={row.label}
                        className='border-b border-border last:border-0 odd:bg-canvas'
                      >
                        <td className='px-5 py-3 text-text-primary'>{row.label}</td>
                        <td className='px-5 py-3 text-text-secondary tabular-nums whitespace-nowrap text-right'>
                          {row.median}
                        </td>
                        <td className='px-5 py-3 text-text-secondary tabular-nums whitespace-nowrap text-right'>
                          {row.mean}
                        </td>
                        <td className='px-5 py-3 text-text-secondary text-xs leading-relaxed'>
                          {row.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              <p className='text-xs text-text-secondary leading-relaxed mb-8'>
                Väikese valimiga read (n&lt;150) on suunavad, mitte täpsed võrdlusarvud — kasuta
                neid suunana, mitte hinnakirjana.
              </p>
              {/* Unit-price anchor is not registry statistics — a median/mean
              column would mislead, so it renders as its own card below the
              table. */}
              {PRICE_BENCHMARKS.filter((row) => row.anchor).map((row) => (
                <div
                  key={row.label}
                  className='rounded-xl border border-border bg-card p-5 shadow-card mb-8'
                >
                  <h4 className='font-semibold text-text-primary'>{row.label}</h4>
                  <p className='text-sm text-text-secondary mt-1 leading-relaxed'>
                    Kuuhind: {row.median} · Aastahind: {row.mean}. {row.note}
                  </p>
                </div>
              ))}

              <h3 className='text-lg font-semibold text-text-primary mb-3'>Lepingupraktika</h3>
              <ul className='grid gap-3 md:grid-cols-2 mb-8'>
                {CONTRACT_NORMS.map((row) => (
                  <li
                    key={row.title}
                    className='rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow'
                  >
                    <h4 className='font-semibold text-text-primary'>{row.title}</h4>
                    <p className='text-sm text-text-secondary mt-1 leading-relaxed'>
                      <TechText text={row.detail} />
                    </p>
                  </li>
                ))}
              </ul>

              <h3 className='text-lg font-semibold text-text-primary mb-3'>Tehnilised nõuded</h3>
              <ul className='grid gap-3 md:grid-cols-2 mb-8'>
                {TENDER_TECH_REQUIREMENTS.map((row) => (
                  <li
                    key={row.title}
                    className='rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow'
                  >
                    <h4 className='font-semibold text-text-primary'>{row.title}</h4>
                    <p className='text-sm text-text-secondary mt-1 leading-relaxed'>
                      <TechText text={row.detail} />
                    </p>
                  </li>
                ))}
              </ul>

              <ul className='space-y-3 mb-8'>
                <StatusCard
                  title='Hankepakett (hinnakiri, lepingutingimused, tehniline kirjeldus)'
                  detail='Õpilasepõhine aastahind, lepingu üldtingimused ja tehniline kirjeldus koostatakse enne piloodi laiendamist. Seni arutame hankeprotsessi ja ajakava vestluse käigus — kontaktid lehe lõpus.'
                  status='Kavandatud'
                />
              </ul>

              <div className='rounded-xl border border-border bg-elevated p-6'>
                <p className='font-medium text-text-primary text-sm mb-4'>Hankeinfo allikad</p>
                {/* Structured definition list — one source per row, term + citation,
                instead of a paragraph wall. Same facts, scannable. */}
                <dl className='space-y-4 text-xs text-text-secondary leading-relaxed'>
                  {HANKE_SOURCES.map(({ title, detail }) => (
                    <div key={title}>
                      <dt className='font-medium text-text-primary'>{title}</dt>
                      <dd className='mt-0.5'>
                        <TechText text={detail} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            {/* Sources & verification */}
            <section aria-labelledby='allikad-heading' className='mb-12'>
              <SectionHeading
                id='allikad'
                title='Allikad ja kontroll'
                lead='Selle lehe väärtus on selles, et väiteid saab ise kontrollida.'
              />
              <div className='rounded-xl border border-border bg-elevated p-6 space-y-3 text-sm text-text-secondary leading-relaxed'>
                <p>
                  Väidete alus on MATx-i platvormi avalik lähtekood:{' '}
                  <a
                    href={GITHUB_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:text-secondary underline transition-colors'
                  >
                    github.com/matx-ee
                  </a>
                  . Iga kaardi juures on märge selle hetkeseisu kohta.
                </p>
                <p>
                  Osa meetmeid on arendatud ja testimisel eraldi turbearendusharus, mis ühendatakse
                  põhiharuga enne piloodi laiendamist. Kuni ühendamiseni on need meetmed märgitud
                  „Kavandatud&ldquo;.
                </p>
                <p className='text-xs'>
                  Leht ajakohastatud: {LAST_UPDATED}. Staatused muutuvad ühendamiste käigus;
                  kontrolli enne hankeekspertnäidisele tuginemist harude hetkeseisu.
                </p>
              </div>
            </section>

            {/* Glossary */}
            <section aria-labelledby='glossar-heading' className='mb-12'>
              <SectionHeading
                id='glossar'
                title='Glossar'
                lead='Lühendid ühes kohas lahti kirjutatud — mõeldud hanketiimidele, kelle jaoks osa termineid on uued.'
              />
              <details className='group rounded-xl border border-border bg-elevated'>
                <summary className='flex items-center justify-between gap-4 cursor-pointer px-5 py-4 text-sm font-medium text-text-primary hover:bg-surface transition-colors focus-ring-target rounded-xl list-none [&::-webkit-details-marker]:hidden'>
                  <span className='flex items-center gap-2.5'>
                    <ChevronDown
                      className='w-4 h-4 shrink-0 text-text-secondary transition-transform duration-200 group-open:rotate-180'
                      aria-hidden='true'
                    />
                    Terminid ({GLOSSARY.length})
                  </span>
                </summary>
                <dl className='px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3'>
                  {GLOSSARY.map(({ term, definition }) => (
                    <div key={term} className='border-t border-border pt-2'>
                      <dt className='text-sm font-semibold text-text-primary font-mono'>{term}</dt>
                      <dd className='text-sm text-text-secondary mt-0.5'>{definition}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </section>

            {/* Security & procurement contact */}
            <section id='kontakt' aria-labelledby='kontakt-heading' className='scroll-mt-24 mb-12'>
              <h2 id='kontakt-heading' className='text-2xl font-semibold text-text-primary mb-4'>
                Kontakt
              </h2>
              <div className='rounded-xl border border-border bg-elevated p-6 space-y-4 text-sm text-text-secondary leading-relaxed'>
                <p>
                  <strong className='text-text-primary'>Turvapuudus</strong> (vastutustundlik
                  avalikustamine):{' '}
                  <a
                    href='mailto:security@matx.ee'
                    className='text-primary hover:text-secondary underline transition-colors'
                  >
                    security@matx.ee
                  </a>{' '}
                  <CopyButton
                    value='security@matx.ee'
                    label='Kopeeri meiliaadress'
                    className='inline-flex items-center justify-center w-8 h-8 rounded-md border border-border text-text-secondary hover:text-text-primary hover:border-borderStrong transition-colors focus-ring-target align-middle'
                  />
                  . See on teadaanne, mitte tugikanal.
                </p>
                <p>
                  <strong className='text-text-primary'>Hanke- ja lepinguküsimused</strong>, sh
                  hankedokumendid ja andmetöötluslepingud:{' '}
                  <a
                    href='mailto:andri@matx.ee'
                    className='text-primary hover:text-secondary underline transition-colors'
                  >
                    andri@matx.ee
                  </a>{' '}
                  <CopyButton
                    value='andri@matx.ee'
                    label='Kopeeri meiliaadress'
                    className='inline-flex items-center justify-center w-8 h-8 rounded-md border border-border text-text-secondary hover:text-text-primary hover:border-borderStrong transition-colors focus-ring-target align-middle'
                  />{' '}
                  või{' '}
                  <Link
                    href='/#piloot'
                    className='text-primary hover:text-secondary underline transition-colors'
                  >
                    alustamise võimalused
                  </Link>
                  .
                </p>
              </div>
            </section>
          </div>

          {/* Sticky rail — desktop TOC with scroll-spy */}
          <TechnicalTOC items={SECTIONS} />
        </div>
      </div>
    </main>
  );
}

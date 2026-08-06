import type { Metadata } from 'next';
import Link from 'next/link';
import { CapabilityStatusBadge } from '@/components/ui/capability-status';
import type { CapabilityStatus } from '@/lib/content/landing-copy';

export const metadata: Metadata = {
  title: 'Tehniline ülevaade — MATx',
  description:
    'MATx-i arhitektuur, turvameetmed ja vastavusstaatus IT- ja hanketiimidele: identiteet ja sessioonid, pseudonüümimine, integratsioonid ja hankedokumendid.',
  openGraph: {
    title: 'Tehniline ülevaade — MATx',
    description:
      'MATx-i arhitektuur, turvameetmed ja vastavusstaatus IT- ja hanketiimidele.',
    url: 'https://matx.ee/tehniline',
  },
  alternates: {
    canonical: 'https://matx.ee/tehniline',
  },
};

// Status legend used across the page. Stated plainly, not as a promise.
const LEGEND = [
  { status: 'Saadaval' as const, meaning: 'on praegu kasutusel' },
  { status: 'Piloodis' as const, meaning: 'kasutusel valitud koolidega testimiseks' },
  { status: 'Kavandatud' as const, meaning: 'sihtseis — plaanis, pole veel kasutusele võetud' },
];

interface StatusRow {
  title: string;
  detail: string;
  note?: string;
  status: CapabilityStatus;
}

function StatusCard({ title, detail, note, status }: StatusRow) {
  return (
    <li className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary mt-1">{detail}</p>
          {note && <p className="text-xs text-text-secondary mt-2 italic">{note}</p>}
        </div>
        <CapabilityStatusBadge status={status} />
      </div>
    </li>
  );
}

// Target-state security controls. Statuses reflect TODAY's real deployment,
// not the end-state. Items locked to the compliance branch are marked
// Kavandatud until merged — see the note below the table.
const SECURITY_CONTROLS: StatusRow[] = [
  {
    title: 'Sessioonid PostgreSQL-is (PgStore)',
    detail: 'httpOnly, sameSite=strict, IP+UA sõrmejälg, CSRF double-submit konstantaegse võrdlusega.',
    status: 'Kavandatud',
    note: 'Olemas release/matx-compliance-rc-2026-06-22 harul; põhiharul hetkel demosessioonid.',
  },
  {
    title: 'Sessiooni absoluutne eluiga rollide kaupa',
    detail: 'Õpilane 8h, õpetaja/admin 12h + idle timeout; sõrmejälje lahknevus lõpetab sessiooni.',
    status: 'Kavandatud',
    note: 'Õpilase 8h piir on compliance-harul; õpetaja/admini piir on mõlemal harul puudu.',
  },
  {
    title: 'Rollipõhine juurdepääs (requireRole)',
    detail: 'Rollid: õpilane, õpetaja, admin, DPO. Iga lõpp-punkt kontrollib rolli.',
    status: 'Kavandatud',
    note: 'Rollimudel ja DPO/DSR teekonnad on compliance-harul; põhiharul puuduvad.',
  },
  {
    title: 'Pseudonüümimine (HMAC-lüüs)',
    detail: 'Õpilase isikustatud ID-d pseudonüümitakse käitumistabelites; DSR puhul de-pseudonüümimine.',
    status: 'Kavandatud',
    note: 'identityGateway on compliance-harul; põhiharul puudub.',
  },
  {
    title: 'Egress-lüüs kogu väljuvale liiklusele',
    detail: 'Üks väljuv kontrollpunkt (AI, OCR, analüütika, veebihaagid), deny-by-default, DNS-rebindingi kaitse.',
    status: 'Kavandatud',
    note: 'Katab praegu vaid AI/OCR teekondi (compliance-haru); laiendamine kogu väljuvale liiklusele on kavandatud.',
  },
  {
    title: 'Per-endpoint rate limiting (Redis)',
    detail: 'Sisselogimine, AI lõpp-punktid, DSR ekspordid, /api/graph — piirid Redis-poes.',
    status: 'Kavandatud',
    note: 'Üldine limiiter on compliance-harul; põhiharul kommenteeritud välja.',
  },
  {
    title: 'MFA õpetajale/adminile (Smart-ID/Mobiil-ID)',
    detail: 'Privilegeeritud rollidele mitmikautentimine Eesti ID-vahenditega.',
    status: 'Kavandatud',
    note: 'Pole kummalgi harul veel kasutusele võetud.',
  },
  {
    title: 'HarID/TAAT OIDC + PKCE',
    detail: 'Koolide identiteediföderatsioon; joiner/mover/leaver elutsükli käsitlus.',
    status: 'Kavandatud',
    note: 'Pole veel kasutusele võetud.',
  },
  {
    title: 'Tarneahela turve',
    detail: 'pnpm audit + Dependabot CI-lüüsid, SBOM, submodule kinnitatud releasile, avalikustamispoliitika.',
    status: 'Kavandatud',
    note: 'SIEM-i ja tarneahela lüüsid on kavandatud; matx-hack submodule on hetkel funktsiooniharul.',
  },
  {
    title: 'Post-kvantum allkirjad (ML-DSA-65)',
    detail: 'EATF-i tõendite ja BKT hetktõmmiste allkirjastamine.',
    status: 'Piloodis',
    note: 'server/eatf.ts ja server/bktSnapshotSign.ts on põhiharul olemas.',
  },
  {
    title: 'Sandbox-isolatsioon',
    detail: 'Mitte-root kasutaja, seccomp, no-new-privileges, pids-limit, image digesti kinnitus.',
    status: 'Kavandatud',
    note: 'Praegune sandbox töötab root kasutajana ilma seccomp/pids-piiranguteta.',
  },
  {
    title: 'Varukoopiad ja taaste',
    detail: 'PostgreSQL PITR + krüpteeritud väljaspoole varukoopiad, RPO ≤ 24h / RTO ≤ 4h, kvartaalne taastetest.',
    status: 'Kavandatud',
    note: 'Varukoopia- ja taasteprogramm on kavandatud, pole veel paigas.',
  },
  {
    title: 'Logid ja SIEM',
    detail: 'Logid ainult metaandmetega (mitte vastuste kehad), SIEM-sissekanne, 72h intsidentide tähtaeg.',
    status: 'Kavandatud',
    note: 'Põhiharu logib hetkel API vastuste kehad — see on teadaolev puudus, parandus kavandatud.',
  },
  {
    title: 'Helmet, CSP, HSTS',
    detail: 'Turvapäised, sisu turvapoliitika, HSTS preload.',
    status: 'Kavandatud',
    note: 'Põhiharul kommenteeritud välja; taastamine kavandatud.',
  },
];

// Compliance status per regime. Honest scope: NIS2/DORA are NOT in legal
// scope for education — stated as such, not claimed.
const COMPLIANCE_ROWS: StatusRow[] = [
  {
    title: 'GDPR (2016/679)',
    detail: 'Kohaldub. Vastutav töötleja on kool/omavalitsus, volitatud töötleja MATx. Art. 8 alaealiste erikaitse (vanusepiir 13+, vanema nõusolek).',
    status: 'Kavandatud',
    note: 'Alaealiste andmete kaitse on pilootfaasi põhirõhk; täismahus vastavus sihtseisus.',
  },
  {
    title: 'EU AI Act (2024/1689)',
    detail: 'Kohanduv õpimootor (BKT) on hinnatud Annex III §3 haridusvaldkonna riskiklassi; Art. 6(3)(c) enesehindamine on otsustamisel. Õpetaja inimese-kontroll säilib.',
    status: 'Piloodis',
    note: 'FRIA ja gate-scope otsused on compliance-harul; allkirjastamine ja Art. 49 registreerimine on kavandatud.',
  },
  {
    title: 'NIS2 (2022/2555)',
    detail: 'Haridus ei kuulu lisadesse I/II — otsene kohustus ei laiene. Meetmed on võetud aluseks hea tavana.',
    status: 'Piloodis',
    note: 'Siht on NIS2-põhine baastase, mitte formaalne vastavus.',
  },
  {
    title: 'DORA (2022/2554)',
    detail: 'Finantssektori määrus — MATx-ile ei kohaldu. Distsipliin (varukoopiad, BCM) on laenatud hea tavana.',
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
    detail: 'IKS digitaalne nõusolek alates 13. eluaastast, isikuandmete kaitse seadus, AKI koolide juhendmaterjalid.',
    status: 'Piloodis',
    note: 'Nõusoleku- ja vanusepiiri loogika on compliance-harul; põhiharul puudub.',
  },
];

// Integration status. Integrations are future-state — no overclaiming.
const INTEGRATION_ROWS: StatusRow[] = [
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
  {
    title: 'Käsikirja OCR',
    detail: 'Käsikirja tuvastus egress-lüüsi taga; EL/Eesti pakkuja kaalumisel.',
    status: 'Piloodis',
  },
  {
    title: 'Kolmandad osapooled',
    detail: 'Jälgijaid pole. Ainus väline teenus on demobroneering (Calendly).',
    status: 'Saadaval',
  },
];

// Architecture facts that are true today (verified against the repo).
const ARCHITECTURE_ROWS: StatusRow[] = [
  { title: 'Esikiht', detail: 'React 18, TypeScript, Vite, Tailwind', status: 'Saadaval' },
  { title: 'Tagakiht', detail: 'Express, TypeScript, Drizzle ORM', status: 'Saadaval' },
  { title: 'Andmebaas', detail: 'PostgreSQL (relatsiooniline), Redis (järjekorrad ja limiidid)', status: 'Saadaval' },
  { title: 'Kohanduv õpimootor', detail: 'BKT valdamismudel, reeglipõhine ja selgitatav — soovitus, mitte diagnoos', status: 'Piloodis' },
  { title: 'Koodigraaf', detail: 'ts-morph indekseerija, SQLite, BullMQ, Docker-sandbox', status: 'Piloodis' },
  { title: 'Paigaldus', detail: 'Docker Compose + Caddy (isemajutatud); hallatud pilv on avatud otsus', status: 'Piloodis' },
];

export default function TechnicalOverviewPage() {
  return (
    <main id="main" className="min-h-screen bg-canvas">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24 max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Leivajälg" className="mb-8">
          <Link href="/" className="text-sm text-text-secondary hover:text-primary transition-colors">
            ← Tagasi avalehele
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Tehniline ülevaade
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            MATx-i arhitektuur, turvameetmed ja vastavusstaatus IT- ja hanketiimidele.
            Kõik väited on märgistatud staatusega ja allikapõhised — mitte lubadused.
          </p>
        </header>

        {/* Status legend */}
        <section aria-labelledby="legend-heading" className="mb-12">
          <h2 id="legend-heading" className="text-xl font-semibold text-text-primary mb-4">
            Staatused
          </h2>
          <ul className="space-y-2">
            {LEGEND.map((item) => (
              <li key={item.status} className="flex items-center gap-3">
                <CapabilityStatusBadge status={item.status} />
                <span className="text-sm text-text-secondary">{item.meaning}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Honesty note */}
        <section aria-label="Sihtseisu märkus" className="mb-12">
          <div className="rounded-xl border border-border bg-elevated p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Sihtseis, mitte hetkeseis
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              MATx on pilootfaasis. Osa allpool kirjeldatud turvameetmetest on välja
              arendatud ja testimisel eraldi turbeharul, kuid pole veel põhiharule
              ühendatud. „Kavandatud&ldquo; tähendab sihtseisu, mitte lubadust, et
              meede on täna kasutuses. Turvameetmete ühendamine põhiharuga on
              prioriteet enne piloodi laiendamist.
            </p>
          </div>
        </section>

        {/* Architecture */}
        <section aria-labelledby="arhitektuur-heading" className="mb-12">
          <h2 id="arhitektuur-heading" className="text-2xl font-semibold text-text-primary mb-6">
            Arhitektuur
          </h2>
          <ul className="space-y-3">
            {ARCHITECTURE_ROWS.map((row) => (
              <StatusCard key={row.title} {...row} />
            ))}
          </ul>
        </section>

        {/* Security controls */}
        <section aria-labelledby="turve-heading" className="mb-12">
          <h2 id="turve-heading" className="text-2xl font-semibold text-text-primary mb-6">
            Turvameetmed
          </h2>
          <ul className="space-y-3">
            {SECURITY_CONTROLS.map((row) => (
              <StatusCard key={row.title} {...row} />
            ))}
          </ul>
        </section>

        {/* Compliance */}
        <section aria-labelledby="vastavus-heading" className="mb-12">
          <h2 id="vastavus-heading" className="text-2xl font-semibold text-text-primary mb-6">
            Vastavus
          </h2>
          <ul className="space-y-3">
            {COMPLIANCE_ROWS.map((row) => (
              <StatusCard key={row.title} {...row} />
            ))}
          </ul>
        </section>

        {/* Integrations */}
        <section aria-labelledby="integratsioonid-heading" className="mb-12">
          <h2 id="integratsioonid-heading" className="text-2xl font-semibold text-text-primary mb-6">
            Integratsioonid
          </h2>
          <ul className="space-y-3">
            {INTEGRATION_ROWS.map((row) => (
              <StatusCard key={row.title} {...row} />
            ))}
          </ul>
        </section>

        {/* Security contact */}
        <section aria-labelledby="kontakt-heading" className="mb-12">
          <h2 id="kontakt-heading" className="text-2xl font-semibold text-text-primary mb-4">
            Turvalisuse kontakt
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Turvapuudusest teada andmiseks (vastutustundlik avalikustamine) kirjuta
            aadressile{' '}
            <a
              href="mailto:security@matx.ee"
              className="text-primary hover:text-secondary underline transition-colors"
            >
              security@matx.ee
            </a>
            . See on teadaanne, mitte tugikanal.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Hanke- ja lepinguküsimuste korral vaata{' '}
            <Link href="/#piloot" className="text-primary hover:text-secondary underline transition-colors">
              alustamise võimalusi
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

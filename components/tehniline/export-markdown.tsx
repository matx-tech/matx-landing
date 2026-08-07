'use client';

/**
 * "Copy as Markdown" — single-click export of the page's claims as plain
 * markdown, for LLM/AI-procurement ingestion and offline review. Data is
 * serialized server-side from the same arrays that render the page, so the
 * export cannot drift from what is displayed.
 */

import { FileDown } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import type { StatusRow } from './status-card';

interface ExportSection {
  heading: string;
  rows: StatusRow[];
}

interface ProcurementRoute {
  band: string;
  route: string;
  note: string;
}

interface PriceBenchmark {
  label: string;
  median: string;
  mean: string;
  note: string;
}

interface ContractNorm {
  title: string;
  detail: string;
}

interface TenderTechRequirement {
  title: string;
  detail: string;
}

const STATUS_PREFIX: Record<string, string> = {
  Saadaval: '[Saadaval]',
  Piloodis: '[Piloodis]',
  Kavandatud: '[Kavandatud]',
};

function toMarkdown(
  lastUpdated: string,
  githubUrl: string,
  sections: ExportSection[],
  procurementRoutes?: ProcurementRoute[],
  priceBenchmarks?: PriceBenchmark[],
  contractNorms?: ContractNorm[],
  tenderTechRequirements?: TenderTechRequirement[],
  glossary?: { term: string; definition: string }[],
): string {
  const lines: string[] = [
    '# Tehniline ülevaade — MATx',
    '',
    `> Ajakohastatud: ${lastUpdated} · Väidete alus: ${githubUrl}`,
    '',
    'Staatuse märgendid: [Saadaval] = kasutusel, [Piloodis] = kasutusel valitud koolidega,',
    '[Kavandatud] = sihtseis, mitte lubadus.',
    '',
  ];

  for (const { heading, rows } of sections) {
    lines.push(`## ${heading}`, '');
    for (const row of rows) {
      const prefix = STATUS_PREFIX[row.status] ?? '';
      lines.push(`- ${prefix} **${row.title}** — ${row.detail}`);
      if (row.note) lines.push(`  - Märkus: ${row.note}`);
    }
    lines.push('');
  }

  if (procurementRoutes && procurementRoutes.length > 0) {
    lines.push('## Hankeinfo: Ostuteed ja piirmäärad', '');
    for (const route of procurementRoutes) {
      lines.push(`- **${route.band}**: ${route.route}`);
      lines.push(`  - ${route.note}`);
    }
    lines.push('');
  }

  if (priceBenchmarks && priceBenchmarks.length > 0) {
    lines.push('## Hankeinfo: Hinnaklassid', '');
    for (const benchmark of priceBenchmarks) {
      lines.push(`- **${benchmark.label}**: Mediaan ${benchmark.median}, Keskmine ${benchmark.mean}`);
      lines.push(`  - ${benchmark.note}`);
    }
    lines.push('');
  }

  if (contractNorms && contractNorms.length > 0) {
    lines.push('## Hankeinfo: Lepingupraktika', '');
    for (const norm of contractNorms) {
      lines.push(`- **${norm.title}**: ${norm.detail}`);
    }
    lines.push('');
  }

  if (tenderTechRequirements && tenderTechRequirements.length > 0) {
    lines.push('## Hankeinfo: Tehnilised nõuded', '');
    for (const req of tenderTechRequirements) {
      lines.push(`- **${req.title}**: ${req.detail}`);
    }
    lines.push('');
  }

  if (glossary && glossary.length > 0) {
    lines.push('## Glossar', '');
    for (const { term, definition } of glossary) {
      lines.push(`- **${term}**: ${definition}`);
    }
  }

  return lines.join('\n');
}

export function ExportMarkdown({
  lastUpdated,
  githubUrl,
  sections,
  procurementRoutes,
  priceBenchmarks,
  contractNorms,
  tenderTechRequirements,
  glossary,
}: {
  lastUpdated: string;
  githubUrl: string;
  sections: ExportSection[];
  procurementRoutes?: ProcurementRoute[];
  priceBenchmarks?: PriceBenchmark[];
  contractNorms?: ContractNorm[];
  tenderTechRequirements?: TenderTechRequirement[];
  glossary?: { term: string; definition: string }[];
}) {
  const markdown = toMarkdown(
    lastUpdated,
    githubUrl,
    sections,
    procurementRoutes,
    priceBenchmarks,
    contractNorms,
    tenderTechRequirements,
    glossary,
  );

  return (
    <CopyButton
      value={markdown}
      label="Kopeeri Markdown (LLM- ja auditeksport)"
      copiedLabel="Markdown kopeeritud!"
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:border-borderStrong hover:text-text-primary transition-colors focus-ring-target"
    >
      <FileDown className="w-4 h-4 shrink-0" aria-hidden="true" />
      Ekspordi Markdown
    </CopyButton>
  );
}

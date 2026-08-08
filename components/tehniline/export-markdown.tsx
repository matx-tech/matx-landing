'use client';

/**
 * "Copy as Markdown" — single-click export of the page's claims as plain
 * markdown, for LLM/AI-procurement ingestion and offline review. Data is
 * serialized server-side from the same arrays that render the page, so the
 * export cannot drift from what is displayed.
 */

import { FileDown } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';

interface ExportRow {
  title: string;
  detail: string;
  note?: string;
  status?: string;
}

interface ExportSection {
  heading: string;
  rows: ExportRow[];
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
      const prefix = STATUS_PREFIX[row.status ?? ''] ?? '';
      lines.push(`- ${prefix} **${row.title}** — ${row.detail}`);
      if (row.note) lines.push(`  - Märkus: ${row.note}`);
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
  glossary,
}: {
  lastUpdated: string;
  githubUrl: string;
  sections: ExportSection[];
  glossary?: { term: string; definition: string }[];
}) {
  const markdown = toMarkdown(lastUpdated, githubUrl, sections, glossary);

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

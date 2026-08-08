'use client';

/**
 * "Copy as Markdown" — single-click export of the page's claims as plain
 * markdown, for LLM/AI-procurement ingestion and offline review. Data is
 * serialized server-side from the same arrays that render the page, so the
 * export cannot drift from what is displayed.
 */

import { CopyButton } from '@/components/ui/copy-button';
import type { CapabilityStatus } from '@/lib/content/landing-copy';

interface ExportRow {
  title: string;
  detail: string;
  note?: string;
  status?: CapabilityStatus;
}

interface ExportSection {
  heading: string;
  rows: readonly ExportRow[];
}

// Keyed on the shared status union so a renamed status is a compile
// error, not a silently dropped badge in the export.
const STATUS_PREFIX: Record<CapabilityStatus, string> = {
  Saadaval: '[Saadaval]',
  Piloodis: '[Piloodis]',
  Kavandatud: '[Kavandatud]',
};

/**
 * Builds a Markdown technical overview from metadata, sections, and an optional glossary.
 *
 * @param lastUpdated - The date or text identifying when the overview was updated
 * @param githubUrl - The source URL for the overview's claims
 * @param sections - The headings and rows to include in the overview
 * @param glossary - Optional glossary terms and definitions
 * @returns The generated Markdown document
 */
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
      const prefix = row.status ? STATUS_PREFIX[row.status] : '';
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

/**
 * Provides a control for copying the supplied technical overview as Markdown.
 *
 * @param lastUpdated - The date shown in the exported document
 * @param githubUrl - The source repository URL shown in the exported document
 * @param sections - The overview sections and rows included in the export
 * @param glossary - Optional glossary entries included in the export
 * @returns A copy control containing the generated Markdown
 */
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
      label='Kopeeri Markdown (LLM- ja auditeksport)'
      copiedLabel='Markdown kopeeritud!'
      className='inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:border-borderStrong hover:text-text-primary transition-colors focus-ring-target'
    >
      Kopeeri Markdown
    </CopyButton>
  );
}

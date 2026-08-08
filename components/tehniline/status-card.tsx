/**
 * Shared status-card building blocks for the technical overview page.
 * Server-safe (no hooks) so the same components render in the server page,
 * the client-side status filter, and the Markdown export.
 */

import { CapabilityStatusBadge } from '@/components/ui/capability-status';
import type { CapabilityStatus } from '@/lib/content/landing-copy';

export interface StatusRow {
  title: string;
  detail: string;
  note?: string;
  status: CapabilityStatus;
}

/**
 * Wraps technical tokens (file paths, branch names, standards, emails) in
 * mono-spaced <code> so they read as code, not prose. Matches are split on
 * the token pattern; everything else passes through untouched.
 */
const TECH_SPLIT =
  /(server\/[\w./-]+\.ts\b|release\/[\w.-]+|ML-DSA-65|CPV \d+\*|RHS § \d+|[\w.-]+@[\w.-]+\.[a-z]{2,})/gi;
const TECH_MATCH =
  /^(?:server\/[\w./-]+\.ts\b|release\/[\w.-]+|ML-DSA-65|CPV \d+\*|RHS § \d+|[\w.-]+@[\w.-]+\.[a-z]{2,})$/i;

export function TechText({ text }: { text: string }) {
  return (
    <>
      {text.split(TECH_SPLIT).map((part, index) =>
        TECH_MATCH.test(part) ? (
          <code
            key={index}
            className="font-mono text-[0.85em] not-italic break-words"
          >
            {part}
          </code>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * Status row card. Renders an <li> root — must be used inside a <ul> or <ol>.
 */
export function StatusCard({ title, detail, note, status, showBadge = true }: StatusRow & { showBadge?: boolean }) {
  const muted = status === 'Kavandatud';
  return (
    <li
      className={`rounded-xl border p-5 transition-shadow ${
        muted
          ? 'border-border bg-surface'
          : 'border-border bg-card shadow-card hover:shadow-card-hover'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`font-semibold ${muted ? 'text-text-secondary' : 'text-text-primary'}`}>
            {title}
          </h3>
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">
            <TechText text={detail} />
          </p>
          {note && (
            <p className="text-xs text-text-secondary mt-2 italic leading-relaxed">
              <span className="not-italic font-medium">Märkus:</span>{' '}
              <TechText text={note} />
            </p>
          )}
        </div>
        {showBadge && <CapabilityStatusBadge status={status} />}
      </div>
    </li>
  );
}

export function StatusList({ rows, showBadge = true }: { rows: StatusRow[]; showBadge?: boolean }) {
  return (
    <ul className="grid gap-3 lg:grid-cols-2">
      {rows.map((row) => (
        <StatusCard key={row.title} {...row} showBadge={showBadge} />
      ))}
    </ul>
  );
}

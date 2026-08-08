'use client';

/**
 * Status-filtered section for the technical overview page. Chips let an
 * evaluator isolate one status (e.g. "show me only what is live today");
 * "Kõik" restores the default split: live/pilot rows full-weight, planned
 * target-state rows collapsed into one labelled <details> group.
 */

import { ChevronDown, Clock } from 'lucide-react';
import { useState } from 'react';
import { CAPABILITY_STATUSES, type CapabilityStatus } from '@/lib/content/landing-copy';
import { StatusList, type StatusRow } from './status-card';

type Filter = 'Kõik' | CapabilityStatus;

const FILTERS: readonly Filter[] = ['Kõik', ...CAPABILITY_STATUSES];

const FILTER_ACTIVE = 'bg-primary text-text-inverse border-primary shadow-sm';
const FILTER_IDLE =
  'bg-surface text-text-secondary border-border hover:border-borderStrong hover:text-text-primary';

export function StatusFilterSection({
  rows,
  plannedLabel,
}: {
  rows: StatusRow[];
  plannedLabel: string;
}) {
  const [filter, setFilter] = useState<Filter>('Kõik');

  const countFor = (f: Filter) =>
    f === 'Kõik' ? rows.length : rows.filter((row) => row.status === f).length;

  const filtered = filter === 'Kõik' ? rows : rows.filter((row) => row.status === filter);
  const active = filtered.filter((row) => row.status !== 'Kavandatud');
  const planned = filtered.filter((row) => row.status === 'Kavandatud');

  return (
    <div>
      <fieldset
        aria-label='Filtreeri staatuse järgi'
        className='flex flex-wrap gap-2 mb-4 p-0 m-0 border-0 min-w-0'
      >
        <span className='sr-only' aria-live='polite'>
          {filter === 'Kõik' ? 'Näidatakse kõiki' : `Näidatakse ainult staatust: ${filter}`}
        </span>
        {FILTERS.map((f) => (
          <button
            key={f}
            type='button'
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-ring-target ${filter === f ? FILTER_ACTIVE : FILTER_IDLE}`}
          >
            {f}
            <span
              className={`text-xs tabular-nums ${filter === f ? 'opacity-80' : 'text-text-secondary'}`}
            >
              {countFor(f)}
            </span>
          </button>
        ))}
      </fieldset>

      {/* Single-status filter: badges on every card would repeat the chip
          above it — suppress them, keep them in the mixed "Kõik" view. */}
      {active.length > 0 && <StatusList rows={active} showBadge={filter === 'Kõik'} />}
      {planned.length > 0 && (
        <details
          open={filter === 'Kavandatud'}
          className='group mt-4 rounded-xl border border-border bg-elevated'
        >
          <summary className='flex items-center justify-between gap-4 cursor-pointer px-5 py-4 text-sm font-medium text-text-primary hover:bg-surface transition-colors focus-ring-target rounded-xl list-none [&::-webkit-details-marker]:hidden'>
            <span className='flex items-center gap-2.5'>
              <ChevronDown
                className='w-4 h-4 shrink-0 text-text-secondary transition-transform duration-200 group-open:rotate-180'
                aria-hidden='true'
              />
              {plannedLabel} ({planned.length})
            </span>
            <span className='inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-normal text-text-secondary'>
              <Clock className='w-3 h-3 shrink-0' aria-hidden='true' />
              Sihtseis
            </span>
          </summary>
          <div className='px-5 pb-5'>
            <p className='text-xs text-text-secondary mb-4'>
              „Kavandatud&ldquo; tähendab sihtseisu, mitte lubadust: meede on planeeritud ja osalt
              välja arendatud, kuid pole veel põhiharul kasutusele võetud. Ühendamine on prioriteet
              enne piloodi laiendamist.
            </p>
            <StatusList rows={planned} showBadge={filter === 'Kõik'} />
          </div>
        </details>
      )}
    </div>
  );
}

/**
 * Capability status badge component
 * Displays maturity level: Saadaval, Piloodis, Kavandatud
 * Icons make status readable without relying on color alone (color-blind safe);
 * a pulsing dot marks live ("Saadaval") status. Colors come from the design
 * tokens so they remap automatically in dark mode.
 */

import type { LucideIcon } from 'lucide-react';
import { Check, Clock, Rocket } from 'lucide-react';
import type { CapabilityStatus } from '@/lib/content/landing-copy';

interface CapabilityStatusProps {
  status: CapabilityStatus;
  className?: string;
}

const STATUS_STYLES: Record<CapabilityStatus, string> = {
  Saadaval: 'bg-success-surface border-success-border text-success-strong',
  Piloodis: 'bg-warning-surface border-warning-border text-warning-strong',
  Kavandatud: 'bg-transparent border-border text-text-secondary',
};

const STATUS_ICONS: Record<CapabilityStatus, LucideIcon> = {
  Saadaval: Check,
  Piloodis: Rocket,
  Kavandatud: Clock,
};

// Live indicator — only "Saadaval" carries the dot, so deployment state
// reads even when colors are stripped (print, color-blindness).
const STATUS_LIVE_DOT: Record<CapabilityStatus, boolean> = {
  Saadaval: true,
  Piloodis: false,
  Kavandatud: false,
};

/**
 * Displays a capability status as an accessible badge with status-specific styling and an icon.
 *
 * @returns A status badge containing the capability status text and corresponding visual indicators.
 */
export function CapabilityStatusBadge({ status, className = '' }: CapabilityStatusProps) {
  const Icon = STATUS_ICONS[status];
  return (
    <span
      className={`inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status]} ${className}`}
      aria-label={`Staatus: ${status}`}
      role='img'
    >
      {STATUS_LIVE_DOT[status] && (
        <span
          className='h-1.5 w-1.5 rounded-full bg-current animate-pulse motion-reduce:animate-none'
          aria-hidden='true'
        />
      )}
      <Icon className='w-3.5 h-3.5 shrink-0' aria-hidden='true' />
      {status}
    </span>
  );
}

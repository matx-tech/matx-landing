/**
 * Capability status badge component
 * Displays maturity level: Saadaval, Piloodis, Kavandatud
 */

import type { CapabilityStatus } from '@/lib/content/landing-copy';

interface CapabilityStatusProps {
  status: CapabilityStatus;
  className?: string;
}

const STATUS_STYLES: Record<CapabilityStatus, string> = {
  Saadaval: 'bg-green-100 text-green-800 border-green-200',
  Piloodis: 'bg-blue-100 text-blue-800 border-blue-200',
  Kavandatud: 'bg-gray-100 text-gray-600 border-gray-200',
};

export function CapabilityStatusBadge({ status, className = '' }: CapabilityStatusProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status]} ${className}`}
      aria-label={`Staatus: ${status}`}
    >
      {status}
    </span>
  );
}

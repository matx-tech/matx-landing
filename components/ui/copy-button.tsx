'use client';

/**
 * Copy-to-clipboard button. Falls back to a temporary textarea when the
 * async Clipboard API is unavailable (insecure context, older browsers).
 */

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  value: string;
  label: string;
  copiedLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export function CopyButton({
  value,
  label,
  copiedLabel = 'Kopeeritud!',
  className = '',
  children,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    let success = false;
    try {
      await navigator.clipboard.writeText(value);
      success = true;
    } catch {
      const el = document.createElement('textarea');
      el.value = value;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      // Deprecated in TS DOM lib but the only fallback that works in
      // non-secure contexts where the async Clipboard API is absent.
      try {
        success = (document as unknown as { execCommand: (cmd: string) => boolean }).execCommand('copy');
      } finally {
        document.body.removeChild(el);
      }
    }
    if (success) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      className={className}
    >
      {copied ? (
        <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
      ) : (
        <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

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
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const el = document.createElement('textarea');
      el.value = value;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      // Deprecated in TS DOM lib but the only fallback that works in
      // non-secure contexts where the async Clipboard API is absent.
      (document as unknown as { execCommand: (cmd: string) => boolean }).execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
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

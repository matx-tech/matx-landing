'use client';

/**
 * Copy-to-clipboard button. Falls back to a temporary textarea when the
 * async Clipboard API is unavailable (insecure context, older browsers).
 * Success state is set only when a copy path actually succeeded.
 */

import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CopyButtonProps {
  value: string;
  label: string;
  copiedLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Renders a button that copies text to the clipboard and indicates successful copying.
 *
 * @param value - The text to copy
 * @param label - The button's label before copying
 * @param copiedLabel - The button's label after a successful copy
 * @returns A clipboard copy button
 */
export function CopyButton({
  value,
  label,
  copiedLabel = 'Kopeeritud!',
  className = '',
  children,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | undefined>(undefined);

  // Clear any pending success-reset timer on unmount.
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleCopy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      const el = document.createElement('textarea');
      el.value = value;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      try {
        // Deprecated in TS DOM lib but the only fallback that works in
        // non-secure contexts where the async Clipboard API is absent.
        ok = (document as unknown as { execCommand: (cmd: string) => boolean }).execCommand('copy');
      } finally {
        document.body.removeChild(el);
        // el.select() moved focus into the textarea — hand it back.
        buttonRef.current?.focus();
      }
    }
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      ref={buttonRef}
      type='button'
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      className={className}
    >
      {copied ? (
        <Check className='w-4 h-4 shrink-0' aria-hidden='true' />
      ) : (
        <Copy className='w-4 h-4 shrink-0' aria-hidden='true' />
      )}
      {children}
    </button>
  );
}

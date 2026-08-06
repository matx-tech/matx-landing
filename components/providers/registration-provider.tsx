'use client';

import { useState, useRef, useCallback, useEffect, useContext, useMemo, createContext } from 'react';
import dynamic, { type DynamicOptionsLoadingProps } from 'next/dynamic';
import { dialogCloseDelayMs } from '@/lib/dialog-timing';

// Cancel channel for the chunk-loading fallback: next/dynamic renders the
// `loading` fallback inside the page tree, so it can ask the provider to
// abandon the pending open via context instead of being a dead-end overlay.
const RegistrationChunkContext = createContext<{ cancel: () => void }>({ cancel: () => {} });

function RegistrationChunkFallback({ error, retry }: DynamicOptionsLoadingProps) {
  const { cancel } = useContext(RegistrationChunkContext);

  // While the chunk is loading, the Radix dialog isn't mounted yet — Escape
  // would do nothing. Cancel the pending open here instead.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cancel]);

  if (error) {
    return (
      <div
        role="alert"
        className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/95"
        onClick={cancel}
      >
        <div
          className="flex flex-col items-center gap-4 px-6 text-center"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-text-primary">Registreerimisvormi laadimine ebaõnnestus.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={retry}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-text-inverse transition-colors hover:bg-primary/90 focus-ring-target min-h-[44px]"
            >
              Proovi uuesti
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-lg border border-border px-6 py-3 font-semibold text-text-primary transition-colors hover:bg-surface focus-ring-target min-h-[44px]"
            >
              Sulge
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/95"
      onClick={cancel}
    >
      <div
        className="flex flex-col items-center gap-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
        />
        <span className="sr-only">Laadime registreerimisvormi…</span>
        <button
          type="button"
          onClick={cancel}
          className="rounded-lg border border-border px-6 py-3 font-semibold text-text-primary transition-colors hover:bg-surface focus-ring-target min-h-[44px]"
        >
          Tühista
        </button>
      </div>
    </div>
  );
}

// Modal — only its JS ships when the user actually opens the form.
const RegistrationForm = dynamic(
  () => import('@/components/ui/registration-form').then((mod) => mod.RegistrationForm),
  {
    // First open fetches the chunk on a slow connection; show a lightweight,
    // cancelable overlay so the CTA click never looks dead. react-loadable
    // surfaces a rejected chunk fetch as `error` here (caught in its
    // subscription, so the page doesn't blank), letting the overlay degrade
    // to a visible retry state instead of a dead click.
    loading: (loadingProps) => <RegistrationChunkFallback {...loadingProps} />,
  }
);

const RegistrationContext = createContext<{ openRegistration: () => void }>({
  openRegistration: () => {},
});

/** Opens the lazy-loaded registration dialog. Consumed by CTA sections. */
export function useRegistration() {
  return useContext(RegistrationContext);
}

/**
 * Holds the registration-dialog state so the page itself can stay a Server
 * Component: the whole state machine, chunk fallback and modal live in this
 * client island instead of hydrating with every section.
 */
export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  // Keep the dialog mounted briefly after close so Radix Presence can play
  // the exit fade before the lazy chunk unmounts.
  const [isRegistrationClosing, setIsRegistrationClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenRegistration = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsRegistrationClosing(false);
    setIsRegistrationOpen(true);
  }, []);

  const handleCloseRegistration = useCallback(() => {
    setIsRegistrationClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsRegistrationOpen(false);
      setIsRegistrationClosing(false);
      closeTimerRef.current = null;
    }, dialogCloseDelayMs); // let the overlay's exit fade complete before unmounting the chunk
  }, []);

  // Cancel a pending open while the chunk is still loading: the dialog never
  // mounted, so there's no exit fade to wait for — reset immediately.
  const handleCancelPendingOpen = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsRegistrationClosing(false);
    setIsRegistrationOpen(false);
  }, []);

  const registrationChunkContextValue = useMemo(
    () => ({ cancel: handleCancelPendingOpen }),
    [handleCancelPendingOpen]
  );

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    []
  );

  return (
    <RegistrationContext.Provider value={{ openRegistration: handleOpenRegistration }}>
      {children}
      <RegistrationChunkContext.Provider value={registrationChunkContextValue}>
        {isRegistrationOpen && (
          <RegistrationForm isOpen={!isRegistrationClosing} onClose={handleCloseRegistration} />
        )}
      </RegistrationChunkContext.Provider>
    </RegistrationContext.Provider>
  );
}

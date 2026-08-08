'use client';

import dynamic, { type DynamicOptionsLoadingProps } from 'next/dynamic';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { REGISTRATION_COPY } from '@/lib/content/landing-copy';
import { dialogCloseDelayMs } from '@/lib/dialog-timing';

// Cancel channel for the chunk-loading fallback: next/dynamic renders the
// `loading` fallback inside the page tree, so it can ask the provider to
// abandon the pending open via context instead of being a dead-end overlay.
const RegistrationChunkContext = createContext<{ cancel: () => void }>({ cancel: () => {} });

/**
 * Renders a modal fallback while the registration form chunk is loading or has failed.
 *
 * @param error - The chunk-loading error, if loading failed
 * @param retry - Retries loading the registration form chunk
 */
function RegistrationChunkFallback({ error, retry }: DynamicOptionsLoadingProps) {
  const { cancel } = useContext(RegistrationChunkContext);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const retryButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);
  // The CTA that opened the dialog — captured once on the fallback's first
  // mount. Re-reading document.activeElement when `error` flips would capture
  // whatever the loading→error DOM swap left focused (the unmounted cancel
  // button or <body>), and closing from the error state would then restore
  // focus to the wrong element.
  const openerRef = useRef<HTMLElement | null>(null);

  // Modal-shell semantics: focus the primary action on show (retry in the
  // error state, cancel while loading), trap Tab inside the overlay, and
  // hand focus back to the opener when cancel runs.
  useEffect(() => {
    if (openerRef.current === null) {
      openerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    if (error) {
      retryButtonRef.current?.focus();
    } else {
      cancelButtonRef.current?.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        restoreFocusRef.current = true;
        cancel();
        return;
      }
      if (event.key !== 'Tab' || !overlayRef.current) return;

      const focusables = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      // Only steal focus back on cancel — when the chunk loads successfully
      // the Radix dialog takes over focus management.
      if (restoreFocusRef.current) openerRef.current?.focus();
    };
  }, [cancel, error]);

  const handleCancel = () => {
    restoreFocusRef.current = true;
    cancel();
  };

  // Modal shell: lock background scroll while the chunk loads — the loaded
  // Radix dialog locks scroll too, so both states behave the same.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape cancels via the window keydown listener in the effect above
    <div
      ref={overlayRef}
      role='dialog'
      aria-modal='true'
      aria-label={error ? REGISTRATION_COPY.error : REGISTRATION_COPY.loading}
      className='fixed inset-0 z-50 flex items-center justify-center bg-canvas/95 touch-none'
      onClick={handleCancel}
    >
      {error ? (
        // biome-ignore lint/a11y/useKeyWithClickEvents: passive click-blocker, keeps panel clicks off the backdrop handler
        // biome-ignore lint/a11y/noStaticElementInteractions: passive click-blocker, not an interactive control
        <div
          className='flex flex-col items-center gap-4 px-6 text-center'
          onClick={(event) => event.stopPropagation()}
        >
          <p className='text-text-primary'>{REGISTRATION_COPY.error}</p>
          <div className='flex gap-3'>
            <button
              type='button'
              ref={retryButtonRef}
              onClick={retry}
              className='rounded-lg bg-primary px-6 py-3 font-semibold text-text-inverse transition-colors hover:bg-primary/90 focus-ring-target min-h-[44px]'
            >
              {REGISTRATION_COPY.retry}
            </button>
            <button
              type='button'
              ref={cancelButtonRef}
              onClick={handleCancel}
              className='rounded-lg border border-border px-6 py-3 font-semibold text-text-primary transition-colors hover:bg-surface focus-ring-target min-h-[44px]'
            >
              {REGISTRATION_COPY.close}
            </button>
          </div>
        </div>
      ) : (
        // biome-ignore lint/a11y/useKeyWithClickEvents: passive click-blocker, keeps panel clicks off the backdrop handler
        // biome-ignore lint/a11y/noStaticElementInteractions: passive click-blocker, not an interactive control
        <div
          className='flex flex-col items-center gap-6'
          onClick={(event) => event.stopPropagation()}
        >
          <div
            aria-hidden='true'
            className='h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent'
          />
          <span className='sr-only'>{REGISTRATION_COPY.loading}</span>
          <button
            type='button'
            ref={cancelButtonRef}
            onClick={handleCancel}
            className='rounded-lg border border-border px-6 py-3 font-semibold text-text-primary transition-colors hover:bg-surface focus-ring-target min-h-[44px]'
          >
            {REGISTRATION_COPY.cancel}
          </button>
        </div>
      )}
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
  },
);

const RegistrationContext = createContext<{ openRegistration: () => void }>({
  openRegistration: () => {},
});

/**
 * Provides access to registration dialog controls.
 *
 * @returns The registration context value
 */
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
    // Clear any pending timer first: a second close inside the exit-fade
    // window must not orphan a timer that would slam a reopened dialog shut.
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
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
    [handleCancelPendingOpen],
  );

  const registrationContextValue = useMemo(
    () => ({ openRegistration: handleOpenRegistration }),
    [handleOpenRegistration],
  );

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  return (
    <RegistrationContext.Provider value={registrationContextValue}>
      {children}
      <RegistrationChunkContext.Provider value={registrationChunkContextValue}>
        {isRegistrationOpen && (
          <RegistrationForm isOpen={!isRegistrationClosing} onClose={handleCloseRegistration} />
        )}
      </RegistrationChunkContext.Provider>
    </RegistrationContext.Provider>
  );
}

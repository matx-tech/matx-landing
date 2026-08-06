/**
 * Registration dialog exit timing — single source of truth for the close
 * sequence shared by `components/ui/registration-form.tsx` (the Radix
 * overlay's exit fade duration) and `app/page.tsx` (how long the lazy chunk
 * stays mounted so the fade can complete before it unmounts).
 *
 * The overlay fades out over `dialogExitMs` (tailwindcss-animate's
 * `animate-out` default, via `theme("animationDuration.DEFAULT")`); the page
 * keeps the chunk mounted for `dialogCloseDelayMs` — a small buffer beyond
 * the fade — so the exit animation never gets cut off.
 */

/** Radix overlay exit fade duration, in milliseconds. */
export const dialogExitMs = 150;

/** How long the lazy modal chunk stays mounted after close starts, in milliseconds. */
export const dialogCloseDelayMs = dialogExitMs + 50;

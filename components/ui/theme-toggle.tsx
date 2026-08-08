'use client';

import { Moon, Sun } from 'lucide-react';
import { EVENTS, track } from '@/lib/analytics';

const STORAGE_KEY = 'matx-theme';

/**
 * Dark/light toggle. The icon follows the active theme purely via the `dark:`
 * variant (wired to [data-theme=dark] in globals.css) — no JS state, so no
 * hydration mismatch and no icon flash. Persists the explicit choice to the
 * same localStorage key the layout bootstrap script reads, so the next load
 * honors it instead of falling back to prefers-color-scheme.
 *
 * ponytail: binary light/dark only; add a three-state (system/light/dark)
 * if users ask to follow the OS after having chosen once.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const toggle = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    track(EVENTS.themeToggle, { theme: next });
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode) — the attribute still applies this session.
    }
  };

  return (
    <button
      type='button'
      onClick={toggle}
      aria-label='Vaheta teemat'
      title='Vaheta teemat'
      className={`w-11 h-11 rounded-lg bg-elevated flex items-center justify-center focus-ring-target ${className}`}
    >
      <Sun className='w-5 h-5 text-text-primary hidden dark:block' aria-hidden='true' />
      <Moon className='w-5 h-5 text-text-primary block dark:hidden' aria-hidden='true' />
    </button>
  );
}

'use client';

/**
 * Sticky table of contents for long technical pages. Shows the current
 * section via IntersectionObserver scroll-spy and highlights it in the rail.
 * Desktop-only (xl+); the mobile fallback is the chip row in the page body.
 */

import { useEffect, useState } from 'react';

interface TocItem {
  readonly id: string;
  readonly label: string;
}

export function TechnicalTOC({ items }: { items: readonly TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      // Active band: the strip just below the fixed header.
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label='Sisukord' className='hidden xl:block w-60 shrink-0'>
      <div className='sticky top-24'>
        <h2 className='text-sm font-semibold text-text-primary mb-3'>Selles lehes</h2>
        <ul className='space-y-1 border-l border-border'>
          {items.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={activeId === id ? 'true' : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm transition-colors focus-ring-target ${
                  activeId === id
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-borderStrong'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

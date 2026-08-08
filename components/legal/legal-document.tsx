'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LegalSection {
  readonly heading: string;
  readonly body: string | React.ReactNode;
}

interface LegalDocumentProps {
  title: string;
  updated: string;
  sections: readonly LegalSection[];
}

function linkifyContent(text: string): React.ReactNode {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const urlRegex = /((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const allMatches: Array<{ index: number; text: string; type: 'email' | 'url' }> = [];

  let match: RegExpExecArray | null = emailRegex.exec(text);
  while (match !== null) {
    allMatches.push({ index: match.index, text: match[0], type: 'email' });
    match = emailRegex.exec(text);
  }

  match = urlRegex.exec(text);
  while (match !== null) {
    if (!allMatches.some((m) => m.index === match?.index)) {
      allMatches.push({ index: match.index, text: match[0], type: 'url' });
    }
    match = urlRegex.exec(text);
  }

  allMatches.sort((a, b) => a.index - b.index);

  for (const m of allMatches) {
    if (m.index > lastIndex) {
      parts.push(text.substring(lastIndex, m.index));
    }

    if (m.type === 'email') {
      parts.push(
        <a
          key={`link-${m.index}`}
          href={`mailto:${m.text}`}
          className='text-primary hover:text-secondary transition-colors underline'
        >
          {m.text}
        </a>,
      );
    } else {
      const href = m.text.startsWith('http') ? m.text : `https://${m.text}`;
      parts.push(
        <a
          key={`link-${m.index}`}
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary hover:text-secondary transition-colors underline'
        >
          {m.text}
        </a>,
      );
    }

    lastIndex = m.index + m.text.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function parseInlineList(text: string): React.ReactNode {
  const listPattern = /\(([a-z])\)\s+([^;]+?)(?=\s*\([a-z]\)|;|$)/gi;
  const matches = Array.from(text.matchAll(listPattern));

  if (matches.length >= 3) {
    const beforeList = text.substring(0, matches[0].index);
    const afterList = text.substring(
      matches[matches.length - 1].index + matches[matches.length - 1][0].length,
    );

    return (
      <>
        {linkifyContent(beforeList.trim())}
        <ul className='mt-4 space-y-2 ml-6 list-none'>
          {matches.map((m) => (
            <li key={`clause-${m[1]}`} className='text-text-secondary text-sm leading-relaxed'>
              <strong className='text-text-primary'>({m[1]})</strong> {linkifyContent(m[2].trim())}
            </li>
          ))}
        </ul>
        {afterList.trim() && (
          <p className='mt-4 text-text-secondary text-sm leading-relaxed'>
            {linkifyContent(afterList.trim())}
          </p>
        )}
      </>
    );
  }

  return linkifyContent(text);
}

export function LegalDocument({ title, updated, sections }: LegalDocumentProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' },
    );

    sections.forEach((_, i) => {
      const el = document.getElementById(`section-${i}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <main id='main' className='pt-16 min-h-screen'>
      <div className='container mx-auto px-4 md:px-8 lg:px-16 py-16'>
        <div className='lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 max-w-6xl mx-auto'>
          {/* Sticky TOC Sidebar - Desktop */}
          <aside className='hidden lg:block'>
            <div className='sticky top-24'>
              <nav aria-label='Sisukord'>
                <h2 className='text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider'>
                  Sisukord
                </h2>
                <ul className='space-y-2'>
                  {sections.map((section, i) => (
                    <li key={section.heading}>
                      <a
                        href={`#section-${i}`}
                        className={`block text-sm py-1 px-3 rounded-md transition-colors ${
                          activeSection === `section-${i}`
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                        }`}
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Mobile TOC Toggle */}
          <div className='lg:hidden mb-6'>
            <button
              type='button'
              onClick={() => setTocOpen(!tocOpen)}
              className='w-full flex items-center justify-between p-4 bg-surface border border-border rounded-lg text-text-primary font-medium'
              aria-expanded={tocOpen}
            >
              <span>Sisukord</span>
              <svg
                className={`w-5 h-5 transition-transform ${tocOpen ? 'rotate-180' : ''}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <title>Toggle</title>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>
            {tocOpen && (
              <nav
                className='mt-2 p-4 bg-surface border border-border rounded-lg'
                aria-label='Sisukord'
              >
                <ul className='space-y-2'>
                  {sections.map((section, i) => (
                    <li key={section.heading}>
                      <a
                        href={`#section-${i}`}
                        onClick={() => setTocOpen(false)}
                        className='block text-sm py-2 text-text-secondary hover:text-primary transition-colors'
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          {/* Main Content */}
          <div className='lg:col-start-2'>
            <header className='mb-12'>
              <p className='text-xs font-medium text-text-secondary uppercase tracking-wider mb-3'>
                MATx · Õiguslik teave
              </p>
              <h1 className='text-3xl md:text-4xl font-display font-bold text-text-primary mb-2'>
                {title}
              </h1>
              <p className='text-sm text-text-secondary'>{updated}</p>
            </header>

            <div className='space-y-12'>
              {sections.map((section, i) => (
                <section key={section.heading} id={`section-${i}`} className='scroll-mt-24'>
                  <h2 className='text-xl font-display font-semibold text-text-primary mb-4'>
                    {section.heading}
                  </h2>
                  <div className='prose-legal text-text-secondary text-sm leading-relaxed'>
                    {typeof section.body === 'string'
                      ? parseInlineList(section.body)
                      : section.body}
                  </div>
                  {i < sections.length - 1 && <hr className='mt-12 border-border opacity-30' />}
                </section>
              ))}
            </div>

            <Link
              href='/'
              className='inline-block mt-12 text-primary hover:text-secondary transition-colors text-sm focus-ring-target rounded-md underline'
            >
              ← Tagasi avalehele
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

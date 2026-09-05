import { Newsreader } from 'next/font/google';

// Loaded here (not app/layout.tsx) so it ships inside the demo section's lazy
// chunk, not the initial page load. Only the tutor voice and card captions
// use it (--font-tutor); student text stays on the already-loaded Inter.
export const newsreaderTutor = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-tutor',
  style: 'italic',
  weight: '400',
  display: 'swap',
});

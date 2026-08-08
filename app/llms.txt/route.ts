import { ROUTES } from '@/app/sitemap';
import { LLMS_TXT, PROHIBITED_PHRASES, SITE_META } from '@/lib/content/landing-copy';

// Prerendered at build time so the guards below fail `pnpm build` instead of
// shipping a stale or policy-violating llms.txt.
export const dynamic = 'force-static';

// Every internal link in llms.txt must be a real sitemap route.
const unknownRoutes = [...LLMS_TXT.matchAll(/\((https?:\/\/[^)]+)\)/g)]
  .map((match) => match[1])
  .filter((url) => url.startsWith(SITE_META.url))
  .map((url) => url.slice(SITE_META.url.length).replace(/\/$/, ''))
  .filter((path) => !(ROUTES as readonly string[]).includes(path));

if (unknownRoutes.length > 0) {
  throw new Error(
    `llms.txt links to routes missing from sitemap ROUTES: ${unknownRoutes.join(', ')}`,
  );
}

// No prohibited phrase may leak into the file.
const prohibited = PROHIBITED_PHRASES.find((phrase) => LLMS_TXT.includes(phrase));
if (prohibited) {
  throw new Error(`llms.txt contains prohibited phrase: ${prohibited}`);
}

export function GET() {
  return new Response(LLMS_TXT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

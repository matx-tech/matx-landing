import type { MetadataRoute } from 'next';
import { SITE_META } from '@/lib/content/landing-copy';

// All public routes. Legal slugs are locked in app/[legal]/page.tsx.
// Exported: app/llms.txt/route.ts validates llms.txt links against this list.
export const ROUTES = ['', '/tehniline', '/demo', '/privaatsus', '/tingimused', '/gdpr'] as const;

/**
 * Generates sitemap entries for all public routes.
 *
 * @returns Sitemap entries containing the absolute URL for each public route.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({ url: `${SITE_META.url}${route}` }));
}

import type { MetadataRoute } from 'next';
import { SITE_META } from '@/lib/content/landing-copy';

// All public routes. Legal slugs are locked in app/[legal]/page.tsx.
const ROUTES = ['', '/tehniline', '/privaatsus', '/tingimused', '/gdpr'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({ url: `${SITE_META.url}${route}` }));
}

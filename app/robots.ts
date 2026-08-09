import type { MetadataRoute } from 'next';
import { SITE_META } from '@/lib/content/landing-copy';

/**
 * Defines crawling rules and the sitemap location for the site.
 *
 * @returns The robots configuration allowing all user agents to access the site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_META.url}/sitemap.xml`,
  };
}

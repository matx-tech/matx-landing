import type { MetadataRoute } from 'next';
import { SITE_META } from '@/lib/content/landing-copy';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_META.url}/sitemap.xml`,
  };
}

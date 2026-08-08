'use client';

import { useEffect } from 'react';
import { enableAnalytics } from '@/lib/analytics';
import { SITE_META } from '@/lib/content/landing-copy';

/**
 * Initializes the Plausible tracker (official npm library). Rendered by the
 * root layout only when PLAUSIBLE_SCRIPT_URL is set. The tracker replaces the
 * classic script tag — it captures pageviews (incl. SPA navigation), outbound
 * link clicks and form submissions, and sends events to the proxied
 * same-origin endpoint.
 */
export function AnalyticsProvider() {
  useEffect(() => {
    void enableAnalytics({
      domain: new URL(SITE_META.url).hostname,
      endpoint: '/api/event',
      outboundLinks: true,
      formSubmissions: true,
      captureOnLocalhost: process.env.NODE_ENV === 'development',
    });
  }, []);

  return null;
}

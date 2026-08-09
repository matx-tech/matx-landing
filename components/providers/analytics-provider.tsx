'use client';

import { useEffect } from 'react';
import { enableAnalytics } from '@/lib/analytics';
import { SITE_META } from '@/lib/content/landing-copy';

/**
 * Initializes Plausible analytics when the component mounts.
 *
 * @returns `null`
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

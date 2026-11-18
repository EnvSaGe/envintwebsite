'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Tracks client-side Next.js App Router navigations in GA4 without double-counting
 * the initial SSR pageview already recorded by the <head> Google tag snippet.
 */
function GoogleAnalyticsTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    if (prevUrl.current === null) {
      prevUrl.current = url;
      return;
    }

    if (prevUrl.current === url) return;
    prevUrl.current = url;

    if (typeof window.gtag === 'function') {
      window.gtag('config', measurementId, { page_path: url });
    }
  }, [measurementId, pathname, searchParams]);

  return null;
}

/**
 * Client-side route-change listener for Google Analytics (GA4).
 * Wrapped in Suspense because useSearchParams requires a boundary in Next.js App Router.
 */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  if (!measurementId) return null;

  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsTracker measurementId={measurementId} />
    </Suspense>
  );
}

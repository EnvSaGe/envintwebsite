'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * AnalyticsBeacon — lightweight client component (~0.5KB gzipped).
 * 
 * Uses `navigator.sendBeacon` (fire-and-forget, doesn't block navigation)
 * to ping /api/telemetry with the current page path, title, and referrer.
 * 
 * No cookies. No localStorage. No external scripts.
 * Pure first-party, privacy-compliant tracking.
 */
export function AnalyticsBeacon() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double-fire on strict mode mount or same path
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      title: document.title,
      referrer: document.referrer || null,
    });

    // sendBeacon works even if the user navigates away immediately
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/telemetry', new Blob([payload], { type: 'application/json' }));
    } else {
      // Fallback for older browsers
      fetch('/api/telemetry', {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  // Renders nothing — purely a side-effect component
  return null;
}

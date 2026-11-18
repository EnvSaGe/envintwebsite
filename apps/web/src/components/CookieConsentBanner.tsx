'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CONSENT_STORAGE_KEY = 'envint_cookie_consent';

type ConsentDecision = 'granted' | 'denied';

function updateGoogleConsent(decision: ConsentDecision) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: decision,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (saved !== 'granted' && saved !== 'denied') {
        setVisible(true);
      }
    } catch {
      // If storage is unavailable, keep unobtrusive default denied mode
    }
  }, []);

  const handleChoice = (decision: ConsentDecision) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, decision);
    } catch {
      // Ignore storage errors in restricted browsing modes
    }
    updateGoogleConsent(decision);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="envint-cookie-banner"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        maxWidth: '420px',
        zIndex: 9999,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '16px 18px',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
        fontFamily: '"Neue Montreal", sans-serif',
        color: '#1e293b',
      }}
    >
      <p
        style={{
          margin: '0 0 12px 0',
          fontSize: '13.5px',
          lineHeight: 1.5,
          color: '#334155',
        }}
      >
        We use analytics cookies to understand site traffic and improve your experience.{' '}
        <Link
          href="/disclaimer/"
          style={{
            color: '#004E35',
            textDecoration: 'underline',
            fontWeight: 500,
          }}
        >
          Learn more
        </Link>
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button
          type="button"
          onClick={() => handleChoice('denied')}
          style={{
            padding: '7px 14px',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: '"Neue Montreal", sans-serif',
            color: '#475569',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => handleChoice('granted')}
          style={{
            padding: '7px 16px',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: '"Neue Montreal", sans-serif',
            color: '#ffffff',
            backgroundColor: '#004E35',
            border: '1px solid #004E35',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}

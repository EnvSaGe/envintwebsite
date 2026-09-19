'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function GlobalAdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin application error caught by boundary:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <AlertTriangle size={32} />
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
        Something went wrong
      </h1>

      <p
        style={{
          color: '#94a3b8',
          maxWidth: '480px',
          lineHeight: 1.6,
          fontSize: '0.9rem',
          marginBottom: '24px',
        }}
      >
        {error.message && !error.message.includes('digest')
          ? error.message
          : 'An unexpected issue occurred while rendering this page or communicating with the server.'}
      </p>

      {error.digest && (
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: '#64748b',
            backgroundColor: '#1e293b',
            padding: '4px 10px',
            borderRadius: '6px',
            marginBottom: '24px',
          }}
        >
          Digest: {error.digest}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => reset()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            backgroundColor: '#3079bd',
            color: '#ffffff',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.85rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={15} />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            backgroundColor: '#334155',
            color: '#f8fafc',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.85rem',
            textDecoration: 'none',
          }}
        >
          <LayoutDashboard size={15} />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

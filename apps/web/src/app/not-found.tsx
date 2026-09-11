import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      padding: '120px 24px 80px',
    }}>
      <div style={{ maxWidth: '560px' }}>
        <div style={{
          fontFamily: '"Neue Montreal", sans-serif',
          fontSize: 'clamp(4rem, 10vw, 7rem)',
          lineHeight: 1,
          color: '#2F7ABE',
          fontWeight: 400,
        }}>
          404
        </div>
        <h1 style={{
          fontFamily: '"Neue Montreal", sans-serif',
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          color: '#004E35',
          fontWeight: 400,
          margin: '16px 0 12px',
        }}>
          This page has moved or no longer exists
        </h1>
        <p style={{
          fontFamily: '"Neue Montreal", sans-serif',
          fontSize: '18px',
          lineHeight: 1.7,
          color: '#404040',
          margin: '0 0 32px',
        }}>
          The URL may have changed during our website migration. Try our updated
          pages below, or use the navigation to find what you need.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              backgroundColor: '#2F7ABE',
              color: '#ffffff',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              padding: '12px 30px',
              borderRadius: '10px',
              textDecoration: 'none',
            }}
          >
            Back to Home
          </Link>
          <Link
            href="/impact/"
            style={{
              border: '1px solid #2F7ABE',
              color: '#2F7ABE',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              padding: '12px 30px',
              borderRadius: '10px',
              textDecoration: 'none',
            }}
          >
            View Impact
          </Link>
        </div>
      </div>
    </div>
  );
}

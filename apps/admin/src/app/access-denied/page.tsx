import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

export default function AccessDeniedPage() {
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
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <ShieldAlert size={36} />
      </div>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '10px' }}>
        Access Restricted
      </h1>

      <p style={{ color: '#94a3b8', maxWidth: '440px', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '24px' }}>
        Your account is not authorized to access the Envint CMS Admin Portal. Only pre-approved Envint team accounts are permitted.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '8px 14px', backgroundColor: '#1e293b', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Switch Account:</span>
          <UserButton />
        </div>

        <Link
          href="/sign-in"
          style={{
            padding: '10px 18px',
            backgroundColor: '#334155',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

import Image from 'next/image';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        padding: '24px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background brand glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(48, 121, 189, 0.15) 0%, rgba(69, 182, 83, 0.08) 50%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ marginBottom: '28px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div
            style={{
              padding: '8px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(48, 121, 189, 0.25)',
              display: 'inline-flex',
            }}
          >
            <Image
              src="/brand/envint-business-for-better.png"
              alt="Envint - Business for Better"
              width={76}
              height={76}
              style={{ objectFit: 'contain', borderRadius: '10px' }}
              priority
            />
          </div>
        </div>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
          ENVINT <span style={{ color: '#45b653' }}>CMS</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
          Secure Content Management Portal • <span style={{ color: '#3079bd', fontWeight: 600 }}>business for better</span>
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl={undefined}
          appearance={{
            elements: {
              footerAction: { display: 'none' }, // Hides "Don't have an account? Sign up"
              formButtonPrimary: {
                backgroundColor: '#3079bd',
                '&:hover': {
                  backgroundColor: '#2566a3',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

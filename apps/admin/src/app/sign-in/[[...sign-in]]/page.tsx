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
        padding: '20px',
      }}
    >
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
          ENVINT <span style={{ color: '#10b981' }}>CMS</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
          Secure Content Management Portal for Envint Global
        </p>
      </div>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl={undefined}
        appearance={{
          elements: {
            footerAction: { display: 'none' }, // Hides "Don't have an account? Sign up"
          },
        }}
      />
    </div>
  );
}

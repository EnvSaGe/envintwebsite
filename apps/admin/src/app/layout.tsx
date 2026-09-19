import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './admin-theme.css';

export const metadata: Metadata = {
  title: 'Envint CMS Admin Portal',
  description: 'Internal content management system for Envint Global website.',
  icons: {
    icon: '/brand/envint.png',
    apple: '/brand/envint.png',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

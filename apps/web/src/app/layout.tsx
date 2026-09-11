import type { Metadata } from 'next';
import '../styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd, organizationSchema, webSiteSchema } from '@/components/seo/JsonLd';

const SITE_URL = 'https://envintglobal.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | Envint',
    default: 'Envint | Sustainability & ESG Services Firm',
  },
  description:
    'Envint is a sustainability and ESG advisory firm helping organizations integrate sustainability, channelize responsible investment and enable climate action.',
  keywords: [
    'sustainability consulting India',
    'ESG advisory',
    'responsible investment',
    'climate action',
    'ESG consulting',
    'Envint',
    'sustainability strategy',
    'ESG due diligence',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    siteName: 'Envint',
    title: 'Envint | Sustainability & ESG Services Firm',
    description:
      'Envint is a sustainability and ESG solutions firm. We help clients integrate sustainability, channelize responsible investment and enable climate action.',
    url: SITE_URL,
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/images/hero-wetland.webp`,
        width: 1200,
        height: 630,
        alt: 'Envint - Sustainability and ESG solutions for business for better',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvintGlobal',
    title: 'Envint | Sustainability & ESG Services Firm',
    description:
      'Envint helps clients integrate sustainability, channelize responsible investment and enable climate action.',
    images: [`${SITE_URL}/images/hero-wetland.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/images/envint-circle-logo-150x150.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/envint-circle-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/images/envint-circle-logo-150x150.png',
    apple: '/images/envint-circle-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

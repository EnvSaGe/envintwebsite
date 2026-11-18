import type { Metadata } from 'next';
import '../styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd, organizationSchema, webSiteSchema } from '@/components/seo/JsonLd';
import { getNavigationItems } from '@/lib/data/navigation';
import { buildHeaderNavigation } from '@/lib/data/layout-content';
import { AnalyticsBeacon } from '@/components/AnalyticsBeacon';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';

const SITE_URL = 'https://envintglobal.com';
const RAW_GA_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-TKLJM6K1R4').trim();
const GA_MEASUREMENT_ID = /^G-[A-Z0-9]+$/i.test(RAW_GA_ID) ? RAW_GA_ID : '';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const primaryNavigation = await getNavigationItems('primary');
  const editableHeaderNavigation = primaryNavigation.some((item) => item.children.length > 0)
    ? buildHeaderNavigation(primaryNavigation)
    : [];

  return (
    <html lang="en">
      {GA_MEASUREMENT_ID && (
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} var _ec = null; try { _ec = localStorage.getItem('envint_cookie_consent'); } catch (e) {} gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: _ec === 'granted' ? 'granted' : 'denied', functionality_storage: 'granted', security_storage: 'granted' }); gtag('js', new Date()); gtag('config', '${GA_MEASUREMENT_ID}');`,
            }}
          />
          <script
            async
            src={`https://www.googletagmanager.com/gtm.js?id=${GA_MEASUREMENT_ID}`}
          />
        </head>
      )}
      <body>
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        <AnalyticsBeacon />
        {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}
        <Header navigation={editableHeaderNavigation} />
        <main>{children}</main>
        <Footer />
        {GA_MEASUREMENT_ID && <CookieConsentBanner />}
      </body>
    </html>
  );
}

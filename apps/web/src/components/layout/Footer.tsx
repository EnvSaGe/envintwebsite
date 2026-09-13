import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getNavigationItems, type NavItem } from '@/lib/data/navigation';
import { getPublicSiteSettings, textSetting } from '@/lib/data/site-settings';

const linkStyle: React.CSSProperties = {
  fontFamily: '"Neue Montreal", sans-serif',
  fontSize: '20px',
  lineHeight: '25px',
  fontWeight: 400,
  color: '#404040',
  display: 'block',
};

const DEFAULT_QUICK_LINKS = [
  { label: 'About', href: '/about/' },
  { label: 'Impact', href: '/impact/' },
  { label: 'Careers', href: '/careers-at-envint/' },
  { label: 'Envision', href: '/envision/' },
  { label: 'Privacy policy', href: '/about/' },
];
const DEFAULT_SERVICE_LINKS = [
  { label: 'Our Services', href: '/services/' },
  { label: 'Sustainability Integration', href: '/sustainability-integration/' },
  { label: 'Responsible Investment', href: '/responsible-investment/' },
  { label: 'Climate Action', href: '/climate-action/' },
];

function chooseCmsLinks(
  items: NavItem[],
  defaults: Array<{ label: string; href: string }>,
): Array<{ label: string; href: string }> {
  return defaults.map((fallback) => {
    const normalized = fallback.href.replace(/\/$/, '');
    const match = items.find((item) => item.href.replace(/\/$/, '') === normalized);
    return match ? { label: match.label, href: match.href } : fallback;
  });
}

export async function Footer() {
  const [footerNavigation, socialNavigation, settings] = await Promise.all([
    getNavigationItems('footer'),
    getNavigationItems('social'),
    getPublicSiteSettings(),
  ]);
  const quickLinks = chooseCmsLinks(footerNavigation, DEFAULT_QUICK_LINKS);
  const serviceLinks = chooseCmsLinks(footerNavigation, DEFAULT_SERVICE_LINKS);
  const newsletterHeading = textSetting(settings, 'footer.newsletterHeading', 'Subscribe to our newsletter');
  const brandTagline = textSetting(settings, 'footer.tagline', 'We help businesses progress on sustainability');
  const contactEmail = textSetting(settings, 'contact.email', 'connect@envintglobal.com');
  const copyright = textSetting(settings, 'footer.copyright', '© 2024 Envint Services LLP. All Rights Reserved');
  const designCredit = textSetting(settings, 'footer.designCredit', 'Designed by Envint Team');
  const socialLinks = socialNavigation.length > 0 ? socialNavigation : [
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/envintglobal/', openInNewTab: true },
    { id: 'twitter', label: 'Twitter', href: 'https://twitter.com/envintglobal', openInNewTab: true },
  ];

  return (
    <footer style={{ backgroundColor: '#F0F0F0', marginTop: 'auto', padding: '32px 0' }}>
      <div className="container footer-container">
        {/* Row 1 — Newsletter */}
        <div className="footer-newsletter-row">
          <div className="footer-newsletter-col1">
            <h3
              style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '24px',
                lineHeight: '28px',
                fontWeight: 500,
                color: '#404040',
                margin: '10px 0 0',
              }}
            >
              {newsletterHeading}
            </h3>
          </div>
          <div className="footer-newsletter-col2">
            <form action="/api/forms/newsletter" method="POST" className="footer-newsletter-form">
              <div style={{ display: 'none' }} aria-hidden="true">
                <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your mail"
                style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: '100%',
                  padding: '0 18px',
                  height: '49px',
                  borderRadius: '15px',
                  border: '0',
                  fontSize: '16px',
                  fontFamily: '"Neue Montreal", sans-serif',
                  color: '#475569',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  width: '107px',
                  height: '48px',
                  fontSize: '16px',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontWeight: 500,
                  backgroundColor: '#2F7ABE',
                  color: '#ffffff',
                  borderRadius: '15px',
                  border: '0',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Row 2 — Main 4 columns */}
        <div className="footer-cols-row">
          {/* Col 1: Logo & Mission */}
          <div className="footer-col-brand">
            <Link href="/" style={{ display: 'inline-block', marginBottom: '21px' }}>
              <Image
                src="/images/envint-logo.webp"
                alt="Envint - Business for Better"
                width={131}
                height={54}
                style={{ objectFit: 'contain', width: '131px', height: 'auto' }}
              />
            </Link>
            <p
              style={{
                fontFamily: '"Neue Montreal", sans-serif',
                color: '#3A3A3A',
                fontSize: '20px',
                lineHeight: '25px',
                fontWeight: 400,
                maxWidth: '283px',
                margin: 0,
              }}
            >
              {brandTagline}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col-links">
            <h4
              style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '18px',
                fontWeight: 500,
                color: '#686868',
                margin: '0 0 24px',
              }}
            >
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} style={linkStyle}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Services */}
          <div className="footer-col-links">
            <h4
              style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '18px',
                fontWeight: 500,
                color: '#686868',
                margin: '0 0 24px',
              }}
            >
              Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {serviceLinks.map((item) => (
                <Link key={item.href} href={item.href} style={linkStyle}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4: Social */}
          <div className="footer-col-links">
            <h4
              style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '18px',
                fontWeight: 500,
                color: '#686868',
                margin: '0 0 24px',
              }}
            >
              Social
            </h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {socialLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.openInNewTab ? '_blank' : undefined}
                rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                aria-label={`Envint ${item.label}`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#383838',
                }}
              >
                {item.label.toLowerCase().includes('linkedin') ? (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.63 1.63 0 1 0 0-3.26 1.63 1.63 0 0 0 0 3.26m1.4 9.74V9.93H5.06v8.57h2.8z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
              </a>
              ))}

              <a
                href={`mailto:${contactEmail}`}
                aria-label="Email Envint"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#383838',
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Row 3 — Bottom bar */}
        <div className="footer-bottom-bar">
          <div>
            {copyright} <span>|</span>{' '}
            <Link href="/disclaimer/" style={{ color: 'inherit' }}>
              Disclaimer
            </Link>
          </div>
          <div>{designCredit}</div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer-container {
          padding-left: 24px;
          padding-right: 24px;
        }
        .footer-newsletter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          padding-bottom: 28px;
          border-bottom: 1px solid #d7d7d7;
        }
        .footer-newsletter-col1 {
          flex: 1 1 300px;
        }
        .footer-newsletter-col2 {
          flex: 1 1 360px;
          display: flex;
          justify-content: flex-end;
        }
        .footer-newsletter-form {
          display: flex;
          gap: 10px;
          width: 100%;
          max-width: 490px;
        }
        @media (max-width: 768px) {
          .footer-newsletter-col2 {
            justify-content: flex-start;
          }
        }
        @media (max-width: 480px) {
          .footer-newsletter-form {
            flex-direction: column;
            align-items: stretch;
          }
          .footer-newsletter-form button {
            width: 100% !important;
          }
        }

        .footer-cols-row {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 32px 20px;
          padding: 35px 0 50px;
        }
        .footer-col-brand {
          flex: 1 1 280px;
          min-width: 240px;
        }
        .footer-col-links {
          flex: 1 1 180px;
          min-width: 140px;
        }
        @media (max-width: 640px) {
          .footer-col-brand {
            flex: 1 1 100%;
          }
          .footer-col-links {
            flex: 1 1 calc(50% - 10px);
          }
        }

        .footer-bottom-bar {
          border-top: 1px solid #d7d7d7;
          padding-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          font-family: "Neue Montreal", sans-serif;
          font-size: 16px;
          line-height: 20px;
          color: #6A6A6A;
          font-weight: 400;
        }
        @media (max-width: 640px) {
          .footer-bottom-bar {
            flex-direction: column;
            text-align: center;
            gap: 8px;
          }
        }
      ` }} />
    </footer>
  );
}

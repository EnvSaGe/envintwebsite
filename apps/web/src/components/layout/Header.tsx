'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Pages whose hero is a dark cover image: header starts transparent with white links
const DARK_HERO_PAGES = [
  '/',
  '/about',
  '/services',
  '/impact',
  '/careers-at-envint',
  '/connect',
  '/enviki',
  '/envision',
  '/behind-the-buzz',
  '/glossary-zone',
  '/how-to-articles',
  '/mapsense',
  '/connect-gbc2024',
];

// Pages whose hero area is white/light: header starts transparent (live behavior) but
// nav links must be dark so they stay visible on the light background (live pages
// 425/952/994 set #393939 for exactly these routes).
const LIGHT_HERO_PAGES = [
  '/sustainability-integration',
  '/responsible-investment',
  '/climate-action',
];

const SERVICES_MENU = [
  { label: 'Our Services', href: '/services/' },
  { label: 'Sustainability Integration', href: '/sustainability-integration/' },
  { label: 'Responsible Investment', href: '/responsible-investment/' },
  { label: 'Climate Action', href: '/climate-action/' },
];

const INSIGHTS_MENU = [
  { label: 'Envision', href: '/envision' },
  { label: 'Enviki', href: '/enviki/' },
];

interface DropdownProps {
  label: string;
  href: string;
  items: { label: string; href: string }[];
  linkColor: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function Dropdown({ label, href, items, linkColor, open, onOpen, onClose }: DropdownProps) {
  return (
    <div
      style={{ position: 'relative', marginRight: 20 }}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <Link
        href={href}
        style={{
          height: 80,
          display: 'flex',
          alignItems: 'center',
          padding: '0 15px',
          fontFamily: '"Neue Montreal", sans-serif',
          fontSize: 18,
          fontWeight: 400,
          color: linkColor,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
      </Link>

      {open && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: 300,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            borderRadius: 12,
            backgroundColor: 'rgba(47, 122, 190, 0.75)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            zIndex: 1001,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li
                key={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 60,
                  padding: '0 20px 0 35px',
                  borderBottom: isLast ? 'none' : '0.5px solid #FFFFFF',
                  transition: 'background-color 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLLIElement).style.backgroundColor = 'rgba(47, 122, 190, 0.90)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLLIElement).style.backgroundColor = 'transparent';
                }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: 18,
                    fontWeight: 400,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                  <Image
                    src="/images/whitearrow.webp"
                    alt=""
                    width={24}
                    height={24}
                    style={{ marginLeft: 'auto', width: 24, height: 24, flexShrink: 0 }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Live behavior: transparent over the hero, then a white fixed bar with #393939
  // links once scrolled. While transparent, dark-image heroes get white links and
  // light/white heroes get dark links so the navbar is always readable.
  const isDarkHeroPage = DARK_HERO_PAGES.some((p) => pathname === p || pathname === `${p}/`);
  const isLightHeroPage = LIGHT_HERO_PAGES.some((p) => pathname === p || pathname === `${p}/`);

  const transparent = (isDarkHeroPage || isLightHeroPage) && !scrolled;
  const linkColor = transparent && isDarkHeroPage ? '#ffffff' : '#393939';

  const topLevelLinkStyle = (active: boolean): React.CSSProperties => ({
    height: 80,
    display: 'flex',
    alignItems: 'center',
    marginRight: 20,
    padding: '0 15px',
    fontFamily: '"Neue Montreal", sans-serif',
    fontSize: 18,
    fontWeight: active ? 500 : 400,
    color: linkColor,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease',
  });

  return (
    <header
      className="envint-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 80,
        zIndex: 1000,
        backgroundColor: transparent ? 'transparent' : '#ffffff',
        borderBottom: transparent ? 'none' : '0.6px solid #dfdfdf',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 20px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo (live: 94 x 39) */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <Image
            src="/images/envint-logo.webp"
            alt="Envint - Business for Better"
            width={94}
            height={39}
            priority
            style={{ objectFit: 'contain', width: 94, height: 39 }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" style={{ alignItems: 'center' }}>
          <Link href="/about/" style={{ ...topLevelLinkStyle(pathname.startsWith('/about')), color: linkColor }}>
            <span style={{ color: linkColor }}>About</span>
          </Link>

          <Dropdown
            label="Services"
            href="/services/"
            items={SERVICES_MENU}
            linkColor={linkColor}
            open={servicesOpen}
            onOpen={() => setServicesOpen(true)}
            onClose={() => setServicesOpen(false)}
          />

          <Link href="/impact/" style={{ ...topLevelLinkStyle(pathname.startsWith('/impact')), color: linkColor }}>
            <span style={{ color: linkColor }}>Impact</span>
          </Link>

          <Link
            href="/careers-at-envint/"
            style={{ ...topLevelLinkStyle(pathname.startsWith('/careers-at-envint')), color: linkColor }}
          >
            <span style={{ color: linkColor }}>Careers</span>
          </Link>

          <Dropdown
            label="Insights"
            href="/envision/"
            items={INSIGHTS_MENU}
            linkColor={linkColor}
            open={insightsOpen}
            onOpen={() => setInsightsOpen(true)}
            onClose={() => setInsightsOpen(false)}
          />
        </nav>

        {/* Right side: Connect CTA + mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/connect/"
            className="header-connect-btn"
            style={{
              backgroundColor: '#2F7ABE',
              color: '#ffffff',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 'normal',
              padding: '8px 18px',
              borderRadius: 10,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(47, 122, 190, 0.25)',
              transition: 'transform 0.25s ease, background-color 0.25s ease',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.04)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
            }}
          >
            Connect
          </Link>

          <button
            type="button"
            className="mobile-nav-toggle"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={linkColor} strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={linkColor} strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
            borderBottom: '0.6px solid #dfdfdf',
            padding: '10px 24px 24px',
            zIndex: 999,
          }}
        >
          <MobileLink href="/about/" label="About" onNavigate={() => setMobileOpen(false)} />
          <MobileGroup
            label="Services"
            open={mobileServicesOpen}
            onToggle={() => setMobileServicesOpen(!mobileServicesOpen)}
            items={SERVICES_MENU}
            onNavigate={() => setMobileOpen(false)}
          />
          <MobileLink href="/impact/" label="Impact" onNavigate={() => setMobileOpen(false)} />
          <MobileLink href="/careers-at-envint/" label="Careers" onNavigate={() => setMobileOpen(false)} />
          <MobileGroup
            label="Insights"
            open={mobileInsightsOpen}
            onToggle={() => setMobileInsightsOpen(!mobileInsightsOpen)}
            items={INSIGHTS_MENU}
            onNavigate={() => setMobileOpen(false)}
          />
          <Link
            href="/connect/"
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 16,
              backgroundColor: '#2F7ABE',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: 10,
              textDecoration: 'none',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: 18,
              fontWeight: 400,
            }}
          >
            Connect
          </Link>
        </div>
      )}
    </header>
  );
}

function MobileLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      style={{
        display: 'block',
        padding: '10px 0',
        fontFamily: '"Neue Montreal", sans-serif',
        fontSize: 18,
        fontWeight: 400,
        color: '#393939',
        textDecoration: 'none',
      }}
    >
      {label}
    </Link>
  );
}

function MobileGroup({
  label,
  open,
  onToggle,
  items,
  onNavigate,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  items: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '10px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: '"Neue Montreal", sans-serif',
          fontSize: 18,
          fontWeight: 400,
          color: '#393939',
          textAlign: 'left',
        }}
      >
        {label}
        <span style={{ fontSize: 14, color: '#2F7ABE' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ paddingLeft: 16 }}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              style={{
                display: 'block',
                padding: '8px 0',
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 15,
                fontWeight: 400,
                color: '#555555',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
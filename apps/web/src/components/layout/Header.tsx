'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { HeaderNavEntry } from '@/lib/data/layout-content';

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

const DEFAULT_NAVIGATION: HeaderNavEntry[] = [
  { label: 'About', href: '/about/', items: [] },
  {
    label: 'Services',
    href: '/services/',
    items: [
      { label: 'Our Services', href: '/services/' },
      { label: 'Sustainability Integration', href: '/sustainability-integration/' },
      { label: 'Responsible Investment', href: '/responsible-investment/' },
      { label: 'Climate Action', href: '/climate-action/' },
    ],
  },
  { label: 'Impact', href: '/impact/', items: [] },
  { label: 'Careers', href: '/careers-at-envint/', items: [] },
  {
    label: 'Insights',
    href: '/envision/',
    items: [
      { label: 'Envision', href: '/envision/' },
      { label: 'Enviki', href: '/enviki/' },
    ],
  },
  { label: 'Connect', href: '/connect/', items: [] },
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
  const menuId = `desktop-menu-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <div
      style={{ position: 'relative', marginRight: 20 }}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <Link
        href={href}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          {label}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={linkColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: 'transform 0.2s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              marginTop: 2,
            }}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </Link>

      {open && (
        <ul
          id={menuId}
          role="menu"
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

export function Header({ navigation = [] }: { navigation?: HeaderNavEntry[] }) {
  const pathname = usePathname();
  const navEntries = navigation.length > 0 ? navigation : DEFAULT_NAVIGATION;
  const connectEntry = navEntries.find((item) => item.href.startsWith('/connect')) ?? DEFAULT_NAVIGATION[5];
  const menuEntries = navEntries.filter((item) => item !== connectEntry);

  const [scrolled, setScrolled] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroupOpen, setMobileGroupOpen] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const closeMenus = () => {
      setDesktopOpen(null);
      setMobileOpen(false);
      setMobileGroupOpen(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenus();
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) closeMenus();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  // Live behavior: transparent over the hero, then a white fixed bar with #393939
  // links once scrolled. While transparent, dark-image heroes get white links and
  // light/white heroes get dark links so the navbar is always readable.
  const isDarkHeroPage = DARK_HERO_PAGES.some((p) => pathname === p || pathname === `${p}/`);
  const isLightHeroPage = LIGHT_HERO_PAGES.some((p) => pathname === p || pathname === `${p}/`);

  const transparent = (isDarkHeroPage || isLightHeroPage) && !scrolled;
  const linkColor = transparent && isDarkHeroPage ? '#ffffff' : '#393939';
  const mobileIconColor = transparent ? '#777777' : linkColor;

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
      ref={headerRef}
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
          {menuEntries.map((entry) => entry.items.length > 0 ? (
            <Dropdown
              key={entry.href}
              label={entry.label}
              href={entry.href}
              items={entry.items}
              linkColor={linkColor}
              open={desktopOpen === entry.href}
              onOpen={() => setDesktopOpen(entry.href)}
              onClose={() => setDesktopOpen(null)}
            />
          ) : (
            <Link
              key={entry.href}
              href={entry.href}
              style={{ ...topLevelLinkStyle(pathname.startsWith(entry.href.replace(/\/$/, ''))), color: linkColor }}
            >
              <span style={{ color: linkColor }}>{entry.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right side: Connect CTA + mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href={connectEntry.href}
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
            {connectEntry.label}
          </Link>

          <button
            type="button"
            className="mobile-nav-toggle"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={mobileIconColor} strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={mobileIconColor} strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
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
          {menuEntries.map((entry) => entry.items.length > 0 ? (
            <MobileGroup
              key={entry.href}
              label={entry.label}
              open={mobileGroupOpen === entry.href}
              onToggle={() => setMobileGroupOpen(mobileGroupOpen === entry.href ? null : entry.href)}
              items={entry.items}
              onNavigate={() => setMobileOpen(false)}
            />
          ) : (
            <MobileLink
              key={entry.href}
              href={entry.href}
              label={entry.label}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
          <Link
            href={connectEntry.href}
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
            {connectEntry.label}
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
  const menuId = `mobile-menu-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={menuId}
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
        <div id={menuId} style={{ paddingLeft: 16 }}>
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

import Image from 'next/image';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Briefcase, 
  Users, 
  Image as ImageIcon, 
  Settings,
  ExternalLink,
  Layers3
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Pages & Layouts', href: '/pages', icon: FileText },
  { label: 'Shared Templates', href: '/templates', icon: Layers3 },
  { label: 'Insights & Articles', href: '/insights', icon: BookOpen },
  { label: 'Case Studies', href: '/case-studies', icon: Briefcase },
  { label: 'Team & Leadership', href: '/team', icon: Users },
  { label: 'Media Library', href: '/media', icon: ImageIcon },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ currentPath }: { currentPath?: string }) {
  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #1e293b',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            flexShrink: 0
          }}>
            <Image
              src="/brand/envint.png"
              alt="Envint Logo"
              width={30}
              height={30}
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              priority
            />
          </div>
          <div>
            <div style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.05rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>ENVINT</span>
              <span style={{ color: '#45b653', fontWeight: 700, fontSize: '0.8rem', backgroundColor: 'rgba(69, 182, 83, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>CMS</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#3079bd', fontWeight: 600, letterSpacing: '0.01em', marginTop: '2px' }}>
              business for better
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive ? '#45b653' : '#94a3b8',
                backgroundColor: isActive ? 'rgba(69, 182, 83, 0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid #3079bd' : '3px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={18} color={isActive ? '#45b653' : '#94a3b8'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Live Site Quick Link */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b' }}>
        <a
          href="https://envintglobal.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: '#1e293b',
            color: '#cbd5e1',
            fontSize: '0.8rem',
            fontWeight: 500,
            border: '1px solid rgba(48, 121, 189, 0.2)'
          }}
        >
          <span>View Live Website</span>
          <ExternalLink size={14} color="#3079bd" />
        </a>
      </div>

      {/* User Profile Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UserButton />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>Team Account</div>
            <div style={{ fontSize: '0.72rem', color: '#45b653', fontWeight: 500 }}>Active • Free Tier</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

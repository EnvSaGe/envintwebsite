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
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>
            E
          </div>
          <div>
            <div style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.05rem', color: '#fff' }}>
              ENVINT <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>CMS</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Admin Portal</div>
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
                color: isActive ? '#10b981' : '#94a3b8',
                backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={18} />
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
            fontWeight: 500
          }}
        >
          <span>View Live Website</span>
          <ExternalLink size={14} color="#94a3b8" />
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
            <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 500 }}>Active • Free Tier</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

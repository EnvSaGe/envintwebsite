import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getTeamMember, getTeamMembers } from '@/lib/data/team';
import { JsonLd, personProfileSchema } from '@/components/seo/JsonLd';

interface MemberPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const members = await getTeamMembers();
  return members.map((m: any) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: MemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMember(slug);
  if (!member) return { title: 'Team Member Profile - Envint' };

  return {
    title: `${member.name} | Envint`,
    description: (member as any).shortBio || (member as any).bio?.slice(0, 150) || `${member.name} at Envint`,
    alternates: {
      canonical: `https://envintglobal.com/member/${slug}/`,
    },
  };
}

export default async function TeamMemberPage({ params }: MemberPageProps) {
  const { slug } = await params;
  const member = await getTeamMember(slug);

  if (!member) {
    notFound();
  }

  const avatarUrl = (member as any).image?.url || `/images/team-${slug}.webp`;
  const absoluteAvatar = avatarUrl.startsWith('http') ? avatarUrl : `https://envintglobal.com${avatarUrl}`;
  const bioParagraphs = String((member as any).bio || '')
    .split(/\n{2,}/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '104px 0 120px' }}>
      <JsonLd
        data={personProfileSchema({
          name: member.name,
          url: `/member/${slug}/`,
          jobTitle: member.roleTitle,
          description:
            (member as any).shortBio ||
            String((member as any).bio || '').slice(0, 160) ||
            `${member.name} - ${member.roleTitle} at Envint`,
          image: absoluteAvatar,
          sameAs: (member as any).linkedinUrl || undefined,
        })}
      />
      <div className="container" style={{ maxWidth: '850px' }}>
        <Link
          href="/about/#team"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-brand-blue)',
            fontWeight: 600,
            fontSize: '0.95rem',
            marginBottom: '40px',
            textDecoration: 'none',
          }}
        >
          ← Back to Team
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px',
          alignItems: 'start',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '48px',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid #eef2f6',
        }}>
          {/* Avatar Column */}
          <div>
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: '#f1f5f9',
              marginBottom: '20px',
            }}>
              <Image
                src={avatarUrl}
                alt={member.name}
                fill
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>

            {(member as any).linkedinUrl && (
              <a
                href={(member as any).linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0a66c2',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>in</span>
                <span>Connect on LinkedIn</span>
              </a>
            )}
          </div>

          {/* Details Column */}
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              color: 'var(--color-brand-green-dark)',
              marginBottom: '8px',
              fontWeight: 700,
            }}>
              {member.name}
            </h1>

            <p style={{
              fontSize: '1.25rem',
              color: 'var(--color-brand-blue)',
              fontWeight: 600,
              marginBottom: '24px',
            }}>
              {member.roleTitle}
            </p>

            <div style={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: 'var(--color-text-body)',
            }}>
              {bioParagraphs.length > 0 ? (
                bioParagraphs.map((paragraph: string, i: number) => (
                  <p key={i} style={{ marginBottom: i < bioParagraphs.length - 1 ? '1em' : 0 }}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>
                  Leading multidisciplinary sustainability integration and climate action advisory for corporates, investors, and public sector stakeholders across global markets.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

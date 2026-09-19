import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getInsights } from '@/lib/data/insights';
import { getImpacts } from '@/lib/data/impacts';
import { getTeamMembers } from '@/lib/data/team';
import { resolveCmsImage } from '@envint/shared';

export const metadata: Metadata = {
  title: 'Search Results | Envint',
  description: 'Search across articles, case studies, insights, and advisory solutions at Envint.',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q || '').trim();
  const cleanQ = query.toLowerCase();

  let matchedInsights: any[] = [];
  let matchedImpacts: any[] = [];
  let matchedTeam: any[] = [];

  if (cleanQ) {
    const [allInsights, allImpacts, allTeam] = await Promise.all([
      getInsights(),
      getImpacts(),
      getTeamMembers(),
    ]);

    matchedInsights = (allInsights || []).filter((item: any) => {
      const title = String(item.title || '').toLowerCase();
      const excerpt = String(item.excerpt || '').toLowerCase();
      const content = String(item.contentHtml || '').toLowerCase();
      const categories = Array.isArray(item.categories) ? item.categories.join(' ').toLowerCase() : '';
      return title.includes(cleanQ) || excerpt.includes(cleanQ) || content.includes(cleanQ) || categories.includes(cleanQ);
    });

    matchedImpacts = (allImpacts || []).filter((item: any) => {
      const title = String(item.title || '').toLowerCase();
      const summary = String(item.summary || '').toLowerCase();
      const clientType = String(item.clientType || '').toLowerCase();
      const categories = Array.isArray(item.categories) ? item.categories.join(' ').toLowerCase() : '';
      const sector = String(item.sector?.name || '').toLowerCase();
      const service = String(item.service?.name || '').toLowerCase();
      return title.includes(cleanQ) || summary.includes(cleanQ) || clientType.includes(cleanQ) || categories.includes(cleanQ) || sector.includes(cleanQ) || service.includes(cleanQ);
    });

    matchedTeam = (allTeam || []).filter((item: any) => {
      const name = String(item.name || '').toLowerCase();
      const role = String(item.roleTitle || item.role || '').toLowerCase();
      const bio = String(item.bio || '').toLowerCase();
      return name.includes(cleanQ) || role.includes(cleanQ) || bio.includes(cleanQ);
    });
  }

  const totalResults = matchedInsights.length + matchedImpacts.length + matchedTeam.length;

  return (
    <main style={{ minHeight: '80vh', backgroundColor: '#F8FAFC', paddingTop: '120px', paddingBottom: '90px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px' }}>
        {/* Search header & refine input */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', color: '#10B981', textTransform: 'uppercase' }}>
            Site Search
          </span>
          <h1 style={{ fontFamily: 'Neue Montreal, sans-serif', fontSize: '40px', fontWeight: 500, color: '#004E35', margin: '8px 0 20px' }}>
            {query ? `Search Results for “${query}”` : 'Search Envint'}
          </h1>

          <form action="/search" method="GET" style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', gap: '8px', backgroundColor: '#ffffff', borderRadius: '9999px', padding: '6px 8px 6px 20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,78,53,0.06)' }}>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search articles, case studies, team..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#0f172a', backgroundColor: 'transparent' }}
            />
            <button
              type="submit"
              style={{ backgroundColor: '#004E35', color: '#ffffff', border: 'none', borderRadius: '9999px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              Search
            </button>
          </form>

          {query && (
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '16px' }}>
              Found {totalResults} result{totalResults === 1 ? '' : 's'} across Envint
            </p>
          )}
        </div>

        {/* Results */}
        {query && totalResults === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '18px', fontWeight: 500, color: '#1e293b', marginBottom: '8px' }}>
              No results found matching &ldquo;{query}&rdquo;
            </p>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              Try searching with broader terms like &ldquo;climate&rdquo;, &ldquo;ESG&rdquo;, &ldquo;decarbonization&rdquo;, or &ldquo;SEBI&rdquo;.
            </p>
            <Link
              href="/envision"
              style={{ display: 'inline-block', backgroundColor: '#004E35', color: '#ffffff', padding: '10px 24px', borderRadius: '9999px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
            >
              Browse All Insights
            </Link>
          </div>
        )}

        {/* Case Studies Section */}
        {matchedImpacts.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              <h2 style={{ fontFamily: 'Neue Montreal, sans-serif', fontSize: '22px', fontWeight: 600, color: '#004E35', margin: 0 }}>
                Case Studies ({matchedImpacts.length})
              </h2>
              <Link href="/impact" style={{ color: '#10B981', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                View all case studies &rarr;
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
              {matchedImpacts.map((item: any) => (
                <Link
                  key={item.slug}
                  href={`/impact/${item.slug}/`}
                  style={{ textDecoration: 'none', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ height: '180px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                    <img
                      src={resolveCmsImage(item.coverImage?.url || item.coverImageUrl || '/images/services-sustainability.webp')}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {item.clientType || 'Case Study'}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px', lineHeight: '1.3' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0, flex: 1 }}>
                      {item.summary ? `${item.summary.slice(0, 110)}...` : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Articles Section */}
        {matchedInsights.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              <h2 style={{ fontFamily: 'Neue Montreal, sans-serif', fontSize: '22px', fontWeight: 600, color: '#004E35', margin: 0 }}>
                Insights & Articles ({matchedInsights.length})
              </h2>
              <Link href="/envision" style={{ color: '#10B981', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                View all insights &rarr;
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
              {matchedInsights.map((item: any) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}/`}
                  style={{ textDecoration: 'none', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ height: '180px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                    <img
                      src={resolveCmsImage(item.coverImage?.url || item.coverImageUrl || '/images/hero-wetland.webp')}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Article
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px', lineHeight: '1.3' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0, flex: 1 }}>
                      {item.excerpt ? `${item.excerpt.slice(0, 110)}...` : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Team Members Section */}
        {matchedTeam.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              <h2 style={{ fontFamily: 'Neue Montreal, sans-serif', fontSize: '22px', fontWeight: 600, color: '#004E35', margin: 0 }}>
                Team & Leadership ({matchedTeam.length})
              </h2>
              <Link href="/about" style={{ color: '#10B981', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                View all team &rarr;
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '20px' }}>
              {matchedTeam.map((member: any) => (
                <div
                  key={member.slug}
                  style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px', textAlign: 'center' }}
                >
                  <img
                    src={resolveCmsImage(member.avatarUrl || member.avatar?.url || member.image?.url || '/images/default-avatar.webp')}
                    alt={member.name}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px' }}
                  />
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>
                    {member.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    {member.roleTitle || member.role || 'Envint Team'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

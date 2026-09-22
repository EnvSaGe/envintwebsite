'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchPageTreeAction, fetchPageBySlug } from '../actions';
import { PageBlockTree, createStarterPageTree, type StudioDynamicModules } from '@envint/shared';
import { VisualStudioEditor } from './studio/VisualStudioEditor';

// ------------------------------------------------------------------
// Full-screen loading skeleton shown while fetching page data
// ------------------------------------------------------------------
function EditorLoadingSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#0f172a',
        overflow: 'hidden',
      }}
    >
      {/* Left panel skeleton */}
      <div
        style={{
          width: '256px',
          backgroundColor: '#1e293b',
          borderRight: '1px solid #334155',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px',
        }}
      >
        {[80, 60, 70, 55, 65].map((w, i) => (
          <div
            key={i}
            style={{
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#273549',
              width: `${w}%`,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
      </div>

      {/* Centre canvas skeleton */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#0b1329',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '3px solid #334155',
            borderTopColor: '#38bdf8',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: '6px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Loading Envint CMS Studio…
          </div>
          <div style={{ fontSize: '0.82rem', color: '#64748b', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Fetching page data
          </div>
        </div>
      </div>

      {/* Right panel skeleton */}
      <div
        style={{
          width: '328px',
          backgroundColor: '#1a2740',
          borderLeft: '1px solid #334155',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px',
        }}
      >
        {[70, 90, 55, 80, 60].map((w, i) => (
          <div
            key={i}
            style={{
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#243349',
              width: `${w}%`,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
      </div>

      {/* Keyframes injected inline */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.9; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ------------------------------------------------------------------
// Error screen shown when a page cannot be loaded at all
// ------------------------------------------------------------------
function EditorErrorScreen({ slug, message }: { slug: string; message: string }) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        flexDirection: 'column',
        gap: '12px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'center',
        padding: '40px',
      }}
    >
      <div style={{ fontSize: '2.5rem' }}>⚠️</div>
      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
        Unable to open editor
      </div>
      <div style={{ fontSize: '0.88rem', color: '#94a3b8', maxWidth: '420px' }}>
        {message || `Could not load page data for "${slug}".`}
      </div>
      <a
        href="/pages"
        style={{
          marginTop: '12px',
          padding: '9px 22px',
          borderRadius: '8px',
          backgroundColor: '#1e293b',
          color: '#94a3b8',
          textDecoration: 'none',
          fontSize: '0.85rem',
          fontWeight: 600,
          border: '1px solid #334155',
        }}
      >
        ← Back to Pages
      </a>
    </div>
  );
}

// ------------------------------------------------------------------
// Main content – fetches data, then renders the Visual Studio Editor
// ------------------------------------------------------------------
function PageBuilderContent() {
  const searchParams = useSearchParams();
  const slug = (searchParams && searchParams.get('slug')) || '/about';

  // Data loading states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Studio data
  const [studioTree, setStudioTree] = useState<PageBlockTree | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [noIndex, setNoIndex] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<
    Array<{ name: string; role?: string | null; imageUrl?: string | null }>
  >([]);
  const [dynamicModules, setDynamicModules] = useState<StudioDynamicModules>({});

  // Fetch page data on mount / slug change
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setLoadError(null);
      try {
        // 1. Try Schema v2 PageBlockTree first
        const treeData = await fetchPageTreeAction(slug);
        if (treeData?.tree) {
          setStudioTree(treeData.tree);
          setPageTitle(treeData.title || slug);
          setSeoTitle(treeData.seoTitle || '');
          setSeoDescription(treeData.seoDescription || '');
          setCanonicalUrl((treeData as any).canonicalUrl || '');
          setOgImageUrl((treeData as any).ogImageUrl || '');
          setNoIndex((treeData as any).noIndex ?? false);
          setScheduledAt((treeData as any).scheduledAt || null);
          if (Array.isArray(treeData.teamMembers)) {
            setTeamMembers(treeData.teamMembers);
          }
          setDynamicModules(treeData.dynamicModules || {});
          return; // tree found – done
        }

        // 2. Fallback: fetch legacy page record so the backend can auto-convert it
        const legacyData = await fetchPageBySlug(slug);
        if (legacyData) {
          setPageTitle(legacyData.title || slug);
          setSeoTitle(legacyData.seoTitle || '');
          setSeoDescription(legacyData.seoDescription || '');
          setCanonicalUrl((legacyData as any).canonicalUrl || '');
          setOgImageUrl((legacyData as any).ogImageUrl || '');
          setNoIndex((legacyData as any).noIndex ?? false);
        }

        // 3. If still no tree, create a starter tree so the editor is never blank
        setStudioTree(createStarterPageTree(legacyData?.title || slug));
      } catch (err: any) {
        console.error('Error loading page:', err);
        setLoadError(err?.message || 'An unexpected error occurred while loading the page.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  // While loading, show a proper skeleton — never the legacy editor
  if (isLoading) {
    return <EditorLoadingSkeleton />;
  }

  // On hard error, show a helpful error screen
  if (loadError) {
    return <EditorErrorScreen slug={slug} message={loadError} />;
  }

  // studioTree is always set at this point (either fetched or starter)
  return (
    <VisualStudioEditor
      initialTree={studioTree!}
      teamMembers={teamMembers}
      dynamicModules={dynamicModules}
      slug={slug}
      pageTitle={pageTitle || slug}
      seoTitle={seoTitle}
      seoDescription={seoDescription}
      canonicalUrl={canonicalUrl}
      ogImageUrl={ogImageUrl}
      noIndex={noIndex}
      scheduledAt={scheduledAt}
    />
  );
}

// ------------------------------------------------------------------
// Public default export – wraps in Suspense for useSearchParams
// ------------------------------------------------------------------
export default function PageBuilderEditor() {
  return (
    <Suspense fallback={<EditorLoadingSkeleton />}>
      <PageBuilderContent />
    </Suspense>
  );
}

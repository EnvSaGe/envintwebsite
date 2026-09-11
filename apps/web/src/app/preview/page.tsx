import React from 'react';
import { NextRequest } from 'next/server';
import { getPreviewBlocks } from '@/lib/preview-store';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';

export const dynamic = 'force-dynamic';

/**
 * GET /preview?slug=/about
 * Renders the editor's current (possibly unsaved) block state with the real
 * DynamicPageRenderer. The admin editor loads this URL in its iframe and
 * reloads it after each edit for a live preview without saving.
 */
export default async function PreviewPage({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const { slug } = await searchParams;
  const cleanSlug = slug ? (slug.startsWith('/') ? slug : `/${slug}`) : '/';

  const entry = await getPreviewBlocks(cleanSlug);

  if (!entry) {
    return (
      <div style={{ padding: '60px 40px', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#0f172a' }}>No preview data</h2>
        <p>Open the Page Builder in the admin app and click Refresh in the preview toolbar to load the latest unsaved edits.</p>
      </div>
    );
  }

  const page = {
    slug: cleanSlug,
    title: entry.title || cleanSlug,
    seoTitle: entry.seoTitle || '',
    seoDescription: entry.seoDescription || '',
    layoutTemplate: 'standard',
    contentBlocks: entry.blocks,
  };

  return (
    <main style={{ minHeight: '80vh' }}>
      <DynamicPageRenderer page={page} />
    </main>
  );
}

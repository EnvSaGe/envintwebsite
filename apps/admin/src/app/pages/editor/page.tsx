'use client';

/**
 * ============================================================================
 * EDITOR ROUTE ENTRY POINT (`/pages/editor`)
 * ============================================================================
 * 
 * PURPOSE:
 * Top-level route handler for the editor URL: `/pages/editor?slug=<page-slug>`.
 * 
 * ARCHITECTURE:
 * Mounts `EditorClient.tsx` which resolves the page from the database and
 * decides whether to render:
 *   - Modern Visual Studio Builder (`studio/VisualStudioEditor.tsx`) for Schema v2 pages
 *   - Legacy Block Editor form for Schema v1 pages
 * ============================================================================
 */

import PageBuilderEditor from './EditorClient';

export default function EditorPage() {
  return <PageBuilderEditor />;
}

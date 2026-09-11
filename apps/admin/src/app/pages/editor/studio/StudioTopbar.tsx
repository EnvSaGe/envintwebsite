'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  ExternalLink,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Rocket,
  Save,
} from 'lucide-react';
import { Breakpoint, StudioState } from './StudioState';

interface StudioTopbarProps {
  slug: string;
  pageTitle: string;
  state: StudioState;
  onSetBreakpoint: (bp: Breakpoint) => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenHistory: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPublishing: boolean;
}

export function StudioTopbar({
  slug,
  pageTitle,
  state,
  onSetBreakpoint,
  onUndo,
  onRedo,
  onOpenHistory,
  onSaveDraft,
  onPublish,
  isSaving,
  isPublishing,
}: StudioTopbarProps) {
  const canUndo = state.history.past.length > 0;
  const canRedo = state.history.future.length > 0;

  return (
    <header className="h-16 bg-[#001D14] border-b border-white/10 px-4 flex items-center justify-between z-30 select-none">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-4">
        <Link
          href="/pages"
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Pages</span>
        </Link>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-2.5">
          <span className="font-medium text-white text-base">{pageTitle}</span>
          <span className="text-xs font-mono bg-white/5 text-white/60 px-2 py-0.5 rounded border border-white/10">
            {slug}
          </span>
          {/* Status badge */}
          {state.saveStatus === 'saving' ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <Loader2 size={12} className="animate-spin" />
              Saving draft...
            </span>
          ) : state.isDirty ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Unsaved changes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
              <CheckCircle2 size={12} />
              Draft saved
            </span>
          )}
        </div>
      </div>

      {/* Center: Responsive Breakpoint Switcher */}
      <div className="flex items-center bg-black/30 border border-white/10 rounded-lg p-1">
        <button
          type="button"
          onClick={() => onSetBreakpoint('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            state.breakpoint === 'desktop'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          title="Desktop preview (100% width)"
        >
          <Monitor size={14} />
          <span>Desktop</span>
        </button>
        <button
          type="button"
          onClick={() => onSetBreakpoint('tablet')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            state.breakpoint === 'tablet'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          title="Tablet preview (768px frame)"
        >
          <Tablet size={14} />
          <span>Tablet</span>
        </button>
        <button
          type="button"
          onClick={() => onSetBreakpoint('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            state.breakpoint === 'mobile'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          title="Mobile preview (375px frame)"
        >
          <Smartphone size={14} />
          <span>Mobile</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-lg border border-white/10 transition-colors ${
            canUndo
              ? 'text-white/80 hover:text-white hover:bg-white/5'
              : 'text-white/20 cursor-not-allowed border-white/5'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-lg border border-white/10 transition-colors ${
            canRedo
              ? 'text-white/80 hover:text-white hover:bg-white/5'
              : 'text-white/20 cursor-not-allowed border-white/5'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* History */}
        <button
          type="button"
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          title="View revision snapshots and rollback"
        >
          <History size={14} />
          <span>History</span>
        </button>

        {/* Preview in Tab */}
        <a
          href={`https://envintglobal.vercel.app${slug === '/' ? '' : slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
        >
          <ExternalLink size={14} />
          <span>Live Site</span>
        </a>

        {/* Save Draft */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20 text-white hover:bg-white/10 transition-colors"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>Save Draft</span>
        </button>

        {/* Publish */}
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isPublishing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Rocket size={14} />
          )}
          <span>Publish Changes</span>
        </button>
      </div>
    </header>
  );
}

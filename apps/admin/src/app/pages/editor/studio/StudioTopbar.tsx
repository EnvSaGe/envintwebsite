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
  Loader2,
  Rocket,
  Save,
  PanelLeftClose,
  PanelRightClose,
  PanelLeftOpen,
  PanelRightOpen,
  Maximize,
  Minimize,
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
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  focusMode: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onToggleFocus: () => void;
}

const BREAKPOINTS: Array<{ id: Breakpoint; label: string; icon: React.ReactNode; title: string }> = [
  { id: 'desktop', label: 'Desktop', icon: <Monitor size={14} />, title: 'Desktop preview — full fluid width' },
  { id: 'tablet', label: 'Tablet', icon: <Tablet size={14} />, title: 'Tablet preview — 768px frame' },
  { id: 'mobile', label: 'Mobile', icon: <Smartphone size={14} />, title: 'Mobile preview — 390px frame' },
];

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
  leftCollapsed,
  rightCollapsed,
  focusMode,
  onToggleLeft,
  onToggleRight,
  onToggleFocus,
}: StudioTopbarProps) {
  const canUndo = state.history.past.length > 0;
  const canRedo = state.history.future.length > 0;

  return (
    <header className="z-30 flex h-12 shrink-0 items-center justify-between gap-2 overflow-hidden border-b border-slate-800/90 bg-[#0D1220] px-3 shadow-sm select-none">
      {/* Left: Back, Page Title, Slug & Status + panel toggle */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <IconToggle
          active={!leftCollapsed}
          title={leftCollapsed ? 'Show Components (Ctrl+\\)' : 'Hide Components (Ctrl+\\)'}
          onClick={onToggleLeft}
          label={leftCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        />

        <Link
          href="/pages"
          className="flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-xs text-slate-400 transition-all hover:border-slate-700/60 hover:bg-slate-800/70 hover:text-white"
          title="Back to Pages List"
        >
          <ArrowLeft size={14} />
          <span className="font-medium">Pages</span>
        </Link>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[13px] font-semibold tracking-tight text-slate-100">{pageTitle}</span>
          <span className="hidden rounded-md border border-slate-800 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 md:inline">
            {slug}
          </span>
          {state.saveStatus === 'saving' ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
              <Loader2 size={10} className="animate-spin" />
              Saving…
            </span>
          ) : state.isDirty ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
              <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400" />
              Unsaved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              <CheckCircle2 size={10} />
              Draft saved
            </span>
          )}
        </div>
      </div>

      {/* Center: Device switcher */}
      <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-slate-800 bg-slate-950/80 p-0.5 shadow-inner">
        {BREAKPOINTS.map((bp) => {
          const active = state.breakpoint === bp.id;
          return (
            <button
              key={bp.id}
              type="button"
              onClick={() => onSetBreakpoint(bp.id)}
              title={bp.title}
              aria-pressed={active}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                active
                  ? 'bg-emerald-500 font-semibold text-slate-950 shadow'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              {bp.icon}
              <span className="hidden sm:inline">{bp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-1.5">
        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950/60 p-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`rounded-md p-1.5 transition-colors ${
              canUndo ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'cursor-not-allowed text-slate-600'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`rounded-md p-1.5 transition-colors ${
              canRedo ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'cursor-not-allowed text-slate-600'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={14} />
          </button>
        </div>

        <IconToggle
          active={focusMode}
          title={focusMode ? 'Exit Focus Canvas (Esc)' : 'Focus Canvas (Shift+F)'}
          onClick={onToggleFocus}
          label={focusMode ? <Minimize size={15} /> : <Maximize size={15} />}
        />

        <IconToggle
          active={!rightCollapsed}
          title={rightCollapsed ? 'Show Inspector (Ctrl+\\)' : 'Hide Inspector (Ctrl+\\)'}
          onClick={onToggleRight}
          label={rightCollapsed ? <PanelRightOpen size={15} /> : <PanelRightClose size={15} />}
        />

        <div className="mx-0.5 h-4 w-px bg-slate-800" />

        <button
          type="button"
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1.5 text-[11px] font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          title="View revision snapshots and rollback"
        >
          <History size={13} />
          <span className="hidden lg:inline">History</span>
        </button>

        <a
          href={`https://envintglobal.vercel.app${slug === '/' ? '' : slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1.5 text-[11px] font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          title="Open live production page in new tab"
        >
          <ExternalLink size={13} />
          <span className="hidden lg:inline">Live Site</span>
        </a>

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-100 shadow-sm transition-all hover:bg-slate-800 hover:text-white active:scale-95"
        >
          {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          <span>Save</span>
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:bg-emerald-400 active:scale-[0.98]"
        >
          {isPublishing ? (
            <Loader2 size={13} className="animate-spin text-slate-950" />
          ) : (
            <Rocket size={13} className="text-slate-950" />
          )}
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
}

function IconToggle({
  active,
  title,
  onClick,
  label,
}: {
  active?: boolean;
  title: string;
  onClick: () => void;
  label: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`rounded-lg p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
        active ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

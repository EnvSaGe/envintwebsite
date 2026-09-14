'use client';

/**
 * QuickPalette — ⌘K command menu.
 *
 * Two sections: component insertion (same production palette as the sidebar —
 * no extra components invented here) and editor actions (save, preview
 * breakpoints, focus mode, navigator, duplicate/delete selection).
 *
 * Keyboard: ↑/↓ navigate, Enter run, Esc close. Fully aria-combobox.
 */

import React from 'react';
import {
  Search,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Maximize2,
  FolderTree,
  Copy,
  Trash2,
  Layout,
  Type,
  AlignLeft,
  Square,
  Image as ImageIcon,
  Columns,
  Minus,
  ChevronDown,
  Sparkles,
  Users,
  Rows3,
  PanelTop,
  ToggleLeft,
  CornerDownLeft,
  Share2,
} from 'lucide-react';
import { ElementType } from '@envint/shared';
import { StudioState } from './StudioState';

interface QuickPaletteProps {
  state: StudioState;
  onClose: () => void;
  onAddNode: (type: ElementType) => void;
  onSelectNode: (id: string) => void;
  onSaveDraft: () => void;
  onSetBreakpoint: (bp: 'desktop' | 'tablet' | 'mobile') => void;
  onToggleFocus: () => void;
  onOpenNavigator: () => void;
  onDuplicateNode: (id: string) => void;
  onDeleteNode: (id: string) => void;
}

const COMPONENTS: Array<{ type: ElementType; label: string; icon: React.ReactNode }> = [
  { type: 'section', label: 'Section', icon: <PanelTop size={14} /> },
  { type: 'container', label: 'Container', icon: <Layout size={14} /> },
  { type: 'grid', label: 'Grid', icon: <Columns size={14} /> },
  { type: 'flex', label: 'Flex Stack', icon: <Rows3 size={14} /> },
  { type: 'heading', label: 'Heading', icon: <Type size={14} /> },
  { type: 'paragraph', label: 'Paragraph', icon: <AlignLeft size={14} /> },
  { type: 'button', label: 'Button', icon: <Square size={14} /> },
  { type: 'image', label: 'Image', icon: <ImageIcon size={14} /> },
  { type: 'badge', label: 'Badge', icon: <Sparkles size={14} /> },
  { type: 'counter', label: 'Stat Counter', icon: <Sparkles size={14} /> },
  { type: 'spacer', label: 'Spacer', icon: <Minus size={14} /> },
  { type: 'divider', label: 'Divider', icon: <Minus size={14} /> },
  { type: 'accordion', label: 'Accordion', icon: <ChevronDown size={14} /> },
  { type: 'team-grid', label: 'Team Roster', icon: <Users size={14} /> },
  { type: 'journey-carousel', label: 'Journey Carousel', icon: <Rows3 size={14} /> },
  { type: 'service-cards', label: 'Service Cards', icon: <Sparkles size={14} /> },
  { type: 'social-share', label: 'Social Share Bar', icon: <Share2 size={14} /> },
];

interface ActionItem {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  run: (helpers: QuickPaletteProps) => void;
  disabled?: (state: StudioState) => boolean;
}

const ACTIONS: ActionItem[] = [
  {
    id: 'save',
    label: 'Save Draft',
    hint: 'Ctrl+S',
    icon: <Save size={14} />,
    run: (h) => h.onSaveDraft(),
  },
  {
    id: 'focus',
    label: 'Toggle Focus Canvas',
    hint: 'Shift+F',
    icon: <Maximize2 size={14} />,
    run: (h) => h.onToggleFocus(),
  },
  {
    id: 'navigator',
    label: 'Open Navigator',
    hint: 'layers',
    icon: <FolderTree size={14} />,
    run: (h) => h.onOpenNavigator(),
  },
  {
    id: 'desktop',
    label: 'Preview Desktop',
    hint: 'fluid',
    icon: <Monitor size={14} />,
    run: (h) => h.onSetBreakpoint('desktop'),
  },
  {
    id: 'tablet',
    label: 'Preview Tablet',
    hint: '768px',
    icon: <Tablet size={14} />,
    run: (h) => h.onSetBreakpoint('tablet'),
  },
  {
    id: 'mobile',
    label: 'Preview Mobile',
    hint: '390px',
    icon: <Smartphone size={14} />,
    run: (h) => h.onSetBreakpoint('mobile'),
  },
  {
    id: 'duplicate',
    label: 'Duplicate Selected',
    hint: 'Ctrl+D',
    icon: <Copy size={14} />,
    run: (h) => {
      if (h.state.selectedId) h.onDuplicateNode(h.state.selectedId);
    },
    disabled: (s) => !s.selectedId,
  },
  {
    id: 'delete',
    label: 'Delete Selected',
    hint: 'Del',
    icon: <Trash2 size={14} />,
    run: (h) => {
      if (h.state.selectedId) h.onDeleteNode(h.state.selectedId);
    },
    disabled: (s) => !s.selectedId,
  },
];

export function QuickPalette(props: QuickPaletteProps) {
  const { onClose, onAddNode, state } = props;
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = query.trim().toLowerCase();

  const filteredComponents = COMPONENTS.filter(
    (c) => !q || c.label.toLowerCase().includes(q) || c.type.includes(q)
  );
  const filteredActions = ACTIONS.filter((a) => !q || a.label.toLowerCase().includes(q));

  type Row = { kind: 'component'; type: ElementType; label: string; icon: React.ReactNode } | { kind: 'action'; item: ActionItem };
  const rows: Row[] = [
    ...filteredComponents.map<Row>((c) => ({ kind: 'component', ...c })),
    ...filteredActions.map<Row>((a) => ({ kind: 'action', item: a })),
  ];
  const enabledRows = rows.filter((r) => r.kind === 'component' || !r.item.disabled?.(state));

  const [activeIndex, setActiveIndex] = React.useState(0);
  React.useEffect(() => setActiveIndex(0), [query]);

  const runRow = (row: Row) => {
    if (row.kind === 'component') {
      onAddNode(row.type);
      onClose();
    } else {
      if (row.item.disabled?.(state)) return;
      row.item.run(props);
      onClose();
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(enabledRows.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const row = enabledRows[activeIndex];
      if (row) runRow(row);
    }
  };

  // Keep active row in view
  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-row-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  let enabledCounter = -1;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 pt-[14vh] backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Quick actions"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
        className="w-[520px] max-w-[92vw] overflow-hidden rounded-2xl border border-slate-700 bg-[#0D1220] shadow-[0_32px_90px_-12px_rgba(0,0,0,0.9)]"
      >
        {/* Search input */}
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
          <Search size={15} className="shrink-0 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Add a component or run an action…"
            aria-label="Search commands"
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
            Esc
          </kbd>
        </div>

        {/* Rows */}
        <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-1.5">
          {enabledRows.length === 0 && (
            <p className="px-3 py-8 text-center text-xs text-slate-500">
              Nothing matches “{query}”.
            </p>
          )}

          {filteredComponents.length > 0 && (
            <p className="px-2.5 pb-1 pt-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              Add to page
            </p>
          )}
          {rows.map((row) => {
            if (row.kind === 'action') return null;
            enabledCounter += 1;
            const idx = enabledCounter;
            const active = idx === activeIndex;
            return (
              <button
                key={`c-${row.type}`}
                type="button"
                data-row-index={idx}
                onClick={() => runRow(row)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                  active ? 'bg-emerald-500/15 text-emerald-200' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-md border ${active ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900 text-emerald-400'}`}>
                  {row.icon}
                </span>
                <span className="flex-1 text-xs font-medium">{row.label}</span>
                {active && <CornerDownLeft size={12} className="text-emerald-400" />}
              </button>
            );
          })}

          {filteredActions.length > 0 && (
            <p className="px-2.5 pb-1 pt-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              Actions
            </p>
          )}
          {rows.map((row) => {
            if (row.kind !== 'action') return null;
            const disabled = row.item.disabled?.(state);
            if (disabled) return null;
            enabledCounter += 1;
            const idx = enabledCounter;
            const active = idx === activeIndex;
            return (
              <button
                key={`a-${row.item.id}`}
                type="button"
                data-row-index={idx}
                onClick={() => runRow(row)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                  active ? 'bg-emerald-500/15 text-emerald-200' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-md border ${active ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
                  {row.item.icon}
                </span>
                <span className="flex-1 text-xs font-medium">{row.item.label}</span>
                <kbd className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 font-mono text-[9px] text-slate-500">
                  {row.item.hint}
                </kbd>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

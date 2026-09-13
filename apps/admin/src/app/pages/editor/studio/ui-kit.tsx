'use client';

/**
 * ui-kit.tsx — shared editor chrome primitives.
 *
 * One place for the editor's information hierarchy so individual panels never
 * sprinkle ad-hoc font sizes. Tokens live in admin-theme.css (.studio-shell).
 *
 * Hierarchy contract:
 *   - Selected element title   → 15px / 700   (ElementTitle)
 *   - Inspector tabs           → 13px / 600   (InspectorTabs)
 *   - Group headings           → 12px / 700 muted, title-case (InspectorSection)
 *   - Property labels          → 12px / 500   (PropertyLabel)
 *   - Control values           → 13px / 500   (controls themselves)
 *   - Helper text              → 11px / 400 muted (HelpText)
 *   - Breadcrumb               → 12px (BreadcrumbBar)
 *
 * Every icon-only control must be wrapped in <Tooltip> — icons never require
 * guessing. <PropertyLabel help="…"> gives important properties contextual
 * explanations that describe FUNCTION, not just restate the label.
 */

import React from 'react';
import { ChevronRight, ChevronDown, CircleHelp } from 'lucide-react';

/* ───────────────────────────────── Tooltip ───────────────────────────────── */

/**
 * Lightweight hover tooltip. Explains FUNCTION. 150ms delay, max 260px,
 * high-contrast dark surface. Pure CSS positioning — no portal needed for the
 * fixed-width Inspector context it is used in.
 */
export function Tooltip({
  label,
  children,
  side = 'bottom',
  className = '',
}: {
  /** Tooltip body — explains what the control DOES. */
  label: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom';
  className?: string;
}) {
  return (
    <span className={`group/tt relative inline-flex ${className}`} data-tooltip-side={side}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-50 hidden w-max max-w-[260px] -translate-x-1/2 rounded-lg border border-slate-700 bg-[#1A2236] px-2.5 py-1.5 text-[12px] leading-[1.45] text-slate-100 opacity-0 shadow-xl transition-opacity duration-150 group-hover/tt:block group-hover/tt:opacity-100 ${
          side === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5'
        }`}
      >
        {label}
      </span>
    </span>
  );
}

/* ─────────────────────────────── HelpPopover ─────────────────────────────── */

/**
 * Click-to-open help popover for complex settings: longer explanation,
 * optional example block. Used by PropertyLabel when `rich` help is needed.
 */
export function HelpPopover({
  title,
  body,
  example,
  children,
}: {
  title: string;
  body: React.ReactNode;
  /** Optional worked example, rendered in a subtle inset box. */
  example?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Help: ${title}`}
        className="rounded p-0.5 text-slate-500 transition hover:bg-slate-800 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      >
        {children}
      </button>
      {open && (
        <span
          role="dialog"
          aria-label={title}
          className="absolute right-0 top-full z-50 mt-1.5 block w-[260px] rounded-xl border border-slate-700 bg-[#1A2236] p-3 text-left shadow-2xl"
        >
          <span className="mb-1 block text-[12px] font-bold text-slate-100">{title}</span>
          <span className="block text-[12px] leading-[1.45] text-slate-300">{body}</span>
          {example && (
            <span className="mt-2 block rounded-lg border border-slate-700/70 bg-slate-950/60 px-2.5 py-2 text-[11px] leading-[1.5] text-slate-400">
              {example}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

/* ───────────────────────────── PropertyLabel ─────────────────────────────── */

/**
 * Property label row: human-readable name + optional contextual help.
 * `help` → hover tooltip. `rich` → click popover with example. 12px/500.
 */
export function PropertyLabel({
  label,
  help,
  rich,
  trailing,
}: {
  label: string;
  /** Short function-first explanation shown on hover. */
  help?: string;
  /** Complex setting → click opens a HelpPopover with an example. */
  rich?: { body: React.ReactNode; example?: React.ReactNode };
  trailing?: React.ReactNode;
}) {
  const helpIcon = <CircleHelp size={12} strokeWidth={2} />;
  return (
    <div className="mb-1 flex min-h-[18px] items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-1">
        <span className="truncate text-[12px] font-medium text-slate-300">{label}</span>
        {rich ? (
          <HelpPopover title={label} body={rich.body} example={rich.example}>
            {helpIcon}
          </HelpPopover>
        ) : help ? (
          <Tooltip label={help}>
            <span
              tabIndex={0}
              role="note"
              aria-label={`${label} help`}
              className="rounded p-0.5 text-slate-500 transition hover:bg-slate-800 hover:text-emerald-300 cursor-help"
            >
              {helpIcon}
            </span>
          </Tooltip>
        ) : null}
      </span>
      {trailing && <span className="shrink-0 text-[11px] text-slate-500">{trailing}</span>}
    </div>
  );
}

/** Small muted helper line (11px / 400). Use sparingly — only where useful. */
export function HelpText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-[11px] font-normal leading-[1.45] text-slate-500">{children}</p>;
}

/* ───────────────────────────── InspectorSection ──────────────────────────── */

const SECTION_STATE_KEY = 'envint.studio.sections.v1';

function loadSectionState(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(SECTION_STATE_KEY) || '{}') as Record<string, boolean>;
  } catch {
    return {};
  }
}

/**
 * Collapsible group heading — visually distinct from property labels:
 * title-case, 12px/700, chevron, subtle divider. Open/closed state persists
 * locally so editors keep their preferred layout.
 */
export function InspectorSection({
  id,
  title,
  defaultOpen = true,
  description,
  children,
  first,
}: {
  /** Stable key used for local persistence of open/closed state. */
  id: string;
  title: string;
  defaultOpen?: boolean;
  /** One-line explanation — only for genuinely complex groups. */
  description?: string;
  children: React.ReactNode;
  /** Suppress top margin when this is the first group in a panel. */
  first?: boolean;
}) {
  const initial = React.useMemo(loadSectionState, []);
  const [open, setOpen] = React.useState<boolean>(initial[id] ?? defaultOpen);

  const toggle = () => {
    setOpen((o) => {
      const next = !o;
      try {
        const all = loadSectionState();
        all[id] = next;
        window.localStorage.setItem(SECTION_STATE_KEY, JSON.stringify(all));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <section
      className={`${first ? '' : 'mt-3'} rounded-xl border border-slate-800/80 bg-[#111831]/60`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 border-b border-transparent px-3 py-2.5 text-left transition hover:bg-slate-800/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500/40 rounded-xl"
      >
        {open ? (
          <ChevronDown size={13} className="shrink-0 text-emerald-400" />
        ) : (
          <ChevronRight size={13} className="shrink-0 text-slate-500" />
        )}
        <span
          className={`text-[12px] font-bold tracking-wide ${
            open ? 'text-[var(--editor-heading-fg)]' : 'text-[var(--editor-heading-muted)]'
          }`}
        >
          {title}
        </span>
      </button>
      {open && (
        <div className="space-y-3.5 border-t border-slate-800/60 px-3 pb-3.5 pt-3">
          {description && <HelpText>{description}</HelpText>}
          {children}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────── IconButton ──────────────────────────────── */

/**
 * Icon-only action with a REQUIRED tooltip — icons must never require
 * guessing. 28px minimum click target.
 */
export function IconButton({
  icon,
  label,
  onClick,
  danger,
  active,
}: {
  icon: React.ReactNode;
  /** Shown as tooltip and exposed to screen readers. */
  label: string;
  onClick: () => void;
  danger?: boolean;
  active?: boolean;
}) {
  return (
    <Tooltip label={label} side="bottom">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={active}
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
          danger
            ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
            : active
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

/* ─────────────────────────────── BreadcrumbBar ───────────────────────────── */

/**
 * Element-hierarchy breadcrumb with smart collapsing.
 *
 * - 12px readable text, fixed-height row (no vertical clipping)
 * - outer shell clips overflow; inner region scrolls horizontally without a
 *   visible native scrollbar
 * - when narrow, middle segments collapse into a "…" button that expands to
 *   reveal the hidden ancestors; the deepest (most relevant) levels stay
 *   visible
 * - every segment is clickable (selects that ancestor) and exposes its full
 *   name via title tooltip when truncated
 */
export function BreadcrumbBar({
  items,
  onSelect,
}: {
  items: Array<{ id: string; name: string; type: string }>;
  onSelect: (id: string) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [overflowing, setOverflowing] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  // Detect horizontal overflow so we can offer smart collapsing.
  React.useEffect(() => {
    const check = () => {
      const el = scrollRef.current;
      if (!el) return;
      setOverflowing(el.scrollWidth > el.clientWidth + 2);
    };
    check();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length, expanded]);

  // Collapsed mode: keep root + last two levels visible, middle → "…".
  const collapseMiddle = overflowing && !expanded && items.length > 3;
  const visible = collapseMiddle
    ? [items[0], null, ...items.slice(items.length - 2)]
    : items;

  const hidden = collapseMiddle ? items.slice(1, items.length - 2) : [];

  return (
    <div
      className="overflow-hidden"
      style={{ height: 24 }}
      role="navigation"
      aria-label="Element hierarchy"
    >
      <div
        ref={scrollRef}
        className="no-scrollbar flex h-full items-center gap-0.5 overflow-x-auto text-[12px] leading-none"
      >
        {visible.map((item, i) => {
          if (item === null) {
            return (
              <React.Fragment key="ellipsis">
                {i > 0 && <BreadcrumbSep />}
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  title={
                    hidden.length
                      ? hidden.map((h) => h.name).join(' › ')
                      : 'Show hidden levels'
                  }
                  aria-label="Show hidden hierarchy levels"
                  className="shrink-0 rounded px-1 py-0.5 font-semibold text-slate-500 transition hover:bg-slate-800 hover:text-emerald-300"
                >
                  …
                </button>
              </React.Fragment>
            );
          }
          const isLast = item.id === items[items.length - 1].id;
          return (
            <React.Fragment key={item.id}>
              {i > 0 && <BreadcrumbSep />}
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                title={item.name}
                aria-current={isLast ? 'location' : undefined}
                className={`max-w-[160px] shrink-0 truncate rounded px-1.5 py-0.5 transition ${
                  isLast
                    ? 'font-semibold text-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                {item.name}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function BreadcrumbSep() {
  return <ChevronRight size={11} className="shrink-0 text-slate-600" aria-hidden />;
}

/* ──────────────────────────── Element title header ───────────────────────── */

/**
 * Selected-element header: human-friendly name dominant (15px/700), technical
 * block type visibly secondary (10px muted uppercase). Quick actions use
 * tooltip-equipped IconButtons.
 */
export function ElementTitle({
  name,
  type,
  actions,
}: {
  name: string;
  type: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[15px] font-bold leading-tight text-slate-50" title={name}>
          {name}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {type}
        </span>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-0.5">{actions}</div>}
    </div>
  );
}

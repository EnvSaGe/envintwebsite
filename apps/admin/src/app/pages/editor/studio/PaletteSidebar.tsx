'use client';

/**
 * PaletteSidebar — component library + Navigator.
 *
 * v2: COMPACT. Default is a 256px browser; collapsible to a 56px icon rail.
 * Tiles are 2-column icon+label with hover tooltip (no reserved hint line).
 *
 * PALETTE vs CANVAS: the palette lists components that MAY be added; the
 * canvas shows only what HAS been added. No demo content is inserted anywhere.
 */

import React from 'react';
import {
  Plus,
  Layout,
  Type,
  AlignLeft,
  Square,
  Image as ImageIcon,
  Columns,
  Minus,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Sparkles,
  Users,
  Search,
  X,
  FolderTree,
  MousePointerClick,
  Rows3,
  GripVertical,
  PanelTop,
  ToggleLeft,
  Layers,
  Share2,
} from 'lucide-react';
import { ElementType } from '@envint/shared';
import { StudioState } from './StudioState';

interface PaletteSidebarProps {
  state: StudioState;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onSelectNode: (id: string) => void;
  onAddNode: (type: ElementType) => void;
  onDuplicateNode: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRenameNode: (id: string, name: string) => void;
  onSetLeftTab: (tab: 'palette' | 'navigator' | 'templates') => void;
}

type Category = 'all' | 'layout' | 'basic' | 'interactive' | 'dynamic';

interface PaletteItemDef {
  type: ElementType;
  label: string;
  category: Exclude<Category, 'all'>;
  icon: React.ReactNode;
  hint: string;
  keywords: string[];
}

/** Intentional production components only — no dev/testing leftovers. */
const PALETTE_ITEMS: PaletteItemDef[] = [
  // ── LAYOUT ────────────────────────────────────────────────────────────────
  { type: 'section', label: 'Section', category: 'layout', icon: <PanelTop size={15} />, hint: 'Full-width page band', keywords: ['band', 'row'] },
  { type: 'container', label: 'Container', category: 'layout', icon: <Layout size={15} />, hint: 'Centered width box', keywords: ['wrapper', 'max width'] },
  { type: 'grid', label: 'Grid', category: 'layout', icon: <Columns size={15} />, hint: 'Responsive CSS grid', keywords: ['columns', 'cells'] },
  { type: 'flex', label: 'Flex Stack', category: 'layout', icon: <Rows3 size={15} />, hint: 'Vertical/horizontal stack', keywords: ['stack', 'row', 'column'] },
  { type: 'spacer', label: 'Spacer', category: 'layout', icon: <Minus size={15} />, hint: 'Vertical whitespace gap', keywords: ['gap', 'space'] },
  { type: 'divider', label: 'Divider', category: 'layout', icon: <Minus size={15} />, hint: 'Horizontal separator line', keywords: ['line', 'hr', 'rule'] },

  // ── CONTENT ───────────────────────────────────────────────────────────────
  { type: 'heading', label: 'Heading', category: 'basic', icon: <Type size={15} />, hint: 'Add heading text', keywords: ['title', 'h1', 'h2', 'text'] },
  { type: 'paragraph', label: 'Paragraph', category: 'basic', icon: <AlignLeft size={15} />, hint: 'Add body copy', keywords: ['text', 'copy', 'rich'] },
  { type: 'button', label: 'Button', category: 'basic', icon: <Square size={15} />, hint: 'Add clickable CTA', keywords: ['cta', 'link', 'action'] },
  { type: 'image', label: 'Image', category: 'basic', icon: <ImageIcon size={15} />, hint: 'Add image from S3 library', keywords: ['photo', 'picture', 'media'] },
  { type: 'badge', label: 'Badge', category: 'basic', icon: <Sparkles size={15} />, hint: 'Small category pill', keywords: ['pill', 'tag', 'label'] },
  { type: 'counter', label: 'Stat Counter', category: 'basic', icon: <Sparkles size={15} />, hint: 'Animated metric number', keywords: ['stat', 'number', 'metric'] },

  // ── INTERACTIVE ───────────────────────────────────────────────────────────
  { type: 'accordion', label: 'Accordion', category: 'interactive', icon: <ChevronDown size={15} />, hint: 'Expandable list items', keywords: ['faq', 'collapse', 'expand'] },
  { type: 'social-share', label: 'Social Share Bar', category: 'interactive', icon: <Share2 size={15} />, hint: 'Email, LinkedIn, X, Facebook buttons', keywords: ['share', 'social', 'facebook', 'linkedin', 'twitter'] },

  // ── DYNAMIC ───────────────────────────────────────────────────────────────
  { type: 'team-grid', label: 'Team Roster', category: 'dynamic', icon: <Users size={15} />, hint: 'Live leadership cards', keywords: ['team', 'people', 'members'] },
  { type: 'service-cards', label: 'Service Cards', category: 'dynamic', icon: <Sparkles size={15} />, hint: 'Advisory pillar cards', keywords: ['services', 'pillars'] },
];

/** Icon + short label for the collapsed rail mode. */
const RAIL_ITEMS: Array<{ id: Category | 'search'; label: string; icon: React.ReactNode }> = [
  { id: 'all', label: 'All', icon: <MousePointerClick size={16} /> },
  { id: 'layout', label: 'Layout', icon: <Layout size={16} /> },
  { id: 'basic', label: 'Content', icon: <Type size={16} /> },
  { id: 'interactive', label: 'Interactive', icon: <ToggleLeft size={16} /> },
  { id: 'dynamic', label: 'Dynamic', icon: <Sparkles size={16} /> },
];

const CATEGORIES: Array<{ id: Category; label: string; icon: React.ReactNode }> = [
  { id: 'all', label: 'All', icon: <MousePointerClick size={11} /> },
  { id: 'layout', label: 'Layout', icon: <Layout size={11} /> },
  { id: 'basic', label: 'Content', icon: <Type size={11} /> },
  { id: 'interactive', label: 'Interactive', icon: <ToggleLeft size={11} /> },
  { id: 'dynamic', label: 'Dynamic', icon: <Sparkles size={11} /> },
];

export function PaletteSidebar({
  state,
  collapsed,
  onToggleCollapsed,
  onSelectNode,
  onAddNode,
  onDuplicateNode,
  onDeleteNode,
  onToggleVisibility,
  onRenameNode,
  onSetLeftTab,
}: PaletteSidebarProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<Category>('all');
  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const [collapsedNodes, setCollapsedNodes] = React.useState<Record<string, boolean>>({});
  const [editingNodeId, setEditingNodeId] = React.useState<string | null>(null);
  const [editNameText, setEditNameText] = React.useState('');

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredPalette = PALETTE_ITEMS.filter((item) => {
    const matchesSearch =
      !normalizedSearch ||
      item.label.toLowerCase().includes(normalizedSearch) ||
      item.hint.toLowerCase().includes(normalizedSearch) ||
      item.keywords.some((k) => k.includes(normalizedSearch));
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const counts = React.useMemo(() => {
    const map: Record<string, number> = { all: PALETTE_ITEMS.length };
    for (const item of PALETTE_ITEMS) map[item.category] = (map[item.category] || 0) + 1;
    return map;
  }, []);

  /* ── Collapsed icon rail (56px) ──────────────────────────────────────── */
  if (collapsed) {
    return (
      <aside className="flex h-full w-14 shrink-0 flex-col items-center gap-1 border-r border-slate-800/90 bg-[#0D1220] py-2 select-none">
        <RailButton
          active={state.activeLeftTab === 'palette'}
          title="Components"
          icon={<Plus size={17} />}
          onClick={() => {
            onSetLeftTab('palette');
            onToggleCollapsed();
          }}
        />
        <RailButton
          active={state.activeLeftTab === 'navigator'}
          title={`Navigator (${Object.keys(state.tree.nodes).length})`}
          icon={<Layers size={17} />}
          onClick={() => {
            onSetLeftTab('navigator');
            onToggleCollapsed();
          }}
        />
        <div className="my-1 h-px w-7 bg-slate-800" />
        {RAIL_ITEMS.map((item) => (
          <RailButton
            key={item.id}
            active={state.activeLeftTab === 'palette' && activeCategory === item.id}
            title={item.label}
            icon={item.icon}
            onClick={() => {
              onSetLeftTab('palette');
              if (item.id !== 'search') setActiveCategory(item.id as Category);
            }}
          />
        ))}
        <div className="mt-auto">
          <RailButton title="Expand panel" icon={<ChevronsRight size={16} />} onClick={onToggleCollapsed} />
        </div>
      </aside>
    );
  }

  /* ── Expanded browser (resizable width set by shell) ─────────────────── */
  return (
    <aside className="flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden border-r border-slate-800/90 bg-[#0D1220] select-none">
      {/* Mode switcher + collapse */}
      <div className="border-b border-slate-800/80 bg-slate-950/40 p-2">
        <div className="flex items-center gap-1">
          <div className="flex flex-1 gap-1 rounded-xl border border-slate-800 bg-slate-950/70 p-1">
            <TabButton
              active={state.activeLeftTab === 'palette'}
              onClick={() => onSetLeftTab('palette')}
              icon={<Plus size={13} />}
              label="Add"
            />
            <TabButton
              active={state.activeLeftTab === 'navigator'}
              onClick={() => onSetLeftTab('navigator')}
              icon={<FolderTree size={13} />}
              label="Layers"
              badge={Object.keys(state.tree.nodes).length}
            />
          </div>
          <button
            type="button"
            onClick={onToggleCollapsed}
            title="Collapse panel (Ctrl+\)"
            aria-label="Collapse left panel"
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <ChevronsLeft size={15} />
          </button>
        </div>
      </div>

      {/* ── Palette mode ──────────────────────────────────────────────── */}
      {state.activeLeftTab === 'palette' && (
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Search + filters */}
          <div className="space-y-2 border-b border-slate-800/80 px-2.5 py-2.5">
            <div className="relative">
              <Search size={12} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchTerm('');
                }}
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950 py-1.5 pl-7 pr-7 text-xs text-slate-100 shadow-inner transition placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    searchRef.current?.focus();
                  }}
                  title="Clear search"
                  aria-label="Clear search"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="no-scrollbar -mx-0.5 flex max-w-full gap-1 overflow-x-auto px-0.5 pb-0.5" role="tablist" aria-label="Component categories">
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex h-[24px] shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      active
                        ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                        : 'border-slate-700/80 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                  >
                    {active && <span className="text-[10px] leading-none">✓</span>}
                    <span>{cat.label}</span>
                    <span
                      className={`rounded px-1 font-mono text-[9px] leading-[14px] ${
                        active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {counts[cat.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact 2-col tiles */}
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-2.5">
            {filteredPalette.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <Search size={20} className="text-slate-600" />
                <p className="text-xs font-semibold text-slate-300">
                  No components found{searchTerm ? ` for “${searchTerm}”` : ''}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 pb-6">
                {filteredPalette.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', item.type);
                      e.dataTransfer.setData('application/envint-palette-type', item.type);
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    onClick={() => onAddNode(item.type)}
                    title={`${item.label} — ${item.hint}`}
                    aria-label={`Add ${item.label}`}
                    className="group flex cursor-grab flex-col items-center justify-center gap-1 rounded-lg border border-slate-800/80 bg-slate-900/40 px-1.5 py-2.5 transition-all hover:-translate-y-px hover:border-emerald-500/50 hover:bg-slate-800/80 hover:shadow-md hover:shadow-emerald-500/5 active:cursor-grabbing active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-emerald-400 transition-transform group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="w-full truncate text-center text-[12.5px] font-medium leading-tight text-slate-200">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Navigator mode ────────────────────────────────────────────── */}
      {state.activeLeftTab === 'navigator' && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-slate-800/80 px-3 py-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <FolderTree size={12} /> Layers
            </span>
            <button
              type="button"
              onClick={() => setCollapsedNodes({})}
              className="rounded px-1.5 py-0.5 text-[10px] text-slate-500 hover:bg-slate-800 hover:text-slate-200"
              title="Expand all layers"
            >
              Expand all
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {state.tree.rootIds.length === 0 ? (
              <p className="px-2 py-6 text-center text-[11px] text-slate-500">
                No layers yet — add a Section to begin.
              </p>
            ) : (
              state.tree.rootIds.map((rootId) => (
                <NavigatorNodeItem
                  key={rootId}
                  nodeId={rootId}
                  depth={0}
                  state={state}
                  collapsedNodes={collapsedNodes}
                  editingNodeId={editingNodeId}
                  editNameText={editNameText}
                  onSelectNode={onSelectNode}
                  onToggleCollapse={toggleCollapse}
                  onStartRename={(id, name) => {
                    setEditingNodeId(id);
                    setEditNameText(name);
                  }}
                  onSaveRename={(id) => {
                    if (editNameText.trim()) onRenameNode(id, editNameText.trim());
                    setEditingNodeId(null);
                  }}
                  onCancelRename={() => setEditingNodeId(null)}
                  setEditNameText={setEditNameText}
                  onDuplicateNode={onDuplicateNode}
                  onDeleteNode={onDeleteNode}
                  onToggleVisibility={onToggleVisibility}
                />
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );

  function toggleCollapse(id: string) {
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  }
}

function RailButton({
  active,
  icon,
  title,
  onClick,
}: {
  active?: boolean;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
        active
          ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40'
          : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
      }`}
    >
      {icon}
    </button>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
        active
          ? 'border border-slate-700/60 bg-slate-800 font-semibold text-emerald-400 shadow-sm'
          : 'border border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
      }`}
    >
      {icon}
      <span>{label}</span>
      {typeof badge === 'number' && (
        <span className="rounded-full border border-slate-700/60 bg-slate-900 px-1.5 font-mono text-[9px] text-slate-400">
          {badge}
        </span>
      )}
    </button>
  );
}

function NavigatorNodeItem({
  nodeId,
  depth,
  state,
  collapsedNodes,
  editingNodeId,
  editNameText,
  onSelectNode,
  onToggleCollapse,
  onStartRename,
  onSaveRename,
  onCancelRename,
  setEditNameText,
  onDuplicateNode,
  onDeleteNode,
  onToggleVisibility,
}: {
  nodeId: string;
  depth: number;
  state: StudioState;
  collapsedNodes: Record<string, boolean>;
  editingNodeId: string | null;
  editNameText: string;
  onSelectNode: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onStartRename: (id: string, name: string) => void;
  onSaveRename: (id: string) => void;
  onCancelRename: () => void;
  setEditNameText: (val: string) => void;
  onDuplicateNode: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}) {
  const node = state.tree.nodes[nodeId];
  if (!node) return null;

  const isSelected = state.selectedId === nodeId;
  const isCollapsed = Boolean(collapsedNodes[nodeId]);
  const hasChildren = node.children && node.children.length > 0;
  const isVisible = node.visibility?.desktop !== false;
  const isEditing = editingNodeId === nodeId;

  const rowRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (isSelected && rowRef.current) {
      rowRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isSelected]);

  return (
    <div>
      <div
        ref={rowRef}
        onClick={() => onSelectNode(nodeId)}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        className={`group flex cursor-pointer items-center gap-0.5 rounded-md border py-[3px] pr-0.5 transition-all ${
          isSelected
            ? 'border-emerald-500/40 bg-emerald-500/15 font-semibold text-emerald-300'
            : 'border-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white'
        }`}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse(nodeId);
            }}
            className="rounded p-0.5 text-slate-500 hover:bg-slate-700/60 hover:text-white"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
          </button>
        ) : (
          <span className="w-[15px]" />
        )}

        <GripVertical size={9} className="shrink-0 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />

        {isEditing ? (
          <input
            type="text"
            value={editNameText}
            autoFocus
            onChange={(e) => setEditNameText(e.target.value)}
            onBlur={() => onSaveRename(nodeId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveRename(nodeId);
              if (e.key === 'Escape') onCancelRename();
            }}
            className="min-w-0 flex-1 rounded border border-emerald-500 bg-slate-950 px-1.5 py-0.5 text-xs text-white focus:outline-none"
          />
        ) : (
          <span
            onDoubleClick={(e) => {
              e.stopPropagation();
              onStartRename(nodeId, node.name);
            }}
            className="min-w-0 flex-1 truncate text-xs"
            title={`${node.name} (double-click to rename)`}
          >
            {node.name}
          </span>
        )}

        {(node.locked || node.isGlobal) && (
          <span
            className="rounded bg-slate-800 px-1 font-mono text-[8px] uppercase tracking-wide text-slate-400"
            title={node.isGlobal ? 'Global block' : 'Locked layer'}
          >
            {node.isGlobal ? 'G' : 'L'}
          </span>
        )}

        {/* Hover quick actions */}
        <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(nodeId);
            }}
            className="rounded p-0.5 text-slate-500 transition hover:bg-slate-700/60 hover:text-white"
            title={isVisible ? 'Hide on Desktop' : 'Show on Desktop'}
          >
            {isVisible ? <Eye size={10} /> : <EyeOff size={10} className="text-amber-400" />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateNode(nodeId);
            }}
            className="rounded p-0.5 text-slate-500 transition hover:bg-slate-700/60 hover:text-white"
            title="Duplicate"
          >
            <Copy size={10} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode(nodeId);
            }}
            className="rounded p-0.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
            title="Delete"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {!isCollapsed && hasChildren && (
        <div>
          {node.children.map((childId) => (
            <NavigatorNodeItem
              key={childId}
              nodeId={childId}
              depth={depth + 1}
              state={state}
              collapsedNodes={collapsedNodes}
              editingNodeId={editingNodeId}
              editNameText={editNameText}
              onSelectNode={onSelectNode}
              onToggleCollapse={onToggleCollapse}
              onStartRename={onStartRename}
              onSaveRename={onSaveRename}
              onCancelRename={onCancelRename}
              setEditNameText={setEditNameText}
              onDuplicateNode={onDuplicateNode}
              onDeleteNode={onDeleteNode}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      )}
    </div>
  );
}

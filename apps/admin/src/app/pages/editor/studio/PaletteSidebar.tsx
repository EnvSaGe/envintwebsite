'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Layout,
  Type,
  AlignLeft,
  Square,
  Image as ImageIcon,
  Grid as GridIcon,
  Columns,
  Minus,
  Maximize2,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Lock,
  Unlock,
  GripVertical,
  Sparkles,
  Users,
  Briefcase,
  Compass,
  ArrowRight,
  FormInput,
  FolderTree,
} from 'lucide-react';
import { ElementType, BuilderNode, createDefaultNode } from '@envint/shared';
import { StudioState } from './StudioState';

interface PaletteSidebarProps {
  state: StudioState;
  onSelectNode: (id: string) => void;
  onAddNode: (type: ElementType) => void;
  onDuplicateNode: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRenameNode: (id: string, name: string) => void;
  onSetLeftTab: (tab: 'palette' | 'navigator' | 'templates') => void;
}

interface PaletteItemDef {
  type: ElementType;
  label: string;
  category: 'layout' | 'basic' | 'interactive' | 'dynamic';
  icon: React.ReactNode;
  preview: React.ReactNode;
  description: string;
}

const PALETTE_ITEMS: PaletteItemDef[] = [
  // Layout
  {
    type: 'section',
    label: 'Section',
    category: 'layout',
    icon: <Maximize2 size={16} className="text-emerald-400" />,
    preview: (
      <div className="w-full h-8 bg-emerald-950/40 border border-emerald-500/30 rounded flex items-center justify-center text-[10px] text-emerald-300 font-mono">
        [======= Full Bleed =======]
      </div>
    ),
    description: 'Full-width row container with background & padding',
  },
  {
    type: 'container',
    label: 'Container',
    category: 'layout',
    icon: <Layout size={16} className="text-blue-400" />,
    preview: (
      <div className="w-full h-8 bg-blue-950/40 border border-blue-500/30 rounded flex items-center justify-center text-[10px] text-blue-300 font-mono">
        [  [...] Max Width  ]
      </div>
    ),
    description: 'Constrained centered box (max-width 1280px)',
  },
  {
    type: 'grid',
    label: '2 Columns',
    category: 'layout',
    icon: <Columns size={16} className="text-purple-400" />,
    preview: (
      <div className="w-full h-8 grid grid-cols-2 gap-1.5 p-1 bg-purple-950/40 border border-purple-500/30 rounded">
        <div className="bg-purple-800/40 rounded border border-purple-400/20 flex items-center justify-center text-[9px] text-purple-200">
          50%
        </div>
        <div className="bg-purple-800/40 rounded border border-purple-400/20 flex items-center justify-center text-[9px] text-purple-200">
          50%
        </div>
      </div>
    ),
    description: 'Responsive 2-column split grid',
  },
  {
    type: 'flex',
    label: 'Flex Stack',
    category: 'layout',
    icon: <GridIcon size={16} className="text-indigo-400" />,
    preview: (
      <div className="w-full h-8 flex flex-col gap-1 p-1 bg-indigo-950/40 border border-indigo-500/30 rounded">
        <div className="h-2 bg-indigo-500/30 rounded" />
        <div className="h-2 bg-indigo-500/30 rounded" />
      </div>
    ),
    description: 'Vertical or horizontal directional stack',
  },
  {
    type: 'spacer',
    label: 'Spacer',
    category: 'layout',
    icon: <Minus size={16} className="text-gray-400" />,
    preview: (
      <div className="w-full h-8 border border-dashed border-white/20 rounded flex items-center justify-center text-[10px] text-white/40">
        ↕ 48px Space
      </div>
    ),
    description: 'Vertical whitespace gap',
  },
  {
    type: 'divider',
    label: 'Divider',
    category: 'layout',
    icon: <Minus size={16} className="text-gray-400" />,
    preview: (
      <div className="w-full h-8 flex items-center justify-center px-4">
        <div className="w-full h-px bg-white/30" />
      </div>
    ),
    description: 'Horizontal subtle separator line',
  },

  // Basic / Content
  {
    type: 'heading',
    label: 'Heading',
    category: 'basic',
    icon: <Type size={16} className="text-emerald-400" />,
    preview: (
      <div className="w-full h-8 flex items-center px-3 text-sm font-semibold text-emerald-300">
        Aa Headline (H1–H6)
      </div>
    ),
    description: 'Semantic SEO heading tag with typography tokens',
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    category: 'basic',
    icon: <AlignLeft size={16} className="text-amber-400" />,
    preview: (
      <div className="w-full h-8 flex flex-col justify-center px-3 gap-1 text-[10px] text-white/60">
        <div className="w-full h-1.5 bg-white/20 rounded" />
        <div className="w-3/4 h-1.5 bg-white/20 rounded" />
      </div>
    ),
    description: 'Rich text paragraph with safe formatting',
  },
  {
    type: 'button',
    label: 'Button',
    category: 'basic',
    icon: <Square size={16} className="text-teal-400" />,
    preview: (
      <div className="w-full h-8 flex items-center justify-center">
        <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[11px] font-medium shadow-sm">
          [ Action Button ]
        </span>
      </div>
    ),
    description: 'Pill CTA button with links, modals & anchors',
  },
  {
    type: 'image',
    label: 'Image',
    category: 'basic',
    icon: <ImageIcon size={16} className="text-cyan-400" />,
    preview: (
      <div className="w-full h-8 bg-cyan-950/40 border border-cyan-500/30 rounded flex items-center justify-center gap-1.5 text-[10px] text-cyan-300">
        <ImageIcon size={14} /> S3 Media Image
      </div>
    ),
    description: 'Optimized responsive image from S3 library',
  },
  {
    type: 'counter',
    label: 'Stat Counter',
    category: 'basic',
    icon: <Sparkles size={16} className="text-yellow-400" />,
    preview: (
      <div className="w-full h-8 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-emerald-400">500+</span>
        <span className="text-[8px] text-white/50">Engagements</span>
      </div>
    ),
    description: 'Metric counter display with label',
  },
  {
    type: 'badge',
    label: 'Badge / Pill',
    category: 'basic',
    icon: <Sparkles size={16} className="text-green-400" />,
    preview: (
      <div className="w-full h-8 flex items-center justify-center">
        <span className="px-2 py-0.5 bg-white/10 text-emerald-300 rounded text-[10px] font-mono">
          TAGLINE
        </span>
      </div>
    ),
    description: 'Category tag or category badge',
  },

  // Interactive
  {
    type: 'accordion',
    label: 'Accordion',
    category: 'interactive',
    icon: <ChevronDown size={16} className="text-orange-400" />,
    preview: (
      <div className="w-full h-8 flex flex-col justify-center px-2 gap-1 border border-white/10 rounded">
        <div className="flex justify-between items-center text-[9px] text-white/70">
          <span>FAQ Item</span>
          <span>v</span>
        </div>
      </div>
    ),
    description: 'Expandable accordion question/answer',
  },

  // Dynamic Modules
  {
    type: 'team-grid',
    label: 'Leadership Grid',
    category: 'dynamic',
    icon: <Users size={16} className="text-blue-400" />,
    preview: (
      <div className="w-full h-8 bg-blue-950/40 border border-blue-500/30 rounded flex items-center justify-center gap-1 text-[10px] text-blue-300">
        <Users size={14} /> 15 Team Cards
      </div>
    ),
    description: 'Dynamically query & render leadership profiles',
  },
  {
    type: 'service-cards',
    label: 'Service Pillars',
    category: 'dynamic',
    icon: <Briefcase size={16} className="text-emerald-400" />,
    preview: (
      <div className="w-full h-8 bg-emerald-950/40 border border-emerald-500/30 rounded flex items-center justify-center gap-1 text-[10px] text-emerald-300">
        <Briefcase size={14} /> 3 Practice Cards
      </div>
    ),
    description: 'The 3 core sustainability advisory pillars',
  },
];

export function PaletteSidebar({
  state,
  onSelectNode,
  onAddNode,
  onDuplicateNode,
  onDeleteNode,
  onToggleVisibility,
  onRenameNode,
  onSetLeftTab,
}: PaletteSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editNameText, setEditNameText] = useState('');

  const filteredPalette = PALETTE_ITEMS.filter((item) => {
    const matchesSearch =
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const toggleCollapse = (id: string) => {
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-80 bg-[#001D14] border-r border-white/10 flex flex-col h-[calc(100vh-4rem)] select-none">
      {/* Tab bar: Palette vs Navigator */}
      <div className="flex border-b border-white/10 bg-black/20 p-1">
        <button
          type="button"
          onClick={() => onSetLeftTab('palette')}
          className={`flex-1 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            state.activeLeftTab === 'palette'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plus size={14} />
          <span>Add Element</span>
        </button>
        <button
          type="button"
          onClick={() => onSetLeftTab('navigator')}
          className={`flex-1 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            state.activeLeftTab === 'navigator'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <FolderTree size={14} />
          <span>Navigator</span>
        </button>
      </div>

      {/* Mode A: Elements Palette */}
      {state.activeLeftTab === 'palette' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search & Category Pills */}
          <div className="p-3 border-b border-white/10 space-y-2">
            <input
              type="text"
              placeholder="Search elements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50"
            />
            <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
              {['all', 'layout', 'basic', 'interactive', 'dynamic'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-0.5 rounded-full capitalize transition-colors ${
                    activeCategory === cat
                      ? 'bg-emerald-500 text-black font-semibold'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Palette Grid (Draggable Cards) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            <div className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2">
              Drag into Canvas or Click to Add
            </div>
            {filteredPalette.map((item) => (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', item.type);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => onAddNode(item.type)}
                className="group relative bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/50 rounded-xl p-2.5 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-white/30 group-hover:text-emerald-400 transition-colors" />
                    {item.icon}
                    <span className="text-xs font-medium text-white">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/0 group-hover:text-emerald-400 transition-colors font-mono">
                    + Click to Add
                  </span>
                </div>

                {/* Visual Preview */}
                <div className="mt-1">{item.preview}</div>

                <p className="mt-1.5 text-[10px] text-white/40 leading-tight">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode B: Navigator Layer Tree */}
      {state.activeLeftTab === 'navigator' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              DOM Structure ({Object.keys(state.tree.nodes).length} elements)
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {state.tree.rootIds.map((rootId) => (
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
            ))}
          </div>
        </div>
      )}
    </aside>
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

  return (
    <div>
      <div
        onClick={() => onSelectNode(nodeId)}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
        className={`group flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? 'bg-emerald-600/30 text-white border border-emerald-500/50'
            : 'text-white/70 hover:text-white hover:bg-white/5'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse(nodeId);
              }}
              className="p-0.5 text-white/40 hover:text-white"
            >
              {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
            </button>
          ) : (
            <span className="w-3" />
          )}

          <span className="text-[11px] font-mono text-emerald-400/70">{`[${node.type}]`}</span>

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
              className="bg-black/60 border border-emerald-500 rounded px-1 text-xs text-white focus:outline-none"
            />
          ) : (
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                onStartRename(nodeId, node.name);
              }}
              className="text-xs truncate"
              title="Double click to rename"
            >
              {node.name}
            </span>
          )}
        </div>

        {/* Hover Quick Actions */}
        <div className="hidden group-hover:flex items-center gap-1 text-white/50">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(nodeId);
            }}
            className="p-1 hover:text-white hover:bg-white/10 rounded"
            title={isVisible ? 'Hide element' : 'Show element'}
          >
            {isVisible ? <Eye size={12} /> : <EyeOff size={12} className="text-red-400" />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateNode(nodeId);
            }}
            className="p-1 hover:text-white hover:bg-white/10 rounded"
            title="Duplicate layer"
          >
            <Copy size={12} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode(nodeId);
            }}
            className="p-1 hover:text-red-400 hover:bg-red-500/10 rounded"
            title="Delete element"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Render children recursively if not collapsed */}
      {!isCollapsed && hasChildren && (
        <div className="space-y-0.5">
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

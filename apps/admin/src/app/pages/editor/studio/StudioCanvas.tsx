'use client';

/**
 * StudioCanvas — the central visual editing surface (v2).
 *
 * SCROLLING CONTRACT
 * ------------------
 * <main> is the editor viewport: it alone scrolls (overflow-y: auto) and is a
 * plain block, so the page frame's natural document height (auto, following its
 * content) is fully preserved. The complete page renders hero → footer.
 *
 * v2 CHANGES
 * ----------
 * - Chrome is FLOATING (absolute) so the page gets every pixel of height.
 * - Compact selection pill: "Paragraph · Belief" + icon actions only.
 * - Hover = subtle 1px slate outline; selected = 2px emerald; no noise.
 * - Inline text editing: double-click heading/paragraph/button.
 * - Ctrl/Cmd + wheel zoom.
 * - Memoized node renderer: hover/select no longer re-render the whole tree.
 *
 * PARITY CONTRACT (unchanged)
 * ---------------------------
 * Every element renders through the shared primitives in `./blocks` which
 * mirror the public `apps/web` renderers. The canvas shows ONLY nodes that
 * exist in the current BuilderNode document — zero demo/sample content.
 */

import React from 'react';
import {
  Copy,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  Type as TypeIcon,
  Keyboard,
} from 'lucide-react';
import { BuilderNode, ElementType, canAcceptChild } from '@envint/shared';
import { StudioState, Breakpoint } from './StudioState';
import {
  SectionPrimitive,
  ContainerPrimitive,
  GridPrimitive,
  FlexPrimitive,
  HeadingPrimitive,
  ParagraphPrimitive,
  ButtonPrimitive,
  ImagePrimitive,
  BadgePrimitive,
  CounterPrimitive,
  SpacerPrimitive,
  DividerPrimitive,
  AccordionPrimitive,
  AccordionItemPrimitive,
  TeamGridPrimitive,
  DynamicModulePlaceholder,
} from './blocks';

export type ZoomLevel = 'fit' | 0.5 | 0.75 | 0.9 | 1 | 1.25 | 1.5;

interface StudioCanvasProps {
  state: StudioState;
  onSelectNode: (id: string | null) => void;
  onHoverNode: (id: string | null) => void;
  onAddNode: (
    type: ElementType,
    targetParentId?: string | null,
    position?: 'before' | 'after' | 'inside',
    relativeNodeId?: string
  ) => void;
  onMoveNode: (nodeId: string, targetParentId: string | null, targetIndex: number) => void;
  onDuplicateNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onToggleVisibility: (nodeId: string) => void;
  onUpdateContent: (nodeId: string, content: Partial<any>) => void;
  zoom: ZoomLevel;
  onZoomChange: (zoom: ZoomLevel) => void;
}

const ZOOM_OPTIONS: Array<{ label: string; value: ZoomLevel }> = [
  { label: 'Fit', value: 'fit' },
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: '90%', value: 0.9 },
  { label: '100%', value: 1 },
  { label: '125%', value: 1.25 },
  { label: '150%', value: 1.5 },
];

const DEVICE_META: Record<Breakpoint, { label: string; width: number | null; icon: React.ReactNode }> = {
  desktop: { label: 'Desktop', width: null, icon: <Monitor size={12} /> },
  tablet: { label: 'Tablet', width: 768, icon: <Tablet size={12} /> },
  mobile: { label: 'Mobile', width: 390, icon: <Smartphone size={12} /> },
};

/** Inline-editable element types (plain-text semantics). */
const INLINE_EDITABLE = new Set(['heading', 'button']);

export function StudioCanvas({
  state,
  onSelectNode,
  onHoverNode,
  onAddNode,
  onMoveNode,
  onDuplicateNode,
  onDeleteNode,
  onToggleVisibility,
  onUpdateContent,
  zoom,
  onZoomChange,
}: StudioCanvasProps) {
  const { tree, selectedId, breakpoint } = state;
  const device = DEVICE_META[breakpoint];
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [inlineEditId, setInlineEditId] = React.useState<string | null>(null);

  const canvasWidthStyle = React.useMemo<React.CSSProperties>(() => {
    if (device.width) {
      const scaled = zoom === 'fit' ? device.width : Math.round(device.width * zoom);
      return { width: `${scaled}px` };
    }
    return { width: zoom === 'fit' ? '100%' : `${Math.round(zoom * 100)}%` };
  }, [zoom, device.width]);

  // Ctrl/Cmd + wheel → zoom ( Fit↔steps ), prevent browser zoom.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const numeric = zoom === 'fit' ? 1 : zoom;
      const step = e.deltaY < 0 ? 0.1 : -0.1;
      const next = Math.min(1.5, Math.max(0.5, Math.round((numeric + step) * 10) / 10));
      onZoomChange(next as ZoomLevel);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoom, onZoomChange]);

  // Keep the selected element in view (canvas click OR Navigator selection).
  React.useEffect(() => {
    if (!selectedId || !scrollRef.current) return;
    const el = scrollRef.current.querySelector(`[data-builder-id="${selectedId}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const host = scrollRef.current.getBoundingClientRect();
      const fullyVisible = rect.top >= host.top + 8 && rect.bottom <= host.bottom - 8;
      if (!fullyVisible) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedId]);

  return (
    <main
      onClick={() => onSelectNode(null)}
      className="relative h-full min-h-0 min-w-0 flex-1 bg-[#0B0F16] select-none"
      style={{
        backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        backgroundPosition: 'center center',
      }}
      aria-label="Visual canvas"
    >
      {/* The single independent scroll container for the canvas column */}
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden">
        <div className="flex min-h-full flex-col items-center px-4 pb-24 pt-4">
          {/* Page frame — height follows the rendered page content exactly */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              ...canvasWidthStyle,
              transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className={`w-full rounded-lg border border-slate-800 bg-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)] ${
              breakpoint !== 'desktop' ? 'ring-8 ring-slate-900/80' : ''
            }`}
          >
            {/* Renders ONLY nodes that exist in the page tree */}
            {tree.rootIds.length === 0 ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const elementType = e.dataTransfer.getData('text/plain') as ElementType;
                  if (elementType) onAddNode(elementType, null, 'after');
                }}
                className="m-8 flex h-96 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-500/30 bg-emerald-950/[0.03] text-center"
              >
                <Plus size={28} className="text-emerald-500" />
                <p className="text-sm font-semibold text-slate-700">This page has no sections yet</p>
                <p className="max-w-xs text-xs text-slate-500">
                  Drag a <strong>Section</strong> from the Components panel, or press ⌘K to add one.
                </p>
              </div>
            ) : (
              tree.rootIds.map((rootId) => (
                <MemoCanvasNode
                  key={rootId}
                  nodeId={rootId}
                  state={state}
                  inlineEditId={inlineEditId}
                  onSetInlineEdit={setInlineEditId}
                  onSelectNode={onSelectNode}
                  onHoverNode={onHoverNode}
                  onAddNode={onAddNode}
                  onMoveNode={onMoveNode}
                  onDuplicateNode={onDuplicateNode}
                  onDeleteNode={onDeleteNode}
                  onToggleVisibility={onToggleVisibility}
                  onUpdateContent={onUpdateContent}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Floating chrome (overlays; zero vertical space taken) ────────── */}

      {/* Device indicator — top left */}
      <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-slate-800 bg-[#0D1220]/95 px-2.5 py-1 shadow-lg">
        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-300">
          {device.icon}
          {device.label}
        </span>
        <span className="h-2.5 w-px bg-slate-700" />
        <span className="font-mono text-[10px] text-slate-500">
          {device.width ? `${device.width}px` : 'Fluid'}
        </span>
      </div>

      {/* Zoom control — top right */}
      <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full border border-slate-800 bg-[#0D1220]/95 px-1 py-1 shadow-lg">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onZoomChange(zoom === 'fit' ? 1 : 'fit');
          }}
          title="Toggle Fit / 100%  (Ctrl+wheel also zooms)"
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          {zoom === 'fit' ? 'Fit' : `${Math.round(zoom * 100)}%`}
        </button>
        <span className="h-2.5 w-px bg-slate-700" />
        <select
          value={String(zoom)}
          onChange={(e) => {
            const v = e.target.value;
            onZoomChange(v === 'fit' ? 'fit' : (Number(v) as ZoomLevel));
          }}
          title="Zoom level"
          aria-label="Zoom level"
          className="cursor-pointer appearance-none bg-transparent px-1 text-[10px] font-semibold text-slate-400 focus:outline-none"
        >
          {ZOOM_OPTIONS.map((opt) => (
            <option key={opt.label} value={String(opt.value)} className="bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Inline editing hint — bottom center, only while editing */}
      {inlineEditId && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-500/30 bg-[#0D1220]/95 px-3 py-1.5 text-[10px] font-medium text-slate-300 shadow-lg">
          <TypeIcon size={11} className="text-emerald-400" />
          Editing text — Enter or click outside to save · Esc to cancel
          <Keyboard size={11} className="text-slate-500" />
        </div>
      )}
    </main>
  );
}

/* ══════════════════════════ Node renderer (memoized) ═════════════════════ */

interface CanvasNodeRendererProps {
  nodeId: string;
  state: StudioState;
  inlineEditId: string | null;
  onSetInlineEdit: (id: string | null) => void;
  onSelectNode: (id: string | null) => void;
  onHoverNode: (id: string | null) => void;
  onAddNode: StudioCanvasProps['onAddNode'];
  onMoveNode: StudioCanvasProps['onMoveNode'];
  onDuplicateNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onToggleVisibility: (nodeId: string) => void;
  onUpdateContent: (nodeId: string, content: Partial<any>) => void;
}

/**
 * Memo: re-renders only when THIS node's data, selection/hover flags, or the
 * callbacks change — hovering a sibling no longer re-renders the subtree.
 */
const MemoCanvasNode = React.memo(CanvasNodeRenderer, (prev, next) => {
  if (prev.nodeId !== next.nodeId) return false;
  if (prev.inlineEditId !== next.inlineEditId) return false;
  const p = prev.state.tree.nodes[prev.nodeId];
  const n = next.state.tree.nodes[next.nodeId];
  if (p !== n) return false;
  const flagChanged =
    prev.state.selectedId !== next.state.selectedId ||
    prev.state.hoveredId !== next.state.hoveredId ||
    prev.state.breakpoint !== next.state.breakpoint;
  if (flagChanged) {
    // Only re-render if THIS node's flags actually changed.
    const wasSel = prev.state.selectedId === prev.nodeId;
    const isSel = next.state.selectedId === next.nodeId;
    const wasHov = prev.state.hoveredId === prev.nodeId;
    const isHov = next.state.hoveredId === next.nodeId;
    if (wasSel !== isSel || wasHov !== isHov || prev.state.breakpoint !== next.state.breakpoint) {
      return false;
    }
  }
  // Children identity via node object equality (children arrays live on nodes).
  return true;
});

function CanvasNodeRenderer({
  nodeId,
  state,
  inlineEditId,
  onSetInlineEdit,
  onSelectNode,
  onHoverNode,
  onAddNode,
  onMoveNode,
  onDuplicateNode,
  onDeleteNode,
  onToggleVisibility,
  onUpdateContent,
}: CanvasNodeRendererProps) {
  const node: BuilderNode | undefined = state.tree.nodes[nodeId];
  if (!node) return null;

  const isSelected = state.selectedId === nodeId;
  const isHovered = state.hoveredId === nodeId && !isSelected;
  const { breakpoint } = state;
  const isEditing = inlineEditId === nodeId;

  const isVisible = !node.visibility || node.visibility[breakpoint] !== false;
  const hasChildren = (node.children || []).length > 0;

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('application/envint-node-id', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const startInlineEdit = () => {
    if (INLINE_EDITABLE.has(node.type) || node.type === 'paragraph' || node.type === 'rich-text') {
      onSetInlineEdit(node.id);
    }
  };

  const commitInlineEdit = (text: string) => {
    onSetInlineEdit(null);
    if (node.type === 'heading' && text !== (node.content?.text || '')) {
      onUpdateContent(node.id, { text });
    } else if (node.type === 'button' && text !== (node.content?.label || '')) {
      onUpdateContent(node.id, { label: text });
    } else if ((node.type === 'paragraph' || node.type === 'rich-text') && text.trim()) {
      // Preserve the <p> wrapper so public HTML output stays identical.
      const html = `<p>${text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '</p><p>')}</p>`;
      if (html !== node.content?.html) onUpdateContent(node.id, { html });
    }
  };

  const acceptChildType = (childType: ElementType): boolean => canAcceptChild(node.type, childType);

  return (
    <div
      data-builder-id={node.id}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        if (!isEditing) onSelectNode(node.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (isSelected) startInlineEdit();
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        if (!isEditing) onHoverNode(node.id);
      }}
      onMouseLeave={() => onHoverNode(null)}
      onDragOver={(e) => {
        if (!isVisible) return;
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const existingId = e.dataTransfer.getData('application/envint-node-id');
        if (existingId) {
          if (existingId !== node.id && existingId !== node.parentId) {
            onMoveNode(existingId, node.id, (node.children || []).length);
          }
          return;
        }
        const elementType = e.dataTransfer.getData('text/plain') as ElementType;
        if (elementType && acceptChildType(elementType)) {
          onAddNode(elementType, node.id, 'inside');
        } else if (elementType) {
          onAddNode(elementType, node.parentId, 'after', node.id);
        }
      }}
      style={{
        boxSizing: 'border-box',
        position: 'relative',
        opacity: isVisible ? undefined : 0.35,
        outline: isSelected
          ? '2px solid #10B981'
          : isHovered
            ? '1px solid rgba(100,116,139,0.55)'
            : undefined,
        outlineOffset: '-1px',
      }}
    >
      {/* Compact selection pill — one row, tiny footprint (editor chrome only) */}
      {(isSelected || isHovered) && !isEditing && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute -top-[22px] left-0 z-30 flex h-[20px] items-center gap-0.5 whitespace-nowrap rounded-[5px] px-1 shadow-md ${
            isSelected
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-700/95 text-slate-200'
          }`}
        >
          <span className="px-0.5 text-[10px] font-semibold capitalize leading-none">
            {node.type === 'rich-text' ? 'text' : node.type}
          </span>
          <span className="max-w-[110px] truncate text-[10px] leading-none opacity-70">{node.name}</span>
          {isSelected && (
            <>
              <span className="mx-0.5 h-2.5 w-px bg-current opacity-30" />
              <ToolButton
                title={isVisible ? `Hide on ${breakpoint}` : `Show on ${breakpoint}`}
                onClick={() => onToggleVisibility(node.id)}
              >
                {isVisible ? <Eye size={10} /> : <EyeOff size={10} />}
              </ToolButton>
              <ToolButton title="Duplicate (Ctrl+D)" onClick={() => onDuplicateNode(node.id)}>
                <Copy size={10} />
              </ToolButton>
              <ToolButton title="Delete element (Del)" danger onClick={() => onDeleteNode(node.id)}>
                <Trash2 size={10} />
              </ToolButton>
            </>
          )}
        </div>
      )}

      <NodeContentSwitch
        node={node}
        state={state}
        isSelected={isSelected}
        isEditing={isEditing}
        inlineEditId={inlineEditId}
        onSetInlineEdit={onSetInlineEdit}
        onCommitInlineEdit={commitInlineEdit}
        onSelectNode={onSelectNode}
        onHoverNode={onHoverNode}
        onAddNode={onAddNode}
        onMoveNode={onMoveNode}
        onDuplicateNode={onDuplicateNode}
        onDeleteNode={onDeleteNode}
        onToggleVisibility={onToggleVisibility}
        onUpdateContent={onUpdateContent}
      />

      {!hasChildren && isLayoutType(node.type) && (
        <EmptyContainerHint nodeId={node.id} nodeName={node.name} allowed={ALLOWED_CHILD_HINT[node.type]} />
      )}
    </div>
  );
}

function ToolButton({
  children,
  onClick,
  title,
  danger,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  title?: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`rounded p-[3px] transition-colors ${
        danger ? 'hover:bg-red-500 hover:text-white' : 'hover:bg-black/15'
      }`}
    >
      {children}
    </button>
  );
}

function isLayoutType(type: string): boolean {
  return [
    'section',
    'container',
    'grid',
    'flex',
    'columns',
    'accordion',
    'accordion-item',
    'tabs',
    'tab-item',
  ].includes(type);
}

const ALLOWED_CHILD_HINT: Record<string, string> = {
  section: 'Container · Grid · Flex · Divider · Spacer',
  container: 'headings, text, images, buttons, grids…',
  grid: 'Container · Flex cells',
  flex: 'headings, text, buttons, badges…',
  columns: 'Container columns',
  accordion: 'Accordion items',
  tabs: 'Tab items',
};

function EmptyContainerHint({
  nodeId,
  nodeName,
  allowed,
}: {
  nodeId: string;
  nodeName: string;
  allowed?: string;
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.stopPropagation()}
      className="m-2 rounded-lg border-2 border-dashed border-emerald-500/25 bg-emerald-500/[0.03] px-4 py-4 text-center"
    >
      <p className="text-[11px] font-semibold text-slate-500">{nodeName} is empty</p>
      <p className="mt-0.5 text-[10px] text-slate-400">Drop {allowed || 'elements'} inside</p>
      <span className="hidden">{nodeId}</span>
    </div>
  );
}

interface NodeContentSwitchProps {
  node: BuilderNode;
  state: StudioState;
  isSelected: boolean;
  isEditing: boolean;
  inlineEditId: string | null;
  onSetInlineEdit: (id: string | null) => void;
  onCommitInlineEdit: (text: string) => void;
  onSelectNode: (id: string | null) => void;
  onHoverNode: (id: string | null) => void;
  onAddNode: StudioCanvasProps['onAddNode'];
  onMoveNode: StudioCanvasProps['onMoveNode'];
  onDuplicateNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onToggleVisibility: (nodeId: string) => void;
  onUpdateContent: (nodeId: string, content: Partial<any>) => void;
}

function NodeContentSwitch({
  node,
  state,
  isSelected,
  isEditing,
  inlineEditId,
  onSetInlineEdit,
  onCommitInlineEdit,
  onSelectNode,
  onHoverNode,
  onAddNode,
  onMoveNode,
  onDuplicateNode,
  onDeleteNode,
  onToggleVisibility,
  onUpdateContent,
}: NodeContentSwitchProps) {
  const renderedChildren = (node.children || []).map((childId) => (
    <MemoCanvasNode
      key={childId}
      nodeId={childId}
      state={state}
      inlineEditId={inlineEditId}
      onSetInlineEdit={onSetInlineEdit}
      onSelectNode={onSelectNode}
      onHoverNode={onHoverNode}
      onAddNode={onAddNode}
      onMoveNode={onMoveNode}
      onDuplicateNode={onDuplicateNode}
      onDeleteNode={onDeleteNode}
      onToggleVisibility={onToggleVisibility}
      onUpdateContent={onUpdateContent}
    />
  ));

  switch (node.type) {
    case 'section':
      return <SectionPrimitive node={node}>{renderedChildren}</SectionPrimitive>;

    case 'container':
    case 'columns':
      return <ContainerPrimitive node={node}>{renderedChildren}</ContainerPrimitive>;

    case 'grid':
      return <GridPrimitive node={node}>{renderedChildren}</GridPrimitive>;

    case 'flex':
      return <FlexPrimitive node={node}>{renderedChildren}</FlexPrimitive>;

    case 'heading':
      return isEditing ? (
        <InlineTextArea
          initial={node.content?.text || ''}
          semantics="heading"
          onCommit={onCommitInlineEdit}
          onCancel={() => onSetInlineEdit(null)}
        />
      ) : (
        <HeadingPrimitive node={node} />
      );

    case 'paragraph':
    case 'rich-text':
      return isEditing ? (
        <InlineTextArea
          initial={stripParagraphHtml(node.content?.html || '')}
          semantics="paragraph"
          onCommit={onCommitInlineEdit}
          onCancel={() => onSetInlineEdit(null)}
        />
      ) : (
        <ParagraphPrimitive node={node} />
      );

    case 'button':
      return isEditing ? (
        <InlineTextArea
          initial={node.content?.label || ''}
          semantics="button"
          onCommit={onCommitInlineEdit}
          onCancel={() => onSetInlineEdit(null)}
        />
      ) : (
        <ButtonPrimitive node={node} />
      );

    case 'image':
      return <ImagePrimitive node={node} isSelected={isSelected} />;

    case 'badge':
      return <BadgePrimitive node={node} />;

    case 'counter':
      return <CounterPrimitive node={node} />;

    case 'spacer':
      return <SpacerPrimitive node={node} isSelected={isSelected} />;

    case 'divider':
      return <DividerPrimitive node={node} isSelected={isSelected} />;

    case 'accordion':
      return <AccordionPrimitive node={node}>{renderedChildren}</AccordionPrimitive>;

    case 'accordion-item':
      return <AccordionItemPrimitive node={node}>{renderedChildren}</AccordionItemPrimitive>;

    case 'tabs':
    case 'tab-item':
      return <ContainerPrimitive node={node}>{renderedChildren}</ContainerPrimitive>;

    case 'team-grid':
      return <TeamGridPrimitive node={node} members={state.teamMembers} />;

    case 'insights-grid':
      return <DynamicModulePlaceholder node={node} moduleLabel="Insights" />;

    case 'impact-grid':
      return <DynamicModulePlaceholder node={node} moduleLabel="Impact case studies" />;

    case 'service-cards':
      return <DynamicModulePlaceholder node={node} moduleLabel="Service cards" />;

    case 'form':
      return (
        <DynamicModulePlaceholder
          node={node}
          moduleLabel="Form"
          hint="Forms render on the live site with spam protection."
        />
      );

    case 'modal-trigger':
    case 'link':
    case 'video':
    case 'icon':
    case 'quote':
    case 'reusable-block':
      return <DynamicModulePlaceholder node={node} moduleLabel={node.type} />;

    default:
      // Unknown future types: render children transparently, never fake content.
      return <div style={{ display: 'contents' }}>{renderedChildren}</div>;
  }
}

/* ───────────────────────── Inline text editing ──────────────────────────── */

/** Plain-text extract from the stored paragraph HTML (no invented content). */
function stripParagraphHtml(html: string): string {
  return html
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/**
 * ContentEditable-free inline editor: a styled textarea overlaid on the node.
 * Enter commits (Shift+Enter newline), Esc cancels, blur commits.
 */
function InlineTextArea({
  initial,
  semantics,
  onCommit,
  onCancel,
}: {
  initial: string;
  semantics: 'heading' | 'paragraph' | 'button';
  onCommit: (text: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = React.useState(initial);
  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.select();
    // Auto-grow to content
    const grow = () => {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    };
    grow();
    el.addEventListener('input', grow);
    return () => el.removeEventListener('input', grow);
  }, []);

  const base =
    'w-full rounded-[4px] outline-none ring-2 ring-emerald-500 bg-white text-inherit';
  const font =
    semantics === 'heading'
      ? 'text-[inherit] leading-[inherit] font-[inherit] text-inherit'
      : semantics === 'button'
        ? 'text-center font-semibold'
        : 'text-[1.05em] leading-relaxed';

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onCommit(value);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      }}
      onBlur={() => onCommit(value)}
      rows={1}
      className={`${base} ${font} resize-none`}
      style={{ color: 'inherit' }}
      aria-label="Inline text editor"
    />
  );
}

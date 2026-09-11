'use client';

import React, { useState } from 'react';
import {
  GripVertical,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  ChevronRight,
  Maximize2,
  Columns,
  Layout,
  Type,
  Square,
  Image as ImageIcon,
} from 'lucide-react';
import { BuilderNode, PageBlockTree, ElementType, createDefaultNode } from '@envint/shared';
import { StudioState, Breakpoint } from './StudioState';
import { elementStylesToCss } from './style-utils';

interface StudioCanvasProps {
  state: StudioState;
  onSelectNode: (id: string) => void;
  onHoverNode: (id: string | null) => void;
  onAddNode: (type: ElementType, targetParentId?: string | null, position?: 'before' | 'after' | 'inside', relativeNodeId?: string) => void;
  onMoveNode: (nodeId: string, targetParentId: string | null, targetIndex: number) => void;
  onDuplicateNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateContent: (nodeId: string, content: Partial<any>) => void;
}

export function StudioCanvas({
  state,
  onSelectNode,
  onHoverNode,
  onAddNode,
  onMoveNode,
  onDuplicateNode,
  onDeleteNode,
  onUpdateContent,
}: StudioCanvasProps) {
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    targetId: string;
    position: 'before' | 'after' | 'inside';
  } | null>(null);

  const { tree, selectedId, hoveredId, breakpoint } = state;

  // Viewport widths based on breakpoint
  const viewportStyles: Record<Breakpoint, { width: string; maxWidth: string }> = {
    desktop: { width: '100%', maxWidth: '100%' },
    tablet: { width: '768px', maxWidth: '768px' },
    mobile: { width: '375px', maxWidth: '375px' },
  };

  const currentViewport = viewportStyles[breakpoint];

  const handleDragOver = (e: React.DragEvent, targetId: string, position: 'before' | 'after' | 'inside') => {
    e.preventDefault();
    e.stopPropagation();
    setDropIndicator({ targetId, position });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string, position: 'before' | 'after' | 'inside') => {
    e.preventDefault();
    e.stopPropagation();
    setDropIndicator(null);

    const elementType = e.dataTransfer.getData('text/plain') as ElementType;
    const existingNodeId = e.dataTransfer.getData('application/envint-node-id');

    if (existingNodeId) {
      // Reposition existing element
      const targetNode = tree.nodes[targetId];
      if (position === 'inside') {
        onMoveNode(existingNodeId, targetId, (targetNode?.children?.length || 0));
      } else {
        const parentId = targetNode?.parentId || null;
        const siblings = parentId ? tree.nodes[parentId]?.children || [] : tree.rootIds;
        const targetIdx = siblings.indexOf(targetId);
        const insertIdx = position === 'before' ? targetIdx : targetIdx + 1;
        onMoveNode(existingNodeId, parentId, Math.max(0, insertIdx));
      }
    } else if (elementType) {
      // Add new element from palette
      const newNode = createDefaultNode(elementType);
      onAddNode(elementType, null, position, targetId);
    }
  };

  return (
    <main
      onClick={() => onSelectNode('')}
      className="flex-1 bg-[#091511] overflow-y-auto p-6 flex flex-col items-center select-none"
    >
      {/* Viewport Frame */}
      <div
        style={{
          width: currentViewport.width,
          maxWidth: currentViewport.maxWidth,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className={`bg-white min-h-[85vh] rounded-xl shadow-2xl overflow-hidden border border-white/10 ${
          breakpoint !== 'desktop' ? 'my-4 ring-8 ring-black/40' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Render Root Sections */}
        {tree.rootIds.length === 0 ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const elementType = e.dataTransfer.getData('text/plain') as ElementType;
              if (elementType) onAddNode(elementType);
            }}
            className="h-96 border-2 border-dashed border-emerald-500/30 rounded-xl m-8 flex flex-col items-center justify-center text-center p-6 text-gray-400 bg-emerald-950/10"
          >
            <Plus size={32} className="text-emerald-500 mb-2 animate-bounce" />
            <p className="text-base font-semibold text-gray-800">Your page is empty</p>
            <p className="text-xs text-gray-500 mt-1">
              Drag a <strong>Section</strong> from the left sidebar or click to get started.
            </p>
          </div>
        ) : (
          tree.rootIds.map((rootId, idx) => (
            <React.Fragment key={rootId}>
              {/* Drop guide before section */}
              {dropIndicator?.targetId === rootId && dropIndicator.position === 'before' && (
                <div className="h-2 bg-emerald-500 rounded-full my-1 shadow-lg shadow-emerald-500/50 flex items-center justify-center">
                  <span className="bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ADD HERE
                  </span>
                </div>
              )}

              <CanvasNodeRenderer
                nodeId={rootId}
                state={state}
                onSelectNode={onSelectNode}
                onHoverNode={onHoverNode}
                onAddNode={onAddNode}
                onMoveNode={onMoveNode}
                onDuplicateNode={onDuplicateNode}
                onDeleteNode={onDeleteNode}
                onUpdateContent={onUpdateContent}
                inlineEditingId={inlineEditingId}
                setInlineEditingId={setInlineEditingId}
                dropIndicator={dropIndicator}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
              />

              {/* Drop guide after section */}
              {dropIndicator?.targetId === rootId && dropIndicator.position === 'after' && (
                <div className="h-2 bg-emerald-500 rounded-full my-1 shadow-lg shadow-emerald-500/50 flex items-center justify-center">
                  <span className="bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ADD HERE
                  </span>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </main>
  );
}

interface CanvasNodeRendererProps {
  nodeId: string;
  state: StudioState;
  onSelectNode: (id: string) => void;
  onHoverNode: (id: string | null) => void;
  onAddNode: (type: ElementType, targetParentId?: string | null, position?: 'before' | 'after' | 'inside', relativeNodeId?: string) => void;
  onMoveNode: (nodeId: string, targetParentId: string | null, targetIndex: number) => void;
  onDuplicateNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateContent: (nodeId: string, content: Partial<any>) => void;
  inlineEditingId: string | null;
  setInlineEditingId: (id: string | null) => void;
  dropIndicator: { targetId: string; position: 'before' | 'after' | 'inside' } | null;
  handleDragOver: (e: React.DragEvent, targetId: string, position: 'before' | 'after' | 'inside') => void;
  handleDrop: (e: React.DragEvent, targetId: string, position: 'before' | 'after' | 'inside') => void;
}

function CanvasNodeRenderer({
  nodeId,
  state,
  onSelectNode,
  onHoverNode,
  onAddNode,
  onMoveNode,
  onDuplicateNode,
  onDeleteNode,
  onUpdateContent,
  inlineEditingId,
  setInlineEditingId,
  dropIndicator,
  handleDragOver,
  handleDrop,
}: CanvasNodeRendererProps) {
  const node = state.tree.nodes[nodeId];
  if (!node) return null;

  const isSelected = state.selectedId === nodeId;
  const isHovered = state.hoveredId === nodeId && !isSelected;
  const isInlineEditing = inlineEditingId === nodeId;

  // Compute CSS properties including breakpoint overrides
  const effectiveStyles =
    state.breakpoint === 'desktop'
      ? node.styles || {}
      : { ...node.styles, ...(node.responsiveStyles?.[state.breakpoint] || {}) };
  const inlineCss = elementStylesToCss(effectiveStyles);

  // Check visibility for current breakpoint
  const isVisibleOnCurrentBreakpoint = node.visibility?.[state.breakpoint] !== false;

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('application/envint-node-id', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode(node.id);
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        onHoverNode(node.id);
      }}
      onMouseLeave={() => onHoverNode(null)}
      onDragOver={(e) => handleDragOver(e, node.id, 'inside')}
      onDrop={(e) => handleDrop(e, node.id, 'inside')}
      style={{
        ...inlineCss,
        position: 'relative',
        opacity: isVisibleOnCurrentBreakpoint ? (inlineCss.opacity ?? 1) : 0.35,
      }}
      className={`group/node transition-shadow ${
        isSelected
          ? 'ring-2 ring-emerald-500 ring-offset-1 z-20'
          : isHovered
            ? 'ring-1 ring-blue-400/80 ring-offset-0 z-10'
            : ''
      }`}
    >
      {/* Floating Selection Quick-Actions Bar (Section 35) */}
      {isSelected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-7 left-0 bg-emerald-600 text-white rounded-t-md px-2 py-0.5 text-[11px] font-medium flex items-center gap-1.5 shadow-lg z-30 pointer-events-auto"
        >
          <GripVertical size={12} className="cursor-grab active:cursor-grabbing text-emerald-200" />
          <span className="font-semibold uppercase tracking-wider">{node.type}</span>
          <span className="text-emerald-200 truncate max-w-[100px]">{node.name}</span>

          <div className="h-3 w-px bg-white/30 mx-0.5" />

          <button
            type="button"
            onClick={() => onDuplicateNode(node.id)}
            className="p-0.5 hover:bg-white/20 rounded"
            title="Duplicate"
          >
            <Copy size={11} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteNode(node.id)}
            className="p-0.5 hover:bg-red-500 rounded"
            title="Delete"
          >
            <Trash2 size={11} />
          </button>
        </div>
      )}

      {/* Hover Type Tag */}
      {isHovered && !isSelected && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-bl shadow-sm z-20">
          {node.type}
        </div>
      )}

      {/* Node Render Switch */}
      {(() => {
        switch (node.type) {
          case 'section':
          case 'container':
          case 'grid':
          case 'flex':
          case 'columns': {
            const hasChildren = node.children && node.children.length > 0;
            return (
              <>
                {(node.styles?.backgroundOverlay || (node.styles as any)?.overlayGradient) && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: node.styles.backgroundOverlay || (node.styles as any)?.overlayGradient,
                      pointerEvents: 'none',
                    }}
                  />
                )}
                <div style={{ position: 'relative', width: '100%' }}>
                  {hasChildren ? (
                    node.children.map((childId) => (
                      <CanvasNodeRenderer
                        key={childId}
                        nodeId={childId}
                        state={state}
                        onSelectNode={onSelectNode}
                        onHoverNode={onHoverNode}
                        onAddNode={onAddNode}
                        onMoveNode={onMoveNode}
                        onDuplicateNode={onDuplicateNode}
                        onDeleteNode={onDeleteNode}
                        onUpdateContent={onUpdateContent}
                        inlineEditingId={inlineEditingId}
                        setInlineEditingId={setInlineEditingId}
                        dropIndicator={dropIndicator}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                      />
                    ))
                  ) : (
                    <div
                      onDragOver={(e) => handleDragOver(e, node.id, 'inside')}
                      onDrop={(e) => handleDrop(e, node.id, 'inside')}
                      className="border-2 border-dashed border-emerald-500/30 rounded-lg p-6 text-center text-xs text-gray-400 bg-emerald-500/[0.03]"
                    >
                      + Drop elements inside {node.name}
                    </div>
                  )}
                </div>
              </>
            );
          }

          case 'heading': {
            const Tag = (node.content?.tag || 'h2') as keyof React.JSX.IntrinsicElements;
            return isInlineEditing ? (
              <input
                type="text"
                autoFocus
                value={node.content?.text || ''}
                onChange={(e) => onUpdateContent(node.id, { text: e.target.value })}
                onBlur={() => setInlineEditingId(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setInlineEditingId(null);
                }}
                className="w-full bg-white border border-emerald-500 rounded p-1 text-inherit font-inherit"
              />
            ) : (
              <Tag
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setInlineEditingId(node.id);
                }}
                title="Double-click to edit inline"
              >
                {node.content?.text || 'Heading Title'}
              </Tag>
            );
          }

          case 'paragraph':
          case 'rich-text': {
            return (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    node.content?.html ||
                    (node.content?.text ? `<p>${node.content.text}</p>` : '<p>Enter text here...</p>'),
                }}
              />
            );
          }

          case 'button': {
            return (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {node.content?.label || 'Click Here'}
              </span>
            );
          }

          case 'image': {
            return (
              <img
                src={node.content?.src || 'https://envintcms.s3.ap-south-1.amazonaws.com/images/placeholder.webp'}
                alt={node.content?.alt || ''}
                style={{
                  width: '100%',
                  height: effectiveStyles.height || 'auto',
                  objectFit: node.content?.objectFit || 'cover',
                  display: 'block',
                  borderRadius: effectiveStyles.borderRadius,
                }}
              />
            );
          }

          case 'badge': {
            return <span>{node.content?.text || 'TAGLINE'}</span>;
          }

          case 'counter': {
            return (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 600, color: '#004E35' }}>
                  {node.content?.value || '500+'}
                </div>
                <div style={{ fontSize: '15px', color: '#6B7280', marginTop: '4px' }}>
                  {node.content?.label || 'Metric Label'}
                </div>
              </div>
            );
          }

          case 'team-grid': {
            return (
              <div className="bg-emerald-50/50 border border-emerald-500/20 rounded-xl p-8 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-2">
                  [ Dynamic Team Grid Module ]
                </span>
                <p className="text-sm text-gray-600">
                  Renders the 15 leadership team members dynamically from the database.
                </p>
              </div>
            );
          }

          default:
            return (
              <div className="p-4 border border-dashed border-gray-300 rounded text-center text-xs text-gray-500">
                [{node.type}] {node.name}
              </div>
            );
        }
      })()}
    </div>
  );
}

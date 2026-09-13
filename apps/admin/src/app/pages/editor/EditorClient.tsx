'use client';

import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Plus,
  Monitor,
  Tablet,
  Smartphone,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Layout,
  ExternalLink,
  Sparkles,
  RefreshCw,
  GripVertical,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Globe,
  SlidersHorizontal,
  Layers,
  CheckCircle2,
  Rocket,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fetchPageBySlug, fetchPageTreeAction, savePageAction } from '../actions';
import { PageBlockTree, createStarterPageTree } from '@envint/shared';
import { VisualStudioEditor } from './studio/VisualStudioEditor';
import { MediaPickerModal, PickedMedia } from '../../../components/MediaPickerModal';
import { BlockSection, BlockLayout, LiveCanvasRenderer } from './LiveCanvasRenderer';
import { BlockFormFields } from './BlockFormFields';
import { COMPREHENSIVE_BLOCK_TEMPLATES, BlockTemplate } from './block-templates';

const DEFAULT_LAYOUT: BlockLayout = {
  align: 'left',
  vAlign: 'center',
  width: 'standard',
  spacing: 'normal',
  bgColor: '',
  bgImage: '',
};

// ------------------------------------------------------------------
// Drag-and-drop sortable block wrapper
// ------------------------------------------------------------------
function SortableBlock({
  block,
  index,
  isExpanded,
  onToggleExpand,
  onToggleEnabled,
  onDelete,
  onDuplicate,
  children,
}: {
  block: BlockSection;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleEnabled: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  children?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : block.enabled ? 1 : 0.5,
    backgroundColor: isExpanded ? '#ffffff' : '#ffffff',
    border: isExpanded ? '1px solid #10b981' : '1px solid #e2e8f0',
    boxShadow: isExpanded ? '0 4px 16px rgba(16, 185, 129, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
    borderRadius: '10px',
    marginBottom: '10px',
    overflow: 'hidden',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Block Header Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 14px',
          backgroundColor: isExpanded ? '#f0fdf4' : '#ffffff',
          borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
          userSelect: 'none',
        }}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          title="Drag to reorder section"
          style={{
            cursor: 'grab',
            color: '#94a3b8',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
          }}
        >
          <GripVertical size={16} />
        </button>

        {/* Section title & type badge */}
        <div
          onClick={onToggleExpand}
          style={{ flex: 1, cursor: 'pointer', overflow: 'hidden' }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: '0.86rem',
              color: isExpanded ? '#065f46' : '#0f172a',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {index + 1}. {block.name}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
            type: {block.type}
          </div>
        </div>

        {/* Actions: Duplicate, Visibility, Delete, Expand */}
        <button
          type="button"
          onClick={onDuplicate}
          title="Duplicate section"
          style={{ color: '#64748b', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Copy size={14} />
        </button>

        <button
          type="button"
          onClick={onToggleEnabled}
          title={block.enabled ? 'Hide section' : 'Show section'}
          style={{ color: block.enabled ? '#10b981' : '#94a3b8', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {block.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>

        <button
          type="button"
          onClick={onDelete}
          title="Delete section"
          style={{ color: '#ef4444', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Trash2 size={14} />
        </button>

        <button
          type="button"
          onClick={onToggleExpand}
          title={isExpanded ? 'Collapse' : 'Expand'}
          style={{ color: '#64748b', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && children}
    </div>
  );
}

// ------------------------------------------------------------------
// Layout tab controls for spacing, width, background
// ------------------------------------------------------------------
function LayoutPanel({
  layout,
  onChange,
  onPickBgImage,
}: {
  layout: BlockLayout;
  onChange: (next: BlockLayout) => void;
  onPickBgImage: () => void;
}) {
  const seg = (
    options: Array<{ value: string; label: string; icon?: any }>,
    current: string | undefined,
    onPick: (v: string) => void
  ) => (
    <div style={{ display: 'inline-flex', backgroundColor: '#f1f5f9', borderRadius: '7px', padding: '3px', gap: '2px' }}>
      {options.map((o) => {
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onPick(o.value)}
            title={o.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontWeight: 600,
              backgroundColor: current === o.value ? '#0f172a' : 'transparent',
              color: current === o.value ? '#ffffff' : '#64748b',
            }}
          >
            {Icon && <Icon size={12} />}
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Alignment */}
      <div>
        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Content Alignment
        </label>
        {seg(
          [
            { value: 'left', label: 'Left', icon: AlignLeft },
            { value: 'center', label: 'Center', icon: AlignCenter },
            { value: 'right', label: 'Right', icon: AlignRight },
          ],
          layout.align,
          (v) => onChange({ ...layout, align: v as BlockLayout['align'] })
        )}
      </div>

      {/* Section Width */}
      <div>
        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Container Width
        </label>
        {seg(
          [
            { value: 'narrow', label: 'Narrow' },
            { value: 'standard', label: 'Standard' },
            { value: 'wide', label: 'Wide' },
            { value: 'full', label: 'Full' },
          ],
          layout.width,
          (v) => onChange({ ...layout, width: v as BlockLayout['width'] })
        )}
      </div>

      {/* Spacing */}
      <div>
        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Vertical Padding
        </label>
        {seg(
          [
            { value: 'compact', label: 'Compact' },
            { value: 'normal', label: 'Normal' },
            { value: 'spacious', label: 'Spacious' },
          ],
          layout.spacing,
          (v) => onChange({ ...layout, spacing: v as BlockLayout['spacing'] })
        )}
      </div>

      {/* Background Color & Image */}
      <div>
        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Background
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="color"
            value={layout.bgColor || '#ffffff'}
            onChange={(e) => onChange({ ...layout, bgColor: e.target.value })}
            style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
          />
          <input
            type="text"
            placeholder="#004E35 or transparent"
            value={layout.bgColor || ''}
            onChange={(e) => onChange({ ...layout, bgColor: e.target.value })}
            style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
          />
          <button
            type="button"
            onClick={onPickBgImage}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#fff',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ImageIcon size={13} />
            <span>Bg Image</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Main Page Builder Component
// ------------------------------------------------------------------
function PageBuilderContent() {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const slug = (searchParams && searchParams.get('slug')) || '/about';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [blocks, setBlocks] = useState<BlockSection[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [pageStatus, setPageStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [showSeoModal, setShowSeoModal] = useState(false);

  // Preview Mode: 'canvas' (Real-time live component renderer) vs 'liveWeb' (Iframe to deployed site)
  const [previewMode, setPreviewMode] = useState<'canvas' | 'liveWeb'>('canvas');
  const [previewTimestamp, setPreviewTimestamp] = useState(Date.now());
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const [studioTree, setStudioTree] = useState<PageBlockTree | null>(null);
  const [studioTeamMembers, setStudioTeamMembers] = useState<
    Array<{ name: string; role?: string | null; imageUrl?: string | null }>
  >([]);
  const [studioScheduledAt, setStudioScheduledAt] = useState<string | null>(null);
  const [editorEngine, setEditorEngine] = useState<'studio' | 'legacy'>('studio');

  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);
  const [expandedTab, setExpandedTab] = useState<'content' | 'layout'>('content');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Add block modal state & category filter
  const [showAddModal, setShowAddModal] = useState(false);
  const [addCategoryFilter, setAddCategoryFilter] = useState<string>('all');

  // Media picker modal state
  const [pickerState, setPickerState] = useState<{
    open: boolean;
    blockId: string | null;
    field: string | null;
    kind: 'prop' | 'bgimage';
  }>({ open: false, blockId: null, field: null, kind: 'prop' });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Load real page data on mount / slug change
  useEffect(() => {
    async function load() {
      setIsLoadingPage(true);
      try {
        // 1. Fetch Schema v2 Dynamic Block Tree
        const treeData = await fetchPageTreeAction(slug);
        if (treeData?.tree) {
          setStudioTree(treeData.tree);
          setPageTitle(treeData.title || slug);
          setSeoTitle(treeData.seoTitle || '');
          setSeoDescription(treeData.seoDescription || '');
          setStudioScheduledAt((treeData as any).scheduledAt || null);
          if (Array.isArray(treeData.teamMembers)) {
            setStudioTeamMembers(treeData.teamMembers);
          }
        }

        // 2. Fetch Schema v1 legacy blocks as fallback
        const data = await fetchPageBySlug(slug);
        if (data) {
          if (!treeData?.tree) {
            setPageTitle(data.title || slug);
            setSeoTitle(data.seoTitle || '');
            setSeoDescription(data.seoDescription || '');
          }
          setPageStatus((data.status as 'DRAFT' | 'PUBLISHED') || 'DRAFT');
          if (Array.isArray(data.contentBlocks) && data.contentBlocks.length > 0) {
            const normalized = (data.contentBlocks as BlockSection[]).map((b) => ({
              ...b,
              layout: { ...DEFAULT_LAYOUT, ...(b.layout || {}) },
            }));
            setBlocks(normalized);
            // Expand first block by default
            if (normalized.length > 0) setExpandedBlockId(normalized[0].id);
          }
        }
      } catch (err) {
        console.error('Error loading page:', err);
      } finally {
        setIsLoadingPage(false);
      }
    }
    load();
  }, [slug]);

  // ---------------- DnD handlers ----------------
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      setBlocks(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const moveBlockUp = (index: number) => {
    if (index <= 0) return;
    setBlocks(arrayMove(blocks, index, index - 1));
  };

  const moveBlockDown = (index: number) => {
    if (index >= blocks.length - 1) return;
    setBlocks(arrayMove(blocks, index, index + 1));
  };

  // Duplicate block
  const duplicateBlock = (id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    const newId = `block_${Date.now()}`;
    const newBlock: BlockSection = {
      ...block,
      id: newId,
      name: `${block.name} (Copy)`,
      props: { ...block.props },
      layout: { ...(block.layout || DEFAULT_LAYOUT) },
    };
    setBlocks([...blocks, newBlock]);
    setExpandedBlockId(newId);
    setExpandedTab('content');
  };

  // Delete block
  const deleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      alert('A page must have at least one section block.');
      return;
    }
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  // Add block from comprehensive templates
  const addBlockFromTemplate = (tmpl: BlockTemplate) => {
    const newId = `block_${Date.now()}`;
    const newBlock: BlockSection = {
      id: newId,
      name: tmpl.name,
      type: tmpl.type,
      enabled: true,
      props: { ...tmpl.defaultProps },
      layout: { ...DEFAULT_LAYOUT },
    };
    setBlocks([...blocks, newBlock]);
    setExpandedBlockId(newId);
    setExpandedTab('content');
    setShowAddModal(false);
  };

  // Update text field prop
  const updateBlockProp = (id: string, field: string, value: any) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id === id) {
          const nextProps = { ...b.props };
          if (value === undefined) {
            delete nextProps[field];
          } else {
            nextProps[field] = value;
          }
          return {
            ...b,
            props: nextProps,
          };
        }
        return b;
      })
    );
  };

  // Update block layout
  const updateBlockLayout = (id: string, layout: BlockLayout) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, layout } : b)));
  };

  // Handle media picker result
  const handleMediaPicked = (media: PickedMedia) => {
    const { blockId, field, kind } = pickerState;
    if (!blockId) return;
    if (kind === 'bgimage') {
      const block = blocks.find((b) => b.id === blockId);
      if (block?.layout) updateBlockLayout(blockId, { ...block.layout, bgImage: media.url });
    } else if (field) {
      updateBlockProp(blockId, field, media.url);
    }
  };

  // ---------------- Save handlers ----------------
  const doSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    setSaveStatus('saving');
    try {
      await savePageAction({
        slug,
        title: pageTitle || slug,
        seoTitle,
        seoDescription,
        contentBlocks: blocks,
        layoutTemplate: 'standard',
        status,
      });
      setPageStatus(status);
      setSaveStatus('saved');
      setPreviewTimestamp(Date.now());
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err: any) {
      alert(err.message || 'Error saving page changes');
      setSaveStatus('idle');
    }
  };

  const handleSaveDraft = () => doSave('DRAFT');
  const handlePublish = () => doSave('PUBLISHED');

  const previewWidths: Record<string, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '390px',
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://envintglobal.vercel.app';
  const liveWebUrl = `${siteUrl}${slug}?t=${previewTimestamp}`;

  const filteredTemplates = COMPREHENSIVE_BLOCK_TEMPLATES.filter(
    (t) => addCategoryFilter === 'all' || t.category === addCategoryFilter
  );

  if (!isMounted) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
            Loading Envint CMS Studio...
          </div>
          <div style={{ fontSize: '0.85rem' }}>Preparing page editor workspace</div>
        </div>
      </div>
    );
  }

  // Render Schema v2 Visual Page Builder Studio if tree exists
  if (editorEngine === 'studio' && studioTree) {
    return (
      <VisualStudioEditor
        initialTree={studioTree}
        teamMembers={studioTeamMembers}
        slug={slug}
        pageTitle={pageTitle || (slug === '/about' ? 'About Envint' : slug)}
        seoTitle={seoTitle}
        seoDescription={seoDescription}
        scheduledAt={studioScheduledAt}
        onSwitchToLegacy={() => setEditorEngine('legacy')}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', overflow: 'hidden' }}>
      {/* Top Header Bar */}
      <header
        style={{
          height: '60px',
          borderBottom: '1px solid #1e293b',
          backgroundColor: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/pages"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#1e293b',
              color: '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} />
            <span>Pages</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Editing:</span>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="Page Title"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                outline: 'none',
                maxWidth: '220px',
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                backgroundColor: '#1e293b',
                padding: '3px 8px',
                borderRadius: '4px',
                color: '#38bdf8',
              }}
            >
              {slug}
            </span>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                backgroundColor: pageStatus === 'PUBLISHED' ? '#064e3b' : '#78350f',
                color: pageStatus === 'PUBLISHED' ? '#34d399' : '#fbbf24',
              }}
            >
              {pageStatus}
            </span>
          </div>
        </div>

        {/* Device Viewport & Mode Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#1e293b', borderRadius: '8px', padding: '3px' }}>
          {[
            { mode: 'desktop', icon: Monitor, label: 'Desktop' },
            { mode: 'tablet', icon: Tablet, label: 'Tablet' },
            { mode: 'mobile', icon: Smartphone, label: 'Mobile' },
          ].map((item) => {
            const Icon = item.icon;
            const active = deviceMode === item.mode;
            return (
              <button
                key={item.mode}
                type="button"
                onClick={() => setDeviceMode(item.mode as any)}
                title={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  backgroundColor: active ? '#0f172a' : 'transparent',
                  color: active ? '#38bdf8' : '#64748b',
                }}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* SEO & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowSeoModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '6px',
              backgroundColor: '#1e293b',
              color: '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={14} color="#38bdf8" />
            <span>SEO</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!studioTree) {
                setStudioTree(createStarterPageTree(pageTitle || slug));
              }
              setEditorEngine('studio');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: '1px solid rgba(16, 185, 129, 0.4)',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={14} />
            <span>Visual Studio Builder</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saveStatus === 'saving'}
            style={{
              padding: '7px 14px',
              borderRadius: '6px',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {saveStatus === 'saved' && pageStatus === 'DRAFT' ? 'Saved!' : 'Save Draft'}
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={saveStatus === 'saving'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 18px',
              borderRadius: '6px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Rocket size={14} />
            <span>{saveStatus === 'saving' ? 'Publishing...' : 'Publish Changes'}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Dynamic Blocks Structure & Property Controls */}
        <div
          style={{
            width: '420px',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {/* Sidebar Top: Block count & + Add Block button */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff',
            }}
          >
            <div>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Page Sections
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0' }}>
                {blocks.length} sections • drag <GripVertical size={11} style={{ display: 'inline' }} /> to reorder
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '6px',
                backgroundColor: '#004E35',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={14} />
              <span>Add Block</span>
            </button>
          </div>

          {/* Block Accordion List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {isLoadingPage ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ marginBottom: '8px', fontSize: '0.88rem', fontWeight: 600 }}>Loading Page Sections...</div>
                <span style={{ fontSize: '0.75rem' }}>Fetching blocks from database</span>
              </div>
            ) : blocks.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                <Layers size={32} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>No sections yet</div>
                <p style={{ fontSize: '0.78rem', margin: '6px 0 16px' }}>
                  Click <strong>Add Block</strong> above to pick your first section template.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: '#004E35',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Browse Block Templates
                </button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  {blocks.map((block, index) => {
                    const isExpanded = expandedBlockId === block.id;

                    return (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        index={index}
                        isExpanded={isExpanded}
                        onToggleExpand={() => {
                          setExpandedBlockId(isExpanded ? null : block.id);
                          if (!isExpanded) setExpandedTab('content');
                        }}
                        onToggleEnabled={() => {
                          setBlocks(blocks.map((b) => (b.id === block.id ? { ...b, enabled: !b.enabled } : b)));
                        }}
                        onDelete={() => deleteBlock(block.id)}
                        onDuplicate={() => duplicateBlock(block.id)}
                      >
                        {/* Expanded Block Editor Panel */}
                        <div style={{ padding: '16px', backgroundColor: '#ffffff' }}>
                          {/* Tabs: Content vs Layout */}
                          <div
                            style={{
                              display: 'flex',
                              gap: '4px',
                              borderBottom: '1px solid #e2e8f0',
                              paddingBottom: '8px',
                              marginBottom: '16px',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedTab('content')}
                              style={{
                                padding: '5px 12px',
                                borderRadius: '5px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                backgroundColor: expandedTab === 'content' ? '#004E35' : 'transparent',
                                color: expandedTab === 'content' ? '#ffffff' : '#64748b',
                              }}
                            >
                              Content
                            </button>
                            <button
                              type="button"
                              onClick={() => setExpandedTab('layout')}
                              style={{
                                padding: '5px 12px',
                                borderRadius: '5px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                backgroundColor: expandedTab === 'layout' ? '#004E35' : 'transparent',
                                color: expandedTab === 'layout' ? '#ffffff' : '#64748b',
                              }}
                            >
                              Layout & Style
                            </button>
                          </div>

                          {expandedTab === 'content' ? (
                            <BlockFormFields
                              block={block}
                              onUpdateProp={(field, val) => updateBlockProp(block.id, field, val)}
                              onOpenMediaPicker={(field) =>
                                setPickerState({ open: true, blockId: block.id, field, kind: 'prop' })
                              }
                            />
                          ) : (
                            <LayoutPanel
                              layout={block.layout || DEFAULT_LAYOUT}
                              onChange={(next) => updateBlockLayout(block.id, next)}
                              onPickBgImage={() =>
                                setPickerState({ open: true, blockId: block.id, field: null, kind: 'bgimage' })
                              }
                            />
                          )}
                        </div>
                      </SortableBlock>
                    );
                  })}
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Reorder controls footer */}
          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Order control:</span>
            <button
              type="button"
              onClick={() => {
                const idx = blocks.findIndex((b) => b.id === expandedBlockId);
                if (idx > -1) moveBlockUp(idx);
              }}
              disabled={!expandedBlockId}
              title="Move block up"
              style={{
                padding: '4px 8px',
                borderRadius: '5px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#fff',
                cursor: expandedBlockId ? 'pointer' : 'not-allowed',
                color: '#64748b',
              }}
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              onClick={() => {
                const idx = blocks.findIndex((b) => b.id === expandedBlockId);
                if (idx > -1) moveBlockDown(idx);
              }}
              disabled={!expandedBlockId}
              title="Move block down"
              style={{
                padding: '4px 8px',
                borderRadius: '5px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#fff',
                cursor: expandedBlockId ? 'pointer' : 'not-allowed',
                color: '#64748b',
              }}
            >
              <ChevronDown size={13} />
            </button>
          </div>
        </div>

        {/* Right Side: Live Visual Studio Canvas (Zero 404s!) */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#0b1329',
            padding: '16px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Canvas Sub-Header Strip */}
          <div
            style={{
              width: previewWidths[deviceMode],
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
              color: '#94a3b8',
              fontSize: '0.78rem',
              flexShrink: 0,
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Mode Switcher: Live Studio Canvas vs Live Website Iframe */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  backgroundColor: '#1e293b',
                  borderRadius: '6px',
                  padding: '2px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setPreviewMode('canvas')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: previewMode === 'canvas' ? '#0f172a' : 'transparent',
                    color: previewMode === 'canvas' ? '#10b981' : '#94a3b8',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: previewMode === 'canvas' ? '#10b981' : '#64748b',
                    }}
                  />
                  <span>Live Studio Canvas (Real-Time)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMode('liveWeb')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: previewMode === 'liveWeb' ? '#0f172a' : 'transparent',
                    color: previewMode === 'liveWeb' ? '#38bdf8' : '#94a3b8',
                  }}
                >
                  <Globe size={12} />
                  <span>Live Website (Iframe)</span>
                </button>
              </div>

              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {previewMode === 'canvas' ? 'Click any section to edit' : 'Loads public deployed URL'}
              </span>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setPreviewTimestamp(Date.now())}
                title="Refresh preview"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#94a3b8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                }}
              >
                <RefreshCw size={12} />
                <span>Refresh</span>
              </button>

              <a
                href={`${siteUrl}${slug}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 600, textDecoration: 'none' }}
              >
                <span>Open in Tab</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Actual Simulator Container */}
          <div
            style={{
              width: previewWidths[deviceMode],
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: deviceMode === 'desktop' ? '8px' : '20px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              overflowY: 'auto',
              border: deviceMode !== 'desktop' ? '10px solid #1e293b' : '1px solid #334155',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
            }}
          >
            {previewMode === 'canvas' ? (
              <LiveCanvasRenderer
                blocks={blocks}
                pageTitle={pageTitle || slug}
                selectedBlockId={expandedBlockId}
                onSelectBlock={(id) => {
                  setExpandedBlockId(id);
                  setExpandedTab('content');
                }}
              />
            ) : (
              <iframe
                key={`${slug}-${deviceMode}-${previewTimestamp}`}
                src={liveWebUrl}
                title="Live Website View"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        open={pickerState.open}
        onClose={() => setPickerState({ ...pickerState, open: false })}
        onSelect={handleMediaPicked}
      />

      {/* SEO Settings Modal */}
      {showSeoModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(4px)',
            padding: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '28px',
              width: '100%',
              maxWidth: '540px',
              color: '#0f172a',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>SEO & Meta Settings</h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0' }}>Configure how this page appears in search engines</p>
              </div>
              <button onClick={() => setShowSeoModal(false)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  SEO Page Title
                </label>
                <input
                  type="text"
                  placeholder={`${pageTitle} - Envint Global`}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Meta Description (Max 160 characters)
                </label>
                <textarea
                  rows={3}
                  placeholder="Appears in search engine result snippets..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowSeoModal(false)}
                  style={{
                    padding: '8px 22px',
                    borderRadius: '6px',
                    backgroundColor: '#004E35',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save SEO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive "+ Add Block" Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(4px)',
            padding: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '780px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              color: '#0f172a',
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  Add Section Block
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '3px 0 0' }}>
                  Choose from our curated library of mobile-responsive, production-tested section templates
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div style={{ padding: '12px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Templates' },
                { id: 'hero', label: 'Heroes & Headers' },
                { id: 'narrative', label: 'Story & Narrative' },
                { id: 'features', label: 'Features & Pillars' },
                { id: 'metrics', label: 'Metrics & Proof' },
                { id: 'conversion', label: 'Conversion & CTAs' },
                { id: 'faq', label: 'FAQs' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setAddCategoryFilter(cat.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: addCategoryFilter === cat.id ? '#004E35' : '#cbd5e1',
                    backgroundColor: addCategoryFilter === cat.id ? '#004E35' : '#ffffff',
                    color: addCategoryFilter === cat.id ? '#ffffff' : '#475569',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div
              style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '14px',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {filteredTemplates.map((tmpl) => {
                const Icon = tmpl.icon;
                return (
                  <button
                    key={tmpl.type}
                    type="button"
                    onClick={() => addBlockFromTemplate(tmpl)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#10b981';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(16, 185, 129, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: '#ecfdf5',
                        color: '#004E35',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '4px' }}>
                        {tmpl.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: '1.4' }}>
                        {tmpl.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PageBuilderEditor() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', color: '#fff' }}>Loading Page Builder Studio...</div>}>
      <PageBuilderContent />
    </Suspense>
  );
}

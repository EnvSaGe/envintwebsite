'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Layout,
  Palette,
  Smartphone,
  MousePointer,
  Trash2,
  Copy,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  ChevronRight,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';
import { BuilderNode, ElementStyles } from '@envint/shared';
import { Breakpoint, StudioState } from './StudioState';
import { MediaPickerModal, PickedMedia } from '../../../../components/MediaPickerModal';

interface InspectorSidebarProps {
  state: StudioState;
  onUpdateContent: (nodeId: string, content: Partial<any>) => void;
  onUpdateStyles: (nodeId: string, styles: Partial<ElementStyles>, bp?: Breakpoint) => void;
  onUpdateVisibility: (nodeId: string, visibility: { desktop?: boolean; tablet?: boolean; mobile?: boolean }) => void;
  onDuplicateNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onSelectNode: (nodeId: string) => void;
}

// Envint Curated Design Tokens
const BRAND_COLORS = [
  { label: 'Deep Forest', hex: '#002E20' },
  { label: 'Emerald Mint', hex: '#004E35' },
  { label: 'Vibrant Mint', hex: '#10B981' },
  { label: 'Soft Mint', hex: '#E6F4EA' },
  { label: 'Cream White', hex: '#FBF4EB' },
  { label: 'Charcoal Body', hex: '#393939' },
  { label: 'Pure White', hex: '#FFFFFF' },
  { label: 'Light Neutral', hex: '#F7F7F7' },
  { label: 'Border Gray', hex: '#E5E7EB' },
];

export function InspectorSidebar({
  state,
  onUpdateContent,
  onUpdateStyles,
  onUpdateVisibility,
  onDuplicateNode,
  onDeleteNode,
  onSelectNode,
}: InspectorSidebarProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'style' | 'responsive'>('content');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const selectedNode = state.selectedId ? state.tree.nodes[state.selectedId] : null;

  if (!selectedNode) {
    return (
      <aside className="w-80 bg-[#001D14] border-l border-white/10 flex flex-col h-[calc(100vh-4rem)] p-6 text-center justify-center items-center select-none text-white/50">
        <MousePointer size={32} className="text-white/20 mb-3" />
        <p className="text-xs">Select any element on the canvas to inspect and edit its properties.</p>
      </aside>
    );
  }

  // Active styles based on selected breakpoint
  const currentStyles =
    state.breakpoint === 'desktop'
      ? selectedNode.styles || {}
      : { ...selectedNode.styles, ...(selectedNode.responsiveStyles?.[state.breakpoint] || {}) };

  // Calculate breadcrumbs from root to selected node
  const breadcrumbs: { id: string; name: string; type: string }[] = [];
  let curr: BuilderNode | null = selectedNode;
  while (curr) {
    breadcrumbs.unshift({ id: curr.id, name: curr.name, type: curr.type });
    curr = curr.parentId ? state.tree.nodes[curr.parentId] : null;
  }

  const handleMediaPicked = (media: PickedMedia) => {
    onUpdateContent(selectedNode.id, { src: media.url, alt: media.filename || selectedNode.content?.alt || '' });
    setIsMediaPickerOpen(false);
  };

  return (
    <aside className="w-80 bg-[#001D14] border-l border-white/10 flex flex-col h-[calc(100vh-4rem)] select-none">
      {/* Node Header & Breadcrumbs */}
      <div className="p-3 border-b border-white/10 bg-black/20">
        {/* Breadcrumb line */}
        <div className="flex items-center gap-1 overflow-x-auto text-[10px] text-white/40 mb-1">
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={b.id}>
              {i > 0 && <ChevronRight size={10} />}
              <button
                type="button"
                onClick={() => onSelectNode(b.id)}
                className={`hover:text-white truncate ${b.id === selectedNode.id ? 'text-emerald-400 font-semibold' : ''}`}
              >
                {b.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white truncate max-w-[170px]">
              {selectedNode.name}
            </span>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
              {selectedNode.type}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDuplicateNode(selectedNode.id)}
              className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded"
              title="Duplicate"
            >
              <Copy size={13} />
            </button>
            <button
              type="button"
              onClick={() => onDeleteNode(selectedNode.id)}
              className="p-1 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-black/10 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 font-medium transition-colors ${
            activeTab === 'content'
              ? 'text-emerald-400 border-b-2 border-emerald-400 bg-white/[0.02]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`flex-1 py-2 font-medium transition-colors ${
            activeTab === 'layout'
              ? 'text-emerald-400 border-b-2 border-emerald-400 bg-white/[0.02]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Layout
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2 font-medium transition-colors ${
            activeTab === 'style'
              ? 'text-emerald-400 border-b-2 border-emerald-400 bg-white/[0.02]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Style
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('responsive')}
          className={`flex-1 py-2 font-medium transition-colors ${
            activeTab === 'responsive'
              ? 'text-emerald-400 border-b-2 border-emerald-400 bg-white/[0.02]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Responsive
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-white">
        {/* ================================================================= */}
        {/* TAB 1: CONTENT                                                    */}
        {/* ================================================================= */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Heading Node */}
            {selectedNode.type === 'heading' && (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Heading Text
                  </label>
                  <textarea
                    rows={3}
                    value={selectedNode.content?.text || ''}
                    onChange={(e) => onUpdateContent(selectedNode.id, { text: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    HTML Semantic Tag
                  </label>
                  <select
                    value={selectedNode.content?.tag || 'h2'}
                    onChange={(e) => onUpdateContent(selectedNode.id, { tag: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="h1">H1 - Page Main Title</option>
                    <option value="h2">H2 - Section Heading</option>
                    <option value="h3">H3 - Subsection Heading</option>
                    <option value="h4">H4 - Card Title</option>
                    <option value="h5">H5 - Minor Title</option>
                    <option value="h6">H6 - Label Title</option>
                  </select>
                </div>
              </>
            )}

            {/* Paragraph Node */}
            {(selectedNode.type === 'paragraph' || selectedNode.type === 'rich-text') && (
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">
                  Paragraph HTML Content
                </label>
                <textarea
                  rows={6}
                  value={selectedNode.content?.html || ''}
                  onChange={(e) => onUpdateContent(selectedNode.id, { html: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-white/40 block mt-1">
                  Supports bold, italic, links, and paragraph tags.
                </span>
              </div>
            )}

            {/* Button Node */}
            {selectedNode.type === 'button' && (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={selectedNode.content?.label || ''}
                    onChange={(e) => onUpdateContent(selectedNode.id, { label: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Button Variant
                  </label>
                  <select
                    value={selectedNode.content?.variant || 'primary'}
                    onChange={(e) => onUpdateContent(selectedNode.id, { variant: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="primary">Primary (Emerald Filled)</option>
                    <option value="secondary">Secondary (Mint Filled)</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost</option>
                    <option value="text">Inline Text Link</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Target URL / Route
                  </label>
                  <input
                    type="text"
                    value={selectedNode.content?.action?.url || ''}
                    onChange={(e) =>
                      onUpdateContent(selectedNode.id, {
                        action: { ...(selectedNode.content?.action || {}), url: e.target.value },
                      })
                    }
                    placeholder="e.g. /connect or https://..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="openInNewTab"
                    checked={selectedNode.content?.action?.target === '_blank'}
                    onChange={(e) =>
                      onUpdateContent(selectedNode.id, {
                        action: {
                          ...(selectedNode.content?.action || {}),
                          target: e.target.checked ? '_blank' : '_self',
                        },
                      })
                    }
                    className="rounded bg-black/40 border-white/20 text-emerald-500 focus:ring-0"
                  />
                  <label htmlFor="openInNewTab" className="text-[11px] text-white/70">
                    Open link in new tab
                  </label>
                </div>
              </>
            )}

            {/* Image Node */}
            {selectedNode.type === 'image' && (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Image Source (AWS S3)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedNode.content?.src || ''}
                      onChange={(e) => onUpdateContent(selectedNode.id, { src: e.target.value })}
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 text-[11px] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1 text-xs font-medium"
                      title="Choose from AWS S3 Media Library"
                    >
                      <Upload size={13} />
                      <span>S3</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Alt Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    value={selectedNode.content?.alt || ''}
                    onChange={(e) => onUpdateContent(selectedNode.id, { alt: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Object Fit
                  </label>
                  <select
                    value={selectedNode.content?.objectFit || 'cover'}
                    onChange={(e) => onUpdateContent(selectedNode.id, { objectFit: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cover">Cover (Fill container)</option>
                    <option value="contain">Contain (Preserve aspect ratio)</option>
                    <option value="fill">Fill (Stretch)</option>
                  </select>
                </div>
              </>
            )}

            {/* Badge Node */}
            {selectedNode.type === 'badge' && (
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">
                  Tagline / Badge Text
                </label>
                <input
                  type="text"
                  value={selectedNode.content?.text || ''}
                  onChange={(e) => onUpdateContent(selectedNode.id, { text: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Counter Node */}
            {selectedNode.type === 'counter' && (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Metric Value
                  </label>
                  <input
                    type="text"
                    value={selectedNode.content?.value || ''}
                    onChange={(e) => onUpdateContent(selectedNode.id, { value: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Metric Label
                  </label>
                  <input
                    type="text"
                    value={selectedNode.content?.label || ''}
                    onChange={(e) => onUpdateContent(selectedNode.id, { label: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: LAYOUT & DIMENSIONS                                        */}
        {/* ================================================================= */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            {/* Display Model */}
            {(selectedNode.type === 'section' || selectedNode.type === 'container' || selectedNode.type === 'grid' || selectedNode.type === 'flex') && (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Layout Display
                  </label>
                  <select
                    value={currentStyles.display || 'block'}
                    onChange={(e) => onUpdateStyles(selectedNode.id, { display: e.target.value as any })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="block">Block (Standard)</option>
                    <option value="flex">Flexbox Stack</option>
                    <option value="grid">CSS Grid</option>
                  </select>
                </div>

                {currentStyles.display === 'grid' && (
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Grid Columns
                    </label>
                    <input
                      type="text"
                      value={currentStyles.gridColumns || ''}
                      onChange={(e) => onUpdateStyles(selectedNode.id, { gridColumns: e.target.value })}
                      placeholder="e.g. repeat(2, 1fr) or 1fr 2fr"
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                {currentStyles.display === 'flex' && (
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Flex Direction
                    </label>
                    <select
                      value={currentStyles.flexDirection || 'row'}
                      onChange={(e) => onUpdateStyles(selectedNode.id, { flexDirection: e.target.value as any })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="row">Horizontal Row</option>
                      <option value="column">Vertical Column</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Gap Spacing
                  </label>
                  <input
                    type="text"
                    value={currentStyles.gap || ''}
                    onChange={(e) => onUpdateStyles(selectedNode.id, { gap: e.target.value })}
                    placeholder="e.g. 24px or 48px"
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            {/* Dimensions */}
            <div>
              <label className="block text-[11px] font-medium text-white/70 mb-1">
                Max Width
              </label>
              <input
                type="text"
                value={currentStyles.maxWidth || ''}
                onChange={(e) => onUpdateStyles(selectedNode.id, { maxWidth: e.target.value })}
                placeholder="e.g. 1280px or 100%"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Padding Controls */}
            <div>
              <label className="block text-[11px] font-medium text-white/70 mb-2">
                Padding (Spacing Inside)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-white/50">Top</span>
                  <input
                    type="text"
                    value={currentStyles.paddingTop || ''}
                    onChange={(e) => onUpdateStyles(selectedNode.id, { paddingTop: e.target.value })}
                    placeholder="e.g. 80px"
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-1.5 text-white text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-white/50">Bottom</span>
                  <input
                    type="text"
                    value={currentStyles.paddingBottom || ''}
                    onChange={(e) => onUpdateStyles(selectedNode.id, { paddingBottom: e.target.value })}
                    placeholder="e.g. 80px"
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-1.5 text-white text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-white/50">Left</span>
                  <input
                    type="text"
                    value={currentStyles.paddingLeft || ''}
                    onChange={(e) => onUpdateStyles(selectedNode.id, { paddingLeft: e.target.value })}
                    placeholder="e.g. 24px"
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-1.5 text-white text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-white/50">Right</span>
                  <input
                    type="text"
                    value={currentStyles.paddingRight || ''}
                    onChange={(e) => onUpdateStyles(selectedNode.id, { paddingRight: e.target.value })}
                    placeholder="e.g. 24px"
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-1.5 text-white text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: STYLE & TOKENS                                             */}
        {/* ================================================================= */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            {/* Background Color */}
            <div>
              <label className="block text-[11px] font-medium text-white/70 mb-1.5">
                Background Color
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {BRAND_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onUpdateStyles(selectedNode.id, { backgroundColor: c.hex })}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${
                      currentStyles.backgroundColor === c.hex ? 'border-white ring-2 ring-emerald-500' : 'border-white/20'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
              <input
                type="text"
                value={currentStyles.backgroundColor || ''}
                onChange={(e) => onUpdateStyles(selectedNode.id, { backgroundColor: e.target.value })}
                placeholder="#002E20 or transparent"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Typography */}
            <div>
              <label className="block text-[11px] font-medium text-white/70 mb-1.5">
                Typography & Text
              </label>
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-white/50">Font Size</span>
                  <input
                    type="text"
                    value={currentStyles.fontSize || ''}
                    onChange={(e) => onUpdateStyles(selectedNode.id, { fontSize: e.target.value })}
                    placeholder="e.g. 48px or 1.5rem"
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-1.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-white/50">Text Color</span>
                  <input
                    type="text"
                    value={currentStyles.textColor || ''}
                    onChange={(e) => onUpdateStyles(selectedNode.id, { textColor: e.target.value })}
                    placeholder="e.g. #004E35"
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-1.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-white/50">Alignment</span>
                  <div className="flex bg-black/40 border border-white/10 rounded-lg p-0.5 mt-1">
                    {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => onUpdateStyles(selectedNode.id, { textAlign: align })}
                        className={`flex-1 py-1 rounded flex justify-center items-center ${
                          currentStyles.textAlign === align ? 'bg-emerald-600 text-white' : 'text-white/40 hover:text-white'
                        }`}
                      >
                        {align === 'left' && <AlignLeft size={14} />}
                        {align === 'center' && <AlignCenter size={14} />}
                        {align === 'right' && <AlignRight size={14} />}
                        {align === 'justify' && <AlignJustify size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-[11px] font-medium text-white/70 mb-1">
                Border Radius
              </label>
              <input
                type="text"
                value={currentStyles.borderRadius || ''}
                onChange={(e) => onUpdateStyles(selectedNode.id, { borderRadius: e.target.value })}
                placeholder="e.g. 16px or 9999px"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: RESPONSIVE & VISIBILITY                                    */}
        {/* ================================================================= */}
        {activeTab === 'responsive' && (
          <div className="space-y-4">
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-3">
              <span className="text-[11px] font-semibold text-emerald-300 block mb-1">
                Editing: {state.breakpoint.toUpperCase()} View
              </span>
              <p className="text-[10px] text-white/60">
                {state.breakpoint === 'desktop'
                  ? 'Changes will apply to all device viewports as base styles.'
                  : `Changes made while in ${state.breakpoint} mode will override desktop styling.`}
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-white/70 mb-2">
                Device Visibility
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={selectedNode.visibility?.desktop !== false}
                    onChange={(e) => onUpdateVisibility(selectedNode.id, { desktop: e.target.checked })}
                    className="rounded bg-black/40 border-white/20 text-emerald-500 focus:ring-0"
                  />
                  <span>Visible on Desktop</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={selectedNode.visibility?.tablet !== false}
                    onChange={(e) => onUpdateVisibility(selectedNode.id, { tablet: e.target.checked })}
                    className="rounded bg-black/40 border-white/20 text-emerald-500 focus:ring-0"
                  />
                  <span>Visible on Tablet</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={selectedNode.visibility?.mobile !== false}
                    onChange={(e) => onUpdateVisibility(selectedNode.id, { mobile: e.target.checked })}
                    className="rounded bg-black/40 border-white/20 text-emerald-500 focus:ring-0"
                  />
                  <span>Visible on Mobile</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <MediaPickerModal
          open={isMediaPickerOpen}
          onSelect={handleMediaPicked}
          onClose={() => setIsMediaPickerOpen(false)}
        />
      )}
    </aside>
  );
}

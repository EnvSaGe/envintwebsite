'use client';

/**
 * InspectorSidebar — smart, visual Inspector (v2).
 *
 * Design language: editors make DESIGN decisions, not CSS decisions.
 * - Tabs: Content / Design / Layout (visibility & device live in the footer).
 * - Quick controls first (size stepper, alignment, color, presets).
 * - CSS-jargon properties (line-height, overflow, z-index…) hidden under
 *   "Advanced ▸" disclosures.
 * - Responsive: fields show an override dot; the footer mirrors the device
 *   switcher and counts overrides; per-field "Inherited: X" + reset.
 *
 * All writes still go through the same UPDATE_CONTENT / UPDATE_STYLES /
 * UPDATE_VISIBILITY dispatches — persistence unchanged.
 */

import React from 'react';
import {
  ChevronRight,
  Copy,
  Trash2,
  MousePointer,
  Type,
  Monitor,
  Tablet as TabletIcon,
  Smartphone,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Rows3,
  Columns,
  Paintbrush,
  ToggleLeft,
  Check,
} from 'lucide-react';
import { BuilderNode, ElementStyles } from '@envint/shared';
import { Breakpoint, StudioState } from './StudioState';
import { MediaPickerModal, PickedMedia } from '../../../../components/MediaPickerModal';
import {
  BreadcrumbBar,
  ElementTitle,
  IconButton,
  InspectorSection,
  Tooltip,
} from './ui-kit';
import {
  FieldRow,
  OverrideDot,
  ScrubNumber,
  Segmented,
  TextAlignControl,
  DirectionControl,
  AlignMatrix,
  ColorPopover,
  SpacingControl,
  ColumnsControl,
  AdvancedDisclosure,
  StylePresetSelect,
} from './ui-controls';

interface InspectorSidebarProps {
  state: StudioState;
  onUpdateContent: (nodeId: string, content: Partial<any>) => void;
  onUpdateStyles: (nodeId: string, styles: Partial<ElementStyles>, bp?: Breakpoint) => void;
  onUpdateVisibility: (
    nodeId: string,
    visibility: { desktop?: boolean; tablet?: boolean; mobile?: boolean }
  ) => void;
  onDuplicateNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onSelectNode: (nodeId: string) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  width: number;
}

const FONT_SIZE_PRESETS = [
  { label: 'Display — 76px', value: '76px' },
  { label: 'Heading 1 — 48px', value: '48px' },
  { label: 'Heading 2 — 36px', value: '36px' },
  { label: 'Heading 3 — 28px', value: '28px' },
  { label: 'Body Large — 20px', value: '20px' },
  { label: 'Body — 16px', value: '16px' },
  { label: 'Small — 14px', value: '14px' },
  { label: 'Caption — 12px', value: '12px' },
];

const WEIGHT_OPTIONS = [
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semibold', value: '600' },
  { label: 'Bold', value: '700' },
];

type InspectorTab = 'content' | 'design' | 'layout';

export function InspectorSidebar({
  state,
  onUpdateContent,
  onUpdateStyles,
  onUpdateVisibility,
  onDuplicateNode,
  onDeleteNode,
  onSelectNode,
  isCollapsed,
  onToggleCollapsed,
  width,
}: InspectorSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<InspectorTab>('content');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  const selectedNode = state.selectedId ? state.tree.nodes[state.selectedId] : null;

  /* ── Collapsed edge rail ─────────────────────────────────────────────── */
  if (isCollapsed) {
    return (
      <aside className="flex h-full w-10 shrink-0 flex-col items-center border-l border-slate-800/90 bg-[#0D1220] py-2 select-none">
        <button
          type="button"
          onClick={onToggleCollapsed}
          title="Expand Inspector"
          aria-label="Expand Inspector"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        >
          <ChevronRight size={16} />
        </button>
      </aside>
    );
  }

  if (!selectedNode) {
    return (
      <aside
        className="flex h-full shrink-0 flex-col items-center justify-center border-l border-slate-800/90 bg-[#0D1220] p-6 text-center select-none"
        style={{ width }}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/70 shadow-inner">
          <MousePointer size={20} className="text-slate-400" />
        </div>
        <h3 className="mb-1 text-[13px] font-semibold text-slate-200">Nothing selected</h3>
        <p className="max-w-[220px] text-[12px] leading-relaxed text-slate-500">
          Click any element on the canvas or in Layers to edit it. Double-click text to edit inline.
        </p>
      </aside>
    );
  }

  const currentStyles: ElementStyles =
    state.breakpoint === 'desktop'
      ? selectedNode.styles || {}
      : { ...(selectedNode.styles || {}), ...(selectedNode.responsiveStyles?.[state.breakpoint] || {}) };

  const activeOverrides =
    state.breakpoint === 'desktop'
      ? ({} as Record<string, unknown>)
      : ((selectedNode.responsiveStyles?.[state.breakpoint] || {}) as Record<string, unknown>);

  const hasOverride = (key: string) => Object.prototype.hasOwnProperty.call(activeOverrides, key);

  // Breadcrumb from root to selected node
  const breadcrumbs: Array<{ id: string; name: string; type: string }> = [];
  let curr: BuilderNode | null = selectedNode;
  while (curr) {
    breadcrumbs.unshift({ id: curr.id, name: curr.name, type: curr.type });
    curr = curr.parentId ? state.tree.nodes[curr.parentId] : null;
  }

  const handleMediaPicked = (media: PickedMedia) => {
    onUpdateContent(selectedNode.id, {
      src: media.url,
      alt: media.filename || selectedNode.content?.alt || '',
    });
    setIsMediaPickerOpen(false);
  };

  const isTextual =
    selectedNode.type === 'heading' ||
    selectedNode.type === 'paragraph' ||
    selectedNode.type === 'rich-text' ||
    selectedNode.type === 'button' ||
    selectedNode.type === 'badge' ||
    selectedNode.type === 'counter';

  const isContainer = ['section', 'container', 'grid', 'flex', 'columns'].includes(selectedNode.type);

  const overrideCount = Object.keys(activeOverrides).length;

  /** Style setter for a single visual key with inherited-aware clearing. */
  const setStyle = (patch: Partial<ElementStyles>) => onUpdateStyles(selectedNode.id, patch);

  return (
    <aside
      className="flex h-full shrink-0 flex-col border-l border-slate-800/90 bg-[#0D1220] select-none"
      style={{ width }}
    >
      {/* Breadcrumb + selected element header */}
      <div className="border-b border-slate-800 bg-[#10162A] px-3 pb-2.5 pt-2">
        <BreadcrumbBar items={breadcrumbs} onSelect={onSelectNode} />
        <div className="mt-1.5">
          <ElementTitle
            name={selectedNode.name}
            type={selectedNode.type}
            actions={
              <>
                <IconButton
                  label={`Duplicate element (Ctrl+D) — creates a copy of ${selectedNode.name}`}
                  onClick={() => onDuplicateNode(selectedNode.id)}
                  icon={<Copy size={14} />}
                />
                <IconButton
                  label="Delete element (Del) — removes it from the page"
                  danger
                  onClick={() => onDeleteNode(selectedNode.id)}
                  icon={<Trash2 size={14} />}
                />
                <IconButton
                  label="Collapse Inspector (Ctrl+\\)"
                  onClick={onToggleCollapsed}
                  icon={<ChevronRight size={15} />}
                />
              </>
            }
          />
        </div>
      </div>

      {/* Tabs — icons + labels, 3 clear modes, accent underline for selection */}
      <div className="border-b border-slate-800/80 bg-slate-950/40 p-2">
        <div className="grid grid-cols-3 gap-1.5">
          <InspectorTabButton
            active={activeTab === 'content'}
            onClick={() => setActiveTab('content')}
            icon={<Type size={13} />}
            label="Content"
          />
          <InspectorTabButton
            active={activeTab === 'design'}
            onClick={() => setActiveTab('design')}
            icon={<Paintbrush size={13} />}
            label="Design"
          />
          <InspectorTabButton
            active={activeTab === 'layout'}
            onClick={() => setActiveTab('layout')}
            icon={<Rows3 size={13} />}
            label="Layout"
          />
        </div>
      </div>

      {/* Panels */}
      <div className="studio-scroll min-h-0 flex-1 overflow-y-auto p-2.5 text-[12px]">
        {activeTab === 'content' && (
          <ContentPanel
            node={selectedNode}
            state={state}
            onUpdateContent={onUpdateContent}
            onOpenMediaPicker={() => setIsMediaPickerOpen(true)}
          />
        )}

        {activeTab === 'design' && (
          <DesignPanel
            node={selectedNode}
            styles={currentStyles}
            isTextual={isTextual}
            isContainer={isContainer}
            hasOverride={hasOverride}
            onSetStyle={setStyle}
          />
        )}

        {activeTab === 'layout' && (
          <LayoutPanel
            node={selectedNode}
            styles={currentStyles}
            isContainer={isContainer}
            hasOverride={hasOverride}
            onSetStyle={setStyle}
          />
        )}
      </div>

      {/* Device / visibility footer */}
      <DeviceFooter
        node={selectedNode}
        breakpoint={state.breakpoint}
        overrideCount={overrideCount}
        onUpdateVisibility={onUpdateVisibility}
      />

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

/* ──────────────────────────── Small building blocks ─────────────────── */

function InspectorTabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex h-[32px] items-center justify-center gap-1.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
        active
          ? 'border border-slate-700/60 bg-slate-800 font-semibold text-emerald-300 shadow-sm'
          : 'border border-transparent font-medium text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
      }`}
    >
      {icon}
      <span className="text-[13px]">{label}</span>
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-emerald-400"
        />
      )}
    </button>
  );
}

/** Value + inherited hint + reset, used for responsive-aware fields. */
function OverrideAware({
  overrideKey,
  hasOverride,
  onReset,
  desktopValue,
  children,
}: {
  overrideKey: string;
  hasOverride: (key: string) => boolean;
  onReset: () => void;
  desktopValue?: string;
  children: React.ReactNode;
}) {
  const overridden = hasOverride(overrideKey);
  return (
    <div>
      {children}
      {overridden && (
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>Inherited from Desktop: {desktopValue || 'not set'}</span>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 rounded px-1 py-0.5 text-emerald-400 transition hover:bg-emerald-500/10"
            title="Reset to Desktop — removes this device override and restores the inherited value"
          >
            <RotateCcw size={10} /> Reset
          </button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── CONTENT panel ─────────────────────────── */

function ContentPanel({
  node,
  state,
  onUpdateContent,
  onOpenMediaPicker,
}: {
  node: BuilderNode;
  state: StudioState;
  onUpdateContent: InspectorSidebarProps['onUpdateContent'];
  onOpenMediaPicker: () => void;
}) {
  switch (node.type) {
    case 'heading':
      return (
        <>
          <FieldRow label="Heading text">
            <textarea
              rows={2}
              value={node.content?.text || ''}
              onChange={(e) => onUpdateContent(node.id, { text: e.target.value })}
              placeholder="Enter heading copy…"
              className="w-full resize-y rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100 shadow-inner transition placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
            />
          </FieldRow>
          <AdvancedDisclosure label="Advanced">
            <FieldRow label="HTML tag">
              <select
                value={node.content?.tag || 'h2'}
                onChange={(e) => onUpdateContent(node.id, { tag: e.target.value })}
                className="w-full cursor-pointer rounded-lg border border-slate-700/80 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="h1">H1 — page title</option>
                <option value="h2">H2 — section heading</option>
                <option value="h3">H3 — sub-section</option>
                <option value="h4">H4 — card title</option>
                <option value="h5">H5 — minor header</option>
                <option value="h6">H6 — small label</option>
              </select>
            </FieldRow>
          </AdvancedDisclosure>
          <SectionHint text="Tip: double-click the heading on the canvas to edit inline." />
        </>
      );

    case 'paragraph':
    case 'rich-text':
      return (
        <>
          <FieldRow label="Text" hint="double-click canvas to edit inline">
            <textarea
              rows={6}
              value={plainText(node.content?.html || '')}
              onChange={(e) => {
                const html = `<p>${escapeHtml(e.target.value).replace(/\n/g, '</p><p>')}</p>`;
                onUpdateContent(node.id, { html });
              }}
              placeholder="Enter paragraph text…"
              className="w-full resize-y rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 text-xs leading-relaxed text-slate-100 shadow-inner transition placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
            />
          </FieldRow>
          <AdvancedDisclosure label="Advanced">
            <FieldRow label="Raw HTML" hint="inline tags allowed">
              <textarea
                rows={4}
                value={node.content?.html || ''}
                onChange={(e) => onUpdateContent(node.id, { html: e.target.value })}
                className="w-full resize-y rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 font-mono text-[10px] text-slate-100 shadow-inner transition focus:border-emerald-500 focus:outline-none"
              />
            </FieldRow>
          </AdvancedDisclosure>
        </>
      );

    case 'button':
      return (
        <>
          <FieldRow label="Label">
            <input
              type="text"
              value={node.content?.label || ''}
              onChange={(e) => onUpdateContent(node.id, { label: e.target.value })}
              placeholder="e.g. Learn More"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100 shadow-inner transition placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </FieldRow>
          <StylePresetSelect
            label="Style"
            value={node.content?.variant || 'primary'}
            options={[
              { label: 'Primary — emerald fill', value: 'primary' },
              { label: 'Secondary — vibrant mint', value: 'secondary' },
              { label: 'Outline — bordered', value: 'outline' },
              { label: 'Ghost — transparent', value: 'ghost' },
              { label: 'Text link', value: 'text' },
            ]}
            onChange={(v) => onUpdateContent(node.id, { variant: v || 'primary' })}
          />
          <FieldRow label="Link">
            <input
              type="text"
              value={node.content?.action?.url || ''}
              onChange={(e) =>
                onUpdateContent(node.id, {
                  action: { ...(node.content?.action || {}), url: e.target.value },
                })
              }
              placeholder="/connect or https://…"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 font-mono text-[11px] text-slate-100 shadow-inner transition placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </FieldRow>
          <SimpleToggle
            label="Open in new tab"
            checked={node.content?.action?.target === '_blank'}
            onChange={(v) =>
              onUpdateContent(node.id, {
                action: { ...(node.content?.action || {}), target: v ? '_blank' : '_self' },
              })
            }
          />
          <SectionHint text="Tip: double-click the button on the canvas to rename it." />
        </>
      );

    case 'image':
      return (
        <>
          {/* Thumbnail + replace */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
            {node.content?.src ? (
              <img
                src={node.content.src}
                alt={node.content?.alt || ''}
                className="h-28 w-full object-cover"
              />
            ) : (
              <div className="flex h-28 items-center justify-center text-slate-600">
                <ImageIcon size={22} />
              </div>
            )}
            <div className="p-2">
              <button
                type="button"
                onClick={onOpenMediaPicker}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-1.5 text-[11px] font-semibold text-white shadow transition hover:bg-emerald-500"
              >
                <Upload size={12} />
                {node.content?.src ? 'Replace image' : 'Choose an image'}
              </button>
            </div>
          </div>
          <FieldRow label="Alt description (accessibility)">
            <input
              type="text"
              value={node.content?.alt || ''}
              onChange={(e) => onUpdateContent(node.id, { alt: e.target.value })}
              placeholder="Describe the image…"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100 shadow-inner transition placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </FieldRow>
          <SimpleToggle
            label="Decorative image"
            hint="Hides from screen readers"
            checked={Boolean(node.content?.isDecorative)}
            onChange={(v) => onUpdateContent(node.id, { isDecorative: v })}
          />
          <AdvancedDisclosure label="Advanced">
            <FieldRow label="Image URL (S3)">
              <input
                type="text"
                value={node.content?.src || ''}
                onChange={(e) => onUpdateContent(node.id, { src: e.target.value })}
                placeholder="https://…"
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 font-mono text-[10px] text-slate-100 shadow-inner transition focus:border-emerald-500 focus:outline-none"
              />
            </FieldRow>
            <FieldRow label="Fit">
              <Segmented
                ariaLabel="Object fit"
                value={(node.content?.objectFit || 'cover') as 'cover'}
                onChange={(v) => onUpdateContent(node.id, { objectFit: v })}
                options={[
                  { value: 'cover', label: 'Cover', title: 'Fill & crop' },
                  { value: 'contain', label: 'Contain', title: 'Show everything' },
                  { value: 'fill', label: 'Fill', title: 'Stretch' },
                ]}
              />
            </FieldRow>
            <FieldRow label="Position">
              <PositionGrid
                value={node.content?.objectPosition || 'center'}
                onChange={(v) => onUpdateContent(node.id, { objectPosition: v })}
              />
            </FieldRow>
          </AdvancedDisclosure>
        </>
      );

    case 'badge':
      return (
        <FieldRow label="Badge text">
          <input
            type="text"
            value={node.content?.text || ''}
            onChange={(e) => onUpdateContent(node.id, { text: e.target.value })}
            placeholder="e.g. ABOUT ENVINT"
            className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100 shadow-inner transition placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
          />
        </FieldRow>
      );

    case 'counter':
      return (
        <>
          <FieldRow label="Metric value">
            <input
              type="text"
              value={node.content?.value || ''}
              onChange={(e) => onUpdateContent(node.id, { value: e.target.value })}
              placeholder="e.g. 50+ or 99.8%"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-slate-100 shadow-inner transition placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </FieldRow>
          <FieldRow label="Metric label">
            <input
              type="text"
              value={node.content?.label || ''}
              onChange={(e) => onUpdateContent(node.id, { label: e.target.value })}
              placeholder="e.g. Global ESG Projects"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100 shadow-inner transition placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </FieldRow>
        </>
      );

    case 'accordion-item':
      return (
        <>
          <FieldRow label="Item title">
            <input
              type="text"
              value={node.content?.title || ''}
              onChange={(e) => onUpdateContent(node.id, { title: e.target.value })}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100 shadow-inner transition placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </FieldRow>
          <SimpleToggle
            label="Open by default"
            checked={Boolean(node.content?.defaultOpen)}
            onChange={(v) => onUpdateContent(node.id, { defaultOpen: v })}
          />
        </>
      );

    default: {
      if (['section', 'container', 'grid', 'flex', 'columns'].includes(node.type)) {
        return (
          <div className="rounded-xl border border-slate-800/80 bg-[#111831]/70 p-3">
            <p className="text-[11px] font-semibold text-slate-300">Layout container</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              This element arranges others. Use <strong className="text-slate-300">Design</strong> for
              background & spacing, <strong className="text-slate-300">Layout</strong> for columns and
              alignment.
            </p>
            <p className="mt-2 text-[10px] text-slate-500">
              Children: <span className="font-mono font-semibold text-emerald-400">{node.children?.length || 0}</span>
            </p>
          </div>
        );
      }
      return (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-3 text-center">
          <p className="text-[11px] text-slate-400">
            No content settings for <strong>{node.type}</strong>.
          </p>
        </div>
      );
    }
  }
}

function SectionHint({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-2.5 py-2 text-[10px] leading-relaxed text-slate-500">
      {text}
    </p>
  );
}

/** Visual 3×3 position grid → objectPosition values. */
function PositionGrid({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const positions = [
    ['top-left', 'top', 'top-right'],
    ['left', 'center', 'right'],
    ['bottom-left', 'bottom', 'bottom-right'],
  ];
  return (
    <div className="mx-auto grid w-fit grid-cols-3 gap-0.5 rounded-lg border border-slate-700/80 bg-slate-950 p-1">
      {positions.flat().map((pos) => {
        const active = (value || 'center') === pos;
        return (
          <button
            key={pos}
            type="button"
            onClick={() => onChange(pos)}
            aria-pressed={active}
            title={pos.replace('-', ' ')}
            className={`h-7 w-9 rounded-md transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
              active ? 'bg-emerald-500' : 'bg-slate-800/70 hover:bg-slate-800'
            }`}
          />
        );
      })}
    </div>
  );
}

function plainText(html: string): string {
  return html
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function SimpleToggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-2 text-left transition hover:border-slate-700"
      role="switch"
      aria-checked={checked}
    >
      <span>
        <span className="block text-[11px] font-medium text-slate-200">{label}</span>
        {hint && <span className="block text-[10px] text-slate-500">{hint}</span>}
      </span>
      <span
        className="relative shrink-0 rounded-full transition-colors"
        style={{ height: 18, width: 32, backgroundColor: checked ? '#10B981' : '#334155' }}
      >
        <span
          className="absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow transition-all"
          style={{ left: checked ? 16 : 2 }}
        />
      </span>
    </button>
  );
}

/* ──────────────────────────── DESIGN panel ──────────────────────────── */

function DesignPanel({
  node,
  styles,
  isTextual,
  isContainer,
  hasOverride,
  onSetStyle,
}: {
  node: BuilderNode;
  styles: ElementStyles;
  isTextual: boolean;
  isContainer: boolean;
  hasOverride: (key: string) => boolean;
  onSetStyle: (patch: Partial<ElementStyles>) => void;
}) {
  return (
    <>
      {isTextual && (
        <>
          <InspectorSection id="design-quick" title="Quick styles" first>
            <StylePresetSelect
              label="Text style"
              help="Pick a design-system text size — Display, Heading, Body — instead of typing raw pixel numbers. Custom sizes can still be set below."
              value={styles.fontSize}
              options={FONT_SIZE_PRESETS}
              onChange={(v) => v && onSetStyle({ fontSize: v })}
            />
            <OverrideAware
              overrideKey="fontSize"
              hasOverride={hasOverride}
              desktopValue={node.styles?.fontSize}
              onReset={() => onSetStyle({ fontSize: undefined as any })}
            >
              <FieldRow
                label="Text size"
                help="Controls how large this text appears. Use −/+ , drag the value, or type a number directly."
              >
                <OverrideDot active={false} />
                <ScrubNumber
                  value={styles.fontSize}
                  onChange={(v) => onSetStyle({ fontSize: v })}
                  step={2}
                  min={8}
                  max={200}
                />
              </FieldRow>
            </OverrideAware>
            <FieldRow
              label="Font weight"
              help="Controls how thick or thin the letters appear — from Light to Bold."
            >
              <select
                value={String(styles.fontWeight ?? '400')}
                onChange={(e) => onSetStyle({ fontWeight: e.target.value })}
                className="h-[32px] w-full cursor-pointer rounded-lg border border-slate-700/80 bg-slate-950 px-2 text-[13px] font-medium text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                {WEIGHT_OPTIONS.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            </FieldRow>
            <FieldRow
              label="Text alignment"
              help="Controls how this text aligns within its available width."
            >
              <TextAlignControl value={styles.textAlign} onChange={(v) => onSetStyle({ textAlign: v as any })} />
            </FieldRow>
            <FieldRow
              label="Text color"
              help="Sets the color of this text. Click the swatch to choose a brand color or a custom one."
            >
              <ColorPopover label="Text" value={styles.textColor} onChange={(v) => onSetStyle({ textColor: v })} />
            </FieldRow>
          </InspectorSection>

          <AdvancedDisclosure label="Advanced typography">
            <FieldRow label="Line height" help="Controls the vertical space between lines of text.">
              <ScrubNumber value={styles.lineHeight} onChange={(v) => onSetStyle({ lineHeight: v })} unit="" step={0.05} min={0.8} max={3} suffixes={['', 'px']} />
            </FieldRow>
            <FieldRow label="Letter spacing" help="Controls the horizontal space between individual letters.">
              <ScrubNumber value={styles.letterSpacing} onChange={(v) => onSetStyle({ letterSpacing: v })} step={0.5} suffixes={['px', 'em']} />
            </FieldRow>
            <FieldRow label="Text case" help="Controls whether text renders normally, ALL CAPS, or Capitalized.">
              <Segmented
                ariaLabel="Text case"
                value={(styles.textTransform || 'none') as 'none'}
                onChange={(v) => onSetStyle({ textTransform: v })}
                options={[
                  { value: 'none', label: 'Aa', title: 'Normal case' },
                  { value: 'uppercase', label: 'AA', title: 'ALL CAPS' },
                  { value: 'capitalize', label: 'Ab', title: 'Capitalize Each Word' },
                ]}
              />
            </FieldRow>
          </AdvancedDisclosure>
        </>
      )}

      {(isContainer || isTextual) && (
        <>
          <InspectorSection id="design-background" title="Background" defaultOpen={false}>
            <FieldRow
              label="Background color"
              help="Fills the area behind this element and its content. Brand colors keep the design consistent."
            >
              <ColorPopover
                label="Background"
                value={styles.backgroundColor}
                onChange={(v) => onSetStyle({ backgroundColor: v })}
              />
            </FieldRow>
          </InspectorSection>

          <InspectorSection id="design-spacing" title="Spacing" defaultOpen={false}>
            <SpacingControl label="Padding" styles={styles} onSet={onSetStyle} />
          </InspectorSection>
        </>
      )}

      <AdvancedDisclosure label="Border & effects">
        <FieldRow label="Corner radius" help="Rounds the element's corners. 0 keeps them square.">
          <ScrubNumber value={styles.borderRadius} onChange={(v) => onSetStyle({ borderRadius: v })} step={2} min={0} suffixes={['px', 'rem', '%']} />
        </FieldRow>
        <FieldRow label="Border width" help="Draws a visible outline around the element. 0 removes the border.">
          <ScrubNumber value={styles.borderWidth} onChange={(v) => onSetStyle({ borderWidth: v })} min={0} />
        </FieldRow>
        {Boolean(styles.borderWidth) && (
          <FieldRow label="Border color">
            <ColorPopover label="Border" value={styles.borderColor} onChange={(v) => onSetStyle({ borderColor: v })} />
          </FieldRow>
        )}
        <FieldRow label="Opacity" help="Controls how transparent this element is — 100% is fully solid.">
          <input
            type="range"
            min={0}
            max={100}
            value={typeof styles.opacity === 'number' ? Math.round(styles.opacity * 100) : 100}
            onChange={(e) => onSetStyle({ opacity: Number(e.target.value) / 100 })}
            className="w-full accent-emerald-500"
          />
        </FieldRow>
      </AdvancedDisclosure>

      {isContainer && (
        <AdvancedDisclosure label="Background media">
          <FieldRow label="Background image" help="Shows an image behind this element, from the media library.">
            <input
              type="text"
              value={styles.backgroundImage || ''}
              onChange={(e) => onSetStyle({ backgroundImage: e.target.value })}
              placeholder="https://…"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 font-mono text-[11px] text-slate-100 shadow-inner transition focus:border-emerald-500 focus:outline-none"
            />
          </FieldRow>
          <FieldRow label="Overlay gradient" help="A color gradient drawn over the background image, often used to keep text readable.">
            <input
              type="text"
              value={styles.backgroundOverlay || ''}
              onChange={(e) => onSetStyle({ backgroundOverlay: e.target.value })}
              placeholder="linear-gradient(…)"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 font-mono text-[11px] text-slate-100 shadow-inner transition focus:border-emerald-500 focus:outline-none"
            />
          </FieldRow>
        </AdvancedDisclosure>
      )}
    </>
  );
}

/* ──────────────────────────── LAYOUT panel ──────────────────────────── */

function LayoutPanel({
  node,
  styles,
  isContainer,
  hasOverride,
  onSetStyle,
}: {
  node: BuilderNode;
  styles: ElementStyles;
  isContainer: boolean;
  hasOverride: (key: string) => boolean;
  onSetStyle: (patch: Partial<ElementStyles>) => void;
}) {
  const display = styles.display || (node.type === 'grid' ? 'grid' : 'block');

  return (
    <>
      {isContainer && (
        <InspectorSection id="layout-arrangement" title="Arrangement" first>
          {node.type === 'grid' ? (
            <FieldRow
              label="Columns"
              rich={{
                body: 'Choose how many equal columns appear at the selected device size. Use a split preset for uneven columns.',
                example: (
                  <>
                    Desktop: 3 columns&nbsp;·&nbsp;Mobile: 1 column — set a separate override per device in the footer below.
                  </>
                ),
              }}
            >
              <ColumnsControl value={styles.gridColumns} onChange={(v) => onSetStyle({ gridColumns: v })} />
            </FieldRow>
          ) : (
            <FieldRow
              label="Arrangement"
              help="Choose how child elements are placed: stacked vertically, in a row/column, or in a grid."
            >
              <Segmented
                ariaLabel="Display mode"
                value={(display === 'flex' ? 'flex' : display === 'grid' ? 'grid' : 'block') as 'block'}
                onChange={(v) =>
                  onSetStyle({
                    display: v,
                    ...(v === 'flex' && !styles.flexDirection ? { flexDirection: 'column' } : {}),
                  })
                }
                options={[
                  { value: 'block', icon: <Rows3 size={12} />, label: 'Stack', title: 'Simple stack' },
                  { value: 'flex', icon: <Rows3 size={12} className="rotate-90" />, label: 'Row / Column', title: 'Flex stack' },
                  { value: 'grid', icon: <Columns size={12} />, label: 'Grid', title: 'Multi-column grid' },
                ]}
              />
            </FieldRow>
          )}

          {(display === 'flex' || display === 'grid') && (
            <>
              {display === 'flex' && (
                <FieldRow label="Direction" help="Whether children flow horizontally (a row) or vertically (a stack).">
                  <DirectionControl value={styles.flexDirection} onChange={(v) => onSetStyle({ flexDirection: v as any })} />
                </FieldRow>
              )}
              <FieldRow label="Gap" help="The space between child elements.">
                <ScrubNumber value={styles.gap} onChange={(v) => onSetStyle({ gap: v })} step={4} min={0} />
              </FieldRow>
              <FieldRow label="Content alignment" help="How children align inside this container — click a cell in the grid.">
                <AlignMatrix
                  alignItems={styles.alignItems}
                  justifyContent={styles.justifyContent}
                  onChange={(next) => onSetStyle(next as Partial<ElementStyles>)}
                />
              </FieldRow>
            </>
          )}
        </InspectorSection>
      )}

      {isContainer && (
        <AdvancedDisclosure label="Advanced alignment">
          <FieldRow label="Wrap" help="Whether items stay on one line or wrap onto new lines when space runs out.">
            <Segmented
              ariaLabel="Flex wrap"
              value={(styles.flexWrap || 'nowrap') as 'nowrap'}
              onChange={(v) => onSetStyle({ flexWrap: v })}
              options={[
                { value: 'nowrap', label: 'No wrap', title: 'Single line' },
                { value: 'wrap', label: 'Wrap', title: 'Wrap to new lines' },
              ]}
            />
          </FieldRow>
          <FieldRow label="Custom column definition" help="Advanced: a raw CSS grid definition for non-standard layouts.">
            <input
              type="text"
              value={styles.gridColumns || ''}
              onChange={(e) => onSetStyle({ gridColumns: e.target.value })}
              placeholder="repeat(2, 1fr)"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 font-mono text-[11px] text-slate-100 shadow-inner transition focus:border-emerald-500 focus:outline-none"
            />
          </FieldRow>
        </AdvancedDisclosure>
      )}

      <InspectorSection id="layout-size" title="Size" defaultOpen={false}>
        {node.type === 'spacer' ? (
          <FieldRow label="Spacer height" help="How much vertical empty space this spacer occupies.">
            <ScrubNumber value={styles.height} onChange={(v) => onSetStyle({ height: v })} step={8} min={0} />
          </FieldRow>
        ) : (
          <>
            <FieldRow label="Width" help="How wide this element is. Leave empty for automatic width.">
              <ScrubNumber
                value={styles.width}
                onChange={(v) => onSetStyle({ width: v })}
                suffixes={['px', '%', 'rem', 'auto']}
              />
            </FieldRow>
            <FieldRow label="Minimum height" help="The element will never be shorter than this, but can grow taller.">
              <ScrubNumber value={styles.minHeight} onChange={(v) => onSetStyle({ minHeight: v })} step={8} suffixes={['px', 'vh', 'rem']} />
            </FieldRow>
          </>
        )}
      </InspectorSection>

      <InspectorSection id="layout-margin" title="Margin" defaultOpen={false}>
        <SpacingControl label="Margin" styles={styles} onSet={onSetStyle} />
      </InspectorSection>

      <AdvancedDisclosure label="Advanced">
        <FieldRow label="Maximum width" help="The element will never grow wider than this — often used to keep text lines readable.">
          <ScrubNumber value={styles.maxWidth} onChange={(v) => onSetStyle({ maxWidth: v })} step={20} suffixes={['px', '%', 'rem']} />
        </FieldRow>
        <FieldRow label="Overflow" help="Controls whether content that spills outside this element is shown or clipped.">
          <Segmented
            ariaLabel="Overflow"
            value={(styles.overflow || 'visible') as 'visible'}
            onChange={(v) => onSetStyle({ overflow: v })}
            options={[
              { value: 'visible', label: 'Visible', title: 'Show overflow' },
              { value: 'hidden', label: 'Hidden', title: 'Clip overflow' },
            ]}
          />
        </FieldRow>
      </AdvancedDisclosure>
    </>
  );
}

/* ───────────────────────── Device / visibility footer ─────────────────── */

function DeviceFooter({
  node,
  breakpoint,
  overrideCount,
  onUpdateVisibility,
}: {
  node: BuilderNode;
  breakpoint: Breakpoint;
  overrideCount: number;
  onUpdateVisibility: InspectorSidebarProps['onUpdateVisibility'];
}) {
  return (
    <div className="border-t border-slate-800 bg-[#10162A] px-3 py-2.5">
      <div className="mb-2 flex items-center justify-between">
        <Tooltip label="Hide this element on selected devices without deleting it from the page. Switch devices in the top toolbar.">
          <span className="flex cursor-help items-center gap-1.5 text-[12px] font-bold text-slate-300">
            <ToggleLeft size={13} /> Visibility
          </span>
        </Tooltip>
        {breakpoint !== 'desktop' && (
          <Tooltip label="Number of values customized specifically for the device you are editing right now.">
            <span className="cursor-help rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
              {overrideCount} override{overrideCount === 1 ? '' : 's'}
            </span>
          </Tooltip>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {(
          [
            { key: 'desktop', label: 'Desktop', icon: <Monitor size={13} /> },
            { key: 'tablet', label: 'Tablet', icon: <TabletIcon size={13} /> },
            { key: 'mobile', label: 'Mobile', icon: <Smartphone size={13} /> },
          ] as const
        ).map((row) => {
          const visible = node.visibility?.[row.key] !== false;
          const isCurrent = breakpoint === row.key;
          return (
            <button
              key={row.key}
              type="button"
              onClick={() => onUpdateVisibility(node.id, { [row.key]: !visible })}
              title={`${visible ? 'Hide this element on' : 'Show this element on'} ${row.label}`}
              aria-pressed={!visible}
              className={`flex min-h-[44px] flex-col items-center gap-1 rounded-lg border py-1.5 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                !visible
                  ? 'border-slate-800 bg-slate-950 text-slate-600'
                  : isCurrent
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className={visible ? '' : 'opacity-50'}>{row.icon}</span>
              <span className={`text-[10px] font-semibold ${visible ? '' : 'line-through'}`}>{row.label}</span>
              {visible && <Check size={10} className="text-emerald-400" />}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] leading-[1.5] text-slate-500">
        Editing styles while a device is active creates an override for that device only. Hidden
        elements stay in the page — they just don&apos;t render there.
      </p>
    </div>
  );
}

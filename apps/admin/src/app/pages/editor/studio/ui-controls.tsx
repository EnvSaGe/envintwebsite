'use client';

/**
 * ui-controls.tsx — the visual control kit for the Studio Inspector.
 *
 * Design principle: editors interact with VISUAL controls; CSS values are an
 * implementation detail written to the existing ElementStyles schema keys.
 *
 * Controls here are chrome only — they never leak into the public renderer.
 */

import React from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ArrowRight,
  ArrowDown,
  Check,
  ChevronRight,
  X,
  Link2,
  Link2Off,
} from 'lucide-react';
import { ElementStyles } from '@envint/shared';
import { PropertyLabel, Tooltip } from './ui-kit';

/* ─────────────────────────── Field shell & labels ───────────────────────── */

/**
 * Field shell: readable 12px property label (with optional contextual help),
 * then the control with comfortable spacing below.
 */
export function FieldRow({
  label,
  children,
  hint,
  help,
  rich,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  /** Function-first explanation shown on hover of the ⓘ icon. */
  help?: string;
  /** Complex setting → click opens a HelpPopover with an example. */
  rich?: { body: React.ReactNode; example?: React.ReactNode };
}) {
  return (
    <div>
      <PropertyLabel label={label} help={help} rich={rich} trailing={hint} />
      {children}
    </div>
  );
}

/** Small override badge shown when the active breakpoint has its own value. */
export function OverrideDot({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span
      className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
      title="Overridden for this device"
    />
  );
}

/* ───────────────────────────── Scrub number field ───────────────────────── */

/**
 * [-] 48 [+] with pointer drag-scrub on the value area.
 * Stores as `${num}${unit}`; empty string clears the override.
 */
export function ScrubNumber({
  value,
  onChange,
  unit = 'px',
  step = 1,
  min,
  max,
  suffixes,
}: {
  value?: string;
  onChange: (v: string) => void;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  suffixes?: string[]; // extra units offered in a small menu
}) {
  const match = value?.match(/^(-?\d*\.?\d+)\s*(.*)$/);
  const num = match ? parseFloat(match[1]) : null;
  const rawUnit = match && match[2] ? match[2] : unit;
  const [dragging, setDragging] = React.useState(false);
  const startX = React.useRef(0);
  const startVal = React.useRef(0);

  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));

  const commit = (n: number) => onChange(`${Math.round(n * 100) / 100}${rawUnit}`);

  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (num === null) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    startVal.current = num;
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const clientX = e.clientX;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      commit(clamp(startVal.current + (clientX - startX.current) * step));
    });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950 shadow-inner transition focus-within:border-emerald-500">
      <Tooltip label="Decrease the value">
        <button
          type="button"
          aria-label="Decrease"
          onClick={() => commit(clamp((num ?? 0) - step))}
          className="h-[30px] w-8 shrink-0 border-r border-slate-800 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          −
        </button>
      </Tooltip>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className={`relative flex-1 ${num !== null ? 'cursor-ew-resize' : ''} ${dragging ? 'select-none' : ''}`}
      >
        <input
          type="text"
          inputMode="decimal"
          value={num === null ? '' : String(num)}
          placeholder="auto"
          aria-label="Value"
          onChange={(e) => {
            const v = e.target.value.trim();
            onChange(v === '' ? '' : `${v}${rawUnit}`);
          }}
          className="h-[30px] w-full bg-transparent px-2 text-center text-[13px] font-medium text-slate-100 placeholder:text-slate-600 focus:outline-none"
        />
      </div>
      <Tooltip label="Increase the value">
        <button
          type="button"
          aria-label="Increase"
          onClick={() => commit(clamp((num ?? 0) + step))}
          className="h-[30px] w-8 shrink-0 border-l border-slate-800 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          +
        </button>
      </Tooltip>
      <span
        className={`flex w-8 shrink-0 items-center justify-center border-l border-slate-800 text-[11px] font-semibold uppercase ${
          dragging ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500'
        }`}
      >
        {rawUnit || '–'}
      </span>
      {suffixes && suffixes.length > 1 && (
        <select
          value={rawUnit}
          onChange={(e) => onChange(num === null ? '' : `${num}${e.target.value}`)}
          aria-label="Unit"
          className="w-6 shrink-0 cursor-pointer appearance-none border-l border-slate-800 bg-transparent text-center text-[10px] text-slate-400 focus:outline-none"
        >
          {suffixes.map((u) => (
            <option key={u} value={u} className="bg-slate-900">
              {u}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

/* ───────────────────────────── Segmented icon group ─────────────────────── */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: Array<{ value: T; icon?: React.ReactNode; label?: string; title?: string }>;
  value?: T;
  onChange: (v: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="flex rounded-lg border border-slate-700/80 bg-slate-950 p-0.5" role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            title={opt.title || opt.label}
            aria-pressed={active}
            className={`flex flex-1 items-center justify-center rounded-md py-1.5 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
              active ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            {opt.icon}
            {opt.label && <span className="ml-1 text-[12px] font-medium">{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Text alignment: ← ↔ → ≡ */
export function TextAlignControl({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <Segmented
      ariaLabel="Text alignment"
      value={(value || 'left') as 'left'}
      onChange={onChange}
      options={[
        { value: 'left', icon: <AlignLeft size={13} />, title: 'Align left' },
        { value: 'center', icon: <AlignCenter size={13} />, title: 'Center align' },
        { value: 'right', icon: <AlignRight size={13} />, title: 'Align right' },
        { value: 'justify', icon: <AlignJustify size={13} />, title: 'Justify' },
      ]}
    />
  );
}

/** Flex direction as Horizontal/Vertical icons. */
export function DirectionControl({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <Segmented
      ariaLabel="Layout direction"
      value={(value || 'column') as 'column'}
      onChange={onChange}
      options={[
        { value: 'row', icon: <ArrowRight size={13} />, label: 'Horizontal', title: 'Horizontal row' },
        { value: 'column', icon: <ArrowDown size={13} />, label: 'Vertical', title: 'Vertical stack' },
      ]}
    />
  );
}

/** 3×3 visual alignment matrix → alignItems × justifyContent. */
export function AlignMatrix({
  alignItems,
  justifyContent,
  onChange,
}: {
  alignItems?: string;
  justifyContent?: string;
  onChange: (next: { alignItems?: string; justifyContent?: string }) => void;
}) {
  const rows: Array<{ ai: string; icons: string[] }> = [
    { ai: 'flex-start', icons: ['↖', '↑', '↗'] },
    { ai: 'center', icons: ['←', '•', '→'] },
    { ai: 'flex-end', icons: ['↙', '↓', '↘'] },
  ];
  const cols = ['flex-start', 'center', 'flex-end'];

  return (
    <div className="mx-auto grid w-fit grid-cols-3 gap-0.5 rounded-lg border border-slate-700/80 bg-slate-950 p-1">
      {rows.map((row) =>
        cols.map((jc, i) => {
          const active =
            (alignItems || 'stretch') === row.ai && (justifyContent || 'flex-start') === jc;
          return (
            <button
              key={`${row.ai}-${jc}`}
              type="button"
              onClick={() => onChange({ alignItems: row.ai, justifyContent: jc })}
              title={`${row.ai === 'flex-start' ? 'Top' : row.ai === 'center' ? 'Middle' : 'Bottom'} ${
                jc === 'flex-start' ? 'left' : jc === 'center' ? 'center' : 'right'
              }`}
              aria-pressed={active}
              className={`flex h-7 w-9 items-center justify-center rounded-md text-[13px] transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                active ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {row.icons[i]}
            </button>
          );
        })
      )}
    </div>
  );
}

/* ─────────────────────────────── Color popover ──────────────────────────── */

export const BRAND_COLORS = [
  { label: 'Brand Blue', hex: '#3079BD' },
  { label: 'Brand Green', hex: '#45B653' },
  { label: 'Deep Blue', hex: '#1E40AF' },
  { label: 'Forest Green', hex: '#004E35' },
  { label: 'Soft Mint', hex: '#E6F4EA' },
  { label: 'Cream White', hex: '#FBF4EB' },
  { label: 'Pure White', hex: '#FFFFFF' },
  { label: 'Charcoal Body', hex: '#393939' },
  { label: 'Muted Gray', hex: '#6B7280' },
  { label: 'Light Neutral', hex: '#F7F7F7' },
];

export function ColorPopover({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [open]);

  const isBrand = BRAND_COLORS.some((c) => c.hex.toLowerCase() === (value || '').toLowerCase());
  const brandLabel = BRAND_COLORS.find((c) => c.hex.toLowerCase() === (value || '').toLowerCase())?.label;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[32px] w-full items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 transition hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span
          className="h-4 w-4 shrink-0 rounded-full border border-slate-600"
          style={{ backgroundColor: value || 'transparent' }}
        />
        <span className="flex-1 truncate text-left text-[12px] font-medium text-slate-200">
          {brandLabel ? `${brandLabel}` : value || 'Not set'}
        </span>
        {value && (
          <span className="shrink-0 font-mono text-[10px] text-slate-500">
            {brandLabel ? value : !isBrand ? 'custom' : ''}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`${label} color`}
          className="absolute right-0 z-40 mt-1 w-56 rounded-xl border border-slate-700 bg-[#10162A] p-3 shadow-2xl"
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Brand colors</p>
          <div className="grid grid-cols-5 gap-1.5">
            {BRAND_COLORS.map((c) => {
              const active = (value || '').toLowerCase() === c.hex.toLowerCase();
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => {
                    onChange(c.hex);
                    setOpen(false);
                  }}
                  title={`${c.label} (${c.hex})`}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-transform hover:scale-110 ${
                    active ? 'border-white ring-2 ring-emerald-500' : 'border-slate-700'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {active && (
                    <Check size={11} className={isLight(c.hex) ? 'text-black' : 'text-white'} />
                  )}
                </button>
              );
            })}
          </div>
          <p className="mb-1.5 mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Custom</p>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(value || '') ? (value as string) : '#004E35'}
              onChange={(e) => onChange(e.target.value)}
              className="h-7 w-9 cursor-pointer rounded border border-slate-700 bg-transparent"
              title="Pick any color"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#004E35"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 font-mono text-[11px] text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                title="Clear color"
                aria-label="Clear color"
                className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function isLight(hex: string): boolean {
  const m = hex.replace('#', '');
  if (m.length < 6) return false;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

/* ───────────────────────────── Spacing (box model) ──────────────────────── */

const SPACING_PRESETS: Array<{ id: string; label: string; value?: string }> = [
  { id: 'none', label: 'None', value: '0px' },
  { id: 'xs', label: 'XS', value: '8px' },
  { id: 's', label: 'S', value: '24px' },
  { id: 'm', label: 'M', value: '48px' },
  { id: 'l', label: 'L', value: '80px' },
  { id: 'xl', label: 'XL', value: '128px' },
  { id: 'custom', label: 'Custom' },
];

/** Reads symmetric padding from per-side values (schema uses per-side keys). */
function symmetricValue(sides: { top?: string; bottom?: string; left?: string; right?: string }): string | 'custom' | null {
  const t = sides.top ?? '';
  const b = sides.bottom ?? '';
  const l = sides.left ?? '';
  const r = sides.right ?? '';
  if (t === '' && b === '' && l === '' && r === '') return null;
  if (t === b && l === r && t === l) return t === '' ? '0px' : t;
  return 'custom';
}

export function SpacingControl({
  label,
  styles,
  onSet,
}: {
  label: string;
  styles: ElementStyles;
  onSet: (patch: Partial<ElementStyles>) => void;
}) {
  const isMargin = label.toLowerCase() === 'margin';
  const p = (s: 'Top' | 'Bottom' | 'Left' | 'Right') =>
    (styles as any)[`${isMargin ? 'margin' : 'padding'}${s}`] as string | undefined;

  const sym = symmetricValue({ top: p('Top'), bottom: p('Bottom'), left: p('Left'), right: p('Right') });
  const activePreset =
    sym === null
      ? null
      : SPACING_PRESETS.find((preset) => preset.value === (sym === 'custom' ? '__custom__' : sym))?.id ||
        (sym === 'custom' ? 'custom' : null);

  const applyPreset = (id: string) => {
    const preset = SPACING_PRESETS.find((x) => x.id === id);
    if (!preset) return;
    const key = isMargin ? 'margin' : 'padding';
    if (!preset.value) {
      onSet({}); // Custom → open box editor only
      return;
    }
    onSet({
      [`${key}Top`]: preset.value,
      [`${key}Bottom`]: preset.value,
      [`${key}Left`]: preset.value,
      [`${key}Right`]: preset.value,
    } as Partial<ElementStyles>);
  };

  return (
    <div>
      <PropertyLabel
        label={label}
        help={
          isMargin
            ? 'Controls the space OUTSIDE this element — between it and neighbouring elements.'
            : 'Adds space INSIDE this element, between its content and its outer boundary. Use a preset for design-system spacing, or edit each side below.'
        }
      />
      <div className="mb-2 flex flex-wrap gap-1">
        {SPACING_PRESETS.map((preset) => {
          const active = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              aria-pressed={active}
              title={
                preset.value
                  ? `${label}: ${preset.value} on every side`
                  : `${label}: edit each side individually`
              }
              className={`h-[26px] rounded-md border px-2.5 text-[11px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                active
                  ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                  : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-100'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <BoxModel
        top={p('Top')}
        right={p('Right')}
        bottom={p('Bottom')}
        left={p('Left')}
        onChange={(side, v) => onSet({ [`${isMargin ? 'margin' : 'padding'}${side}`]: v } as Partial<ElementStyles>)}
      />
    </div>
  );
}

/** Spatial box editor: linked default + per-side overrides, with side highlighting. */
export function BoxModel({
  top,
  right,
  bottom,
  left,
  onChange,
}: {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  onChange: (side: 'Top' | 'Right' | 'Bottom' | 'Left', v: string) => void;
}) {
  const [linked, setLinked] = React.useState(false);
  const [hoverSide, setHoverSide] = React.useState<'Top' | 'Right' | 'Bottom' | 'Left' | null>(null);
  const num = (v?: string) => v?.match(/^(-?\d*\.?\d+)/)?.[1] ?? '';

  const cell =
    'h-[30px] w-12 rounded-md border border-slate-700/80 bg-slate-950 text-center font-mono text-[12px] font-medium text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none';

  const sideGlow = (side: 'Top' | 'Right' | 'Bottom' | 'Left'):
    React.CSSProperties =>
    hoverSide === side
      ? { boxShadow: 'inset 0 0 0 2px rgba(16,185,129,0.55)', borderRadius: 8 }
      : {};

  const linkedChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', v: string) => {
    if (linked) {
      onChange('Top', v);
      onChange('Bottom', v);
      onChange('Left', v);
      onChange('Right', v);
    } else {
      onChange(side, v);
    }
  };

  const input = (side: 'Top' | 'Right' | 'Bottom' | 'Left', val?: string) => (
    <input
      type="text"
      inputMode="decimal"
      value={num(val)}
      placeholder="0"
      aria-label={`${side} value`}
      onChange={(e) => {
        const v = e.target.value.trim();
        linkedChange(side, v === '' ? '' : `${v}px`);
      }}
      onMouseEnter={() => setHoverSide(side)}
      onMouseLeave={() => setHoverSide(null)}
      className={cell}
    />
  );

  return (
    <div className="rounded-lg border border-slate-800/70 bg-[#0B1020] p-2.5">
      {/* Link toggle + unit */}
      <div className="mb-2 flex items-center justify-between">
        <Tooltip
          label={
            linked
              ? 'Sides are linked — editing one value updates all four sides.'
              : 'Edit each side independently: top, right, bottom, left.'
          }
        >
          <button
            type="button"
            onClick={() => setLinked((l) => !l)}
            aria-pressed={linked}
            className="flex h-[24px] items-center gap-1 rounded-md border px-1.5 text-[11px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            style={
              linked
                ? { borderColor: '#3079bd', backgroundColor: 'rgba(48,121,189,0.15)', color: '#60a5fa' }
                : { borderColor: '#334155', color: '#94A3B8' }
            }
          >
            {linked ? <Link2 size={11} /> : <Link2Off size={11} />}
            {linked ? 'Linked' : 'Link sides'}
          </button>
        </Tooltip>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">px</span>
      </div>

      {/* Box diagram with side highlighting */}
      <div className="rounded-md px-1 py-0.5" style={sideGlow('Top')} onMouseEnter={() => setHoverSide('Top')} onMouseLeave={() => setHoverSide(null)}>
        <div className="flex justify-center">{input('Top', top)}</div>
      </div>
      <div className="flex items-stretch justify-between gap-1">
        <div className="flex items-center" style={sideGlow('Left')} onMouseEnter={() => setHoverSide('Left')} onMouseLeave={() => setHoverSide(null)}>
          {input('Left', left)}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700">space</span>
        </div>
        <div className="flex items-center" style={sideGlow('Right')} onMouseEnter={() => setHoverSide('Right')} onMouseLeave={() => setHoverSide(null)}>
          {input('Right', right)}
        </div>
      </div>
      <div className="rounded-md px-1 py-0.5" style={sideGlow('Bottom')} onMouseEnter={() => setHoverSide('Bottom')} onMouseLeave={() => setHoverSide(null)}>
        <div className="flex justify-center">{input('Bottom', bottom)}</div>
      </div>
    </div>
  );
}

/* ───────────────────────────── Grid column presets ─────────────────────── */

const COLUMN_COUNTS = [1, 2, 3, 4];
const SPLIT_PRESETS: Array<{ label: string; value: string }> = [
  { label: '50 / 50', value: 'repeat(2, 1fr)' },
  { label: '40 / 60', value: '2fr 3fr' },
  { label: '60 / 40', value: '3fr 2fr' },
  { label: '33 / 67', value: '1fr 2fr' },
  { label: '67 / 33', value: '2fr 1fr' },
];

/** Count → repeat(n, 1fr); split chips → fr ratios. Writes schema gridColumns. */
export function ColumnsControl({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  const countMatch = value?.match(/^repeat\(\s*(\d)\s*,\s*1fr\s*\)$/);
  const count = countMatch ? Number(countMatch[1]) : null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {COLUMN_COUNTS.map((n) => {
          const active = count === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(`repeat(${n}, 1fr)`)}
              aria-pressed={active}
              title={`${n} equal column${n > 1 ? 's' : ''}`}
              className={`flex-1 rounded-lg border py-1.5 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                active
                  ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                  : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-100'
              }`}
            >
              <span className="flex items-end justify-center gap-[2px]">
                {Array.from({ length: n }).map((_, i) => (
                  <span
                    key={i}
                    className={`inline-block w-[3px] rounded-sm ${active ? 'bg-emerald-400' : 'bg-slate-500'}`}
                    style={{ height: 10 }}
                  />
                ))}
              </span>
              <span className="mt-0.5 block text-center text-[10px] font-semibold">{n}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-1">
        {SPLIT_PRESETS.map((s) => {
          const active = value === s.value;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => onChange(s.value)}
              aria-pressed={active}
              className={`rounded-md border px-2 py-1 text-[10px] font-semibold transition ${
                active
                  ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                  : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-100'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────────── Advanced drawer ─────────────────────────── */

export function AdvancedDisclosure({
  children,
  label = 'Advanced',
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#111831]/70">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[12px] font-bold tracking-wide text-slate-400 transition hover:bg-slate-800/40 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500/40"
      >
        <span className="flex items-center gap-1.5">
          <ChevronRight
            size={13}
            className={`shrink-0 transition-transform ${open ? 'rotate-90 text-emerald-400' : 'text-slate-500'}`}
          />
          {label}
        </span>
        <span className="text-[10px] font-medium normal-case tracking-normal text-slate-500">
          {open ? 'Hide' : 'Fine-tuning for experienced editors'}
        </span>
      </button>
      {open && <div className="space-y-3.5 border-t border-slate-800/60 px-3 pb-3.5 pt-3">{children}</div>}
    </div>
  );
}

/** Datalist-backed select used for font-size style presets. */
export function StylePresetSelect({
  value,
  onChange,
  options,
  label,
  help,
}: {
  value?: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
  label: string;
  help?: string;
}) {
  return (
    <FieldRow label={label} help={help}>
      <select
        value={value && options.some((o) => o.value === value) ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        className="h-[32px] w-full cursor-pointer rounded-lg border border-slate-700/80 bg-slate-950 px-2 text-[13px] font-medium text-slate-100 transition focus:border-emerald-500 focus:outline-none"
      >
        <option value="">Custom…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldRow>
  );
}

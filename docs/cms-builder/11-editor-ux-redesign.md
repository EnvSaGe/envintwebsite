# 11 — Editor UX Redesign (Studio v2)

Status: implemented
Scope: ADMIN EDITOR ONLY. Zero changes to `apps/web` (public renderers, design, content).

## 1. Current UX problems (measured from the live editor)

| Problem | Evidence |
| --- | --- |
| Canvas is squeezed | Left palette is a fixed `300px`, right inspector a fixed `300px` — `600px` of chrome. On a 1366px laptop the canvas gets ~55% before device scrollbars. Neither panel collapses or resizes. |
| Editor thinks in CSS | Inspector exposes `justifyContent`, `alignItems`, `gridColumns: repeat(2,1fr)`, raw gradient/box-shadow text fields, background-image URL field. Non-technical editors cannot use these. |
| Chrome eats the canvas | An in-flow status strip + zoom button row sit **above** the page inside the scroll area; the selected-node label is a tall two-row pill with mono uppercase text; hover outlines are loud 1.5px blue on every element. |
| Too many steps for simple edits | Changing one word requires: select → Content tab → find textarea → edit raw HTML (`<p>…</p>`). No inline text editing on canvas. |
| Controls are manual, not visual | Font size / radius / gap are plain text inputs. No +/- steppers, no scrubbing, no presets. Alignment exists only for text, not for flex/grid content. |
| No progressive disclosure | All controls visible at once; advanced CSS-like properties (overflow, z-index equivalents) mix with everyday ones. |
| Responsive editing is implicit | You must *know* that switching device changes where styles are written. No "inherited" hints, no per-field override/reset affordance. |
| Rerender pressure | Every canvas node receives the whole `StudioState`, so hover/select dispatches re-render the entire tree. |

## 2. New editor layout

```
┌────────────────────────────── Topbar (52px) ──────────────────────────────┐
│ ‹ Pages  Title /about  ●saved   [⌘ Desktop ▣ Tablet 📱 Mobile]  ↶↷ ⛶ ▦ ⚙ │
├────┬──────────────────────────────────────────────┬──────────────────────┤
│ R  │                                              │ Inspector            │
│ a  │           Canvas (flex-1)                    │ 280px default        │
│ i  │     floating chrome overlays only            │ 260–420 resizable    │
│ l  │                                              │ collapsible          │
│ 64–320                                  (resizable)│                      │
│ collapsible                                   │                      │
└────┴──────────────────────────────────────────────┴──────────────────────┘
```

- Left rail: **64px icon rail** ⇄ expanded **256px** browser (drag-resizable, 200–320).
- Right inspector: **288px** default, drag-resizable **260–420**, collapsible.
- Both collapse buttons live on the Topbar + on the panel edges (`«` / `»`).
- Focus mode (`Shift+F` or ⛶ button) hides both panels; Esc restores.
- Panels resize via drag handles with pointer capture; widths persist in
  `localStorage` (`envint.studio.v2`).

## 3. Compact component palette

- 2-column compact tiles (icon + label only), hover hint tooltip instead of
  reserved hint line → roughly half the previous tile height.
- Segmented category chips with count badges (unchanged from v1, already good).
- Search: clear button, Esc resets, empty state with "Reset filters".
- Insert feedback: clicking a tile inserts after selection; dragging still works.

## 4. Inspector redesign (no raw CSS)

Tabs: **Content · Design · Layout** (icons + labels). Device/visibility lives in
a compact footer strip so responsive state is always visible.

Per-element quick controls:

- **Text elements**: size stepper (−/value/+ with drag-scrub), weight select,
  alignment segmented, color popover, style preset select, then `Advanced ▸`
  (line height, letter spacing, transform) collapsed by default.
- **Buttons**: label, style preset, size, action (page/url), alignment.
- **Images**: library picker, alt, fit, position 3×3 grid, radius stepper.
- **Sections/containers**: layout preset (Stack / Row / Grid), columns preset
  (1–4 + split chips 50/50, 40/60…), gap stepper, alignment 3×3 matrix,
  spacing preset chips (None/XS/S/M/L/XL/Custom) opening the box editor,
  background color popover + library image.
- **Advanced drawer**: width/max/min/overflow/z-index style fields (schema
  keys), hidden by default.

### Visual control ↔ CSS mapping

| Visual control | Writes |
| --- | --- |
| Alignment arrows `← ↔ →` | `textAlign` |
| Direction `→ / ↓` | `flexDirection` row/column |
| 3×3 alignment matrix | `alignItems` × `justifyContent` |
| Columns `1 2 3 4` | `gridColumns: repeat(n, 1fr)` |
| Split chips `50/50`, `40/60` | `gridColumns: 1fr 2fr` etc. |
| Gap stepper | `gap` |
| Spacing presets S/M/L/XL | symmetric `padding*` (8/24/48/96) |
| Box editor | per-side `padding*` / `margin*` |
| Color popover swatches | `backgroundColor` / `textColor` / `borderColor` |

## 5. Responsive UX

- Fields show an **override dot** when the active breakpoint has an override.
- Under the value: `Inherited: 48px (desktop)` + one-click **Reset**.
- Device footer chip in inspector shows current breakpoint + override count.

## 6. Canvas focus mode & shortcuts

- `Cmd/Ctrl+\` toggle left+right panels, `Shift+F` focus mode, `Esc` select
  parent / exit inline edit / exit focus, `Delete` remove selected,
  `Cmd/Ctrl+D` duplicate, `Cmd/Ctrl+K` quick palette (insert components by
  name), `Cmd/Ctrl+S` save (existing), `Cmd/Ctrl+Z / +Shift+Z / Y` history
  (existing).
- Ctrl/Cmd + wheel on canvas = zoom steps; double-click heading/paragraph/button
  = inline text editing (Enter/blur commits, Esc cancels).

## 7. Implementation sequence

1. `studio/ui-controls.tsx` — shared visual control kit (steppers, scrubs,
   matrices, popovers, chips). Zero schema changes.
2. `InspectorSidebar` rewrite on the new kit; keep all dispatch contracts.
3. `PaletteSidebar` compact mode + collapsible rail.
4. `StudioCanvas` — floating chrome, compact selection pill, inline editing,
   memoized node renderer, Ctrl+wheel zoom.
5. `VisualStudioEditor` shell — resizable/collapsible panels, focus mode,
   shortcuts, quick palette.
6. `StudioTopbar` — panel toggles + focus button.

## 8. Regression risks

- **Panel widths are UI-only** — no schema/persistence changes; drafts save as
  before via `saveDraftTreeAction`.
- Inline editing writes the same `UPDATE_CONTENT` action; `<p>` wrapper for
  paragraphs preserved to keep public HTML identical.
- Drag & drop paths untouched (same dataTransfer keys, same reducer actions).
- Public parity unchanged: canvas still renders via `studio/blocks.tsx`
  primitives mirroring `apps/web` elements; no new fallback content added.
- Risk: hover-dispatch storms → mitigated by `React.memo` on the node renderer
  with narrow props (node identity + flags) instead of whole state.

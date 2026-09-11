# 10. True Draggable Element Palette & Direct Manipulation Specification

## 1. Draggable Element Palette (Left Sidebar)

As required in **Section 29**, the "Add Element" interface is not a modal or dropdown; it is a **live, visual draggable palette** inspired by modern builders (Webflow, Elementor, Framer).

### 1.1 Palette Categories & Visual Item Previews (Section 34)
Each item in the palette visually previews what it generates:

```
+-------------------------------------------------------------+
| ELEMENTS PALETTE                                            |
| [ Search elements...                                      ] |
+-------------------------------------------------------------+
| v LAYOUT                                                    |
| +-------------------------+     +-------------------------+ |
| | [::] Section            |     | [::] Container          | |
| | [=======] Full-bleed    |     | [  [...]  ] Max-width   | |
| +-------------------------+     +-------------------------+ |
| +-------------------------+     +-------------------------+ |
| | [::] 2 Columns          |     | [::] 3 Columns          | |
| | [ | ] 50 / 50 Grid      |     | [ | | ] 33 / 33 / 33    | |
| +-------------------------+     +-------------------------+ |
| +-------------------------+     +-------------------------+ |
| | [::] Flex Stack         |     | [::] Spacer / Divider   | |
| | [v] [>] Directional     |     | ─────────────────       | |
| +-------------------------+     +-------------------------+ |
|                                                             |
| v BASIC / CONTENT                                           |
| +-------------------------+     +-------------------------+ |
| | [::] Heading            |     | [::] Paragraph          | |
| |  Aa  H1 - H6            |     |  ¶  Rich text body      | |
| +-------------------------+     +-------------------------+ |
| +-------------------------+     +-------------------------+ |
| | [::] Button             |     | [::] Image              | |
| | [ Button ] Pill CTA     |     | [ ◩ Image ] Media S3    | |
| +-------------------------+     +-------------------------+ |
| +-------------------------+     +-------------------------+ |
| | [::] Icon               |     | [::] Counter / Stat     | |
| |  ★  1000+ Lucide SVG    |     |  500+ Metric display    | |
| +-------------------------+     +-------------------------+ |
|                                                             |
| v INTERACTIVE                                               |
| +-------------------------+     +-------------------------+ |
| | [::] Accordion          |     | [::] Tabs               | |
| |  v Expandable FAQ       |     |  [1] [2] Tabbed switch  | |
| +-------------------------+     +-------------------------+ |
| +-------------------------+     +-------------------------+ |
| | [::] Contact Form       |     | [::] Modal Trigger      | |
| |  [ Inquiry Inputs ]     |     |  [⧉] Dialog popup       | |
| +-------------------------+     +-------------------------+ |
|                                                             |
| v DYNAMIC / BUSINESS                                        |
| +-------------------------+     +-------------------------+ |
| | [::] Leadership Grid    |     | [::] Case Studies Grid  | |
| |  15 Team Cards          |     |  Filterable Impact      | |
| +-------------------------+     +-------------------------+ |
| +-------------------------+     +-------------------------+ |
| | [::] Insights Grid      |     | [::] Service Pillars    | |
| |  Envision / Articles    |     |  3 Practice Cards       | |
| +-------------------------+     +-------------------------+ |
+-------------------------------------------------------------+
```

---

## 2. Drag & Drop Mechanics & Visual Insertion Indicators (Sections 29 & 30)

### 2.1 Dragging from Sidebar to Canvas
1. **Drag Initiation**:
   - User mouses down on any palette card (e.g. `[ Button ]`).
   - A semi-transparent drag overlay clone attaches to the cursor.
   - Canvas drop zones activate with subtle boundary indicators.
2. **Hovering Over Canvas**:
   - The engine calculates pointer coordinates against the layout tree.
   - A high-visibility green insertion line (`#10B981`, 3px with pulsating dot) appears showing exact insertion:
     - **Before Node**: `---- ADD BEFORE [Heading] ----`
     - **After Node**: `---- ADD AFTER [Paragraph] ----`
     - **Inside Container**: Highlighted emerald container border with label `[+ DROP INSIDE CONTAINER]`.
     - **Into Grid Column**: Column boundary glows with indicator `[+ INSERT INTO COLUMN 2]`.
3. **Drop Resolution**:
   - Dropping the element triggers `ADD_NODE` in the reducer.
   - Node is assigned a unique nanoid/UUID, default styles, and parent ID.
   - State is committed to `draft_blocks` and pushed onto the history stack.
   - The new element is immediately selected in the Canvas and Right Inspector.

---

## 3. Repositioning Existing Elements (Section 31)

Existing elements on the canvas are fully draggable:
- Every element has a drag handle `::` displayed on hover and selection.
- Editors can:
  1. **Reorder within the same container**: Drag `Button` above `Paragraph`.
  2. **Move between containers**: Drag `Button` from `Container A` into `Container B`.
  3. **Move between columns**: Drag `Button` from Column 1 into Column 2 beside an `Image`.
  4. **Move across sections**: Drag entire subsections or components into a different section.
  5. **Reorder root sections**: Drag entire sections up or down the page.

---

## 4. Parent-Child Nesting & Validation Rules (Section 32)

To prevent broken DOM structures or unusable layouts, strict nesting rules are enforced both in the UI during drag operations and server-side via Zod:

| Parent Type | Allowed Children | Forbidden Children |
| :--- | :--- | :--- |
| **Root (Page)** | `section` | Container, Heading, Paragraph, Button, Image (must be inside a Section). |
| **Section** | `container`, `grid`, `flex`, `columns`, `divider`, `spacer` | Raw inline text or leaf elements directly on section without a container. |
| **Container / Flex / Column** | `container`, `grid`, `flex`, `columns`, `heading`, `paragraph`, `rich-text`, `button`, `image`, `video`, `icon`, `badge`, `counter`, `accordion`, `tabs`, `form`, dynamic grids | Raw sections. |
| **Grid** | `container`, `card`, `flex` (acts as grid cells) | Direct leaf elements without a container/cell wrapper. |
| **Leaf Elements** (`heading`, `paragraph`, `button`, `image`, `icon`, `divider`, `spacer`, `counter`) | **None** (cannot contain children) | Any child element. Drops onto leaf elements will resolve to *Before* or *After*, never *Inside*. |

### Drag Rejection:
- If a user tries to drag a `Section` inside a `Button`, the cursor changes to `not-allowed`, drop guides turn red, and the drop action is aborted.

---

## 5. Click-to-Add Alternative (Section 33)

For accessibility, tablet usage, and speed:
- Clicking (without dragging) any element in the sidebar triggers the **Quick Insertion Engine**:
  - If an element or container is currently selected on the canvas:
    - The new element is automatically inserted **directly below the selected element** or **appended inside the selected container**.
  - If no element is selected:
    - Appends to the last container of the active section, or prompts: `Insert at: [Top of Page | Active Section | Bottom of Page]`.

---

## 6. Direct Canvas Selection & Quick Action Toolbar (Section 35)

Hovering and clicking elements on the canvas gives instant visual feedback:

```
      [ Section > Container > Grid > Column 1 > Button ]  <-- Breadcrumbs
      +--------------------------------------------------+
      | [:: Drag] [^ Up] [v Down] [Clone] [Delete]       |  <-- Quick Actions
+-----+--------------------------------------------------+-----+
|     |  [ Learn More  -> ]                              |     |
|     +--------------------------------------------------+     |
+--------------------------------------------------------------+
      Active Emerald Border (#10B981) + Corner Resize Grips
```

### Right Inspector Synchronization:
Clicking any element immediately switches the Right Inspector:
- Selecting **Button** opens: Content (Label, Icon), Action (Internal URL, External URL, Modal, Phone, Email, Anchor), Layout (Width, Alignment), Style (Background, Text Color, Border, Radius, Shadow, Padding), Responsive Overrides.
- Selecting **Heading** opens: Content (Text, Tag H1–H6), Typography (Font, Size, Weight, Line-height, Color, Align), Spacing, Responsive Overrides.
- Selecting **Container / Grid** opens: Display (`block`/`flex`/`grid`), Columns, Gap, Direction, Alignment, Padding, Margin, Background.

---

## 7. Responsive Layout Primitives vs Free Canvas (Sections 36 & 37)

The builder uses **pure responsive web layout primitives**:
- **Containers**: Set max-width (`1280px`, `1440px`, `100%`) with auto-centering margins.
- **Flexbox**: Row / Column direction, flex-wrap, justify-content (`flex-start`, `center`, `space-between`), align-items, and CSS gap.
- **CSS Grid**: Responsive columns (e.g. `grid-template-columns: minmax(0, 500px) minmax(0, 1fr)`), column-gap, row-gap.
- **NO absolute x/y coordinates**: Prevents overlapping elements or broken layouts on mobile screens. Layouts naturally reflow according to responsive rules.

---

## 8. The 20-Step Drag-and-Drop Acceptance Test (Section 38)

The About Page proof-of-concept will be validated against this exact 20-step protocol:

1. **Step 1**: Open the About page editor (`/pages/editor?slug=/about`).
2. **Step 2**: Drag a new `Section` onto the page canvas.
3. **Step 3**: Drag a `Container` inside the new Section.
4. **Step 4**: Drag a `Heading` into the Container.
5. **Step 5**: Drag a `Paragraph` below the Heading.
6. **Step 6**: Drag a `Button` below the Paragraph.
7. **Step 7**: Convert the Container layout to 2 columns and drag an `Image` beside the text.
8. **Step 8**: Drag the `Button` from the left column into the right column.
9. **Step 9**: Change the `Button` label to `"Discover Our Impact"`.
10. **Step 10**: Configure the `Button` action to link internally to `/connect/`.
11. **Step 11**: Select `Heading` and change text alignment to `center`.
12. **Step 12**: Change `Heading` font size from `48px` to `56px`.
13. **Step 13**: Change the `Section` background color to `#002E20` (Envint Deep Forest).
14. **Step 14**: Add `100px` top and bottom padding to the `Section`.
15. **Step 15**: Switch canvas preview to Mobile breakpoint and set layout to 1 column.
16. **Step 16**: Toggle visibility to hide the `Image` on mobile devices.
17. **Step 17**: Drag the entire new `Section` above the `"About Envint"` section.
18. **Step 18**: Duplicate the Section using the quick-action toolbar.
19. **Step 19**: Press `Ctrl+Z` (Undo) to revert the duplication.
20. **Step 20**: Refresh the admin browser window and verify that all edits, layouts, and styles persist exactly as configured.

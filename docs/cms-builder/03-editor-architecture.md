# 03. Editor UI & Systems Architecture

## 1. 3-Panel Visual Workspace Layout

The redesigned Admin CMS visual editor follows the industry standard established by modern professional visual builders (Webflow, Framer, Elementor).

```
+------------------------------------------------------------------------------------------------------------------+
|  [<- Pages]  About Envint  [/about]  [Draft / Published]   |  [Desktop] [Tablet] [Mobile]  | [Undo] [Redo] [Save] [Publish] |
+-----------------------+-------------------------------------------------------------+----------------------------+
| LEFT SIDEBAR          | CENTER CANVAS                                               | RIGHT INSPECTOR            |
| (Structure & Library) | (Visual Interactive Preview)                                | (Context Properties)       |
|                       |                                                             |                            |
| [Navigator] [Add (+)] | +---------------------------------------------------------+ | Selected: Heading          |
|                       | | Section 1: Hero Banner                                  | | [Content] [Layout] [Style] |
| v Page                | |   Container (Max-Width 1280px)                          | |                          |
|   v Hero Section      | |     Heading: "Our vision for the future..."             | | Text:                    |
|       Container       | |     Paragraph: "A global sustainability advisory..."    | | [Our vision for the...]  |
|         Heading       | |     Button Row: [Get in Touch]                          | |                          |
|         Paragraph     | +---------------------------------------------------------+ | Tag: [ H1 v ]            |
|         Button        |                                                             |                            |
|   v About Envint      | +---------------------------------------------------------+ | Font: [ Neue Montreal v ]|
|       Grid (2-Col)    | | Section 2: About Envint (2-Col Split)                   | | Size: [ 48px ]           |
|         Left Col      | |   [ About Envint ]   | "Envint is a sustainability..."  | | Weight: [ Regular (400) ]|
|           Heading     | |                      | "Our mission is to drive..."     | | Color: [ #004E35 (Mint) ]|
|         Right Col     | +---------------------------------------------------------+ | Align: [ Left | Center ] |
|           Paragraph   |                                                             |                            |
|           Paragraph   | +---------------------------------------------------------+ | Spacing:                   |
|   v Founders          | | Section 3: How It All Began                             | | Margin Btm: [ 24px ]     |
|   v Journey           | |   [Photo Anand & Manish] | "A deep conviction..."       | |                          |
|   v Team              | +---------------------------------------------------------+ | Responsive Overrides:      |
|                       |                                                             | Tablet Size: [ 38px ]      |
| [Global Components]   |                                                             | Mobile Size: [ 28px ]      |
+-----------------------+-------------------------------------------------------------+----------------------------+
```

---

## 2. Left Panel: Navigator & Component Library

The left sidebar toggles between two primary modes:

### Mode A: Page Structure Navigator
- **Hierarchical Tree View**: Visual representation of the DOM tree (Section &rarr; Container &rarr; Grid &rarr; Element).
- **Expand / Collapse**: Folders for nested containers.
- **Visual Drag Reordering**: Drag any section or element to change position in the tree.
- **Context Actions**:
  - Rename layer label (e.g. rename "Heading" to "Section 2 Headline").
  - Duplicate layer (clones node and all children).
  - Delete layer (with confirmation).
  - Toggle visibility (eye icon to show/hide).
  - Lock layer (lock icon to prevent accidental dragging).

### Mode B: Add Element & Templates Library
- **Layout**: Section, Container, 2-Column Grid, 3-Column Grid, 4-Column Grid, Flex Stack, Spacer, Divider.
- **Content**: Heading, Paragraph, Rich Text, Image, Video Embed, Icon, Badge / Pill, Statistic Counter, Quote.
- **Interactive**: Button, Link, Accordion, Tab Group, Modal Trigger, Contact Form, Newsletter Form.
- **Business Modules**: Leadership Team Grid, Insights Grid, Case Studies Grid, Sector Cards, Tools Showcase.
- **Section Starter Templates**: Hero, 2-Column Story, Feature Cards, Founders Spotlight, Journey Timeline, CTA Banner, FAQ Accordion.
- **Reusable Global Blocks**: User-saved components that can be inserted anywhere.

---

## 3. Center Canvas: Visual Interactive Workspace

### Key Features:
1. **True Responsive Viewport Switcher**:
   - **Desktop**: 100% / min 1280px.
   - **Tablet**: Fixed 768px frame with tablet device bezel.
   - **Mobile**: Fixed 375px frame with mobile device bezel.
2. **Selection & Hover Highlighting**:
   - Hovering any element displays a subtle dashed blue outline with an element type pill (`[Heading]`, `[Container]`).
   - Clicking an element selects it, rendering an active solid emerald boundary (`#10B981`) with corner resize handles and a floating quick-action toolbar:
     - Drag handle (`::`)
     - Move Up / Move Down arrows
     - Duplicate button
     - Delete button
     - Breadcrumb pill (`Section > Container > Grid > Heading`)
3. **Drop Zones & Visual Insertion**:
   - Dragging an element from the library or canvas highlights valid drop zones with a horizontal/vertical green guide line.
   - Empty containers display a dashed drop target: `"+ Drop elements here"`.
4. **Inline Text Editing**:
   - Double-clicking any Heading or Paragraph allows direct in-place typing on the canvas without having to look over at the sidebar.

---

## 4. Right Inspector: Dynamic Context-Aware Properties

When an element is selected, the right inspector dynamically generates property tabs specific to that node type:

### Tab 1: Content
- For **Heading**: Text input, HTML tag (`H1`..`H6`).
- For **Paragraph / Rich Text**: TipTap inline toolbar (bold, italic, underline, link, list).
- For **Button**: Label, variant (Primary, Secondary, Outline, Ghost), icon picker, icon position (left/right).
- For **Image**: S3 media picker trigger, URL preview, alt text, decorative flag, aspect ratio, object-fit.
- For **Container / Grid**: Column template presets (1 col, 1/2 + 1/2, 1/3 + 1/3 + 1/3, 1/4 + 3/4).

### Tab 2: Layout & Dimensions
- Display: `Block`, `Flex`, `Grid`.
- Flex controls: Direction (Row / Column), Wrap, Justify Content, Align Items, Gap.
- Grid controls: Column count, Column gap, Row gap.
- Dimensions: Width, Max-width, Min-width, Height, Min-height.
- Alignment: Left, Center, Right, Stretch.
- Overflow: Visible, Hidden, Auto.

### Tab 3: Style & Design System Tokens
- Colors: Brand palette swatches (Deep Forest `#002E20`, Emerald `#004E35`, Mint `#10B981`, Cream `#FBF4EB`, White `#ffffff`) + custom hex picker.
- Typography: Font family ("Neue Montreal"), font size, weight (300, 400, 500, 600, 700), line height, letter spacing.
- Background: Solid color, CSS gradient builder, background image from S3, background overlay opacity.
- Border: Border width, style (solid, dashed), border color, border radius (0, 4px, 8px, 16px, 24px, 9999px).
- Shadow: Subtle, Medium, Elevated, Glow, Custom.

### Tab 4: Responsive & Visibility
- Device Visibility: Show/Hide on Desktop, Tablet, Mobile.
- Breakpoint-specific overrides: When Tablet or Mobile view is active, any modified style property is saved to `responsiveStyles.tablet` or `responsiveStyles.mobile` rather than modifying the base desktop style.

### Tab 5: Actions & Interactions
- Click Action:
  - Internal Next.js page route.
  - External URL (with target `_blank` and `rel="noopener noreferrer"`).
  - Anchor scroll to section (e.g. `#team`, `#vision`).
  - Email (`mailto:`) or Phone (`tel:`).
  - Open Modal dialog.

---

## 5. State Management & Undo/Redo Engine

The editor state is managed using an immutable action reducer pattern:

```typescript
type BuilderAction =
  | { type: 'SELECT_NODE'; id: string | null }
  | { type: 'ADD_NODE'; node: BuilderNode; parentId: string; index?: number }
  | { type: 'MOVE_NODE'; id: string; targetParentId: string; targetIndex: number }
  | { type: 'UPDATE_CONTENT'; id: string; content: Partial<any> }
  | { type: 'UPDATE_STYLES'; id: string; styles: Partial<ElementStyles>; breakpoint?: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'UPDATE_VISIBILITY'; id: string; visibility: Partial<BuilderNode['visibility']> }
  | { type: 'DUPLICATE_NODE'; id: string }
  | { type: 'DELETE_NODE'; id: string }
  | { type: 'SET_BREAKPOINT'; breakpoint: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'UNDO' }
  | { type: 'REDO' };
```

### History Stack:
- Every structural or style mutation pushes the previous state onto `history.past` (up to 50 states).
- `Ctrl+Z` pops from `past` and pushes to `future`.
- `Ctrl+Y` or `Ctrl+Shift+Z` pops from `future` and pushes to `past`.
- Visual dirty indicator displays:
  - `Draft (Unsaved changes)` &rarr; orange dot.
  - `Draft (Saved)` &rarr; blue checkmark.
  - `Published` &rarr; green checkmark.

---

## 6. Open-Source Dependency Evaluation & Selection

To fulfill the requirement of **no paid proprietary licenses** and **no vendor lock-in**, we evaluated and selected the best free, permissive open-source libraries:

| Capability | Selected Library | License | Rationale |
| :--- | :--- | :--- | :--- |
| **Drag & Drop** | `@dnd-kit/core` + `@dnd-kit/sortable` | MIT | Modern, accessible, zero dependencies, full touch/pointer support, clean collision algorithms. Far superior to legacy React DnD or unmaintained libraries. |
| **Rich Text** | `@tiptap/react` + `@tiptap/starter-kit` | MIT | Headless, lightweight, extensible, produces clean HTML/JSON. Fully open-source and customizable without licensing fees. |
| **Icons** | `lucide-react` | ISC | Already integrated across Envint project. Comprehensive set of 1000+ modern SVG icons. |
| **Schema Validation** | `zod` | MIT | Already in project. Guarantees type safety and validates tree integrity before render. |
| **State Primitives** | React 19 / Context / Reducer | MIT | Built-in React architecture; zero external bundle weight for website visitors. |

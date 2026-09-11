# 02. Block & Element Schema Specification

## 1. Architectural Philosophy

Modern professional visual builders (Elementor, Webflow, Framer, Gutenberg) represent pages not as a flat list of rigid section forms, but as an **ordered tree graph of elements**.

```
Page (Root)
 ├── Section (Full-bleed / Contained wrapper, background, padding)
 │    └── Container (Max-width, flex/grid layout)
 │         ├── Heading (H1, 76px, Neue Montreal)
 │         ├── Paragraph (Rich text)
 │         └── Flex Stack (Buttons row)
 │              ├── Button (Primary CTA -> /connect)
 │              └── Button (Secondary CTA -> #learn-more)
 │
 ├── Section (About Envint 2-Column Split)
 │    └── Grid (2 Columns: 1fr 2fr, gap 64px)
 │         ├── Container (Left Column)
 │         │    └── Heading (H2, 48px, #004E35, "About Envint")
 │         └── Container (Right Column, Stack)
 │              ├── Paragraph ("Envint is a sustainability and ESG...")
 │              ├── Paragraph ("Our mission is to drive...")
 │              └── Paragraph ("We believe that by embedding...")
```

Every single node in the tree is:
1. **Addressable** by a unique `id`.
2. **Typed** with a registered component schema.
3. **Editable** in isolation without affecting sibling nodes.
4. **Styleable** with design tokens and granular CSS properties.
5. **Responsive** with desktop base values and tablet/mobile overrides.

---

## 2. Core Node Interface (`BuilderNode`)

```typescript
export type ElementType =
  // Layout
  | 'section'
  | 'container'
  | 'grid'
  | 'flex'
  | 'spacer'
  | 'divider'
  // Content
  | 'heading'
  | 'paragraph'
  | 'rich-text'
  | 'image'
  | 'video'
  | 'icon'
  | 'badge'
  | 'quote'
  | 'counter'
  // Interactive
  | 'button'
  | 'link'
  | 'accordion'
  | 'accordion-item'
  | 'tabs'
  | 'tab-item'
  // Business / Composite
  | 'team-grid'
  | 'insights-grid'
  | 'impact-grid'
  | 'service-cards'
  | 'reusable-block';

export interface ResponsiveValue<T> {
  desktop: T;
  tablet?: T;
  mobile?: T;
}

export interface ElementStyles {
  // Dimensions
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;

  // Spacing
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;

  // Flexbox / Grid (for containers)
  display?: 'block' | 'flex' | 'grid' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  gap?: string;
  gridColumns?: string; // e.g. "repeat(3, 1fr)" or "1fr 2fr"
  gridRows?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: 300 | 400 | 500 | 600 | 700 | 800;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';

  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  backgroundRepeat?: 'no-repeat' | 'repeat';
  backgroundOverlay?: string; // e.g. "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"

  // Border & Radius
  borderWidth?: string;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderRadius?: string;

  // Effects & Advanced
  boxShadow?: string;
  opacity?: number;
  overflow?: 'visible' | 'hidden' | 'auto';
  zIndex?: number;
}

export interface ElementAction {
  type: 'link' | 'scroll-anchor' | 'modal' | 'email' | 'phone';
  url?: string;
  target?: '_self' | '_blank';
  anchorId?: string;
  modalId?: string;
}

export interface BuilderNode {
  id: string;                         // UUID or nanoid
  type: ElementType;                  // Registered element type
  name: string;                       // Human-friendly navigator label (e.g. "Hero Heading")
  parentId: string | null;            // Parent node ID (null for root sections)
  children: string[];                 // Ordered array of child node IDs
  content: Record<string, any>;       // Component-specific content
  styles: ElementStyles;              // Base desktop styling
  responsiveStyles: {
    tablet?: Partial<ElementStyles>;  // 768px - 1023px overrides
    mobile?: Partial<ElementStyles>;  // 0 - 767px overrides
  };
  visibility: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  actions?: ElementAction[];          // Click/interaction behavior
  locked?: boolean;                   // Lock from accidental dragging/deletion
  isGlobal?: boolean;                 // If true, references a global reusable component
  globalBlockId?: string;             // Foreign key to reusable_blocks table
}
```

---

## 3. Normalized Graph vs Serialized Storage

### In-Memory State (Editor Store):
The editor maintains a **normalized dictionary** rather than deeply nested recursion. This guarantees $O(1)$ node lookup, fast updates without cloning deep object trees, and clean drag-and-drop operations:

```typescript
export interface BuilderState {
  rootIds: string[];                  // Top-level Section IDs in display order
  nodes: Record<string, BuilderNode>; // Lookup table: { [id]: node }
  selectedId: string | null;          // Currently active node in inspector
  hoveredId: string | null;           // Currently hovered node in canvas
  breakpoint: 'desktop' | 'tablet' | 'mobile';
  history: {
    past: Array<{ rootIds: string[]; nodes: Record<string, BuilderNode> }>;
    future: Array<{ rootIds: string[]; nodes: Record<string, BuilderNode> }>;
  };
  isDirty: boolean;
  activeTab: 'content' | 'layout' | 'style' | 'responsive' | 'advanced';
}
```

### Database Storage Format:
The database stores the tree as clean, self-contained JSON in `pages.content_blocks` (or `draft_blocks`), either as the normalized dictionary (preferred for lossless updates) or as a structured nested tree.

---

## 4. Element Content Schemas (Zod Validated)

Every element type has a strict Zod schema validating its content:

### 1. Heading (`heading`)
```typescript
export const HeadingContentSchema = z.object({
  text: z.string().default('Heading Title'),
  tag: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).default('h2'),
});
```

### 2. Paragraph & Rich Text (`paragraph`, `rich-text`)
```typescript
export const ParagraphContentSchema = z.object({
  html: z.string().default('<p>Enter your content here...</p>'),
});
```

### 3. Button (`button`)
```typescript
export const ButtonContentSchema = z.object({
  label: z.string().default('Click Here'),
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'text']).default('primary'),
  iconName: z.string().optional(),
  iconPosition: z.enum(['left', 'right']).default('right'),
  action: z.object({
    type: z.enum(['link', 'scroll-anchor', 'modal', 'email', 'phone']).default('link'),
    url: z.string().default('#'),
    target: z.enum(['_self', '_blank']).default('_self'),
    rel: z.string().default('noopener noreferrer'),
  }),
});
```

### 4. Image (`image`)
```typescript
export const ImageContentSchema = z.object({
  src: z.string().url().default('https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp'),
  alt: z.string().default(''),
  isDecorative: z.boolean().default(false),
  caption: z.string().optional(),
  aspectRatio: z.enum(['auto', '16/9', '4/3', '1/1', '3/2', '21/9']).default('auto'),
  objectFit: z.enum(['cover', 'contain', 'fill', 'none']).default('cover'),
  objectPosition: z.string().default('center'),
});
```

### 5. Counter / Statistic (`counter`)
```typescript
export const CounterContentSchema = z.object({
  value: z.string().default('500+'),
  label: z.string().default('Engagements Delivered'),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
});
```

---

## 5. Backward Compatibility & Migration Protocol

Existing legacy blocks (`about-hero`, `about-vision`, `about-founders`, `feature-cards`, `cta-banner`, etc.) are supported via a **dual-mode interpreter**:

1. If `block.type` matches a legacy block archetype, the renderer routes to the legacy renderer component.
2. If `block.type === 'section'` and contains `children`, the renderer executes the recursive dynamic tree engine.
3. An automatic **migration transformer** (`migrateLegacyBlockToTree()`) converts flat legacy blocks into equivalent `Section -> Container -> Elements` trees with 1-click upgrade in the CMS.

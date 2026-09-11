# 04. Extensible Component Registry & Element Library

## 1. Registry Design Protocol

To ensure the visual builder remains extensible over time without requiring rewrites of the core editor, all elements are defined through a **centralized component registration protocol**.

```typescript
export interface ComponentDefinition<TContent = any> {
  type: ElementType;
  name: string;
  category: 'layout' | 'content' | 'interactive' | 'business';
  icon: any; // Lucide icon
  description: string;
  defaultContent: TContent;
  defaultStyles: ElementStyles;
  allowedChildren?: ElementType[] | 'any' | 'none';
  inspectorSchema: {
    hasTypography?: boolean;
    hasBackground?: boolean;
    hasBorder?: boolean;
    hasLayout?: boolean;
    hasDimensions?: boolean;
    customFields?: InspectorFieldDefinition[];
  };
  renderPreview: React.FC<{ node: BuilderNode; isEditing?: boolean }>;
  renderPublic: React.FC<{ node: BuilderNode; children?: React.ReactNode }>;
}
```

To introduce a new element (e.g., a "Testimonial Carousel" or "Carbon Calculator Widget"), a developer creates a single registration file and registers it in `component-registry.ts`. The Navigator, Add Element modal, Inspector, and Renderers immediately support it.

---

## 2. Complete Element Specifications

### Category A: Layout Elements

#### 1. `section` (Section Wrapper)
- **Role**: Root block for horizontal page bands. Supports full-bleed backgrounds with contained inner layout.
- **Allowed Children**: `container`, `grid`, `flex`.
- **Default Styles**:
  - `width: '100%'`
  - `paddingTop: '80px'`, `paddingBottom: '80px'`
  - `backgroundColor: '#ffffff'`
  - `display: 'block'`
- **Inspector Controls**: Background color/image/gradient, padding (top/bottom), full-bleed vs boxed, minimum height.

#### 2. `container` (Centered Content Box)
- **Role**: Constrains content to responsive max-width (`1280px` standard, `1000px` narrow, `1440px` wide).
- **Allowed Children**: `'any'`.
- **Default Styles**:
  - `maxWidth: '1280px'`
  - `marginLeft: 'auto'`, `marginRight: 'auto'`
  - `paddingLeft: '24px'`, `paddingRight: '24px'`
  - `width: '100%'`

#### 3. `grid` (CSS Grid)
- **Role**: Multi-column responsive layout engine.
- **Allowed Children**: `'any'` (typically `container` or element cards).
- **Content Props**:
  - `columnsPreset`: `'2-col'`, `'3-col'`, `'4-col'`, `'1-2'`, `'2-1'`, `'custom'`
  - `gap`: `'24px'`, `'32px'`, `'48px'`, `'64px'`
- **Responsive Controls**:
  - Desktop: 2-4 columns
  - Tablet override: 2 columns
  - Mobile override: 1 column (`1fr`)

#### 4. `flex` / `stack` (Flexbox Container)
- **Role**: Grouping elements horizontally or vertically (e.g. Button Rows, Icon + Title groupings).
- **Allowed Children**: `'any'`.
- **Inspector Controls**: Direction (Row/Col), Wrap, Justify Content, Align Items, Gap.

#### 5. `spacer` & `divider`
- **Spacer**: Responsive vertical spacing block (`height: 40px`, mobile: `24px`).
- **Divider**: Horizontal aesthetic rule with configurable thickness, style (solid, dashed), color (`#E2E8F0`), and width (`100%`, `80px`, centered).

---

### Category B: Content Elements

#### 1. `heading` (Headlines H1–H6)
- **Content**:
  - `text`: Plain text string.
  - `tag`: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'`
- **Default Styles**:
  - Font: `"Neue Montreal", sans-serif`
  - Color: `#004E35` (Emerald) or `#0F172A` (Slate 900)
  - Desktop Size: H1 (`56px`), H2 (`42px`), H3 (`28px`)
  - Tablet Override: H1 (`42px`), H2 (`32px`), H3 (`24px`)
  - Mobile Override: H1 (`32px`), H2 (`26px`), H3 (`20px`)

#### 2. `paragraph` / `rich-text` (Copy & Body Text)
- **Content**: Clean HTML string supporting inline formatting (`strong`, `em`, `u`, `a`, `ul`, `ol`, `li`).
- **Default Styles**:
  - Font: `"Neue Montreal", sans-serif`
  - Font Size: `18px` (Body Large) or `16px` (Body Regular)
  - Line Height: `1.65` (`28px`)
  - Color: `#334155` (Slate 700) or `#475569` (Slate 600)
  - Margin Bottom: `16px`

#### 3. `image` (Responsive S3 Image)
- **Content**:
  - `src`: Full S3 URL (`https://envintcms.s3.ap-south-1.amazonaws.com/...`).
  - `alt`: Descriptive alt text for accessibility.
  - `isDecorative`: Boolean flag (sets `alt=""` and `aria-hidden="true"`).
  - `aspectRatio`: `'auto' | '16/9' | '4/3' | '1/1' | '3/2'`
  - `objectFit`: `'cover' | 'contain'`
- **Inspector Controls**: Integrated S3 Media Library Picker modal, border radius (`16px`, `8px`, `50%`), shadow, caption.

#### 4. `badge` / `pill` (Category Label)
- **Content**: Text string (e.g. `"CLIMATE ACTION"`).
- **Default Styles**:
  - Font size: `12px`, uppercase, letter spacing `0.1em`, font weight `700`.
  - Color: `#047857`, Background: `#ECFDF5`, Border Radius: `9999px`.
  - Padding: `4px 12px`.

#### 5. `counter` / `statistic`
- **Content**: `value` (`"500+"`), `label` (`"Engagements Delivered"`).
- **Default Styles**:
  - Value: `48px`, font weight `700`, color `#10B981` (Mint).
  - Label: `14px`, color `#64748B`, uppercase tracking.

---

### Category C: Interactive Elements

#### 1. `button` (Action Triggers & Links)
- **Content**:
  - `label`: `"Get in Touch"` / `"Explore Services"`
  - `variant`: `'primary'` (Solid Mint), `'secondary'` (Deep Emerald), `'outline'` (Bordered), `'ghost'`, `'text'`
  - `iconName`: Optional Lucide icon name (e.g. `'ArrowRight'`, `'Download'`).
  - `iconPosition`: `'left' | 'right'`
  - `action`:
    - `type: 'link' | 'scroll-anchor' | 'modal' | 'email' | 'phone'`
    - `url`: Route or external URL
    - `target`: `'_self' | '_blank'`
- **Styling**: Hover transition, border-radius (`30px` pill or `8px`), padding, shadow.

#### 2. `accordion` & `accordion-item` (FAQ / Collapsible)
- **Content**: Question heading + answer rich text.
- **Controls**: Allow single or multiple open items, icon style (`chevron`, `plus/minus`), border colors.

#### 3. `tabs` & `tab-item`
- **Role**: Tabbed interface for multi-stage processes (e.g. Decarbonization Roadmap stages).

---

### Category D: Business / Composite Elements

#### 1. `team-grid` (Leadership & Team)
- **Mode**:
  - Dynamic query: Fetches from `team_members` database table.
  - Custom curated: Editor picks specific team members by slug.
- **Controls**: Columns (3, 4, 5), card layout, hover flip bio behavior.

#### 2. `insights-grid` (Featured Articles)
- **Mode**: Fetches latest articles from `insights` table with category filters.
- **Controls**: Number of posts (3, 6, 9), show excerpt toggle, show author toggle.

#### 3. `impact-grid` (Case Studies)
- **Mode**: Fetches from `impact_case_studies` with sector/theme filter pills.

---

## 3. Section Starter Templates Library

When an editor clicks `"+ Add Section"`, they can choose from pre-assembled section templates that instantly insert a fully configured tree of nodes:

1. **Hero Banner**: Section &rarr; Container &rarr; Tagline Pill + H1 Heading + Subtitle + Buttons Row.
2. **About 2-Column Split**: Section &rarr; 2-Column Grid &rarr; Left Heading Column + Right Multi-Paragraph Column.
3. **Founders Spotlight**: Section &rarr; 2-Column Grid &rarr; Left Founder Photo + Right "How It All Began" Story.
4. **3-Card Feature Grid**: Section &rarr; Container &rarr; Header &rarr; 3-Column Grid with Icon, Title, Description, and CTA.
5. **Timeline / Milestones**: Section &rarr; Container &rarr; Horizontal Milestone Cards with years and descriptions.
6. **Statistics Band**: Section &rarr; Container &rarr; 4-Column Grid with Large Numbers and Labels.
7. **Full-Bleed CTA**: Section &rarr; Centered Container &rarr; Compelling H2 + Subtitle + Primary White Pill Button.
8. **FAQ Accordion**: Section &rarr; Narrow Container &rarr; Title + 5 Accordion Items.

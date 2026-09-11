# 05. Style System & Design Tokens

## 1. Envint Design Tokens Integration

To maintain consistent visual excellence and brand harmony across all pages without forcing editors to remember arbitrary CSS values, the page builder integrates directly with the **Envint Design Token System**.

### Color Tokens
```typescript
export const ENVINT_COLORS = {
  // Brand Primaries
  'brand-dark': '#002E20',       // Deep Forest Green (Hero backgrounds, dark footers)
  'brand-primary': '#004E35',    // Classic Envint Emerald (Headings, primary accents)
  'brand-mint': '#10B981',       // Vibrant Mint Green (Buttons, highlights, badges)
  'brand-mint-light': '#DCFCE7', // Light Mint Tint (Pill backgrounds, icon circles)
  'brand-cream': '#FBF4EB',      // Warm Cream (Hero heading contrast, soft cards)

  // Neutrals & Surface
  'surface-white': '#FFFFFF',    // Clean White
  'surface-light': '#F8FAFC',    // Subtle Cool Gray (Section alternate backgrounds)
  'surface-warm': '#F7F7F7',     // Neutral Gray (Founders section background)
  'border-subtle': '#E2E8F0',    // Clean divider borders
  'border-focus': '#10B981',     // Active focus rings

  // Typography Neutrals
  'text-title': '#0F172A',       // Primary Slate 900
  'text-body': '#334155',        // Body Slate 700
  'text-muted': '#64748B',       // Caption Slate 500
  'text-inverse': '#FFFFFF',     // White on dark
} as const;
```

### Typography Tokens
```typescript
export const ENVINT_TYPOGRAPHY = {
  fontFamilies: {
    display: '"Neue Montreal", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: '"Neue Montreal", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  sizes: {
    'display-1': { fontSize: '76px', lineHeight: '1.12', letterSpacing: '-0.03em' },
    'display-2': { fontSize: '56px', lineHeight: '1.15', letterSpacing: '-0.02em' },
    'h1':        { fontSize: '48px', lineHeight: '1.20', letterSpacing: '-0.02em' },
    'h2':        { fontSize: '38px', lineHeight: '1.25', letterSpacing: '-0.01em' },
    'h3':        { fontSize: '28px', lineHeight: '1.30', letterSpacing: '0em' },
    'h4':        { fontSize: '22px', lineHeight: '1.35', letterSpacing: '0em' },
    'body-lg':   { fontSize: '20px', lineHeight: '1.60', letterSpacing: '0em' },
    'body-md':   { fontSize: '16px', lineHeight: '1.65', letterSpacing: '0em' },
    'body-sm':   { fontSize: '14px', lineHeight: '1.50', letterSpacing: '0.01em' },
    'caption':   { fontSize: '12px', lineHeight: '1.40', letterSpacing: '0.05em' },
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;
```

### Spacing Tokens
```typescript
export const ENVINT_SPACING = {
  none: '0px',
  xs:   '4px',
  sm:   '8px',
  md:   '16px',
  lg:   '24px',
  xl:   '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
  '5xl': '110px',
  '6xl': '140px',
} as const;
```

---

## 2. Responsive Breakpoint Engine

The editor and frontend renderer use a **three-tier mobile-first cascading override model**:

$$\text{Active Style} = \text{Desktop (Base)} \oplus \text{Tablet Overrides} \oplus \text{Mobile Overrides}$$

```
Breakpoint Widths:
• Desktop:  >= 1024px  (Base values stored in node.styles)
• Tablet:   768px - 1023px  (Overrides stored in node.responsiveStyles.tablet)
• Mobile:   0px - 767px     (Overrides stored in node.responsiveStyles.mobile)
```

### How the Inspector Handles Overrides:
1. When the editor's device toggle is on **Desktop**:
   - Any property change updates `node.styles[key]`.
2. When the device toggle is on **Tablet**:
   - Any property change updates `node.responsiveStyles.tablet[key]`.
   - The UI displays an indicator showing that a Tablet override is active.
3. When the device toggle is on **Mobile**:
   - Any property change updates `node.responsiveStyles.mobile[key]`.
   - If no mobile override is set, the input shows a ghosted value cascading down from Tablet or Desktop.

### CSS Output Generation:
The frontend renderer generates clean inline styles with media query styles or scoped CSS variables:

```css
/* Scoped node style */
.envint-node-abc123 {
  font-size: var(--fs-desktop, 48px);
  padding: var(--pad-desktop, 80px 24px);
  display: flex;
  flex-direction: row;
}

@media (max-width: 1023px) {
  .envint-node-abc123 {
    font-size: var(--fs-tablet, 36px);
    padding: var(--pad-tablet, 60px 20px);
  }
}

@media (max-width: 767px) {
  .envint-node-abc123 {
    font-size: var(--fs-mobile, 28px);
    padding: var(--pad-mobile, 40px 16px);
    flex-direction: column;
  }
}
```

---

## 3. Style Sanitization & Safety

To ensure that malicious code or broken layouts cannot be injected:
1. **Property Whitelist**: Only approved CSS properties (typography, spacing, layout, background, border, effects) are parsed.
2. **Value Validation**:
   - URL strings in `backgroundImage` must be valid HTTPS URLs from allowed origins (`amazonaws.com`, `envintglobal.com`, `images.clerk.dev`).
   - Expressions (`expression(...)`, `behavior: ...`) and javascript URIs are strictly rejected.
3. **Unit Validation**: Numerical values must specify valid CSS units (`px`, `rem`, `%`, `vh`, `vw`, `em`, `clamp`). Arbitrary raw strings are stripped.

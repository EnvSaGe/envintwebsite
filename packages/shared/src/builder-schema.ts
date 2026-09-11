import { z } from 'zod';

// ============================================================================
// 1. Element Types & Hierarchical Classification
// ============================================================================

export const ElementTypeSchema = z.enum([
  // Layout Primitives
  'section',
  'container',
  'grid',
  'flex',
  'columns',
  'spacer',
  'divider',

  // Basic / Content
  'heading',
  'paragraph',
  'rich-text',
  'image',
  'video',
  'icon',
  'badge',
  'quote',
  'counter',

  // Interactive
  'button',
  'link',
  'accordion',
  'accordion-item',
  'tabs',
  'tab-item',
  'form',
  'modal-trigger',

  // Business / Dynamic Modules
  'team-grid',
  'insights-grid',
  'impact-grid',
  'service-cards',
  'reusable-block',
]);

export type ElementType = z.infer<typeof ElementTypeSchema>;

// Parent-Child Nesting Rules (Programmatic Enforcement)
export const NESTING_RULES: Record<string, { allowedChildren: ElementType[]; isLeaf?: boolean }> = {
  // Page root allows only sections
  root: {
    allowedChildren: ['section'],
  },
  section: {
    allowedChildren: ['container', 'grid', 'flex', 'columns', 'divider', 'spacer'],
  },
  container: {
    allowedChildren: [
      'container',
      'grid',
      'flex',
      'columns',
      'heading',
      'paragraph',
      'rich-text',
      'button',
      'image',
      'video',
      'icon',
      'badge',
      'quote',
      'counter',
      'accordion',
      'tabs',
      'form',
      'modal-trigger',
      'team-grid',
      'insights-grid',
      'impact-grid',
      'service-cards',
      'reusable-block',
      'divider',
      'spacer',
    ],
  },
  grid: {
    allowedChildren: ['container', 'flex'],
  },
  flex: {
    allowedChildren: [
      'container',
      'flex',
      'heading',
      'paragraph',
      'rich-text',
      'button',
      'image',
      'icon',
      'badge',
      'counter',
      'divider',
      'spacer',
    ],
  },
  columns: {
    allowedChildren: ['container'],
  },
  accordion: {
    allowedChildren: ['accordion-item'],
  },
  'accordion-item': {
    allowedChildren: ['heading', 'paragraph', 'rich-text', 'button', 'image', 'flex', 'container'],
  },
  tabs: {
    allowedChildren: ['tab-item'],
  },
  'tab-item': {
    allowedChildren: ['container', 'grid', 'flex', 'heading', 'paragraph', 'rich-text', 'button', 'image'],
  },
  // Leaf Elements: Cannot accept children
  heading: { allowedChildren: [], isLeaf: true },
  paragraph: { allowedChildren: [], isLeaf: true },
  'rich-text': { allowedChildren: [], isLeaf: true },
  button: { allowedChildren: [], isLeaf: true },
  image: { allowedChildren: [], isLeaf: true },
  video: { allowedChildren: [], isLeaf: true },
  icon: { allowedChildren: [], isLeaf: true },
  badge: { allowedChildren: [], isLeaf: true },
  quote: { allowedChildren: [], isLeaf: true },
  counter: { allowedChildren: [], isLeaf: true },
  divider: { allowedChildren: [], isLeaf: true },
  spacer: { allowedChildren: [], isLeaf: true },
  'team-grid': { allowedChildren: [], isLeaf: true },
  'insights-grid': { allowedChildren: [], isLeaf: true },
  'impact-grid': { allowedChildren: [], isLeaf: true },
  'service-cards': { allowedChildren: [], isLeaf: true },
  'reusable-block': { allowedChildren: [], isLeaf: true },
  form: { allowedChildren: [], isLeaf: true },
  'modal-trigger': { allowedChildren: [], isLeaf: true },
};

export function canAcceptChild(parentType: string, childType: ElementType): boolean {
  const rule = NESTING_RULES[parentType];
  if (!rule || rule.isLeaf) return false;
  return rule.allowedChildren.includes(childType);
}

// ============================================================================
// 2. Element Style Tokens & CSS Model
// ============================================================================

export const ElementStylesSchema = z.object({
  // Dimensions
  width: z.string().optional(),
  maxWidth: z.string().optional(),
  minWidth: z.string().optional(),
  height: z.string().optional(),
  minHeight: z.string().optional(),
  maxHeight: z.string().optional(),

  // Spacing (Padding)
  padding: z.string().optional(),
  paddingTop: z.string().optional(),
  paddingRight: z.string().optional(),
  paddingBottom: z.string().optional(),
  paddingLeft: z.string().optional(),

  // Spacing (Margin)
  margin: z.string().optional(),
  marginTop: z.string().optional(),
  marginRight: z.string().optional(),
  marginBottom: z.string().optional(),
  marginLeft: z.string().optional(),

  // Flexbox & Grid Layout Primitives (NOT free absolute positioning)
  display: z.enum(['block', 'flex', 'grid', 'none']).optional(),
  flexDirection: z.enum(['row', 'column', 'row-reverse', 'column-reverse']).optional(),
  flexWrap: z.enum(['nowrap', 'wrap', 'wrap-reverse']).optional(),
  justifyContent: z
    .enum(['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'])
    .optional(),
  alignItems: z.enum(['flex-start', 'center', 'flex-end', 'stretch', 'baseline']).optional(),
  alignSelf: z.enum(['auto', 'flex-start', 'center', 'flex-end', 'stretch']).optional(),
  gap: z.string().optional(),
  columnGap: z.string().optional(),
  rowGap: z.string().optional(),
  gridColumns: z.string().optional(), // e.g. "repeat(3, 1fr)" or "minmax(0, 480px) minmax(0, 1fr)"
  gridRows: z.string().optional(),

  // Typography
  fontFamily: z.string().optional(),
  fontSize: z.string().optional(),
  fontWeight: z.union([z.string(), z.number()]).optional(),
  lineHeight: z.string().optional(),
  letterSpacing: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
  textColor: z.string().optional(),
  textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
  textDecoration: z.enum(['none', 'underline', 'line-through']).optional(),

  // Background
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().optional(),
  backgroundSize: z.enum(['cover', 'contain', 'auto']).optional(),
  backgroundPosition: z.string().optional(),
  backgroundRepeat: z.enum(['no-repeat', 'repeat', 'repeat-x', 'repeat-y']).optional(),
  backgroundOverlay: z.string().optional(),

  // Border & Radius
  borderWidth: z.string().optional(),
  borderStyle: z.enum(['none', 'solid', 'dashed', 'dotted']).optional(),
  borderColor: z.string().optional(),
  borderRadius: z.string().optional(),

  // Effects & Shadows
  boxShadow: z.string().optional(),
  opacity: z.number().min(0).max(1).optional(),
  overflow: z.enum(['visible', 'hidden', 'auto', 'scroll']).optional(),
  zIndex: z.number().optional(),
});

export type ElementStyles = z.infer<typeof ElementStylesSchema>;

// ============================================================================
// 3. Actions (Click & Interactivity)
// ============================================================================

export const ElementActionSchema = z.object({
  type: z.enum(['link', 'scroll-anchor', 'modal', 'email', 'phone', 'download']),
  url: z.string().optional(),
  target: z.enum(['_self', '_blank']).default('_self'),
  rel: z.string().default('noopener noreferrer'),
  anchorId: z.string().optional(),
  modalId: z.string().optional(),
  downloadFilename: z.string().optional(),
});

export type ElementAction = z.infer<typeof ElementActionSchema>;

// ============================================================================
// 4. Content Schemas for Individual Element Types
// ============================================================================

export const HeadingContentSchema = z.object({
  text: z.string().default('Section Headline'),
  tag: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).default('h2'),
});

export const ParagraphContentSchema = z.object({
  html: z.string().default('<p>Enter your paragraph content here...</p>'),
});

export const ButtonContentSchema = z.object({
  label: z.string().default('Click Here'),
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'text']).default('primary'),
  iconName: z.string().optional(),
  iconPosition: z.enum(['left', 'right']).default('right'),
  action: ElementActionSchema.default({
    type: 'link',
    url: '#',
    target: '_self',
    rel: 'noopener noreferrer',
  }),
});

export const ImageContentSchema = z.object({
  src: z.string().default('https://envintcms.s3.ap-south-1.amazonaws.com/images/placeholder.webp'),
  alt: z.string().default(''),
  isDecorative: z.boolean().default(false),
  caption: z.string().optional(),
  aspectRatio: z.enum(['auto', '16/9', '4/3', '1/1', '3/2', '21/9']).default('auto'),
  objectFit: z.enum(['cover', 'contain', 'fill', 'none']).default('cover'),
  objectPosition: z.string().default('center'),
  action: ElementActionSchema.optional(),
});

export const CounterContentSchema = z.object({
  value: z.string().default('500+'),
  label: z.string().default('Engagements Delivered'),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
});

export const BadgeContentSchema = z.object({
  text: z.string().default('NEW'),
  variant: z.enum(['mint', 'emerald', 'neutral', 'outline']).default('mint'),
});

export const IconContentSchema = z.object({
  iconName: z.string().default('ArrowRight'),
  size: z.number().default(24),
  color: z.string().optional(),
});

export const VideoContentSchema = z.object({
  provider: z.enum(['youtube', 'vimeo', 's3']).default('youtube'),
  url: z.string().default(''),
  autoplay: z.boolean().default(false),
  loop: z.boolean().default(false),
  controls: z.boolean().default(true),
  muted: z.boolean().default(false),
});

export const AccordionItemContentSchema = z.object({
  title: z.string().default('Accordion Question / Title'),
  defaultOpen: z.boolean().default(false),
});

export const DynamicModuleContentSchema = z.object({
  category: z.string().optional(),
  limit: z.number().default(6),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  showFilterPills: z.boolean().default(true),
});

// ============================================================================
// 5. The Core Node Model (`BuilderNode`)
// ============================================================================

export const BuilderNodeSchema = z.object({
  id: z.string(),
  type: ElementTypeSchema,
  name: z.string(),
  parentId: z.string().nullable(),
  children: z.array(z.string()).default([]),
  content: z.record(z.any()).default({}),
  styles: ElementStylesSchema.default({}),
  responsiveStyles: z
    .object({
      tablet: ElementStylesSchema.optional(),
      mobile: ElementStylesSchema.optional(),
    })
    .optional(),
  visibility: z
    .object({
      desktop: z.boolean().default(true),
      tablet: z.boolean().default(true),
      mobile: z.boolean().default(true),
    })
    .optional(),
  actions: z.array(ElementActionSchema).optional(),
  locked: z.boolean().optional(),
  isGlobal: z.boolean().optional(),
  globalBlockId: z.string().optional(),
});

export type BuilderNode = z.infer<typeof BuilderNodeSchema>;

// ============================================================================
// 6. Complete Page Block Tree Structure (Saved in Database JSONB)
// ============================================================================

export const PageBlockTreeSchema = z.object({
  version: z.number().default(2),
  rootIds: z.array(z.string()).default([]),
  nodes: z.record(BuilderNodeSchema).default({}),
});

export type PageBlockTree = z.infer<typeof PageBlockTreeSchema>;

// ============================================================================
// 7. Helper Utilities
// ============================================================================

/** Generate a clean collision-resistant ID with element prefix */
export function generateNodeId(prefix: string = 'node'): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let rand = '';
  for (let i = 0; i < 8; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_${rand}`;
}

/** Create a new initialized node with default styling & content */
export function createDefaultNode(
  type: ElementType,
  parentId: string | null = null,
  customProps: Partial<BuilderNode> = {}
): BuilderNode {
  const id = generateNodeId(type);

  // Default content & styling per type
  let content: Record<string, any> = {};
  let styles: ElementStyles = {};
  let name = type.charAt(0).toUpperCase() + type.slice(1);

  switch (type) {
    case 'section':
      name = 'Section';
      styles = {
        paddingTop: '80px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#ffffff',
        width: '100%',
        display: 'block',
      };
      break;

    case 'container':
      name = 'Container';
      styles = {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        display: 'block',
      };
      break;

    case 'grid':
      name = '2-Column Grid';
      styles = {
        display: 'grid',
        gridColumns: 'repeat(2, 1fr)',
        gap: '40px',
        width: '100%',
      };
      break;

    case 'flex':
      name = 'Flex Stack';
      styles = {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
      };
      break;

    case 'heading':
      name = 'Heading';
      content = { text: 'Heading Title', tag: 'h2' };
      styles = {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        lineHeight: '1.2',
        marginBottom: '24px',
        fontFamily: 'Neue Montreal, sans-serif',
      };
      break;

    case 'paragraph':
      name = 'Paragraph';
      content = {
        html: '<p>Envint is a sustainability and ESG solutions firm, driving positive impact worldwide.</p>',
      };
      styles = {
        fontSize: '18px',
        lineHeight: '1.6',
        textColor: '#393939',
        marginBottom: '16px',
      };
      break;

    case 'button':
      name = 'Button';
      content = {
        label: 'Get in Touch',
        variant: 'primary',
        iconPosition: 'right',
        action: { type: 'link', url: '/connect', target: '_self', rel: 'noopener noreferrer' },
      };
      styles = {
        backgroundColor: '#004E35',
        textColor: '#ffffff',
        paddingTop: '14px',
        paddingBottom: '14px',
        paddingLeft: '32px',
        paddingRight: '32px',
        borderRadius: '9999px',
        fontSize: '16px',
        fontWeight: 500,
      };
      break;

    case 'image':
      name = 'Image';
      content = {
        src: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
        alt: 'Envint visual asset',
        isDecorative: false,
        aspectRatio: 'auto',
        objectFit: 'cover',
      };
      styles = {
        width: '100%',
        borderRadius: '12px',
      };
      break;

    case 'counter':
      name = 'Metric Counter';
      content = {
        value: '500+',
        label: 'Client Engagements Delivered',
      };
      styles = {
        textAlign: 'center',
      };
      break;

    case 'spacer':
      name = 'Spacer';
      styles = {
        height: '48px',
        width: '100%',
      };
      break;

    case 'divider':
      name = 'Divider';
      styles = {
        height: '1px',
        backgroundColor: '#E5E7EB',
        width: '100%',
        marginTop: '32px',
        marginBottom: '32px',
      };
      break;
  }

  return {
    id,
    type,
    name,
    parentId,
    children: [],
    content,
    styles,
    responsiveStyles: {},
    visibility: { desktop: true, tablet: true, mobile: true },
    ...customProps,
  };
}

/** Deep clone a node and all of its recursive children with fresh IDs */
export function cloneNodeTree(
  nodeId: string,
  nodes: Record<string, BuilderNode>,
  newParentId: string | null = null
): { newRootId: string; clonedNodes: Record<string, BuilderNode> } {
  const original = nodes[nodeId];
  if (!original) {
    throw new Error(`Node ${nodeId} not found in tree`);
  }

  const newRootId = generateNodeId(original.type);
  const clonedNodes: Record<string, BuilderNode> = {};
  const newChildIds: string[] = [];

  // Recursively clone children
  for (const childId of original.children) {
    if (nodes[childId]) {
      const childClone = cloneNodeTree(childId, nodes, newRootId);
      newChildIds.push(childClone.newRootId);
      Object.assign(clonedNodes, childClone.clonedNodes);
    }
  }

  clonedNodes[newRootId] = {
    ...JSON.parse(JSON.stringify(original)),
    id: newRootId,
    name: `${original.name} (Copy)`,
    parentId: newParentId,
    children: newChildIds,
  };

  return { newRootId, clonedNodes };
}

/**
 * Build authentic Schema v2 Dynamic Block Tree for the About page (/about)
 */
export function createAboutPageTree(): PageBlockTree {
  const rootIds = [
    'sec_about_hero',
    'sec_about_purpose',
    'sec_about_founders',
    'sec_about_journey',
    'sec_about_team',
  ];

  const nodes: Record<string, BuilderNode> = {
    // ─── 1. Hero Section ────────────────────────────────────────────────────────
    sec_about_hero: {
      id: 'sec_about_hero',
      type: 'section',
      name: 'Hero Section',
      parentId: null,
      children: ['cont_about_hero'],
      content: {},
      styles: {
        paddingTop: '160px',
        paddingBottom: '90px',
        paddingLeft: '24px',
        paddingRight: '24px',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay:
          'linear-gradient(to top, rgba(0, 46, 32, 0.88) 0%, rgba(0, 46, 32, 0.35) 100%)',
      },
      responsiveStyles: {
        tablet: { paddingTop: '120px', paddingBottom: '60px' },
        mobile: { paddingTop: '100px', paddingBottom: '40px', minHeight: '50vh' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    cont_about_hero: {
      id: 'cont_about_hero',
      type: 'container',
      name: 'Hero Content',
      parentId: 'sec_about_hero',
      children: ['badge_about_hero', 'h1_about_hero'],
      content: {},
      styles: {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      },
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    badge_about_hero: {
      id: 'badge_about_hero',
      type: 'badge',
      name: 'Hero Tagline',
      parentId: 'cont_about_hero',
      children: [],
      content: { text: 'ABOUT ENVINT' },
      styles: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        textColor: '#FBF4EB',
        width: 'fit-content',
        paddingTop: '6px',
        paddingBottom: '6px',
        paddingLeft: '16px',
        paddingRight: '16px',
        borderRadius: '9999px',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.08em',
      },
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    h1_about_hero: {
      id: 'h1_about_hero',
      type: 'heading',
      name: 'Hero Headline',
      parentId: 'cont_about_hero',
      children: [],
      content: {
        text: 'Our vision for the future is one that’s better',
        tag: 'h1',
      },
      styles: {
        fontSize: '76px',
        fontWeight: 400,
        textColor: '#FBF4EB',
        lineHeight: '1.15',
        fontFamily: 'Neue Montreal, sans-serif',
        margin: '0',
      },
      responsiveStyles: {
        tablet: { fontSize: '52px' },
        mobile: { fontSize: '34px', lineHeight: '1.25' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },

    // ─── 2. About Envint (Vision & Purpose) ───────────────────────────────────
    sec_about_purpose: {
      id: 'sec_about_purpose',
      type: 'section',
      name: 'About Envint (2-Col)',
      parentId: null,
      children: ['cont_about_purpose'],
      content: {},
      styles: {
        backgroundColor: '#ffffff',
        paddingTop: '80px',
        paddingBottom: '100px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      responsiveStyles: {
        tablet: { paddingTop: '60px', paddingBottom: '70px' },
        mobile: { paddingTop: '48px', paddingBottom: '60px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    cont_about_purpose: {
      id: 'cont_about_purpose',
      type: 'container',
      name: 'About Content Wrapper',
      parentId: 'sec_about_purpose',
      children: ['grid_about_purpose'],
      content: {},
      styles: {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    grid_about_purpose: {
      id: 'grid_about_purpose',
      type: 'grid',
      name: '2-Column Split',
      parentId: 'cont_about_purpose',
      children: ['col1_purpose', 'col2_purpose'],
      content: {},
      styles: {
        display: 'grid',
        gridColumns: 'minmax(0, 460px) minmax(0, 1fr)',
        gap: '64px',
        alignItems: 'flex-start',
      },
      responsiveStyles: {
        tablet: { gridColumns: '1fr', gap: '32px' },
        mobile: { gridColumns: '1fr', gap: '24px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    col1_purpose: {
      id: 'col1_purpose',
      type: 'container',
      name: 'Left Column',
      parentId: 'grid_about_purpose',
      children: ['h2_purpose'],
      content: {},
      styles: {},
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    h2_purpose: {
      id: 'h2_purpose',
      type: 'heading',
      name: 'Section Headline',
      parentId: 'col1_purpose',
      children: [],
      content: {
        text: 'About Envint',
        tag: 'h2',
      },
      styles: {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        margin: '0',
        lineHeight: '1.2',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      responsiveStyles: {
        mobile: { fontSize: '28px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    col2_purpose: {
      id: 'col2_purpose',
      type: 'flex',
      name: 'Right Column (Narrative)',
      parentId: 'grid_about_purpose',
      children: ['p1_purpose', 'p2_purpose', 'p3_purpose'],
      content: {},
      styles: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      },
      responsiveStyles: {
        mobile: { gap: '16px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    p1_purpose: {
      id: 'p1_purpose',
      type: 'paragraph',
      name: 'Statement Paragraph',
      parentId: 'col2_purpose',
      children: [],
      content: {
        html: '<p>Envint is a sustainability and ESG solutions firm, founded with a purpose to shape a more liveable planet for the coming generations.</p>',
      },
      styles: {
        fontSize: '22px',
        lineHeight: '35px',
        textColor: '#393939',
        margin: '0',
      },
      responsiveStyles: {
        mobile: { fontSize: '18px', lineHeight: '30px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    p2_purpose: {
      id: 'p2_purpose',
      type: 'paragraph',
      name: 'Belief Paragraph',
      parentId: 'col2_purpose',
      children: [],
      content: {
        html: '<p>Our mission is to drive sustainability into mainstream thought and action, with the belief that ‘green makes sense beyond conscience’.</p>',
      },
      styles: {
        fontSize: '22px',
        lineHeight: '35px',
        textColor: '#393939',
        margin: '0',
      },
      responsiveStyles: {
        mobile: { fontSize: '18px', lineHeight: '30px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    p3_purpose: {
      id: 'p3_purpose',
      type: 'paragraph',
      name: 'Strategy Paragraph',
      parentId: 'col2_purpose',
      children: [],
      content: {
        html: '<p>We believe that by embedding environmental, social and governance principles in their core strategies, businesses can not only do good for the world, but also earn better financial returns.</p>',
      },
      styles: {
        fontSize: '22px',
        lineHeight: '35px',
        textColor: '#393939',
        margin: '0',
      },
      responsiveStyles: {
        mobile: { fontSize: '18px', lineHeight: '30px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },

    // ─── 3. Founders Spotlight (How it all began) ─────────────────────────────
    sec_about_founders: {
      id: 'sec_about_founders',
      type: 'section',
      name: 'Founders Spotlight',
      parentId: null,
      children: ['cont_about_founders'],
      content: {},
      styles: {
        backgroundColor: '#F7F7F7',
        paddingTop: '80px',
        paddingBottom: '100px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      responsiveStyles: {
        tablet: { paddingTop: '60px', paddingBottom: '70px' },
        mobile: { paddingTop: '48px', paddingBottom: '60px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    cont_about_founders: {
      id: 'cont_about_founders',
      type: 'container',
      name: 'Founders Wrapper',
      parentId: 'sec_about_founders',
      children: ['grid_about_founders'],
      content: {},
      styles: {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    grid_about_founders: {
      id: 'grid_about_founders',
      type: 'grid',
      name: 'Founders 2-Col Grid',
      parentId: 'cont_about_founders',
      children: ['col1_founders', 'col2_founders'],
      content: {},
      styles: {
        display: 'grid',
        gridColumns: 'minmax(0, 500px) minmax(0, 1fr)',
        gap: '64px',
        alignItems: 'center',
      },
      responsiveStyles: {
        tablet: { gridColumns: '1fr', gap: '32px' },
        mobile: { gridColumns: '1fr', gap: '24px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    col1_founders: {
      id: 'col1_founders',
      type: 'container',
      name: 'Photo Column',
      parentId: 'grid_about_founders',
      children: ['img_founders'],
      content: {},
      styles: {},
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    img_founders: {
      id: 'img_founders',
      type: 'image',
      name: 'Founders Photo',
      parentId: 'col1_founders',
      children: [],
      content: {
        src: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/founders-anand-manish.webp',
        alt: 'Envint Co-Founders Anand Krishnamurthy and Manish R Jain',
        isDecorative: false,
      },
      styles: {
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
        width: '100%',
      },
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    col2_founders: {
      id: 'col2_founders',
      type: 'flex',
      name: 'Story Column',
      parentId: 'grid_about_founders',
      children: ['h2_founders', 'p1_founders', 'p2_founders'],
      content: {},
      styles: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      },
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    h2_founders: {
      id: 'h2_founders',
      type: 'heading',
      name: 'Story Headline',
      parentId: 'col2_founders',
      children: [],
      content: {
        text: 'How it all began',
        tag: 'h2',
      },
      styles: {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        margin: '0 0 8px 0',
        lineHeight: '1.2',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      responsiveStyles: {
        mobile: { fontSize: '28px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    p1_founders: {
      id: 'p1_founders',
      type: 'paragraph',
      name: 'Story Paragraph 1',
      parentId: 'col2_founders',
      children: [],
      content: {
        html: '<p>A deep conviction to create an impact in the environment sector, steadfast encouragement from family &amp; friends and a few coffee shop meetings was all it took Anand and Manish to start Envint in June 2018. They derive their inspiration from India’s innate wisdom on sustainable living, that is in harmony with nature and its creations.</p>',
      },
      styles: {
        fontSize: '18px',
        lineHeight: '30px',
        textColor: '#393939',
        margin: '0',
      },
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    p2_founders: {
      id: 'p2_founders',
      type: 'paragraph',
      name: 'Story Paragraph 2',
      parentId: 'col2_founders',
      children: [],
      content: {
        html: '<p>Envint is a portmanteau of ‘environment’ and ‘intelligence’ and an anagram of ‘invent’, reflecting a new approach to business. Initially conceived to provide intelligence for the environment sector, Envint has broadened its ambit to include the wider sustainability domain.</p>',
      },
      styles: {
        fontSize: '18px',
        lineHeight: '30px',
        textColor: '#393939',
        margin: '0',
      },
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },

    // ─── 4. Journey Timeline ──────────────────────────────────────────────────
    sec_about_journey: {
      id: 'sec_about_journey',
      type: 'section',
      name: 'Our Journey',
      parentId: null,
      children: ['cont_about_journey'],
      content: {},
      styles: {
        backgroundColor: '#ffffff',
        paddingTop: '80px',
        paddingBottom: '100px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      responsiveStyles: {
        tablet: { paddingTop: '60px', paddingBottom: '70px' },
        mobile: { paddingTop: '48px', paddingBottom: '60px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    cont_about_journey: {
      id: 'cont_about_journey',
      type: 'container',
      name: 'Journey Wrapper',
      parentId: 'sec_about_journey',
      children: ['h2_journey'],
      content: {},
      styles: {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    h2_journey: {
      id: 'h2_journey',
      type: 'heading',
      name: 'Journey Title',
      parentId: 'cont_about_journey',
      children: [],
      content: {
        text: 'Our Journey',
        tag: 'h2',
      },
      styles: {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        textAlign: 'center',
        margin: '0 0 48px 0',
        lineHeight: '1.2',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      responsiveStyles: {
        mobile: { fontSize: '28px', marginBottom: '32px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },

    // ─── 5. Leadership Team ───────────────────────────────────────────────────
    sec_about_team: {
      id: 'sec_about_team',
      type: 'section',
      name: 'Leadership Team',
      parentId: null,
      children: ['cont_about_team'],
      content: {},
      styles: {
        backgroundColor: '#F9FAFB',
        paddingTop: '90px',
        paddingBottom: '110px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      responsiveStyles: {
        tablet: { paddingTop: '60px', paddingBottom: '70px' },
        mobile: { paddingTop: '48px', paddingBottom: '60px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    cont_about_team: {
      id: 'cont_about_team',
      type: 'container',
      name: 'Team Wrapper',
      parentId: 'sec_about_team',
      children: ['h2_team', 'p_team', 'grid_team_members'],
      content: {},
      styles: {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    h2_team: {
      id: 'h2_team',
      type: 'heading',
      name: 'Team Headline',
      parentId: 'cont_about_team',
      children: [],
      content: {
        text: 'A team you’ll be proud to call your own',
        tag: 'h2',
      },
      styles: {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        textAlign: 'center',
        margin: '0 0 16px 0',
        lineHeight: '1.2',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      responsiveStyles: {
        mobile: { fontSize: '28px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    p_team: {
      id: 'p_team',
      type: 'paragraph',
      name: 'Team Subtitle',
      parentId: 'cont_about_team',
      children: [],
      content: {
        html: '<p>Our team is based across multiple locations in India, bringing together expertise in ESG, climate analytics, technology, and responsible investment.</p>',
      },
      styles: {
        fontSize: '18px',
        lineHeight: '1.6',
        textColor: '#4B5563',
        textAlign: 'center',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '56px',
      },
      responsiveStyles: {
        mobile: { fontSize: '16px', marginBottom: '32px' },
      },
      visibility: { desktop: true, tablet: true, mobile: true },
    },
    grid_team_members: {
      id: 'grid_team_members',
      type: 'team-grid',
      name: 'Team Cards Grid (15 members)',
      parentId: 'cont_about_team',
      children: [],
      content: {},
      styles: {
        width: '100%',
      },
      responsiveStyles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
    },
  };

  return {
    version: 2,
    rootIds,
    nodes,
  };
}

/**
 * Generate a blank starter Schema v2 tree for any new or converted page
 */
export function createStarterPageTree(title = 'Page Headline'): PageBlockTree {
  const secId = generateNodeId('section');
  const contId = generateNodeId('container');
  const hId = generateNodeId('heading');
  const pId = generateNodeId('paragraph');

  return {
    version: 2,
    rootIds: [secId],
    nodes: {
      [secId]: {
        id: secId,
        type: 'section',
        name: 'Main Section',
        parentId: null,
        children: [contId],
        content: {},
        styles: {
          paddingTop: '80px',
          paddingBottom: '80px',
          paddingLeft: '24px',
          paddingRight: '24px',
          backgroundColor: '#FFFFFF',
        },
        responsiveStyles: {
          mobile: { paddingTop: '40px', paddingBottom: '40px' },
        },
        visibility: { desktop: true, tablet: true, mobile: true },
      },
      [contId]: {
        id: contId,
        type: 'container',
        name: 'Container',
        parentId: secId,
        children: [hId, pId],
        content: {},
        styles: {
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
        },
        responsiveStyles: {},
        visibility: { desktop: true, tablet: true, mobile: true },
      },
      [hId]: {
        id: hId,
        type: 'heading',
        name: 'Headline',
        parentId: contId,
        children: [],
        content: {
          text: title,
          tag: 'h1',
        },
        styles: {
          fontSize: '56px',
          fontWeight: 400,
          textColor: '#004E35',
          lineHeight: '1.15',
          margin: '0 0 24px 0',
          fontFamily: 'Neue Montreal, sans-serif',
        },
        responsiveStyles: {
          mobile: { fontSize: '36px' },
        },
        visibility: { desktop: true, tablet: true, mobile: true },
      },
      [pId]: {
        id: pId,
        type: 'paragraph',
        name: 'Lead Description',
        parentId: contId,
        children: [],
        content: {
          html: '<p>Start designing your dynamic page with the Visual Studio Builder. Drag and drop elements from the left palette to construct rich layouts.</p>',
        },
        styles: {
          fontSize: '20px',
          lineHeight: '1.6',
          textColor: '#4B5563',
          maxWidth: '800px',
          margin: '0 0 32px 0',
        },
        responsiveStyles: {},
        visibility: { desktop: true, tablet: true, mobile: true },
      },
    },
  };
}


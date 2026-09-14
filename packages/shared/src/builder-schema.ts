import { z } from 'zod';
import {
  ContentBindingSchema,
  DynamicQueryConfigSchema,
} from './content-bindings';

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
  'social-share',
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
      'social-share',
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
      'social-share',
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
  'social-share': { allowedChildren: [], isLeaf: true },
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
  gridTemplateColumns: z.string().optional(),
  gridRows: z.string().optional(),
  gridTemplateRows: z.string().optional(),
  aspectRatio: z.string().optional(),

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
  // Side-specific borders (e.g. stat columns use only a left border)
  borderLeftWidth: z.string().optional(),
  borderLeftStyle: z.enum(['none', 'solid', 'dashed', 'dotted']).optional(),
  borderLeftColor: z.string().optional(),
  borderRightWidth: z.string().optional(),
  borderRightStyle: z.enum(['none', 'solid', 'dashed', 'dotted']).optional(),
  borderRightColor: z.string().optional(),
  borderTopWidth: z.string().optional(),
  borderTopStyle: z.enum(['none', 'solid', 'dashed', 'dotted']).optional(),
  borderTopColor: z.string().optional(),
  borderBottomWidth: z.string().optional(),
  borderBottomStyle: z.enum(['none', 'solid', 'dashed', 'dotted']).optional(),
  borderBottomColor: z.string().optional(),

  // Minimal positioning (decorative watermarks, offset badges)
  position: z.enum(['static', 'relative', 'absolute']).optional(),
  top: z.string().optional(),
  right: z.string().optional(),
  bottom: z.string().optional(),
  left: z.string().optional(),

  // Effects & Shadows
  textShadow: z.string().optional(),
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
  query: DynamicQueryConfigSchema.optional(),
});

// ============================================================================
// 5. The Core Node Model (`BuilderNode`)
// ============================================================================

const BINDABLE_FIELDS: Partial<Record<ElementType, ReadonlySet<string>>> = {
  heading: new Set(['text']),
  paragraph: new Set(['html']),
  'rich-text': new Set(['html']),
  image: new Set(['src', 'alt', 'caption']),
  button: new Set(['label', 'url']),
  link: new Set(['label', 'url']),
  badge: new Set(['text']),
  quote: new Set(['quote', 'attribution', 'role']),
  counter: new Set(['value', 'label', 'prefix', 'suffix']),
  'social-share': new Set(['title', 'url']),
};

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
}).superRefine((node, context) => {
  const bindings = node.content.bindings;
  if (bindings !== undefined) {
    if (!bindings || typeof bindings !== 'object' || Array.isArray(bindings)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['content', 'bindings'],
        message: 'Bindings must be an object keyed by an editable content field',
      });
    } else {
      const allowedFields = BINDABLE_FIELDS[node.type];
      for (const [field, binding] of Object.entries(bindings)) {
        if (!allowedFields?.has(field)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['content', 'bindings', field],
            message: `${field} cannot be bound on a ${node.type} element`,
          });
          continue;
        }
        const result = ContentBindingSchema.safeParse(binding);
        if (!result.success) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['content', 'bindings', field],
            message: result.error.issues.map((issue) => issue.message).join('; '),
          });
        }
      }
    }
  }

  if (['insights-grid', 'impact-grid', 'team-grid', 'service-cards'].includes(node.type)) {
    const query = node.content.query;
    if (query !== undefined) {
      const result = DynamicQueryConfigSchema.safeParse(query);
      if (!result.success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['content', 'query'],
          message: result.error.issues.map((issue) => issue.message).join('; '),
        });
      }
    }
  }
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

    case 'social-share':
      name = 'Social Share Bar';
      content = {
        channels: [
          { id: 'email', name: 'Email', enabled: true, color: '#ea4335', url: '' },
          { id: 'linkedin', name: 'LinkedIn', enabled: true, color: '#0a66c2', url: '' },
          { id: 'twitter', name: 'X / Twitter', enabled: true, color: '#000000', url: '' },
          { id: 'facebook', name: 'Facebook', enabled: true, color: '#1877f2', url: '' },
        ],
        buttonSize: 32,
        borderRadius: 4,
        gap: 10,
        alignment: 'left',
      };
      styles = {
        width: '100%',
        display: 'flex',
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

export { createAboutPageTree } from './page-trees/about';

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

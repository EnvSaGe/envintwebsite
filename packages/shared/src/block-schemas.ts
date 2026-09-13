/**
 * packages/shared/src/block-schemas.ts
 *
 * Zod schemas for every CMS content block type used in DynamicPageRenderer
 * and LiveCanvasRenderer. All blocks follow the same envelope shape:
 *   { id, name, type, enabled, props, layout? }
 *
 * CURRENT_BLOCK_SCHEMA_VERSION tracks the format version stored in the DB.
 * Increment it when any block's `props` shape changes in a breaking way.
 */

import { z } from 'zod';
import { DynamicQueryConfigSchema } from './content-bindings';

export const CURRENT_BLOCK_SCHEMA_VERSION = 1;

// ─── Shared ────────────────────────────────────────────────────────────────

const blockLayoutSchema = z.object({
  align: z.enum(['left', 'center', 'right']).optional(),
  vAlign: z.enum(['top', 'center', 'bottom']).optional(),
  width: z.enum(['narrow', 'standard', 'wide', 'full']).optional(),
  spacing: z.enum(['compact', 'normal', 'spacious']).optional(),
  bgColor: z.string().optional(),
  bgImage: z.string().optional(),
}).optional();

/** Common block envelope — every block starts here */
const blockBase = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  enabled: z.boolean().default(true),
  layout: blockLayoutSchema,
});

// ─── Block Types ──────────────────────────────────────────────────────────

/** Hero Banner — used on most landing pages */
export const heroBannerBlockSchema = blockBase.extend({
  type: z.literal('hero-banner'),
  props: z.object({
    badge: z.string().optional(),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    bgImage: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().optional(),
    ctaSecondaryLabel: z.string().optional(),
    ctaSecondaryUrl: z.string().optional(),
  }).passthrough(),
});

/** About Hero — dark-background hero with badge */
export const aboutHeroBlockSchema = blockBase.extend({
  type: z.literal('about-hero'),
  props: z.object({
    badge: z.string().optional(),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    bgImage: z.string().optional(),
  }).passthrough(),
});

/** Career Hero — full-height careers landing hero */
export const careerHeroBlockSchema = blockBase.extend({
  type: z.literal('career-hero'),
  props: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    bgImage: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().optional(),
  }).passthrough(),
});

/** Story Narrative — left-aligned narrative section */
export const storyNarrativeBlockSchema = blockBase.extend({
  type: z.literal('story-narrative'),
  props: z.object({
    tagline: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().optional(),
    paragraph1: z.string().optional(),
    paragraph2: z.string().optional(),
    paragraph3: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }).passthrough(),
});

/** Feature Cards — 3-column capability/service cards */
export const featureCardsBlockSchema = blockBase.extend({
  type: z.literal('feature-cards'),
  props: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    card1_title: z.string().optional(),
    card1_desc: z.string().optional(),
    card1_icon: z.string().optional(),
    card2_title: z.string().optional(),
    card2_desc: z.string().optional(),
    card2_icon: z.string().optional(),
    card3_title: z.string().optional(),
    card3_desc: z.string().optional(),
    card3_icon: z.string().optional(),
    card4_title: z.string().optional(),
    card4_desc: z.string().optional(),
    card4_icon: z.string().optional(),
    card5_title: z.string().optional(),
    card5_desc: z.string().optional(),
    card5_icon: z.string().optional(),
    card6_title: z.string().optional(),
    card6_desc: z.string().optional(),
    card6_icon: z.string().optional(),
  }).passthrough(),
});

/** CTA Banner — full-width call to action */
export const ctaBannerBlockSchema = blockBase.extend({
  type: z.literal('cta-banner'),
  props: z.object({
    headline: z.string().min(1),
    subtext: z.string().optional(),
    buttonLabel: z.string().optional(),
    buttonUrl: z.string().optional(),
    buttonSecondaryLabel: z.string().optional(),
    buttonSecondaryUrl: z.string().optional(),
    bgColor: z.string().optional(),
  }).passthrough(),
});

/** Stats Counter — animated statistics row */
export const statsCounterBlockSchema = blockBase.extend({
  type: z.literal('stats-counter'),
  props: z.object({
    title: z.string().optional(),
    stat1_num: z.string().optional(),
    stat1_label: z.string().optional(),
    stat2_num: z.string().optional(),
    stat2_label: z.string().optional(),
    stat3_num: z.string().optional(),
    stat3_label: z.string().optional(),
    stat4_num: z.string().optional(),
    stat4_label: z.string().optional(),
  }).passthrough(),
});

/** FAQ Accordion — expandable FAQ list */
export const faqAccordionBlockSchema = blockBase.extend({
  type: z.literal('faq-accordion'),
  props: z.object({
    title: z.string().optional(),
    q1: z.string().optional(),
    a1: z.string().optional(),
    q2: z.string().optional(),
    a2: z.string().optional(),
    q3: z.string().optional(),
    a3: z.string().optional(),
    q4: z.string().optional(),
    a4: z.string().optional(),
    q5: z.string().optional(),
    a5: z.string().optional(),
    q6: z.string().optional(),
    a6: z.string().optional(),
  }).passthrough(),
});

/** Rich Text — WYSIWYG / HTML content block */
export const richTextBlockSchema = blockBase.extend({
  type: z.literal('rich-text'),
  props: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
  }).passthrough(),
});

/** Image Banner — full-width image with optional caption */
export const imageBannerBlockSchema = blockBase.extend({
  type: z.literal('image-banner'),
  props: z.object({
    src: z.string().min(1),
    alt: z.string().optional(),
    caption: z.string().optional(),
    href: z.string().optional(),
  }).passthrough(),
});

/** Quote Block — pull quote with attribution */
export const quoteBlockSchema = blockBase.extend({
  type: z.literal('quote-block'),
  props: z.object({
    quote: z.string().min(1),
    attribution: z.string().optional(),
    role: z.string().optional(),
  }).passthrough(),
});

/** About Vision — mission/vision/belief section */
export const aboutVisionBlockSchema = blockBase.extend({
  type: z.literal('about-vision'),
  props: z.object({
    statement: z.string().optional(),
    belief: z.string().optional(),
    strategy: z.string().optional(),
  }).passthrough(),
});

/** About Founders — founding story with image */
export const aboutFoundersBlockSchema = blockBase.extend({
  type: z.literal('about-founders'),
  props: z.object({
    title: z.string().optional(),
    paragraph1: z.string().optional(),
    paragraph2: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }).passthrough(),
});

/** About Journey — milestones timeline carousel */
export const aboutJourneyBlockSchema = blockBase.extend({
  type: z.literal('about-journey'),
  props: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
  }).passthrough(),
});

/** About Team — leadership grid section */
export const aboutTeamBlockSchema = blockBase.extend({
  type: z.literal('about-team'),
  props: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
  }).passthrough(),
});

/** Insights Grid — dynamic articles grid */
export const insightsGridBlockSchema = blockBase.extend({
  type: z.literal('insights-grid'),
  props: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    filterCategory: z.string().optional(),
    limit: z.number().int().positive().optional(),
    query: DynamicQueryConfigSchema.optional(),
  }).passthrough(),
});

/** Impact Grid — dynamic case studies grid */
export const impactGridBlockSchema = blockBase.extend({
  type: z.literal('impact-grid'),
  props: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    limit: z.number().int().positive().optional(),
    query: DynamicQueryConfigSchema.optional(),
  }).passthrough(),
});

// ─── Union & Validation ──────────────────────────────────────────────────

/** Union of all known block schemas */
export const contentBlockSchema = z.discriminatedUnion('type', [
  heroBannerBlockSchema,
  aboutHeroBlockSchema,
  careerHeroBlockSchema,
  storyNarrativeBlockSchema,
  featureCardsBlockSchema,
  ctaBannerBlockSchema,
  statsCounterBlockSchema,
  faqAccordionBlockSchema,
  richTextBlockSchema,
  imageBannerBlockSchema,
  quoteBlockSchema,
  aboutVisionBlockSchema,
  aboutFoundersBlockSchema,
  aboutJourneyBlockSchema,
  aboutTeamBlockSchema,
  insightsGridBlockSchema,
  impactGridBlockSchema,
]);

export type ContentBlock = z.infer<typeof contentBlockSchema>;

/** Array schema for page.contentBlocks */
export const contentBlocksArraySchema = z.array(contentBlockSchema);

/**
 * Validates an array of content blocks.
 * Throws ZodError if any block is invalid.
 * Returns typed ContentBlock[] on success.
 */
export function validateBlocks(blocks: unknown): ContentBlock[] {
  return contentBlocksArraySchema.parse(blocks);
}

/**
 * Safe version — returns { success, data, errors }.
 * Use this when you want to handle errors without throwing.
 */
export function safeValidateBlocks(blocks: unknown): {
  success: boolean;
  data?: ContentBlock[];
  errors?: z.ZodError;
} {
  const result = contentBlocksArraySchema.safeParse(blocks);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

import { z } from 'zod';

export const BindingSourceSchema = z.enum(['record', 'site', 'route', 'global']);
export type BindingSource = z.infer<typeof BindingSourceSchema>;

export const BindingFormatSchema = z.enum(['text', 'html', 'date', 'url', 'image']);
export type BindingFormat = z.infer<typeof BindingFormatSchema>;

export const ContentBindingSchema = z.object({
  source: BindingSourceSchema,
  path: z.string().min(1),
  fallback: z.unknown().optional(),
  format: BindingFormatSchema.optional(),
});
export type ContentBinding = z.infer<typeof ContentBindingSchema>;

export const TemplateKindSchema = z.enum([
  'article',
  'impact',
  'team-member',
  'taxonomy',
  'author',
  'global-header',
  'global-footer',
  'global-cta',
]);
export type TemplateKind = z.infer<typeof TemplateKindSchema>;

export const DynamicFilterSchema = z.object({
  field: z.string().min(1),
  operator: z.enum(['eq', 'contains', 'in']),
  value: z.union([z.string(), z.array(z.string())]),
});
export type DynamicFilter = z.infer<typeof DynamicFilterSchema>;

export const DynamicQueryConfigSchema = z.object({
  source: z.enum(['insights', 'impacts', 'team', 'services']),
  filters: z.array(DynamicFilterSchema).default([]),
  sort: z.string().min(1).default('orderIndex:asc'),
  limit: z.number().int().min(1).max(100).default(12),
  pagination: z.enum(['none', 'pages', 'load-more']).default('none'),
});
export type DynamicQueryConfig = z.infer<typeof DynamicQueryConfigSchema>;

export interface BindingContext {
  record?: unknown;
  site?: unknown;
  route?: unknown;
  global?: unknown;
}

const FORBIDDEN_PATH_SEGMENTS = new Set(['__proto__', 'prototype', 'constructor']);

export function resolveBinding(bindingInput: ContentBinding, context: BindingContext): unknown {
  const binding = ContentBindingSchema.parse(bindingInput);
  const segments = binding.path.split('.').filter(Boolean);
  if (segments.length === 0 || segments.some((segment) => FORBIDDEN_PATH_SEGMENTS.has(segment))) {
    return binding.fallback;
  }

  let value: unknown = context[binding.source];
  for (const segment of segments) {
    if (value === null || typeof value !== 'object') return binding.fallback;
    if (!Object.prototype.hasOwnProperty.call(value, segment)) return binding.fallback;
    value = (value as Record<string, unknown>)[segment];
  }

  return value ?? binding.fallback;
}

export function validateDynamicQuery(input: unknown): DynamicQueryConfig {
  return DynamicQueryConfigSchema.parse(input);
}

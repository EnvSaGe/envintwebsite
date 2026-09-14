import type { PageBlockTree } from './builder-schema';
import { DynamicQueryConfigSchema, type DynamicFilter } from './content-bindings';

export interface StudioDynamicRecord {
  slug: string;
  title: string;
  excerpt?: string | null;
  summary?: string | null;
  cardExcerpt?: string | null;
  seoDescription?: string | null;
  coverImageUrl?: string | null;
  heroImage?: string | null;
  publishedAt?: string | null;
  categories?: string[];
  service?: { name?: string | null; slug?: string | null } | null;
  sector?: { name?: string | null; slug?: string | null } | null;
  theme?: { name?: string | null; slug?: string | null } | null;
}

export type StudioDynamicModules = Record<string, StudioDynamicRecord[]>;

function normalizedCategory(value: unknown): string {
  return String(value ?? '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('en-US');
}

function valueAtPath(record: StudioDynamicRecord, field: string): unknown {
  const segments = field.split('.');
  if (segments.some((segment) => ['__proto__', 'prototype', 'constructor'].includes(segment))) return undefined;
  let value: unknown = record;
  for (const segment of segments) {
    if (!value || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, segment)) return undefined;
    value = (value as Record<string, unknown>)[segment];
  }
  return value;
}

function matchesFilter(record: StudioDynamicRecord, filter: DynamicFilter): boolean {
  const actual = valueAtPath(record, filter.field);
  const expected = Array.isArray(filter.value) ? filter.value : [filter.value];
  const actualValues = (Array.isArray(actual) ? actual : [actual]).map(normalizedCategory);
  const expectedValues = expected.map(normalizedCategory);
  if (filter.operator === 'contains') {
    return actualValues.some((candidate) => expectedValues.some((value) => candidate.includes(value)));
  }
  if (filter.operator === 'in') {
    return actualValues.some((candidate) => expectedValues.includes(candidate));
  }
  return expectedValues.includes(normalizedCategory(actual));
}

function comparable(value: unknown): string | number {
  if (typeof value === 'number') return value;
  const text = String(value ?? '');
  const timestamp = /^\d{4}-\d{2}-\d{2}/.test(text) ? Date.parse(text) : Number.NaN;
  return Number.isNaN(timestamp) ? text.toLocaleLowerCase('en-US') : timestamp;
}

export function selectDynamicPreviewRecords(
  records: StudioDynamicRecord[],
  content: Record<string, unknown> = {},
): StudioDynamicRecord[] {
  const queryResult = DynamicQueryConfigSchema.safeParse(content.query);
  if (queryResult.success) {
    const query = queryResult.data;
    const [sortField, direction = 'asc'] = query.sort.split(':');
    const multiplier = direction === 'desc' ? -1 : 1;
    return records
      .filter((record) => query.filters.every((filter) => matchesFilter(record, filter)))
      .sort((left, right) => {
        const leftValue = comparable(valueAtPath(left, sortField));
        const rightValue = comparable(valueAtPath(right, sortField));
        if (leftValue < rightValue) return -1 * multiplier;
        if (leftValue > rightValue) return 1 * multiplier;
        return left.slug.localeCompare(right.slug);
      })
      .slice(0, query.limit);
  }
  const category = normalizedCategory(content.category);
  const filtered = category
    ? records.filter((record) =>
        (record.categories || []).some((candidate) => {
          const normalized = normalizedCategory(candidate);
          return normalized.includes(category) || category.includes(normalized);
        }),
      )
    : records;
  const configuredLimit = Number(content.limit);
  const limit = Number.isFinite(configuredLimit) && configuredLimit > 0
    ? Math.floor(configuredLimit)
    : 50;
  return filtered.slice(0, limit);
}

export function buildStudioDynamicModules(
  tree: PageBlockTree,
  sources: { insights?: StudioDynamicRecord[]; impacts?: StudioDynamicRecord[] },
): StudioDynamicModules {
  const modules: StudioDynamicModules = {};
  for (const node of Object.values(tree.nodes)) {
    if (node.type === 'insights-grid') {
      modules[node.id] = sources.insights || [];
    } else if (node.type === 'impact-grid') {
      modules[node.id] = sources.impacts || [];
    }
  }
  return modules;
}

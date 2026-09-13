import {
  validateDynamicQuery,
  type DynamicFilter,
  type DynamicQueryConfig,
} from '@envint/shared';

export type DynamicRecord = Record<string, unknown> & { slug?: string };
export type DynamicSourceLoaders = Partial<
  Record<DynamicQueryConfig['source'], () => Promise<DynamicRecord[]>>
>;

const ALLOWED_FILTER_FIELDS: Record<DynamicQueryConfig['source'], ReadonlySet<string>> = {
  insights: new Set(['slug', 'categories', 'tags', 'author.slug']),
  impacts: new Set(['slug', 'categories', 'service.slug', 'sector.slug', 'theme.slug']),
  team: new Set(['slug', 'isLeadership', 'roleTitle']),
  services: new Set(['slug', 'title']),
};
const ALLOWED_SORT_FIELDS = new Set(['publishedAt', 'orderIndex', 'title', 'name', 'slug']);
const FORBIDDEN_SEGMENTS = new Set(['__proto__', 'prototype', 'constructor']);

function valueAtPath(record: DynamicRecord, path: string): unknown {
  const segments = path.split('.');
  if (segments.some((segment) => FORBIDDEN_SEGMENTS.has(segment))) return undefined;
  let value: unknown = record;
  for (const segment of segments) {
    if (!value || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, segment)) {
      return undefined;
    }
    value = (value as Record<string, unknown>)[segment];
  }
  return value;
}

function comparable(value: unknown): string | number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const timestamp = Date.parse(value);
    if (/^\d{4}-\d{2}-\d{2}/.test(value) && !Number.isNaN(timestamp)) return timestamp;
    return value.toLocaleLowerCase('en-US');
  }
  return String(value ?? '').toLocaleLowerCase('en-US');
}

function includesValue(actual: unknown, expected: string): boolean {
  const needle = expected.toLocaleLowerCase('en-US');
  if (Array.isArray(actual)) {
    return actual.some((value) => String(value).toLocaleLowerCase('en-US').includes(needle));
  }
  return String(actual ?? '').toLocaleLowerCase('en-US').includes(needle);
}

function matchesFilter(record: DynamicRecord, filter: DynamicFilter): boolean {
  const actual = valueAtPath(record, filter.field);
  const expectedValues = Array.isArray(filter.value) ? filter.value : [filter.value];
  if (filter.operator === 'contains') return expectedValues.some((value) => includesValue(actual, value));
  if (filter.operator === 'in') {
    const actualValues = Array.isArray(actual) ? actual : [actual];
    return actualValues.some((value) =>
      expectedValues.some((expected) => String(value).toLocaleLowerCase('en-US') === expected.toLocaleLowerCase('en-US')),
    );
  }
  return expectedValues.some(
    (expected) => String(actual ?? '').toLocaleLowerCase('en-US') === expected.toLocaleLowerCase('en-US'),
  );
}

async function defaultLoader(source: DynamicQueryConfig['source']): Promise<DynamicRecord[]> {
  if (source === 'insights') {
    const { getInsights } = await import('./insights');
    return getInsights();
  }
  if (source === 'impacts') {
    const { getImpacts } = await import('./impacts');
    return getImpacts();
  }
  if (source === 'team') {
    const { getTeamMembers } = await import('./team');
    return getTeamMembers() as Promise<DynamicRecord[]>;
  }
  const { getServices } = await import('./services');
  return getServices() as Promise<DynamicRecord[]>;
}

export async function queryDynamicSource(
  input: DynamicQueryConfig,
  loaders: DynamicSourceLoaders = {},
): Promise<DynamicRecord[]> {
  const config = validateDynamicQuery(input);
  for (const filter of config.filters) {
    if (!ALLOWED_FILTER_FIELDS[config.source].has(filter.field)) {
      throw new Error(`${filter.field} cannot filter ${config.source}`);
    }
  }

  const [sortField, direction = 'asc'] = config.sort.split(':');
  if (!ALLOWED_SORT_FIELDS.has(sortField) || !['asc', 'desc'].includes(direction)) {
    throw new Error(`${config.sort} is not an allowed sort`);
  }

  const loader = loaders[config.source];
  const records = loader ? await loader() : await defaultLoader(config.source);
  const filtered = records.filter((record) => config.filters.every((filter) => matchesFilter(record, filter)));
  const multiplier = direction === 'desc' ? -1 : 1;

  return filtered
    .sort((left, right) => {
      const leftValue = comparable(valueAtPath(left, sortField));
      const rightValue = comparable(valueAtPath(right, sortField));
      if (leftValue < rightValue) return -1 * multiplier;
      if (leftValue > rightValue) return 1 * multiplier;
      return String(left.slug ?? '').localeCompare(String(right.slug ?? ''));
    })
    .slice(0, config.limit);
}

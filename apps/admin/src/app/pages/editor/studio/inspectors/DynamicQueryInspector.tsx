'use client';

import type { BuilderNode, DynamicQueryConfig } from '@envint/shared';

const SOURCE_BY_NODE: Partial<Record<BuilderNode['type'], DynamicQueryConfig['source']>> = {
  'insights-grid': 'insights',
  'impact-grid': 'impacts',
  'team-grid': 'team',
  'service-cards': 'services',
};

const FILTER_FIELDS: Record<DynamicQueryConfig['source'], Array<{ label: string; value: string }>> = {
  insights: [
    { label: 'Category', value: 'categories' },
    { label: 'Tag', value: 'tags' },
    { label: 'Author', value: 'author.slug' },
  ],
  impacts: [
    { label: 'Service', value: 'service.slug' },
    { label: 'Sector', value: 'sector.slug' },
    { label: 'Theme', value: 'theme.slug' },
  ],
  team: [
    { label: 'Leadership', value: 'isLeadership' },
    { label: 'Role', value: 'roleTitle' },
  ],
  services: [{ label: 'Title', value: 'title' }],
};

export function DynamicQueryInspector({
  node,
  onChange,
  onUpdateDisplay,
}: {
  node: BuilderNode;
  onChange: (query: DynamicQueryConfig) => void;
  onUpdateDisplay: (content: Record<string, unknown>) => void;
}) {
  const defaultSource = SOURCE_BY_NODE[node.type];
  if (!defaultSource) return null;
  const query = (node.content.query as DynamicQueryConfig | undefined) ?? {
    source: defaultSource,
    filters: [],
    sort: defaultSource === 'insights' ? 'publishedAt:desc' : 'orderIndex:asc',
    limit: Number(node.content.limit ?? 6),
    pagination: 'none',
  };
  const firstFilter = query.filters[0];

  return (
    <section className="mb-4 rounded-lg border border-sky-400/20 bg-sky-400/5 p-3">
      <p className="text-[11px] font-semibold text-sky-200">Collection content</p>
      <p className="mb-3 text-[10px] text-slate-500">Choose which CMS records appear. No code or JSON needed.</p>
      <div className="space-y-2">
        <label className="block text-[10px] font-medium text-slate-400">
          Content type
          <select value={query.source} onChange={(event) => {
            const source = event.target.value as DynamicQueryConfig['source'];
            onChange({ ...query, source, filters: [] });
          }} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100">
            <option value="insights">Insights & articles</option>
            <option value="impacts">Impact case studies</option>
            <option value="team">Team members</option>
            <option value="services">Services</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-[10px] font-medium text-slate-400">
            Filter by
            <select value={firstFilter?.field ?? ''} onChange={(event) => onChange({
              ...query,
              filters: event.target.value ? [{ field: event.target.value, operator: 'contains', value: firstFilter?.value ?? '' }] : [],
            })} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100">
              <option value="">No filter</option>
              {FILTER_FIELDS[query.source].map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label className="text-[10px] font-medium text-slate-400">
            Match value
            <input value={typeof firstFilter?.value === 'string' ? firstFilter.value : ''} disabled={!firstFilter} onChange={(event) => onChange({ ...query, filters: [{ ...firstFilter!, value: event.target.value }] })} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 disabled:opacity-40" />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-[10px] font-medium text-slate-400">
            Order
            <select value={query.sort} onChange={(event) => onChange({ ...query, sort: event.target.value })} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100">
              <option value="publishedAt:desc">Newest first</option>
              <option value="publishedAt:asc">Oldest first</option>
              <option value="orderIndex:asc">Manual order</option>
              <option value="title:asc">Title A–Z</option>
            </select>
          </label>
          <label className="text-[10px] font-medium text-slate-400">
            Items shown
            <input type="number" min={1} max={100} value={query.limit} onChange={(event) => onChange({ ...query, limit: Math.max(1, Math.min(100, Number(event.target.value) || 1)) })} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100" />
          </label>
        </div>
        <label className="block text-[10px] font-medium text-slate-400">
          Loading style
          <select value={query.pagination} onChange={(event) => onChange({ ...query, pagination: event.target.value as DynamicQueryConfig['pagination'] })} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100">
            <option value="none">Show selected items</option>
            <option value="pages">Page numbers</option>
            <option value="load-more">Load more button</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-slate-300">
          <label><input type="checkbox" checked={node.content.showDate !== false} onChange={(event) => onUpdateDisplay({ showDate: event.target.checked })} className="mr-1" />Show date</label>
          <label><input type="checkbox" checked={Boolean(node.content.showReadMore)} onChange={(event) => onUpdateDisplay({ showReadMore: event.target.checked })} className="mr-1" />Read more</label>
          <label><input type="checkbox" checked={Boolean(node.content.cardBorder)} onChange={(event) => onUpdateDisplay({ cardBorder: event.target.checked })} className="mr-1" />Card border</label>
        </div>
      </div>
    </section>
  );
}

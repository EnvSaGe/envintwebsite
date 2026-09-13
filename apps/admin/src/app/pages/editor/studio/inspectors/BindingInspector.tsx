'use client';

import React from 'react';
import type { BuilderNode, ContentBinding } from '@envint/shared';

const FIELDS_BY_TYPE: Partial<Record<BuilderNode['type'], string[]>> = {
  heading: ['text'],
  paragraph: ['html'],
  'rich-text': ['html'],
  image: ['src', 'alt', 'caption'],
  button: ['label', 'url'],
  link: ['label', 'url'],
  badge: ['text'],
  quote: ['quote', 'attribution', 'role'],
  counter: ['value', 'label', 'prefix', 'suffix'],
};

const PATHS_BY_SOURCE: Record<ContentBinding['source'], Array<{ label: string; value: string }>> = {
  record: [
    { label: 'Title / name', value: 'title' },
    { label: 'Name', value: 'name' },
    { label: 'Summary', value: 'summary' },
    { label: 'Excerpt', value: 'excerpt' },
    { label: 'Main content', value: 'contentHtml' },
    { label: 'Cover image', value: 'coverImageUrl' },
    { label: 'Profile image', value: 'avatarUrl' },
    { label: 'Role title', value: 'roleTitle' },
    { label: 'Published date', value: 'publishedAt' },
  ],
  site: [
    { label: 'Site name', value: 'name' },
    { label: 'Tagline', value: 'tagline' },
    { label: 'Contact email', value: 'contact.email' },
  ],
  route: [
    { label: 'Current path', value: 'pathname' },
    { label: 'Route title', value: 'title' },
  ],
  global: [
    { label: 'Heading', value: 'heading' },
    { label: 'Body', value: 'body' },
    { label: 'Button label', value: 'buttonLabel' },
    { label: 'Button link', value: 'buttonUrl' },
  ],
};

interface BindingInspectorProps {
  node: BuilderNode;
  onChange: (field: string, binding: ContentBinding | null) => void;
}

export function BindingInspector({ node, onChange }: BindingInspectorProps) {
  const fields = FIELDS_BY_TYPE[node.type] ?? [];
  const [field, setField] = React.useState(fields[0] ?? '');
  const current = field ? node.content.bindings?.[field] as ContentBinding | undefined : undefined;

  React.useEffect(() => {
    if (!fields.includes(field)) setField(fields[0] ?? '');
  }, [field, fields]);

  if (fields.length === 0) return null;

  const source = current?.source ?? 'record';
  const options = PATHS_BY_SOURCE[source];
  const binding: ContentBinding = current ?? {
    source,
    path: options[0]?.value ?? 'title',
    fallback: node.content[field] ?? '',
  };

  return (
    <section className="mb-4 rounded-lg border border-violet-400/20 bg-violet-400/5 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-violet-200">Dynamic content binding</p>
          <p className="text-[10px] text-slate-500">Connect this field to the current record or site data.</p>
        </div>
        {current && (
          <button type="button" onClick={() => onChange(field, null)} className="text-[10px] text-rose-300 hover:text-rose-200">
            Remove
          </button>
        )}
      </div>
      <label className="mb-2 block text-[10px] font-medium text-slate-400">
        Editable field
        <select value={field} onChange={(event) => setField(event.target.value)} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100">
          {fields.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[10px] font-medium text-slate-400">
          Source
          <select
            value={source}
            onChange={(event) => {
              const nextSource = event.target.value as ContentBinding['source'];
              onChange(field, { ...binding, source: nextSource, path: PATHS_BY_SOURCE[nextSource][0].value });
            }}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100"
          >
            <option value="record">Current record</option>
            <option value="site">Site settings</option>
            <option value="route">Current route</option>
            <option value="global">Global block</option>
          </select>
        </label>
        <label className="text-[10px] font-medium text-slate-400">
          Value
          <select
            value={binding.path}
            onChange={(event) => onChange(field, { ...binding, path: event.target.value })}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100"
          >
            {options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
      </div>
      {!current && (
        <button type="button" onClick={() => onChange(field, binding)} className="mt-2 w-full rounded-md bg-violet-500/20 px-2 py-1.5 text-[11px] font-semibold text-violet-200 hover:bg-violet-500/30">
          Bind field
        </button>
      )}
      {current && <p className="mt-2 text-[10px] text-violet-300">Bound to {current.source}.{current.path}</p>}
    </section>
  );
}

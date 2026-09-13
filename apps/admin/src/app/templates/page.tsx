'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers3, Plus, Trash2 } from 'lucide-react';
import type { TemplateKind } from '@envint/shared';
import { Sidebar } from '@/components/Sidebar';
import {
  createTemplateAction,
  deleteTemplateAction,
  fetchTemplatesListAction,
} from './actions';

type TemplateListItem = Awaited<ReturnType<typeof fetchTemplatesListAction>>[number];

const TEMPLATE_KINDS: Array<{ value: TemplateKind; label: string }> = [
  { value: 'article', label: 'Article' },
  { value: 'impact', label: 'Impact case study' },
  { value: 'team-member', label: 'Team member' },
  { value: 'taxonomy', label: 'Taxonomy archive' },
  { value: 'author', label: 'Author archive' },
  { value: 'global-header', label: 'Global header' },
  { value: 'global-footer', label: 'Global footer' },
  { value: 'global-cta', label: 'Global call to action' },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', kind: 'article' as TemplateKind, description: '' });

  const load = async () => {
    setLoading(true);
    try {
      setTemplates(await fetchTemplatesListAction());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load templates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await createTemplateAction(form);
      router.push(`/templates/${encodeURIComponent(result.slug)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create template.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentPath="/templates" />
      <main className="w-full max-w-6xl flex-1 p-10">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shared page templates</h1>
            <p className="mt-2 text-sm text-slate-500">Edit one visual layout for every article, impact story, team profile, archive, or global section that uses it.</p>
          </div>
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
            <Plus size={16} /> New template
          </button>
        </div>

        {error && <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-8 text-sm text-slate-500">Loading templates…</p>
          ) : templates.length === 0 ? (
            <div className="p-10 text-center">
              <Layers3 className="mx-auto text-slate-300" size={32} />
              <p className="mt-3 font-medium text-slate-700">No shared templates yet</p>
              <p className="mt-1 text-sm text-slate-500">Create the first template or run the live-content migration.</p>
            </div>
          ) : (
            templates.map((template) => (
              <div key={template.slug} className="flex items-center justify-between gap-4 border-b border-slate-100 p-4 last:border-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/templates/${encodeURIComponent(template.slug)}`} className="font-semibold text-slate-900 hover:text-emerald-700">{template.name}</Link>
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">{template.kind}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${template.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{template.status.toLowerCase()}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">{template.dependencyCount} affected public routes · {template.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/templates/${encodeURIComponent(template.slug)}`} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Open visual editor</Link>
                  <button type="button" aria-label={`Delete ${template.name}`} onClick={async () => {
                    if (!window.confirm(`Delete template “${template.name}”?`)) return;
                    try { await deleteTemplateAction(template.slug); await load(); }
                    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not delete template.'); }
                  }} className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:border-rose-200 hover:text-rose-600"><Trash2 size={15} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
            <form onSubmit={create} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-lg font-bold text-slate-900">Create shared template</h2>
              <p className="mt-1 text-sm text-slate-500">Editors will design it visually after creation.</p>
              <div className="mt-5 space-y-4">
                <label className="block text-sm font-medium text-slate-700">Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value, slug: form.slug || event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                <label className="block text-sm font-medium text-slate-700">Slug<input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono" /></label>
                <label className="block text-sm font-medium text-slate-700">Template type<select value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value as TemplateKind })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">{TEMPLATE_KINDS.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}</select></label>
                <label className="block text-sm font-medium text-slate-700">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
                <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Create and edit</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

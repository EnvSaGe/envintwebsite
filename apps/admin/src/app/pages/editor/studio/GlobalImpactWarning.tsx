'use client';

export function GlobalImpactWarning({
  label,
  affectedRouteCount,
  onCancel,
  onConfirm,
  isPublishing,
}: {
  label: string;
  affectedRouteCount: number;
  onCancel: () => void;
  onConfirm: () => void;
  isPublishing: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="global-impact-title">
      <div className="w-full max-w-md rounded-2xl border border-amber-400/30 bg-[#0D1220] p-5 shadow-2xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">Shared template</p>
        <h2 id="global-impact-title" className="text-lg font-semibold text-white">Publish changes to {label}?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          This layout is shared by <strong className="text-white">{affectedRouteCount} public route{affectedRouteCount === 1 ? '' : 's'}</strong>. Publishing updates all of them immediately after their targeted caches refresh.
        </p>
        {affectedRouteCount > 1 && <p className="mt-2 text-xs text-amber-200">A super administrator is required for this global-impact publish.</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={isPublishing} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={isPublishing} className="rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-60">
            {isPublishing ? 'Publishing…' : `Publish ${affectedRouteCount} route${affectedRouteCount === 1 ? '' : 's'}`}
          </button>
        </div>
      </div>
    </div>
  );
}

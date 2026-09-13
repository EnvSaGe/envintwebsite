'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CalendarClock, Loader2, X } from 'lucide-react';

export interface SchedulePublishModalProps {
  open: boolean;
  slug: string;
  /** Existing schedule (ISO string) when re-scheduling, null for fresh */
  existingIso?: string | null;
  isScheduling: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (isoLocal: string) => void;
  onCancelSchedule?: () => void;
}

/**
 * Minimum viable local datetime string for <input type="datetime-local">
 * e.g. "2026-09-15T09:30"
 */
function toLocalInputValue(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function SchedulePublishModal({
  open,
  slug,
  existingIso,
  isScheduling,
  error,
  onClose,
  onConfirm,
  onCancelSchedule,
}: SchedulePublishModalProps) {
  // Default: tomorrow 9:00 AM local time
  const defaultWhen = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return toLocalInputValue(d);
  };

  const [whenLocal, setWhenLocal] = useState<string>(defaultWhen);
  const initializedRef = useRef(false);

  // Reset the picked time each time the modal opens (fresh or pre-filled)
  useEffect(() => {
    if (open && !initializedRef.current) {
      if (existingIso) {
        const d = new Date(existingIso);
        if (!Number.isNaN(d.getTime())) setWhenLocal(toLocalInputValue(d));
      } else {
        setWhenLocal(defaultWhen());
      }
      initializedRef.current = true;
    }
    if (!open) {
      initializedRef.current = false;
    }
  }, [open, existingIso]);

  if (!open) return null;

  const picked = whenLocal ? new Date(whenLocal) : null;
  const inPast = picked ? picked.getTime() <= Date.now() : false;
  const valid = picked && !Number.isNaN(picked.getTime()) && !inPast;

  const tzLabel = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local time';

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0D1220] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <CalendarClock size={18} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Schedule publish</h2>
              <p className="mt-0.5 font-mono text-[11px] text-slate-500">{slug}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-5">
          <p className="text-xs leading-relaxed text-slate-400">
            The page keeps its current live version. At the chosen time, the current draft
            is automatically published. Make sure your draft is saved first.
          </p>

          <div>
            <label
              htmlFor="schedule-when"
              className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400"
            >
              Publish at <span className="normal-case text-slate-500">({tzLabel})</span>
            </label>
            <input
              id="schedule-when"
              type="datetime-local"
              value={whenLocal}
              onChange={(e) => setWhenLocal(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 [color-scheme:dark]"
            />
            {inPast && (
              <p className="mt-1.5 text-[11px] text-rose-400">
                Time must be in the future.
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-800 px-6 py-4">
          {existingIso && onCancelSchedule ? (
            <button
              type="button"
              onClick={onCancelSchedule}
              disabled={isScheduling}
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-rose-500/50 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel schedule
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isScheduling}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => picked && onConfirm(whenLocal)}
              disabled={!valid || isScheduling}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isScheduling ? <Loader2 size={13} className="animate-spin" /> : <CalendarClock size={13} />}
              {existingIso ? 'Reschedule' : 'Schedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

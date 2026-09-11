'use client';

import React, { useEffect, useState } from 'react';
import { X, History, RotateCcw, Loader2, CheckCircle2 } from 'lucide-react';
import { fetchPageRevisionsAction } from '../../actions';

interface VersionHistoryModalProps {
  slug: string;
  onClose: () => void;
  onRestore: (revisionId: string) => void;
}

export function VersionHistoryModal({ slug, onClose, onRestore }: VersionHistoryModalProps) {
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageRevisionsAction(slug)
      .then((data) => {
        setRevisions(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#00241A] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={18} className="text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Version History</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white/50 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/50">
              <Loader2 size={24} className="animate-spin text-emerald-400 mb-2" />
              <p className="text-xs">Loading snapshot history...</p>
            </div>
          ) : revisions.length === 0 ? (
            <div className="text-center py-12 text-white/40 text-xs">
              No previous version snapshots found for this page.
            </div>
          ) : (
            revisions.map((rev, idx) => (
              <div
                key={rev.id}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-3 flex items-center justify-between hover:bg-white/[0.06] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-white">
                      {rev.isPublishedSnapshot ? 'Published Snapshot' : 'Draft Snapshot'}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30 font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/50">
                    Saved by {rev.savedByName} on {new Date(rev.savedAt).toLocaleString()}
                  </p>
                  {rev.note && <p className="text-[10px] text-white/40 italic mt-0.5">{rev.note}</p>}
                </div>

                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => onRestore(rev.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-emerald-600 text-white transition-colors"
                  >
                    <RotateCcw size={13} />
                    <span>Restore</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

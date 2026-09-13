'use client';

import React, { useReducer, useEffect, useState, useRef, useCallback } from 'react';
import { PageBlockTree, ElementType, createDefaultNode, ElementStyles } from '@envint/shared';
import { studioReducer, StudioState, Breakpoint } from './StudioState';
import { StudioTopbar } from './StudioTopbar';
import { PaletteSidebar } from './PaletteSidebar';
import { StudioCanvas, ZoomLevel } from './StudioCanvas';
import { InspectorSidebar } from './InspectorSidebar';
import { QuickPalette } from './QuickPalette';
import { VersionHistoryModal } from './VersionHistoryModal';
import { saveDraftTreeAction, publishTreeAction, restorePageRevision } from '../../actions';

interface VisualStudioEditorProps {
  initialTree: PageBlockTree;
  teamMembers?: Array<{ name: string; role?: string | null; imageUrl?: string | null }>;
  slug: string;
  pageTitle: string;
  seoTitle?: string;
  seoDescription?: string;
  onSwitchToLegacy?: () => void;
}

/* ─────────────────── Panel sizing (persisted, UI-only) ─────────────────── */

const PANEL_STORE_KEY = 'envint.studio.v2';
const LEFT_DEFAULT = 256;
const LEFT_MIN = 200;
const LEFT_MAX = 320;
const RIGHT_DEFAULT = 328;
const RIGHT_MIN = 280;
const RIGHT_MAX = 420;

interface PanelPrefs {
  leftWidth: number;
  rightWidth: number;
}

function loadPanelPrefs(): PanelPrefs {
  if (typeof window === 'undefined') return { leftWidth: LEFT_DEFAULT, rightWidth: RIGHT_DEFAULT };
  try {
    const raw = window.localStorage.getItem(PANEL_STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PanelPrefs>;
      return {
        leftWidth: Math.min(LEFT_MAX, Math.max(LEFT_MIN, parsed.leftWidth || LEFT_DEFAULT)),
        rightWidth: Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, parsed.rightWidth || RIGHT_DEFAULT)),
      };
    }
  } catch {
    /* ignore */
  }
  return { leftWidth: LEFT_DEFAULT, rightWidth: RIGHT_DEFAULT };
}

/* ═══════════════════════════ Shell component ═══════════════════════════ */

export function VisualStudioEditor({
  initialTree,
  teamMembers,
  slug,
  pageTitle,
  seoTitle,
  seoDescription,
}: VisualStudioEditorProps) {
  const [state, dispatch] = useReducer(studioReducer, {
    tree: initialTree,
    selectedId: initialTree.rootIds[0] || null,
    hoveredId: null,
    draggedType: null,
    draggedExistingId: null,
    dropTargetId: null,
    dropPosition: null,
    breakpoint: 'desktop' as Breakpoint,
    activeLeftTab: 'palette' as const,
    history: { past: [], future: [] },
    isDirty: false,
    saveStatus: 'saved' as const,
    teamMembers,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [zoom, setZoom] = useState<ZoomLevel>('fit');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  /* Panel UI state */
  const [prefs, setPrefs] = useState<PanelPrefs>(loadPanelPrefs);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [quickPaletteOpen, setQuickPaletteOpen] = useState(false);
  const [resizing, setResizing] = useState<'left' | 'right' | null>(null);

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Persist panel widths (debounced by nature of pointerup) */
  useEffect(() => {
    try {
      window.localStorage.setItem(PANEL_STORE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  /* 1. Debounced Auto-Save to draft_blocks */
  useEffect(() => {
    if (!state.isDirty) return;

    dispatch({ type: 'SET_SAVE_STATUS', status: 'saving' });

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        await saveDraftTreeAction(slug, state.tree);
        dispatch({ type: 'SET_SAVE_STATUS', status: 'saved' });
      } catch (err) {
        console.error('Auto-save error:', err);
        dispatch({ type: 'SET_SAVE_STATUS', status: 'unsaved' });
      }
    }, 800);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [state.tree, state.isDirty, slug]);

  /* 2. Handlers */
  const stateRef = useRef(state);
  stateRef.current = state;

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    dispatch({ type: 'SET_SAVE_STATUS', status: 'saving' });
    try {
      await saveDraftTreeAction(slug, stateRef.current.tree);
      dispatch({ type: 'SET_SAVE_STATUS', status: 'saved' });
      showNotification('Draft saved successfully to database!');
    } catch (err: any) {
      showNotification(`Failed to save draft: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  }, [slug]);

  const handlePublish = useCallback(async () => {
    setIsPublishing(true);
    try {
      await publishTreeAction({
        slug,
        title: pageTitle,
        seoTitle,
        seoDescription,
        tree: stateRef.current.tree,
      });
      dispatch({ type: 'SET_SAVE_STATUS', status: 'published' });
      showNotification('Page published live! Public Edge cache revalidated.', 'success');
    } catch (err: any) {
      showNotification(`Publish failed: ${err.message}`, 'error');
    } finally {
      setIsPublishing(false);
    }
  }, [slug, pageTitle, seoTitle, seoDescription]);

  const handleAddNode = useCallback(
    (type: ElementType, targetParentId?: string | null, position?: 'before' | 'after' | 'inside', relativeNodeId?: string) => {
      const newNode = createDefaultNode(type);
      dispatch({
        type: 'ADD_NODE',
        node: newNode,
        targetParentId,
        insertPosition: position,
        relativeNodeId,
      });
      showNotification(`Added ${newNode.name} to page`);
    },
    []
  );

  const handleRestoreRevision = async (revisionId: string) => {
    setIsHistoryOpen(false);
    showNotification('Restoring revision...', 'info');
    try {
      await restorePageRevision(slug, revisionId);
      window.location.reload();
    } catch (err: any) {
      showNotification(`Rollback failed: ${err.message}`, 'error');
    }
  };

  /* 3. Keyboard shortcuts */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inTextControl =
        !!target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      const key = e.key.toLowerCase();

      // Cmd/Ctrl combos
      if (isCmdOrCtrl) {
        if (key === 'z') {
          e.preventDefault();
          if (e.shiftKey) dispatch({ type: 'REDO' });
          else dispatch({ type: 'UNDO' });
          return;
        }
        if (key === 'y') {
          e.preventDefault();
          dispatch({ type: 'REDO' });
          return;
        }
        if (key === 's') {
          e.preventDefault();
          handleSaveDraft();
          return;
        }
        if (key === 'k') {
          e.preventDefault();
          setQuickPaletteOpen((o) => !o);
          return;
        }
        if (key === '\\') {
          e.preventDefault();
          if (e.shiftKey) {
            setFocusMode((f) => !f);
          } else {
            // Toggle panels: if both visible → collapse both; else restore.
            setLeftCollapsed((l) => {
              setRightCollapsed((r) => (l && r ? false : !r));
              return !l;
            });
          }
          return;
        }
        if (key === 'd' && !inTextControl) {
          e.preventDefault();
          if (stateRef.current.selectedId) dispatch({ type: 'DUPLICATE_NODE', nodeId: stateRef.current.selectedId });
          return;
        }
        return;
      }

      // Non-modifier keys
      if (inTextControl) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (stateRef.current.selectedId) {
          e.preventDefault();
          dispatch({ type: 'DELETE_NODE', nodeId: stateRef.current.selectedId });
        }
        return;
      }

      if (e.key === 'Escape') {
        setQuickPaletteOpen(false);
        if (focusMode) {
          setFocusMode(false);
          return;
        }
        // Select parent (walk up the tree)
        const selId = stateRef.current.selectedId;
        if (selId) {
          const parent = stateRef.current.tree.nodes[selId]?.parentId;
          if (parent !== undefined && parent !== null) {
            dispatch({ type: 'SELECT_NODE', id: parent });
          } else {
            dispatch({ type: 'SELECT_NODE', id: null });
          }
        }
        return;
      }

      if (e.shiftKey && key === 'f') {
        e.preventDefault();
        setFocusMode((f) => !f);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveDraft, focusMode]);

  /* 4. Panel resize (pointer capture drag handles) */
  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: PointerEvent) => {
      if (resizing === 'left') {
        setPrefs((p) => ({ ...p, leftWidth: Math.min(LEFT_MAX, Math.max(LEFT_MIN, e.clientX)) }));
      } else {
        const w = window.innerWidth - e.clientX;
        setPrefs((p) => ({ ...p, rightWidth: Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, w)) }));
      }
    };
    const onUp = () => setResizing(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [resizing]);

  const togglePanels = () => {
    if (leftCollapsed || rightCollapsed) {
      setLeftCollapsed(false);
      setRightCollapsed(false);
    } else {
      setLeftCollapsed(true);
      setRightCollapsed(true);
    }
  };

  /* Element-specific update for the canvas inline editor */
  const handleUpdateContent = useCallback((id: string, content: Partial<any>) => {
    dispatch({ type: 'UPDATE_CONTENT', nodeId: id, content });
  }, []);

  return (
    <div
      className="studio-shell flex h-screen w-screen flex-col overflow-hidden bg-[#090D14] text-white"
      style={{ height: '100dvh' }}
    >
      <StudioTopbar
        slug={slug}
        pageTitle={pageTitle}
        state={state}
        onSetBreakpoint={(bp) => dispatch({ type: 'SET_BREAKPOINT', breakpoint: bp })}
        onUndo={() => dispatch({ type: 'UNDO' })}
        onRedo={() => dispatch({ type: 'REDO' })}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSaving={isSaving}
        isPublishing={isPublishing}
        leftCollapsed={leftCollapsed}
        rightCollapsed={rightCollapsed}
        focusMode={focusMode}
        onToggleLeft={() => setLeftCollapsed((v) => !v)}
        onToggleRight={() => setRightCollapsed((v) => !v)}
        onToggleFocus={() => setFocusMode((v) => !v)}
      />

      {/*
        Main 3-panel workspace. min-h-0 + min-w-0 everywhere so each panel
        scrolls independently; panels are either fixed/resizable widths or
        fully hidden (canvas takes the space instantly).
      */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {!focusMode && (
          <>
            <div className="relative flex min-h-0 min-w-0" style={{ width: leftCollapsed ? 56 : prefs.leftWidth }}>
              <PaletteSidebar
                state={state}
                collapsed={leftCollapsed}
                onToggleCollapsed={() => setLeftCollapsed((v) => !v)}
                onSelectNode={(id) => dispatch({ type: 'SELECT_NODE', id })}
                onAddNode={(type) => handleAddNode(type, state.selectedId, 'after', state.selectedId || undefined)}
                onDuplicateNode={(id) => dispatch({ type: 'DUPLICATE_NODE', nodeId: id })}
                onDeleteNode={(id) => dispatch({ type: 'DELETE_NODE', nodeId: id })}
                onToggleVisibility={(id) => {
                  const curr = state.tree.nodes[id]?.visibility?.desktop !== false;
                  dispatch({ type: 'UPDATE_VISIBILITY', nodeId: id, visibility: { desktop: !curr } });
                }}
                onRenameNode={(id, name) => dispatch({ type: 'RENAME_NODE', nodeId: id, name })}
                onSetLeftTab={(tab) => dispatch({ type: 'SET_LEFT_TAB', tab })}
              />
              {!leftCollapsed && (
                <div
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize components panel"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setResizing('left');
                  }}
                  onDoubleClick={() => setPrefs((p) => ({ ...p, leftWidth: LEFT_DEFAULT }))}
                  className="absolute -right-1 top-0 z-10 h-full w-2 cursor-col-resize transition-colors hover:bg-emerald-500/30"
                  title="Drag to resize · double-click to reset"
                />
              )}
            </div>

            {/* Right Inspector */}
            <div
              className="relative flex min-h-0 min-w-0"
              style={{ width: rightCollapsed ? 40 : prefs.rightWidth }}
            >
              <InspectorSidebar
                state={state}
                onUpdateContent={handleUpdateContent}
                onUpdateStyles={(id, styles, bp) =>
                  dispatch({ type: 'UPDATE_STYLES', nodeId: id, styles, breakpoint: bp })
                }
                onUpdateVisibility={(id, visibility) =>
                  dispatch({ type: 'UPDATE_VISIBILITY', nodeId: id, visibility })
                }
                onDuplicateNode={(id) => dispatch({ type: 'DUPLICATE_NODE', nodeId: id })}
                onDeleteNode={(id) => dispatch({ type: 'DELETE_NODE', nodeId: id })}
                onSelectNode={(id) => dispatch({ type: 'SELECT_NODE', id })}
                isCollapsed={rightCollapsed}
                onToggleCollapsed={() => setRightCollapsed((v) => !v)}
                width={prefs.rightWidth}
              />
              {!rightCollapsed && (
                <div
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize inspector panel"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setResizing('right');
                  }}
                  onDoubleClick={() => setPrefs((p) => ({ ...p, rightWidth: RIGHT_DEFAULT }))}
                  className="absolute -left-1 top-0 z-10 h-full w-2 cursor-col-resize transition-colors hover:bg-emerald-500/30"
                  title="Drag to resize · double-click to reset"
                />
              )}
            </div>
          </>
        )}

        {/* Center Visual Canvas — always rendered last so it keeps DOM order, flex-1 */}
        <StudioCanvas
          state={state}
          onSelectNode={(id) => dispatch({ type: 'SELECT_NODE', id: id as string | null })}
          onHoverNode={(id) => dispatch({ type: 'HOVER_NODE', id })}
          onAddNode={handleAddNode}
          onMoveNode={(nodeId, targetParentId, targetIndex) =>
            dispatch({ type: 'MOVE_NODE', nodeId, targetParentId, targetIndex })
          }
          onDuplicateNode={(id) => dispatch({ type: 'DUPLICATE_NODE', nodeId: id })}
          onDeleteNode={(id) => dispatch({ type: 'DELETE_NODE', nodeId: id })}
          onToggleVisibility={(id) => {
            const node = state.tree.nodes[id];
            if (!node) return;
            const bpKey = state.breakpoint as 'desktop' | 'tablet' | 'mobile';
            const curr = node.visibility?.[bpKey] !== false;
            dispatch({ type: 'UPDATE_VISIBILITY', nodeId: id, visibility: { [bpKey]: !curr } });
          }}
          onUpdateContent={handleUpdateContent}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      </div>

      {/* Focus mode exit affordance */}
      {focusMode && (
        <button
          type="button"
          onClick={() => setFocusMode(false)}
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-500/40 bg-[#0D1220]/95 px-4 py-2 text-[11px] font-semibold text-emerald-300 shadow-2xl transition hover:bg-emerald-500 hover:text-slate-950"
        >
          Exit Focus Mode (Esc)
        </button>
      )}

      {/* Quick palette (Cmd/Ctrl+K) */}
      {quickPaletteOpen && (
        <QuickPalette
          state={state}
          onClose={() => setQuickPaletteOpen(false)}
          onAddNode={(type) => handleAddNode(type, state.selectedId, 'after', state.selectedId || undefined)}
          onSelectNode={(id) => dispatch({ type: 'SELECT_NODE', id })}
          onSaveDraft={handleSaveDraft}
          onSetBreakpoint={(bp) => dispatch({ type: 'SET_BREAKPOINT', breakpoint: bp })}
          onToggleFocus={() => setFocusMode((v) => !v)}
          onOpenNavigator={() => {
            setLeftCollapsed(false);
            dispatch({ type: 'SET_LEFT_TAB', tab: 'navigator' });
          }}
          onDuplicateNode={(id) => dispatch({ type: 'DUPLICATE_NODE', nodeId: id })}
          onDeleteNode={(id) => dispatch({ type: 'DELETE_NODE', nodeId: id })}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-2xl transition-all ${
            notification.type === 'error'
              ? 'bg-red-600 text-white'
              : notification.type === 'info'
                ? 'bg-blue-600 text-white'
                : 'bg-emerald-600 text-white'
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}

      {/* Version History Modal */}
      {isHistoryOpen && (
        <VersionHistoryModal slug={slug} onClose={() => setIsHistoryOpen(false)} onRestore={handleRestoreRevision} />
      )}
    </div>
  );
}

/* Keep ElementStyles referenced for the props type of dispatch helpers above. */
export type { ElementStyles, StudioState };

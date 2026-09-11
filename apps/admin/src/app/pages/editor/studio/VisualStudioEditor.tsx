'use client';

import React, { useReducer, useEffect, useState, useRef, useCallback } from 'react';
import { PageBlockTree, ElementType, createDefaultNode, BuilderNode, ElementStyles } from '@envint/shared';
import { studioReducer, StudioState, Breakpoint } from './StudioState';
import { StudioTopbar } from './StudioTopbar';
import { PaletteSidebar } from './PaletteSidebar';
import { StudioCanvas } from './StudioCanvas';
import { InspectorSidebar } from './InspectorSidebar';
import { VersionHistoryModal } from './VersionHistoryModal';
import { saveDraftTreeAction, publishTreeAction, restorePageRevision } from '../../actions';

interface VisualStudioEditorProps {
  initialTree: PageBlockTree;
  slug: string;
  pageTitle: string;
  seoTitle?: string;
  seoDescription?: string;
  onSwitchToLegacy?: () => void;
}

export function VisualStudioEditor({
  initialTree,
  slug,
  pageTitle,
  seoTitle,
  seoDescription,
  onSwitchToLegacy,
}: VisualStudioEditorProps) {
  const [state, dispatch] = useReducer(studioReducer, {
    tree: initialTree,
    selectedId: initialTree.rootIds[0] || null,
    hoveredId: null,
    draggedType: null,
    draggedExistingId: null,
    dropTargetId: null,
    dropPosition: null,
    breakpoint: 'desktop',
    activeLeftTab: 'palette',
    history: { past: [], future: [] },
    isDirty: false,
    saveStatus: 'saved',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // 1. Debounced Auto-Save to draft_blocks (600ms)
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

  // 2. Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          dispatch({ type: 'REDO' });
        } else {
          dispatch({ type: 'UNDO' });
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.tree, state.history]);

  // 3. Handlers
  const handleSaveDraft = async () => {
    setIsSaving(true);
    dispatch({ type: 'SET_SAVE_STATUS', status: 'saving' });
    try {
      await saveDraftTreeAction(slug, state.tree);
      dispatch({ type: 'SET_SAVE_STATUS', status: 'saved' });
      showNotification('Draft saved successfully to database!');
    } catch (err: any) {
      showNotification(`Failed to save draft: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishTreeAction({
        slug,
        title: pageTitle,
        seoTitle,
        seoDescription,
        tree: state.tree,
      });
      dispatch({ type: 'SET_SAVE_STATUS', status: 'published' });
      showNotification('Page published live! Public Edge cache revalidated.', 'success');
    } catch (err: any) {
      showNotification(`Publish failed: ${err.message}`, 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddNode = (
    type: ElementType,
    targetParentId?: string | null,
    position?: 'before' | 'after' | 'inside',
    relativeNodeId?: string
  ) => {
    const newNode = createDefaultNode(type);
    dispatch({
      type: 'ADD_NODE',
      node: newNode,
      targetParentId,
      insertPosition: position,
      relativeNodeId,
    });
    showNotification(`Added ${newNode.name} to page`);
  };

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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#00140E] text-white">
      {/* Topbar */}
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
      />

      {/* Main 3-Panel Studio Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Palette & Navigator */}
        <PaletteSidebar
          state={state}
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

        {/* Center Visual Interactive Canvas */}
        <StudioCanvas
          state={state}
          onSelectNode={(id) => dispatch({ type: 'SELECT_NODE', id })}
          onHoverNode={(id) => dispatch({ type: 'HOVER_NODE', id })}
          onAddNode={handleAddNode}
          onMoveNode={(nodeId, targetParentId, targetIndex) =>
            dispatch({ type: 'MOVE_NODE', nodeId, targetParentId, targetIndex })
          }
          onDuplicateNode={(id) => dispatch({ type: 'DUPLICATE_NODE', nodeId: id })}
          onDeleteNode={(id) => dispatch({ type: 'DELETE_NODE', nodeId: id })}
          onUpdateContent={(id, content) => dispatch({ type: 'UPDATE_CONTENT', nodeId: id, content })}
        />

        {/* Right Inspector Panel */}
        <InspectorSidebar
          state={state}
          onSelectNode={(id) => dispatch({ type: 'SELECT_NODE', id })}
          onUpdateContent={(id, content) => dispatch({ type: 'UPDATE_CONTENT', nodeId: id, content })}
          onUpdateStyles={(id, styles, bp) => dispatch({ type: 'UPDATE_STYLES', nodeId: id, styles, breakpoint: bp })}
          onUpdateVisibility={(id, visibility) =>
            dispatch({ type: 'UPDATE_VISIBILITY', nodeId: id, visibility })
          }
          onDuplicateNode={(id) => dispatch({ type: 'DUPLICATE_NODE', nodeId: id })}
          onDeleteNode={(id) => dispatch({ type: 'DELETE_NODE', nodeId: id })}
        />
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2.5 rounded-xl shadow-2xl z-50 text-xs font-semibold flex items-center gap-2 transition-all ${
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
        <VersionHistoryModal
          slug={slug}
          onClose={() => setIsHistoryOpen(false)}
          onRestore={handleRestoreRevision}
        />
      )}
    </div>
  );
}

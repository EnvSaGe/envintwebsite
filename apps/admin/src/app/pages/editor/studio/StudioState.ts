import {
  BuilderNode,
  PageBlockTree,
  ElementType,
  cloneNodeTree,
  ElementStyles,
  type ContentBinding,
  type DynamicQueryConfig,
  type StudioDynamicModules,
  selectDynamicPreviewRecords,
} from '@envint/shared';

export { selectDynamicPreviewRecords };

export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export interface StudioState {
  tree: PageBlockTree;
  selectedId: string | null;
  hoveredId: string | null;
  draggedType: ElementType | null;
  draggedExistingId: string | null;
  dropTargetId: string | null;
  dropPosition: 'before' | 'after' | 'inside' | null;
  breakpoint: Breakpoint;
  activeLeftTab: 'palette' | 'navigator' | 'templates';
  history: {
    past: PageBlockTree[];
    future: PageBlockTree[];
  };
  isDirty: boolean;
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'published';
  /** Real team members from the CMS database — powers team-grid parity on the canvas. */
  teamMembers?: Array<{ name: string; role?: string | null; imageUrl?: string | null }>;
  /** Server-resolved records keyed by dynamic builder node id. */
  dynamicModules: StudioDynamicModules;
}

export type StudioAction =
  | { type: 'SET_TREE'; tree: PageBlockTree }
  | { type: 'SELECT_NODE'; id: string | null }
  | { type: 'HOVER_NODE'; id: string | null }
  | { type: 'SET_BREAKPOINT'; breakpoint: Breakpoint }
  | { type: 'SET_LEFT_TAB'; tab: 'palette' | 'navigator' | 'templates' }
  | { type: 'SET_DRAGGED_PALETTE_ITEM'; elementType: ElementType | null }
  | { type: 'SET_DRAGGED_EXISTING_NODE'; nodeId: string | null }
  | { type: 'SET_DROP_TARGET'; targetId: string | null; position: 'before' | 'after' | 'inside' | null }
  | { type: 'ADD_NODE'; node: BuilderNode; targetParentId?: string | null; targetIndex?: number; insertPosition?: 'before' | 'after' | 'inside'; relativeNodeId?: string }
  | { type: 'MOVE_NODE'; nodeId: string; targetParentId: string | null; targetIndex: number }
  | { type: 'DUPLICATE_NODE'; nodeId: string }
  | { type: 'DELETE_NODE'; nodeId: string }
  | { type: 'UPDATE_CONTENT'; nodeId: string; content: Partial<any> }
  | { type: 'UPDATE_BINDING'; nodeId: string; field: string; binding: ContentBinding | null }
  | { type: 'UPDATE_DYNAMIC_QUERY'; nodeId: string; query: DynamicQueryConfig }
  | { type: 'UPDATE_STYLES'; nodeId: string; styles: Partial<ElementStyles>; breakpoint?: Breakpoint }
  | { type: 'UPDATE_VISIBILITY'; nodeId: string; visibility: { desktop?: boolean; tablet?: boolean; mobile?: boolean } }
  | { type: 'RENAME_NODE'; nodeId: string; name: string }
  | { type: 'SET_SAVE_STATUS'; status: 'saved' | 'saving' | 'unsaved' | 'published' }
  | { type: 'SET_SAVE_SUCCESS' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

let lastHistoryTime = 0;
function pushHistory(state: StudioState, debounceMs = 0): { past: PageBlockTree[]; future: PageBlockTree[] } {
  const now = Date.now();
  if (debounceMs > 0 && now - lastHistoryTime < debounceMs && state.history.past.length > 0) {
    return state.history;
  }
  lastHistoryTime = now;
  const clonedTree = typeof structuredClone === 'function' ? structuredClone(state.tree) : JSON.parse(JSON.stringify(state.tree));
  const newPast = [...state.history.past, clonedTree];
  if (newPast.length > 50) newPast.shift();
  return {
    past: newPast,
    future: [],
  };
}

export function createInitialStudioState(
  tree: PageBlockTree,
  teamMembers?: StudioState['teamMembers'],
  dynamicModules: StudioDynamicModules = {},
): StudioState {
  return {
    tree,
    selectedId: null,
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
    teamMembers,
    dynamicModules,
  };
}

export function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'SET_TREE':
      return {
        ...state,
        tree: action.tree,
        selectedId: action.tree.rootIds[0] || null,
        isDirty: false,
        saveStatus: 'saved',
        history: { past: [], future: [] },
      };

    case 'SELECT_NODE':
      return { ...state, selectedId: action.id };

    case 'HOVER_NODE':
      return { ...state, hoveredId: action.id };

    case 'SET_BREAKPOINT':
      return { ...state, breakpoint: action.breakpoint };

    case 'SET_LEFT_TAB':
      return { ...state, activeLeftTab: action.tab };

    case 'SET_DRAGGED_PALETTE_ITEM':
      return { ...state, draggedType: action.elementType };

    case 'SET_DRAGGED_EXISTING_NODE':
      return { ...state, draggedExistingId: action.nodeId };

    case 'SET_DROP_TARGET': {
      // Skip redundant updates so dragging across the canvas doesn't re-render
      // the entire tree on every pixel of pointer movement.
      if (state.dropTargetId === action.targetId && state.dropPosition === action.position) return state;
      return { ...state, dropTargetId: action.targetId, dropPosition: action.position };
    }

    case 'ADD_NODE': {
      const history = pushHistory(state);
      const newTree: PageBlockTree =
        typeof structuredClone === 'function'
          ? structuredClone(state.tree)
          : JSON.parse(JSON.stringify(state.tree));
      const newNode = action.node;

      // Determine parent and insertion index
      if (newNode.type === 'section') {
        // Section is always added to root
        newNode.parentId = null;
        if (action.relativeNodeId && action.insertPosition) {
          const idx = newTree.rootIds.indexOf(action.relativeNodeId);
          if (idx !== -1) {
            const insertIdx = action.insertPosition === 'before' ? idx : idx + 1;
            newTree.rootIds.splice(insertIdx, 0, newNode.id);
          } else {
            newTree.rootIds.push(newNode.id);
          }
        } else {
          newTree.rootIds.push(newNode.id);
        }
      } else {
        // Element inside container / section
        let parentId = action.targetParentId;
        if (!parentId && action.relativeNodeId) {
          const relNode = newTree.nodes[action.relativeNodeId];
          if (relNode) {
            if (action.insertPosition === 'inside' || relNode.type === 'container' || relNode.type === 'section') {
              parentId = relNode.id;
            } else {
              parentId = relNode.parentId;
            }
          }
        }

        // If still no parent, append to the first container of the first section
        if (!parentId) {
          const firstSection = newTree.nodes[newTree.rootIds[0]];
          if (firstSection && firstSection.children.length > 0) {
            parentId = firstSection.children[0];
          } else if (firstSection) {
            parentId = firstSection.id;
          }
        }

        if (parentId && newTree.nodes[parentId]) {
          newNode.parentId = parentId;
          const parent = newTree.nodes[parentId];
          if (action.relativeNodeId && action.insertPosition && action.insertPosition !== 'inside') {
            const idx = parent.children.indexOf(action.relativeNodeId);
            const insertIdx = action.insertPosition === 'before' ? idx : idx + 1;
            parent.children.splice(insertIdx, 0, newNode.id);
          } else {
            parent.children.push(newNode.id);
          }
        }
      }

      newTree.nodes[newNode.id] = newNode;

      return {
        ...state,
        tree: newTree,
        selectedId: newNode.id,
        isDirty: true,
        saveStatus: 'unsaved',
        history,
      };
    }

    case 'MOVE_NODE': {
      const { nodeId, targetParentId, targetIndex } = action;
      const node = state.tree.nodes[nodeId];
      if (!node) return state;

      // Cycle prevention: Cannot move node into itself
      if (nodeId === targetParentId) return state;

      // Cycle prevention: Cannot move node into any of its own descendants
      if (targetParentId !== null) {
        let ancestorId: string | null = targetParentId;
        const visitedAncestors = new Set<string>();
        while (ancestorId) {
          if (ancestorId === nodeId) return state; // Target parent is inside nodeId!
          if (visitedAncestors.has(ancestorId)) break;
          visitedAncestors.add(ancestorId);
          ancestorId = state.tree.nodes[ancestorId]?.parentId ?? null;
        }
      }

      const history = pushHistory(state);
      const newTree: PageBlockTree = JSON.parse(JSON.stringify(state.tree));

      // 1. Remove from old location
      if (node.parentId === null) {
        newTree.rootIds = newTree.rootIds.filter((id) => id !== nodeId);
      } else if (newTree.nodes[node.parentId]) {
        newTree.nodes[node.parentId].children = newTree.nodes[node.parentId].children.filter(
          (id) => id !== nodeId
        );
      }

      // 2. Insert into new location
      if (targetParentId === null) {
        newTree.nodes[nodeId].parentId = null;
        newTree.rootIds.splice(targetIndex, 0, nodeId);
      } else if (newTree.nodes[targetParentId]) {
        newTree.nodes[nodeId].parentId = targetParentId;
        newTree.nodes[targetParentId].children.splice(targetIndex, 0, nodeId);
      }

      return {
        ...state,
        tree: newTree,
        selectedId: nodeId,
        isDirty: true,
        saveStatus: 'unsaved',
        history,
      };
    }

    case 'DUPLICATE_NODE': {
      const originalNode = state.tree.nodes[action.nodeId];
      if (!originalNode) return state;

      const history = pushHistory(state);
      const newTree: PageBlockTree = JSON.parse(JSON.stringify(state.tree));
      const { newRootId, clonedNodes } = cloneNodeTree(action.nodeId, newTree.nodes, originalNode.parentId);

      // Merge cloned nodes into dictionary
      Object.assign(newTree.nodes, clonedNodes);

      // Insert cloned node next to original
      if (originalNode.parentId === null) {
        const idx = newTree.rootIds.indexOf(action.nodeId);
        newTree.rootIds.splice(idx + 1, 0, newRootId);
      } else if (newTree.nodes[originalNode.parentId]) {
        const parent = newTree.nodes[originalNode.parentId];
        const idx = parent.children.indexOf(action.nodeId);
        parent.children.splice(idx + 1, 0, newRootId);
      }

      return {
        ...state,
        tree: newTree,
        selectedId: newRootId,
        isDirty: true,
        saveStatus: 'unsaved',
        history,
      };
    }

    case 'DELETE_NODE': {
      const node = state.tree.nodes[action.nodeId];
      if (!node) return state;

      const history = pushHistory(state);
      const newTree: PageBlockTree = JSON.parse(JSON.stringify(state.tree));

      // Recursively collect all descendant node IDs
      const toDelete = new Set<string>();
      function collectDescendants(id: string) {
        toDelete.add(id);
        const curr = newTree.nodes[id];
        if (curr) {
          for (const childId of curr.children) collectDescendants(childId);
        }
      }
      collectDescendants(action.nodeId);

      // Remove from parent's children array or rootIds
      if (node.parentId === null) {
        newTree.rootIds = newTree.rootIds.filter((id) => id !== action.nodeId);
      } else if (newTree.nodes[node.parentId]) {
        newTree.nodes[node.parentId].children = newTree.nodes[node.parentId].children.filter(
          (id) => id !== action.nodeId
        );
      }

      // Delete all collected IDs from lookup table
      toDelete.forEach((id) => {
        delete newTree.nodes[id];
      });

      return {
        ...state,
        tree: newTree,
        selectedId: state.selectedId && toDelete.has(state.selectedId) ? null : state.selectedId,
        isDirty: true,
        saveStatus: 'unsaved',
        history,
      };
    }

    case 'UPDATE_CONTENT': {
      const node = state.tree.nodes[action.nodeId];
      if (!node) return state;

      const history = pushHistory(state, 600);
      const newTree: PageBlockTree = {
        ...state.tree,
        nodes: {
          ...state.tree.nodes,
          [action.nodeId]: {
            ...node,
            content: {
              ...node.content,
              ...action.content,
            },
          },
        },
      };

      return {
        ...state,
        tree: newTree,
        isDirty: true,
        saveStatus: 'unsaved',
        history,
      };
    }

    case 'UPDATE_BINDING': {
      const node = state.tree.nodes[action.nodeId];
      if (!node) return state;

      const history = pushHistory(state);
      const bindings = { ...(node.content.bindings ?? {}) };
      if (action.binding) bindings[action.field] = action.binding;
      else delete bindings[action.field];

      const nextContent = {
        ...node.content,
        ...(Object.keys(bindings).length > 0 ? { bindings } : {}),
      };
      if (Object.keys(bindings).length === 0) delete nextContent.bindings;

      const newTree: PageBlockTree = {
        ...state.tree,
        nodes: {
          ...state.tree.nodes,
          [action.nodeId]: {
            ...node,
            content: nextContent,
          },
        },
      };

      return { ...state, tree: newTree, isDirty: true, saveStatus: 'unsaved', history };
    }

    case 'UPDATE_DYNAMIC_QUERY': {
      const node = state.tree.nodes[action.nodeId];
      if (!node) return state;
      const history = pushHistory(state);
      const newTree: PageBlockTree = {
        ...state.tree,
        nodes: {
          ...state.tree.nodes,
          [action.nodeId]: {
            ...node,
            content: {
              ...node.content,
              query: action.query,
            },
          },
        },
      };
      return { ...state, tree: newTree, isDirty: true, saveStatus: 'unsaved', history };
    }

    case 'UPDATE_STYLES': {
      const node = state.tree.nodes[action.nodeId];
      if (!node) return state;

      const history = pushHistory(state, 600);
      const bp = action.breakpoint || state.breakpoint;
      const updatedNode = { ...node };

      if (bp === 'desktop') {
        updatedNode.styles = {
          ...node.styles,
          ...action.styles,
        };
      } else {
        const resp = { ...(node.responsiveStyles || {}) } as Record<string, any>;
        resp[bp] = {
          ...(resp[bp] || {}),
          ...action.styles,
        };
        updatedNode.responsiveStyles = resp;
      }

      const newTree: PageBlockTree = {
        ...state.tree,
        nodes: {
          ...state.tree.nodes,
          [action.nodeId]: updatedNode,
        },
      };

      return {
        ...state,
        tree: newTree,
        isDirty: true,
        saveStatus: 'unsaved',
        history,
      };
    }

    case 'UPDATE_VISIBILITY': {
      const node = state.tree.nodes[action.nodeId];
      if (!node) return state;

      const history = pushHistory(state);
      const currentVis = node.visibility || { desktop: true, tablet: true, mobile: true };
      const newTree: PageBlockTree = {
        ...state.tree,
        nodes: {
          ...state.tree.nodes,
          [action.nodeId]: {
            ...node,
            visibility: {
              desktop: action.visibility?.desktop ?? currentVis.desktop ?? true,
              tablet: action.visibility?.tablet ?? currentVis.tablet ?? true,
              mobile: action.visibility?.mobile ?? currentVis.mobile ?? true,
            },
          },
        },
      };

      return {
        ...state,
        tree: newTree,
        isDirty: true,
        saveStatus: 'unsaved',
        history,
      };
    }

    case 'RENAME_NODE': {
      const node = state.tree.nodes[action.nodeId];
      if (!node) return state;

      const history = pushHistory(state);
      const newTree: PageBlockTree = {
        ...state.tree,
        nodes: {
          ...state.tree.nodes,
          [action.nodeId]: {
            ...node,
            name: action.name,
          },
        },
      };

      return {
        ...state,
        tree: newTree,
        isDirty: true,
        saveStatus: 'unsaved',
        history,
      };
    }

    case 'SET_SAVE_STATUS':
      return { ...state, saveStatus: action.status, isDirty: action.status === 'unsaved' };

    case 'SET_SAVE_SUCCESS':
      return { ...state, saveStatus: 'saved', isDirty: false };

    case 'UNDO': {
      if (state.history.past.length === 0) return state;
      const prev = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      return {
        ...state,
        tree: prev,
        isDirty: true,
        saveStatus: 'unsaved',
        history: {
          past: newPast,
          future: [JSON.parse(JSON.stringify(state.tree)), ...state.history.future],
        },
      };
    }

    case 'REDO': {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        ...state,
        tree: next,
        isDirty: true,
        saveStatus: 'unsaved',
        history: {
          past: [...state.history.past, JSON.parse(JSON.stringify(state.tree))],
          future: newFuture,
        },
      };
    }

    default:
      return state;
  }
}

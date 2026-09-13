import {
  resolveBinding,
  type BindingContext,
  type ContentBinding,
  type PageBlockTree,
} from '@envint/shared';
import { formatBindingValue } from './BindingValue';

export function resolveTreeBindings(
  tree: PageBlockTree,
  context: BindingContext,
): PageBlockTree {
  const nodes: PageBlockTree['nodes'] = {};

  for (const [id, node] of Object.entries(tree.nodes)) {
    const bindings = node.content.bindings as Record<string, ContentBinding> | undefined;
    if (!bindings || Object.keys(bindings).length === 0) {
      nodes[id] = node;
      continue;
    }

    const content = { ...node.content };
    delete content.bindings;
    for (const [field, binding] of Object.entries(bindings)) {
      const value = resolveBinding(binding, context);
      content[field] = binding.format ? formatBindingValue(value, binding) : value;
    }
    nodes[id] = { ...node, content };
  }

  return { ...tree, nodes };
}

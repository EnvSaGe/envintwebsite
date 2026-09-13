import React from 'react';
import type { BindingContext, PageBlockTree } from '@envint/shared';
import type { TeamCardMember } from '@/components/about/TeamGrid';
import { TreeRenderer } from './TreeRenderer';
import { resolveTreeBindings } from './resolve-tree-bindings';

interface TemplateRendererProps {
  tree: PageBlockTree;
  context: BindingContext;
  teamCards?: TeamCardMember[];
}

export { resolveTreeBindings } from './resolve-tree-bindings';

export function TemplateRenderer({ tree, context, teamCards }: TemplateRendererProps) {
  return <TreeRenderer tree={resolveTreeBindings(tree, context)} teamCards={teamCards} />;
}

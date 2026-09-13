import { PageBlockTreeSchema, type PageBlockTree } from '@envint/shared';

export interface TreeSource {
  draftBlocks?: unknown;
  publishedBlocks?: unknown;
}

function parseTree(value: unknown): PageBlockTree | null {
  const result = PageBlockTreeSchema.safeParse(value);
  if (!result.success || result.data.rootIds.length === 0) return null;
  const referencedIds = [
    ...result.data.rootIds,
    ...Object.values(result.data.nodes).flatMap((node) => node.children),
  ];
  return referencedIds.every((id) => Boolean(result.data.nodes[id])) ? result.data : null;
}

export function choosePublishedTree(source: TreeSource): PageBlockTree | null {
  return parseTree(source.publishedBlocks);
}

export function choosePreviewTree(source: TreeSource): PageBlockTree | null {
  return parseTree(source.draftBlocks) ?? parseTree(source.publishedBlocks);
}

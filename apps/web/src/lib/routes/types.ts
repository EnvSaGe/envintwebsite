import type { PageBlockTree, TemplateKind } from '@envint/shared';
import type { CmsPage } from '@/lib/data/pages';
import type { DynamicQueryConfig } from '@envint/shared';

export type RecordType = 'insight' | 'impact' | 'team-member';

export interface ArchiveRouteRecord {
  type: 'author' | 'category' | 'tag' | 'service' | 'sub-service' | 'sector' | 'theme' | 'member';
  slug: string;
  title: string;
  description: string;
  query: DynamicQueryConfig;
}

export interface ContentTemplateRecord {
  slug: string;
  name: string;
  kind: TemplateKind;
  publishedBlocks: PageBlockTree;
  schemaVersion: number;
}

export type ResolvedPublicRoute =
  | {
      kind: 'page';
      pathname: string;
      page: CmsPage;
      tree: PageBlockTree | null;
    }
  | {
      kind: 'record';
      pathname: string;
      recordType: RecordType;
      record: unknown;
      template: ContentTemplateRecord;
    }
  | {
      kind: 'archive';
      pathname: string;
      archive: ArchiveRouteRecord;
      template: ContentTemplateRecord;
    };

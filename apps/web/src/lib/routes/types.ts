import type { PageBlockTree, TemplateKind } from '@envint/shared';
import type { CmsPage } from '@/lib/data/pages';

export type RecordType = 'insight' | 'impact' | 'team-member';

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
      archive: unknown;
      template: ContentTemplateRecord;
    };

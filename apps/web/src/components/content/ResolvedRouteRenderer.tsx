import type { ResolvedPublicRoute } from '@/lib/routes/types';
import { DynamicPageRenderer } from './DynamicPageRenderer';
import { TemplateRenderer } from '../builder/TemplateRenderer';

export function ResolvedRouteRenderer({ route }: { route: ResolvedPublicRoute }) {
  if (route.kind === 'page') return <DynamicPageRenderer page={route.page} />;
  if (route.kind === 'record') {
    return (
      <TemplateRenderer
        tree={route.template.publishedBlocks}
        context={{
          record: route.record as Record<string, unknown>,
          route: { pathname: route.pathname, absoluteUrl: `https://envintglobal.com${route.pathname}/` },
        }}
      />
    );
  }
  return (
    <TemplateRenderer
      tree={route.template.publishedBlocks}
      context={{
        route: { ...route.archive, pathname: route.pathname },
      }}
    />
  );
}

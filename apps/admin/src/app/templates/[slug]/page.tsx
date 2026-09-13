import { notFound } from 'next/navigation';
import { VisualStudioEditor } from '../../pages/editor/studio/VisualStudioEditor';
import { fetchTemplateAction } from '../actions';

export default async function TemplateEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = await fetchTemplateAction(decodeURIComponent(slug));
  if (!template) notFound();

  const contentScope = template.kind.startsWith('global-') ? 'Global' : 'Shared template';
  return (
    <VisualStudioEditor
      initialTree={template.tree}
      slug={template.slug}
      pageTitle={template.name}
      entityType="template"
      contentScope={contentScope}
      dependencyCount={template.dependencyCount}
    />
  );
}

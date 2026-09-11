import { Metadata } from 'next';

interface AuthorArchiveProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorArchiveProps): Promise<Metadata> {
  const { slug } = await params;
  const authorName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `Articles by ${authorName} | Envint`,
    description: `Browse sustainability insights, explainers, and thought leadership articles authored by ${authorName} at Envint.`,
    alternates: {
      canonical: `https://envintglobal.com/author/${slug}/`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AuthorArchivePage({ params }: AuthorArchiveProps) {
  const { slug } = await params;
  const authorName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="container" style={{ padding: '140px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Author: {authorName}</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--color-text-body)', marginBottom: '40px' }}>
        Articles, explainers, and publications authored by {authorName} on sustainability, ESG, and climate action.
      </p>
      <div style={{ padding: '24px', border: '1px solid var(--color-border-light)', borderRadius: '8px' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Published articles for this author will be rendered dynamically.</p>
      </div>
    </div>
  );
}

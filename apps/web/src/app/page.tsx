import { metadataForPublicPath, renderPublicPath } from '@/lib/routes/public-page-adapter';

const pathname = '/';

export function generateMetadata() {
  return metadataForPublicPath(pathname);
}

export default function Page() {
  return renderPublicPath(pathname);
}

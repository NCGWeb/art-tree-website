import GalleryEditor from '@/components/admin/editors/GalleryEditor';
import { getPageContent } from '@/lib/content';

export default async function AdminGalleryPage() {
  const data = await getPageContent('gallery', { fresh: true });
  return <GalleryEditor initial={data} />;
}

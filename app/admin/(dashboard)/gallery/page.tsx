import GalleryEditor from '@/components/admin/editors/GalleryEditor';
import { getPageContent } from '@/lib/content';

export default async function AdminGalleryPage() {
  const data = await getPageContent('gallery');
  return <GalleryEditor initial={data} />;
}

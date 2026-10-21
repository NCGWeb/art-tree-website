import ArtformsEditor from '@/components/admin/editors/ArtformsEditor';
import { getPageContent } from '@/lib/content';

export default async function AdminArtformsPage() {
  const data = await getPageContent('artforms');
  return <ArtformsEditor initial={data} />;
}

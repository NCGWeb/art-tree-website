import ArtformsEditor from '@/components/admin/editors/ArtformsEditor';
import { getPageContent } from '@/lib/content';

export default async function AdminArtformsPage() {
  const data = await getPageContent('artforms', { fresh: true });
  return <ArtformsEditor initial={data} />;
}

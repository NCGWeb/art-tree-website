import MediaEditor from '@/components/admin/editors/MediaEditor';
import { getPageContent } from '@/lib/content';

export default async function AdminMediaPage() {
  const data = await getPageContent('media');
  return <MediaEditor initial={data} />;
}

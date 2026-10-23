import ExhibitionsEditor from '@/components/admin/editors/ExhibitionsEditor';
import { getPageContent } from '@/lib/content';

export default async function AdminExhibitionsPage() {
  const data = await getPageContent('exhibitions', { fresh: true });
  return <ExhibitionsEditor initial={data} />;
}

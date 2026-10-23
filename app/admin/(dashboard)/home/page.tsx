import HomeEditor from '@/components/admin/editors/HomeEditor';
import { getPageContent } from '@/lib/content';

export default async function AdminHomePage() {
  const data = await getPageContent('home', { fresh: true });
  return <HomeEditor initial={data} />;
}

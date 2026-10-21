import AboutEditor from '@/components/admin/editors/AboutEditor';
import { getPageContent } from '@/lib/content';

export default async function AdminAboutPage() {
  const data = await getPageContent('about');
  return <AboutEditor initial={data} />;
}

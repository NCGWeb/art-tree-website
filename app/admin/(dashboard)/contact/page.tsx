import ContactEditor from '@/components/admin/editors/ContactEditor';
import { getPageContent } from '@/lib/content';

export default async function AdminContactPage() {
  const data = await getPageContent('contact', { fresh: true });
  return <ContactEditor initial={data} />;
}

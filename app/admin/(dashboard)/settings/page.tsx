import SettingsEditor from '@/components/admin/editors/SettingsEditor';
import { getSiteSettings } from '@/lib/content';

export default async function AdminSettingsPage() {
  const data = await getSiteSettings();
  return <SettingsEditor initial={data} />;
}

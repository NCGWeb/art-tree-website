'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded border border-white/30 px-3 py-1.5 text-xs uppercase tracking-wide text-white/90 hover:bg-white/10"
    >
      Log out
    </button>
  );
}

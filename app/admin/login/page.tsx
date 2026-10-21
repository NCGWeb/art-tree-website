'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Incorrect password');
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3EFE6] px-4 font-body">
      <div className="w-full max-w-sm rounded-lg border border-black/10 bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center">
          <Image src="/images/logo.png" alt="Art Tree" width={140} height={71} quality={90} className="mb-3 h-14 w-auto" />
          <h1 className="font-head text-xl text-headline-green">Admin Login</h1>
          <p className="mt-1 text-center text-xs text-[#6a674f]">Sign in to edit the Art Tree website content.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Password</span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-black/15 px-3 py-2.5 text-sm text-ink focus:border-terracotta focus:outline-none"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-headline-green px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#2c3825] disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

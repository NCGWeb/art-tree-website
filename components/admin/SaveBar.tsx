'use client';

import { useState } from 'react';

export default function SaveBar({
  title,
  liveHref,
  onSave,
}: {
  title: string;
  liveHref: string;
  onSave: () => Promise<void>;
}) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSave() {
    setStatus('saving');
    try {
      await onSave();
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
      <h1 className="font-head text-2xl text-headline-green">{title}</h1>
      <div className="flex items-center gap-3">
        {status === 'saved' && <span className="text-sm text-green-700">Saved</span>}
        {status === 'error' && <span className="text-sm text-red-600">{errorMessage}</span>}
        <a
          href={liveHref}
          target="_blank"
          rel="noopener"
          className="rounded border border-headline-green px-3 py-2 text-xs uppercase tracking-wide text-headline-green hover:bg-headline-green hover:text-white"
        >
          View live page
        </a>
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="rounded bg-terracotta px-4 py-2 text-xs uppercase tracking-wide text-white hover:bg-[#8a3c27] disabled:opacity-60"
        >
          {status === 'saving' ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

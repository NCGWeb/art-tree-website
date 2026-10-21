'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function MediaFlipbook({ items }: { items: { image: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);
  const total = items.length;

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }
  function next() {
    setIndex((i) => Math.min(total - 1, i + 1));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (total === 0) {
    return <p className="text-center text-sm text-white/70">No press coverage has been added yet.</p>;
  }

  const current = items[index];

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4">
      <div className="flex w-full items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={index <= 0}
          aria-label="Previous page"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-xl text-white disabled:opacity-30"
        >
          ‹
        </button>

        <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-md bg-white shadow-2xl">
          <Image src={current.image} alt={current.alt} fill className="object-contain" sizes="380px" priority={index === 0} />
        </div>

        <button
          type="button"
          onClick={next}
          disabled={index >= total - 1}
          aria-label="Next page"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-xl text-white disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-white/80">
        <button type="button" onClick={prev} disabled={index <= 0} className="border border-white/40 px-3 py-1.5 disabled:opacity-30">
          ‹ Prev
        </button>
        <span>
          {index + 1} / {total}
        </span>
        <button type="button" onClick={next} disabled={index >= total - 1} className="border border-white/40 px-3 py-1.5 disabled:opacity-30">
          Next ›
        </button>
      </div>
      <p className="text-center text-xs text-white/50">Click the arrows, swipe, or use your keyboard to flip through.</p>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import { useState } from 'react';

export default function ImageListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const images = value ?? [];
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  async function handleFile(i: number, file: File) {
    setUploadingIndex(i);
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
      });
      const next = [...images];
      next[i] = blob.url;
      onChange(next);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingIndex(null);
    }
  }

  function remove(i: number) {
    onChange(images.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...images, '']);
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {images.map((src, i) => (
          <div key={i} className="rounded border border-black/10 bg-white p-2">
            <div className="relative mb-1.5 aspect-[3/4] w-full overflow-hidden rounded bg-cream-deep">
              {src && <Image src={src} alt="" fill quality={90} className="object-cover" sizes="120px" />}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(i, file);
              }}
              className="mb-1 block w-full text-[10px]"
            />
            {uploadingIndex === i && <p className="text-[10px] text-tan">Uploading…</p>}
            <button
              type="button"
              onClick={() => remove(i)}
              className="w-full rounded border border-red-300 py-1 text-[10px] text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 rounded border border-headline-green px-3 py-1.5 text-xs uppercase tracking-wide text-headline-green hover:bg-headline-green hover:text-white"
      >
        + Add image
      </button>
    </div>
  );
}

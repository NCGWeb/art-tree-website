'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

export function ImageField({
  label,
  src,
  alt,
  onSrcChange,
  onAltChange,
}: {
  label: string;
  src: string;
  alt?: string;
  onSrcChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onSrcChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <div className="flex items-start gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border border-black/10 bg-cream-deep">
          {src ? (
            <Image src={src} alt={alt || ''} fill className="object-cover" sizes="80px" unoptimized={src.startsWith('blob:')} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] uppercase text-tan">No image</div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="block w-full text-xs text-ink file:mr-3 file:rounded file:border file:border-headline-green file:bg-white file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-wide file:text-headline-green"
          />
          {uploading && <p className="text-xs text-tan">Uploading…</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
          {onAltChange && (
            <input
              type="text"
              value={alt ?? ''}
              placeholder="Alt text (describes the image for screen readers)"
              onChange={(e) => onAltChange(e.target.value)}
              className="w-full rounded border border-black/15 bg-white px-3 py-1.5 text-xs text-ink focus:border-terracotta focus:outline-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}

import { put } from '@vercel/blob';

/**
 * Saves a page's content JSON to Vercel Blob storage at a predictable path
 * (content/<page>.json), overwriting whatever was there before. Public pages
 * read this back via lib/content.ts#getPageContent.
 */
export async function savePageContentBlob(page: string, data: unknown) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not set. Add it to .env.local (see .env.example) or, on Vercel, in Project Settings -> Environment Variables.',
    );
  }

  const json = JSON.stringify(data, null, 2);

  const blob = await put(`content/${page}.json`, json, {
    access: 'public',
    contentType: 'application/json',
    // Keep the pathname exactly `content/<page>.json` (no random suffix) so
    // that saving again overwrites the same blob instead of creating a new
    // one, and so lib/content.ts can find it at a predictable path.
    addRandomSuffix: false,
    token,
  });

  return blob;
}

/**
 * Uploads an admin-provided image file to Vercel Blob storage under
 * uploads/<timestamp>-<filename> and returns its public URL.
 */
export async function uploadImageBlob(file: File) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not set. Add it to .env.local (see .env.example) or, on Vercel, in Project Settings -> Environment Variables.',
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `uploads/${Date.now()}-${safeName}`;

  const blob = await put(path, file, {
    access: 'public',
    contentType: file.type || 'application/octet-stream',
    token,
  });

  return blob;
}

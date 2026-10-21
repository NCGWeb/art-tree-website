import { list } from '@vercel/blob';

import aboutSeed from '@/content/about.json';
import artformsSeed from '@/content/artforms.json';
import contactSeed from '@/content/contact.json';
import exhibitionsSeed from '@/content/exhibitions.json';
import gallerySeed from '@/content/gallery.json';
import homeSeed from '@/content/home.json';
import mediaSeed from '@/content/media.json';
import siteSeed from '@/content/site.json';

export const PAGE_SEEDS = {
  home: homeSeed,
  about: aboutSeed,
  exhibitions: exhibitionsSeed,
  artforms: artformsSeed,
  gallery: gallerySeed,
  media: mediaSeed,
  contact: contactSeed,
  site: siteSeed,
} as const;

export type PageKey = keyof typeof PAGE_SEEDS;

/**
 * Loads a page's content.
 *
 * Vercel's deployed filesystem is read-only, so admin edits can't be written
 * back into /content/*.json in the repo. Instead, edits are saved as JSON
 * blobs in Vercel Blob storage (see lib/blob.ts + the /api/admin/content
 * route). On every request we try Blob storage first (so edits show up
 * immediately, no redeploy needed) and fall back to the file that shipped
 * with the build if nothing has been saved there yet (first run, or Blob
 * isn't configured for local dev).
 */
export async function getPageContent<K extends PageKey>(
  page: K,
): Promise<(typeof PAGE_SEEDS)[K]> {
  const seed = PAGE_SEEDS[page];
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return seed;
  }

  try {
    const prefix = `content/${page}.json`;
    const { blobs } = await list({ prefix, token, limit: 1 });
    const match = blobs.find((b) => b.pathname === prefix) ?? blobs[0];

    if (!match) {
      return seed;
    }

    const res = await fetch(match.url, { cache: 'no-store' });
    if (!res.ok) {
      return seed;
    }

    const data = await res.json();
    // Merge over the seed so new fields added to the seed later (by a
    // future code change) don't vanish just because an older edit is saved.
    return { ...seed, ...data };
  } catch (err) {
    console.error(`[content] falling back to seed for "${page}":`, err);
    return seed;
  }
}

export async function getSiteSettings() {
  return getPageContent('site');
}

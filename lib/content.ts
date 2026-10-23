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
// Reading a saved edit used to call Blob's list() on every page view, which
// counts as a billable "advanced operation" and blew through the free cap.
// A store's public URL is stable (`<storeId>.public.blob.vercel-storage.com`,
// and the storeId is embedded in the read/write token), so we GET the
// content file directly (a cheap simple read) and keep it in memory for a
// minute per server instance. Admin screens pass { fresh: true } so an editor
// never opens stale data and saves it back over a newer edit.
const CACHE_TTL_MS = 60_000;
const contentCache = new Map<string, { at: number; data: unknown }>();

function storeHostFromToken(token: string): string | null {
  const m = token.match(/^vercel_blob_rw_([a-z0-9]+)_/i);
  return m ? `${m[1].toLowerCase()}.public.blob.vercel-storage.com` : null;
}

async function loadSavedContent(page: string, token: string): Promise<unknown | null> {
  const host = storeHostFromToken(token);
  const pathname = `content/${page}.json`;
  if (host) {
    // Read the plain URL. Do NOT add a cache-busting query string: Blob serves
    // an OLDER copy for URLs with a query, and the plain URL is the one that is
    // refreshed on overwrite.
    const res = await fetch(`https://${host}/${pathname}`, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`blob fetch ${res.status}`);
    return res.json();
  }
  // Unrecognised token format: fall back to looking the file up.
  const { blobs } = await list({ prefix: pathname, token, limit: 1 });
  const match = blobs.find((b) => b.pathname === pathname) ?? blobs[0];
  if (!match) return null;
  const res = await fetch(match.url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`blob fetch ${res.status}`);
  return res.json();
}

export async function getPageContent<K extends PageKey>(
  page: K,
  opts: { fresh?: boolean } = {},
): Promise<(typeof PAGE_SEEDS)[K]> {
  const seed = PAGE_SEEDS[page];
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return seed;
  }

  try {
    const hit = contentCache.get(page);
    let saved: unknown | null;
    if (!opts.fresh && hit && Date.now() - hit.at < CACHE_TTL_MS) {
      saved = hit.data;
    } else {
      saved = await loadSavedContent(page, token);
      contentCache.set(page, { at: Date.now(), data: saved });
    }
    if (!saved) {
      return seed;
    }
    // Merge over the seed so new fields added to the seed later (by a
    // future code change) don't vanish just because an older edit is saved.
    return { ...seed, ...(saved as object) };
  } catch (err) {
    console.error(`[content] falling back to seed for "${page}":`, err);
    return seed;
  }
}

export async function getSiteSettings(opts: { fresh?: boolean } = {}) {
  return getPageContent('site', opts);
}

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run dev           # start dev server at http://localhost:3000
npm run build         # production build
npm run start          # run a production build
npm run lint           # next lint
```

There is no test suite configured in this project (no test script, no test runner installed).

Local setup requires `.env.local` (copy from `.env.example`): `ADMIN_PASSWORD`, `SESSION_SECRET`
(generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`), and
optionally `BLOB_READ_WRITE_TOKEN` (without it, the public site still renders from seed content,
but admin Save/Upload actions fail).

## Architecture

This is a Next.js 14 (App Router) + TypeScript + Tailwind site for Art Tree, with a built-in
admin CMS. The core design constraint driving most of the architecture: **Vercel's deployed
filesystem is read-only at runtime**, so admin-made content edits cannot be written back into
the repo's `content/*.json` files — they go to Vercel Blob storage instead, and public pages
read from Blob first, falling back to the bundled JSON seed.

- **`content/*.json`** — seed content, one file per public page (`home`, `about`,
  `exhibitions`, `artforms`, `gallery`, `media`, `contact`) plus `site.json` for shared
  header/footer/nav/WhatsApp number/social links. This is what ships with the build and what
  renders before any admin edit happens.
- **`lib/content.ts`** — `getPageContent(page)` is the single read path every public page
  (Server Component, at request time) calls. It checks Vercel Blob for a saved edit first; if
  found, it's shallow-merged **over** the seed (so new fields added to the seed later don't
  disappear just because an older saved blob doesn't have them yet). Falls back to the seed if
  Blob isn't configured or nothing's been saved.
- **`lib/blob.ts`** — writes edited JSON to Blob storage at `content/<page>.json` with
  `addRandomSuffix: false`, so the path is stable and repeated saves overwrite in place.
- **`lib/auth.ts`** — signs/verifies the admin session JWT (`jose`, HS256, 7-day expiry). Only
  depends on `jose` because it must run on the **Edge runtime** (imported by `middleware.ts`).
- **`middleware.ts`** — gates everything under `/admin/*` and `/api/admin/*` (except the login
  page/route) behind a valid session cookie, redirecting to `/admin/login` otherwise.
- **API routes** (`app/api/admin/`): `login`/`logout` (password check, sets/clears the session
  cookie), `content/[page]` (GET/PUT a page's JSON via `lib/content.ts`/`lib/blob.ts`), `upload`
  (a Vercel Blob **client-upload** handshake — `handleUpload` from `@vercel/blob/client` — so
  the browser PUTs image files straight to Blob storage, bypassing Vercel's ~4.5MB serverless
  body limit a normal multipart upload would hit).
- **Admin UI** (`app/admin/(dashboard)/`, `components/admin/`): one route + one editor
  component per content page (e.g. `components/admin/editors/GalleryEditor.tsx`), built from
  shared primitives (`Field`, `ImageField`/`ImageListField` which upload via the client-upload
  route above, `CardList` for repeatable/reorderable entries like exhibitions or gallery items,
  `SaveBar`). Each editor screen has one Save button and a "View live page" link.
- **Public pages** (`app/<page>/page.tsx`) call `getPageContent('<page>')` and render from
  whatever comes back — they never know whether they're looking at the seed or a Blob override.

## Things to know before editing content/structure

- Changing the shape of a `content/*.json` seed means `getPageContent`'s shallow merge
  (`{ ...seed, ...data }`) won't deep-merge nested objects/arrays — a saved edit with an old
  shape for a nested field will fully shadow the new seed's version of that field, not merge
  into it.
- Known placeholder images still in use (see README "What was deliberately simplified" for the
  full list): the Exhibitions page VAMA poster and the Gallery page's four "Featured Artworks"
  images are stand-ins from other gallery photos; the 8 Art Forms entries have no real photos
  yet. These are meant to be replaced via `/admin`, not treated as bugs.
- The Media page is a dependency-free prev/next image viewer (not the original site's CDN-based
  page-curl flipbook), fully content-managed from Admin → Media.
- Card reordering in the admin uses up/down buttons, not drag-and-drop — intentional per the
  original brief, not a missing feature.

## IMPORTANT: production content lives in Blob storage, not in this repo

**This is the single most important thing to understand before touching any page's text or
images.** Production (`art-tree-website.vercel.app` / the live domain) has real content saved
via `/admin` for `home`, `about`, `artforms`, `exhibitions`, `gallery`, and `media` — custom
hero photos, real press images, art-form edits — that **does not exist in this repo** and is
**not overwritten by deploying new code**. Editing `content/home.json` and pushing changes
nothing about what's live for any field that's already been saved in Blob; only genuinely new
fields (ones the saved blob doesn't have yet) fall through to the seed.

Consequences:
- If you change an image path, heading, or any other content field in `content/*.json` and the
  user says it's "not reflecting" live after deploy, this is almost certainly why — not a cache
  or deploy problem. Check what's actually live by reading the Blob copy directly (see below)
  before assuming the code is broken.
- To make a content change visible in production, you must **patch the saved Blob JSON directly
  in addition to** editing the repo's seed file, or it'll only ever show up for a fresh install
  with nothing saved. Pattern (needs `BLOB_READ_WRITE_TOKEN` in `.env.local` — get it from the
  Vercel dashboard → the project → Storage → the Blob store → its .env.local/Quickstart tab):

  ```js
  const { list, put } = require('@vercel/blob');
  const token = /* from .env.local */;
  const { blobs } = await list({ prefix: 'content/home.json', token, limit: 1 });
  const data = await (await fetch(blobs[0].url)).json();
  data.someField = 'new value';           // patch only what you changed
  await put('content/home.json', JSON.stringify(data), {
    access: 'public', addRandomSuffix: false, allowOverwrite: true,
    contentType: 'application/json', token,
  });
  ```

  Patch **only the field(s) you actually changed** — overwriting the whole blob with the repo's
  seed would destroy real uploaded content (custom photos, text edits) that exists only in Blob
  and nowhere else. Before writing, it's worth diffing the live blob against the repo's seed
  file for that page so you know what's actually different and don't clobber something real.
- Once `BLOB_READ_WRITE_TOKEN` is set in `.env.local`, local `npm run dev` *also* reads from the
  same production Blob store (not just the repo's seed) — which is useful (local now matches
  live much more closely) but means you're looking at real data locally too, so don't delete
  blobs casually "to test."
- There's no need to delete/reset a page's blob to fix drift — the seed and the blob can safely
  diverge forever on fields the user never asked to change; only patch what's actually needed.

## Established pattern: full-bleed hero / background image with overlaid text

Several sections (Home hero, Home "Record", About hero, Art Forms hero) use the same
illustration-style artwork: a painted scene occupying roughly the left portion of the image,
with a large area of blank canvas (matching the site's own cream tone) to its right, built for
exactly this treatment. The pattern that was landed on after a few false starts:

```tsx
<section className="relative overflow-hidden bg-cream/88">
  <div className="relative w-full aspect-[1955/803]">  {/* match the artwork's real ratio */}
    <Image src={...} alt={...} fill priority quality={90} className="object-cover object-left-top" sizes="100vw" />
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/50 to-cream/92" />
    <div className="absolute inset-0 z-10 flex items-center justify-end px-5 lg:pr-10 xl:pr-16">
      {/* text, sized down at the base breakpoint and growing at sm:/lg: */}
    </div>
  </div>
</section>
```

Why it's built this way, after three failed attempts:
1. A **two-column grid** (image in its own cell, text in another) left a visible dead rectangle
   of blank canvas sitting as its own boxed-off element — looked like two pictures, not one.
2. **`object-cover` with a fixed/content-driven `min-height`** (no `aspect-[...]`) crops the
   artwork whenever the box's aspect ratio doesn't match the image's own — which happens at
   *some* viewport width no matter what height you pick. This actually cropped the canopy.
3. **`aspect-[...]` with text in normal document flow below it on mobile** (stacking) avoids the
   crop, but the user explicitly rejected stacking — text must overlay the image at every
   breakpoint, never stack above/below it.

The combination that satisfies both constraints simultaneously: `aspect-[1955/803]` (or
whatever the specific artwork's real ratio is — **check with `file` on the actual asset**,
don't assume) guarantees the box's ratio always matches the image's, so `object-cover` never
has anything to crop regardless of viewport width. Text is then `absolute inset-0`, which keeps
it from affecting the box's own height at all — so a short box (phone width) still shows the
complete, uncropped artwork; the overlaid text just gets less room there, which is handled by
sizing it down at the base breakpoint (and hiding the least-essential line, e.g. a lead
paragraph or quote, below `sm`) rather than by growing the box.

If you're asked to apply this same treatment to another section, reuse this exact structure —
don't reach for a min-height or a two-column grid again.

## Known chores to be done after a `npm run build`

`npm run build` and `npm run dev` write to the same `.next/` directory. Running a build while a
`dev` server is active corrupts its dev manifest (pages return 200 but every CSS/JS chunk
404s — the page loads completely unstyled). After *any* `npm run build` during a session where
`npm run dev` was already running: kill the dev server, `rm -rf .next`, and start `npm run dev`
again before telling the user to check localhost.

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

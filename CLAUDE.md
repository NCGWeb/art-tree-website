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
- Known placeholder images still in use: the VAMA poster on Exhibitions, and 8 Art Forms entries
  with no real photos yet. They are meant to be replaced via `/admin`, not treated as bugs.
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

## Established patterns (heroes, alignment, mobile)

**Every image and text on a public page must be editable from `/admin`.** Never hardcode an
image path or copy in a page component. Put it in `content/<page>.json`, render it from
`getPageContent`, and add the field to that page's editor in `components/admin/editors/`.
A new nested field also needs a code-side fallback (`value || '/images/default.png'`) or a patch
of the saved Blob, because the merge is shallow (see below). Decorative cutouts (Home canvas
flower, Gallery branch and lotus, About sprig) are all CMS fields for this reason.

**Right edges line up with the nav.** Anything right-anchored (About/Art Forms hero text, Home
Record text) sits inside `mx-auto max-w-site px-5`, the same container as `SiteHeader`, never
pinned to the viewport edge.

**Hero text over painted artwork, sm and up (About, Art Forms, Home Record):** an aspect-locked
box that matches the artwork's real ratio (check with `file`, don't assume), so `object-cover`
never crops it. Text is `absolute inset-0` inside the `max-w-site` container:

```tsx
<div className="relative w-full aspect-[1955/803]">
  <Image fill className="object-cover object-left-top" sizes="100vw" />
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/50 to-cream/92" />
  <div className="absolute inset-0 z-10">
    <div className="mx-auto flex h-full max-w-site items-center justify-end px-5">{/* text */}</div>
  </div>
</div>
```

Put the text on the side of the artwork's blank canvas. The Home Record artwork has its blank
canvas on the left, so its text is `justify-start` and the gradient is `bg-gradient-to-l`.

**Mobile (below sm) is a separate block, not the same box shrunk.** The aspect-locked box is only
~154px tall on a phone, so overlaying text there overflows. Instead:
- About and Art Forms heroes: an Events-style full-bleed hero (`sm:hidden`), the artwork as a
  background under `bg-gradient-to-b from-ink/55 via-ink/65 to-ink/80`, white text, height driven
  by `py-12`, eyebrow + heading + lead (+ quote on About) all shown.
- Home Record: stacked in normal flow, text first, then the image (`sm:hidden`).
- Two-column sections (About Philosophy) are `grid-cols-1` until `sm`.

Centring a text block over this artwork (`justify-center`) overlaps the painted tree at every
width. Don't.

## Transparent cutouts and image processing

Decorative art (`canvas-flower-sprig.png`, `g-lotus-cutout.png`, `g-bird-upload-cutout.png`,
`about-sprig-cutout.png`) must be real transparent PNGs; a paper-coloured background shows as a
box, and `mix-blend-multiply` doesn't hide it. No Python or sharp is installed. Key a background
out with Playwright's Chromium (canvas `getImageData`, sample the corner colour, make near-matches
transparent, crop to bounds), then rename the file when replacing one, because `next/image` caches
by URL in dev.

## Verifying UI

`playwright` is available with `npm install -D playwright --no-save` and `npx playwright install
chromium`; it is not in `package.json`. Screenshot at 375 and 1440 wide. Scroll-reveal sections
(`Reveal`) only fade in on real scroll, so step `window.scrollTo` through the page and wait before a
`fullPage` screenshot, and use `waitUntil: 'load'` (dev HMR never reaches `networkidle`). Local dev
reads the same Blob as production once `BLOB_READ_WRITE_TOKEN` is set.

## Deploying and syncing the CMS

Push to `origin master`; Vercel's GitHub integration deploys it. Check with
`gh api repos/thiru-hue/art-tree-website/commits/<sha>/status`. If a change touches content, push
first and wait for `success`, then patch the Blob (so the new file exists before the page
references it), changing only the fields you edited, and report which Blob values you replaced.
Before overwriting any image field, read its current Blob value; it may be the owner's own upload
(this already happened once with the Gallery branch image) and should be kept or cut out, not swapped.

**Never read a content blob with a query string (`?t=`, `?v=`).** Blob serves an OLDER copy for URLs
with a query, while the plain URL is the one refreshed on overwrite. Read-modify-write scripts that
used `?t=` silently reverted earlier patches (it wiped six art-form credits and the "Gond" rename).
Read the plain `list()` URL / `https://<storeId>.public.blob.vercel-storage.com/content/<page>.json`
with `cache: 'no-store'`, patch every field you need in ONE write, and verify against the live page.

**`lib/content.ts` must not call `list()` per request.** Each `list()` is a billable Blob "advanced
operation"; doing it on every page view blew the Hobby cap (2K) and paused the account. Public reads
GET the fixed URL (store id comes from the token) and cache 60s in memory; admin screens pass
`{ fresh: true }`.

Pages with saved Blob content: home, about, exhibitions, artforms, gallery, media. Contact and
site have none, so their seeds apply directly.

## Misc

- Favicon is `app/icon.png` (the logo tree on a dark tile); Next serves it automatically.
- Header tagline is bottom-aligned (`items-end`) with the logo wordmark on desktop.
- The Gallery page follows the "Discover stories through art" mockup: a five-card fan with
  edge-to-edge images (`GalleryFan`), the lotus between the collection text and quote, framed
  Featured cards. Several gallery photos are still event photos, not artworks; swap them from
  `/admin` → Gallery.
- The VAMA entry on Exhibitions still uses a placeholder (`g56.jpg`) until the poster photo is
  uploaded from `/admin` → Exhibitions.

## Image quality (next/image with object-cover)

`sizes` must describe the width the image is actually *drawn* at, not the box it is clipped to.
With `object-cover` and a source whose aspect differs from the box (landscape photos in the tall
Gallery fan cards), the image is scaled to the box's long side and is much wider than the box.
Telling Next the box width makes it serve a tiny file that the browser then enlarges, which looks
blurry. The Gallery fan uses `sizes="(min-width: 1024px) 1100px, 100vw"` and `quality={95}`;
Featured cards use `700px`/`100vw`. Check with Playwright at `deviceScaleFactor: 2`: compare each
image's `currentSrc` `w=` against its drawn size. Decorative cutouts are small source files, so
keep them at or below their native size.

## Where we left off (update this at the end of each session)

Last updated 2026-10-22. Everything below is pushed to GitHub (`master`) and live on Vercel; the
saved Blob content is in sync for the fields listed.

Done this session:
- Home: Record section uses the garden artwork (`record-women.webp`), text on the left, stacked on
  mobile; stats band with ornamental side borders; canvas image at 41% width with the small flower
  (CMS field `canvas.flowerImage`); "What we do" ornament; ruled footer banner; "Know more" links
  to `/about` (CMS field `expertise.buttonHref`).
- About / Art Forms: Events-style full-bleed mobile hero; nav-aligned desktop overlay; About
  Philosophy stacks on mobile with a larger left-aligned quote.
- Gallery: rebuilt to the mockup (five-card fan, lotus, framed Featured cards); branch and lotus
  are CMS fields; images served at higher resolution (see Image quality above).
- Art Forms: every entry has an editable `credit` line (artist name) shown below its image; all eight are filled (seed and Blob).
- Header tagline aligned with the logo wordmark; favicon `app/icon.png`.
- Blob fields patched: home `record.image/alt`, home `canvas.flowerImage`, gallery
  `hero.birdImage` (cutout of the owner's own upload), gallery `collection.decorImage`.

Open items / next steps:
1. **VAMA poster on Exhibitions** still shows the placeholder `g56.jpg`. The owner pasted the photo
   in chat but it never reached disk. Get the file (or have them upload it in `/admin` →
   Exhibitions), then set it on the Current Show header and the `vama` event card, in the seed and
   in the Blob.
2. **Gallery photos** are mostly event photos, and one is a screenshot of the design mockup. The
   owner should supply the real artwork images (high resolution); swap them in `/admin` → Gallery
   (carousel and Featured).
3. **Footer** is shared by all pages and does not yet match the mockup's green footer with the
   patterned border. Changing it affects every page, so confirm first.
4. **Stats band** has 3 items; the reference design has 4 (12+ years, 500+ artists, 100+ exhibitions
   and programmes, 1,00,000+ people). The layout adapts to 3 or 4; this is a content decision.
5. Contact and Media pages have not been through the mobile/desktop audit (only Home, About, Art
   Forms, Gallery have).
6. A dev server may not be running; start it with `npm run dev` before screenshots.

## Known chores to be done after a `npm run build`

`npm run build` and `npm run dev` write to the same `.next/` directory. Running a build while a
`dev` server is active corrupts its dev manifest (pages return 200 but every CSS/JS chunk
404s — the page loads completely unstyled). After *any* `npm run build` during a session where
`npm run dev` was already running: kill the dev server, `rm -rf .next`, and start `npm run dev`
again before telling the user to check localhost.

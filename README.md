# Art Tree — Website & CMS

A fast, modern replacement for the old static Art Tree HTML site, built with Next.js (App
Router) + TypeScript + Tailwind CSS, with a simple, non-technical-friendly CMS for editing
every page's text and images.

## What was built

- **7 public pages**, rebuilt to match the original site's design and copy as closely as
  possible: Home, About, Exhibitions, Art Forms, Gallery, Media, Contact. Shared header
  (with mobile menu), footer and a floating WhatsApp button live in `app/layout.tsx`.
- **All real marketing copy** from the original site (including every "Read more" / "Details"
  modal's long-form text) was extracted into JSON files under `/content`, one per page. These
  are the **seed content** — what the site shows the first time it runs, before anyone edits
  anything.
- **A password-protected admin area** at `/admin` where a non-technical staff member can edit
  every page's text and images with plain forms (no JSON, no code).
- Edits are saved to **Vercel Blob storage** (not back into the repo's files, since Vercel's
  deployed filesystem is read-only at runtime). Public pages always render dynamically and
  check Blob storage first, falling back to the bundled seed JSON if nothing has been saved
  yet. This means edits appear on the live site immediately — no redeploy needed.

## How the CMS works (architecture)

- `content/*.json` — the seed content, bundled with the app. Edited by hand in this repo, or
  effectively overridden by `lib/content.ts` once an admin save happens.
- `lib/content.ts` — `getPageContent(page)` is called by every public page (as a Server
  Component, at request time). It tries to fetch `content/<page>.json` from Vercel Blob first;
  if that blob doesn't exist yet (fresh install, nothing saved) or `BLOB_READ_WRITE_TOKEN`
  isn't configured, it falls back to the bundled seed from `/content`.
- `lib/blob.ts` — `savePageContentBlob(page, data)` writes the edited JSON to Blob storage at
  `content/<page>.json` with `addRandomSuffix: false` (so the path stays stable and each save
  overwrites the last one). `uploadImageBlob(file)` uploads an admin's
  image upload to `uploads/<timestamp>-<filename>`.
- `/api/admin/content/[page]` (GET/PUT) — reads/writes a page's JSON via the above.
- `/api/admin/upload` (POST) — accepts a multipart image upload, pushes it to Blob, returns its
  public URL for the admin form to use.
- `/api/admin/login` + `/api/admin/logout` — password check against `ADMIN_PASSWORD`, sets an
  httpOnly signed session cookie (`jose`/HS256, ~7 day expiry).
- `middleware.ts` — protects everything under `/admin/*` and `/api/admin/*` (except the login
  page/route itself), redirecting to `/admin/login` if there's no valid session cookie.
- `/admin` — a dashboard with one screen per page. Each screen is plain labelled fields (text
  inputs, textareas, and "card list" add/delete/reorder UI for repeatable content like
  exhibitions, art forms, stats and gallery items). Image fields show a thumbnail, a file
  picker that uploads straight to Blob storage, and an alt-text box. Each screen has a single
  **Save changes** button and a **View live page** link.
- `/admin/settings` edits `content/site.json` — the shared header/footer/nav/WhatsApp
  number/social links used across every page.

## Local development

```bash
npm install
cp .env.example .env.local
# then edit .env.local and fill in the three values (see below)
npm run dev
```

Open http://localhost:3000 for the public site, and http://localhost:3000/admin/login for the
CMS.

### Environment variables (`.env.local`)

| Variable | What it's for | How to get it |
|---|---|---|
| `ADMIN_PASSWORD` | Password for `/admin/login`. | Pick your own strong password. The `.env.example` default (`changeme123`) is **not safe to ship** — change it before going live. |
| `SESSION_SECRET` | Signs the admin session cookie. | Generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `BLOB_READ_WRITE_TOKEN` | Lets the app read/write Vercel Blob storage (content edits + uploaded images). | See below. |

**Getting a `BLOB_READ_WRITE_TOKEN`:**
1. Push this project to GitHub and import it into Vercel (see below), **or** just create the
   Blob store first and use the token locally even before deploying.
2. In the [Vercel dashboard](https://vercel.com/dashboard), open your project (or create one
   for this purpose) → **Storage** tab → **Create Database** → **Blob** → give it a name.
3. Once created, open the store → **.env.local** tab (or **Quickstart**) and copy the
   `BLOB_READ_WRITE_TOKEN` value shown there.
4. Paste it into your local `.env.local`. In Vercel itself, connecting the Blob store to the
   project auto-adds this env var to your deployments — you don't need to re-type it there.
5. Alternatively, once the project is linked (`npx vercel link`), run `npx vercel env pull
   .env.local` to pull all configured env vars down automatically.

Without `BLOB_READ_WRITE_TOKEN` set, the public site still works fine (it just always shows the
seed content), but the admin's Save/Upload actions will fail with a clear error message.

## Deploying

1. **Push to GitHub.** Create a new repository and push this project's contents to it.
2. **Import into Vercel.** In the Vercel dashboard, "Add New… → Project", pick the GitHub repo.
   Framework preset should auto-detect as Next.js — no build settings need changing.
3. **Add environment variables.** In the new project's **Settings → Environment Variables**,
   add `ADMIN_PASSWORD` and `SESSION_SECRET` (same names as `.env.example`). Add
   `BLOB_READ_WRITE_TOKEN` too if you haven't already connected a Blob store (see above — the
   simplest path is actually to create/connect the Blob store from **Storage** tab inside this
   same Vercel project, which wires the token in automatically).
4. **Deploy.** Vercel will build and give you a `*.vercel.app` URL. Test the site and `/admin`
   there before pointing the real domain at it.
5. **Point `art-tree.co.in` at Vercel:**
   - In the Vercel project, go to **Settings → Domains** and add `art-tree.co.in` (and
     `www.art-tree.co.in` if you want both).
   - Vercel will show you the exact DNS records to add. Generally, at your domain
     registrar/DNS provider:
     - Apex domain (`art-tree.co.in`): an **A record** pointing `@` to `76.76.21.21` (or
       whatever ANAME/ALIAS record Vercel's dashboard shows, if your DNS provider supports
       that instead).
     - `www` subdomain: a **CNAME record** pointing `www` to `cname.vercel-dns.com`.
   - DNS changes can take anywhere from a few minutes to a few hours to propagate. Vercel's
     Domains screen will show a green check once it detects the records are correct, and it
     issues the HTTPS certificate automatically.

## What was deliberately simplified (follow-ups for the client)

- **Two images were missing from the original site export** and had to be substituted with
  placeholders from the existing gallery photos, both easily replaced from `/admin`:
  - The "VAMA — The Strength Within" poster on the Exhibitions page (`vama-poster.jpg` was
    referenced in the old HTML but not present in the exported files) — currently shows
    `gallery/g56.jpg` as a stand-in.
  - The four "Featured Artworks" images on the Gallery page (`featured-madhubani.webp`,
    `featured-sanjhi.webp`, `featured-fish.webp`, `featured-exhibition.webp` were likewise
    referenced but missing) — currently show four existing gallery photos as stand-ins.
  - Go to **Admin → Exhibitions** / **Admin → Gallery** and use "Replace image" to swap in the
    real photos whenever they're available.
- **Art Forms page images**: the original site also had no real photos for the 8 art-form
  entries (Gond, Phad, Pichwai, Sanjhi, Sohrai, Warli, Madhubani, Bhil) — they were dashed
  "Artwork placeholder" boxes in the original, and this rebuild reproduces that same
  placeholder look until real photos are uploaded via **Admin → Art Forms**.
- **Media page**: the original used a third-party 3D "page-curl" flipbook library
  (`page-flip@2.0.7` loaded from a CDN). This rebuild uses a simpler, dependency-free
  previous/next image viewer with keyboard-arrow support that achieves the same goal (flipping
  through press clippings one at a time) without pulling in an animation library purely for a
  visual flourish — and it's fully content-managed from **Admin → Media**, including add/
  remove/reorder of pages.
- **Scroll-reveal fade-in animations** present in the old site's `main.js` (sections fading up
  as you scroll) were not reproduced; the new pages render with normal static layout instead.
  This is a purely cosmetic simplification.
- **Hero "leaf" hotspot positions** on the Home page (the invisible clickable leaf shapes over
  the hero illustration linking to About/Art Forms/Events/Media/Gallery/Contact) are
  reproduced at the same percentage-based positions as the original CSS, but are not currently
  exposed as admin-editable fields (they're tied to the artwork itself, not text content).
- **Card reordering** in the admin uses simple up/down arrow buttons rather than drag-and-drop,
  per the brief's suggestion that add/delete-level functionality is enough for v1.
- **Basic validation only**: the admin forms don't block saving with empty required fields;
  content that looks obviously wrong (e.g. a blank heading) will just render blank on the
  public page, rather than being rejected at save time.
- **Images use Next.js `fill` + a fixed aspect-ratio wrapper** rather than each image's exact
  natural pixel dimensions (which weren't readily available for every source file). Visually
  this looks identical; it just means `next/image` doesn't know the original file's intrinsic
  size up front.

## Project structure (top two levels)

```
Arttree_new/
├── app/                     Next.js App Router routes
│   ├── admin/               /admin (dashboard) + /admin/login
│   ├── api/admin/           login, logout, upload, content/[page] routes
│   ├── about/ artforms/ contact/ exhibitions/ gallery/ media/   one folder per public page
│   ├── layout.tsx           root layout: fonts, header, footer, WhatsApp button
│   ├── page.tsx             Home page
│   └── globals.css
├── components/              Public-site components (header, footer, modals, etc.)
│   └── admin/                Admin-only components, incl. editors/ (one per content page)
├── content/                 Seed content JSON — one file per page, plus site.json
├── lib/                     content.ts, blob.ts, auth.ts (server-side helpers)
├── public/images/           All site images (copied from the original export)
├── middleware.ts            Protects /admin and /api/admin routes
├── next.config.js
├── tailwind.config.ts
└── .env.example
```

## Admin login (local)

- URL: http://localhost:3000/admin/login
- Password: whatever you set `ADMIN_PASSWORD` to in `.env.local` (the example file ships with
  `changeme123` — change this before deploying anywhere real).

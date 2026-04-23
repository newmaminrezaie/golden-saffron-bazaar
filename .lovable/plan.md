

## Add `robots.txt` and `sitemap.xml`

Since the site is **static-prerendered** and deployed to Nginx (no server runtime at request time), both files will be **generated at build time** and emitted into `dist/` so Nginx serves them as plain static files at `/robots.txt` and `/sitemap.xml`.

### Approach

Use a small Vite plugin inside `vite.config.ts` that runs after the prerender step and writes both files into the build output. It already knows every URL (the `routes` array we hand to the prerenderer), so we reuse that single source of truth — no drift between sitemap and actually-built pages.

The site URL needs to be configurable. I'll add `VITE_SITE_URL` to `.env.example` (e.g. `https://khajavi-saffron.com`) and read it in the config with a sensible fallback.

### `robots.txt` (static file)

Create `public/robots.txt` — Vite copies `public/` verbatim to `dist/`, so this needs zero plugin work:

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

The `Sitemap:` line will be templated from `VITE_SITE_URL` at build time via the same plugin (it'll overwrite this file in `dist/` with the resolved URL). That keeps the source readable while still letting the deployed file have the correct domain.

### `sitemap.xml` (build-time generated)

A `writeSeoFiles` Vite plugin in `vite.config.ts`:
- Hooks into `closeBundle` (runs after prerender finishes)
- Builds the URL list from the same arrays already used for prerender: `/`, `/about`, `/contact`, `/shop`, `/blog`, all `/shop/<slug>`, all `/blog/<slug>`
- For blog URLs, uses each article's `publishedAt` as `<lastmod>` (parsed from `articles.json`, already loaded above)
- For other URLs, uses today's build date as `<lastmod>`
- Sets sensible `<changefreq>` / `<priority>` (home + shop = higher, static pages = lower)
- Writes `dist/sitemap.xml` and rewrites `dist/robots.txt` with the resolved `Sitemap:` URL

Output shape:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/blog/khavass-zafaran</loc>
    <lastmod>2025-...</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  ...
</urlset>
```

### Files touched

1. **`public/robots.txt`** (new) — readable default, gets its `Sitemap:` line rewritten in `dist/` at build time.
2. **`vite.config.ts`** (edit) — add a `writeSeoFiles` plugin in the `vite.plugins` array that emits `dist/sitemap.xml` and rewrites `dist/robots.txt`. Reuses the existing `PRODUCT_SLUGS` and parsed `articles` data so there's only one source of truth.
3. **`.env.example`** (edit) — add `VITE_SITE_URL=https://yourdomain.com` with a comment.
4. **`DEPLOYMENT.md`** (edit) — short note that `/robots.txt` and `/sitemap.xml` are auto-generated at build time and that `VITE_SITE_URL` must be set in `.env` before `npm run build`. Also a one-liner reminder to submit the sitemap in Google Search Console after first deploy.

### Out of scope

- No `?category=...` shop URLs in the sitemap — they're filtered views of the same `/shop` page; including them risks Google flagging duplicates. Can be added later with `<link rel="canonical">` if you want.
- No image sitemap extension (can add later for product images if you want stronger Image Search).
- No automatic submission to Google — manual via Search Console after first publish.


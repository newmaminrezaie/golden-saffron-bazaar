# Fix the 13 unindexed pages (ready for multiple languages)

## Where things stand

- **10 pages, "Alternate page with proper canonical tag":** this was fixed in the code last round. Every page now points at its own address, not the homepage. But the live site still serves the old build, and Google's report is based on the old crawl. Upload a fresh build, then ask Google to re-check.
- **2 pages, "Page with redirect":** the most likely cause is the trailing slash. The build saves each page as a folder (`/shop/index.html`). Nginx then redirects `/shop` to `/shop/` with a 301. But the sitemap and the page's own address tag both say `/shop`, so Google sees a page that redirects away. The other possibility is old `/product/...` links. Google's export shows which URLs these are.
- **1 page, "Server error (5xx)":** this one isn't thin content. Google got a server error. That usually means a page with no saved HTML (a product added from the admin panel) fell through to the backend or failed while the site was being restarted.
- **One more gap:** the sitemap and the saved pages only include products listed in the source code. Products added in the admin panel never get a saved HTML page or a sitemap entry, so Google can't index them properly.

## What I'll change

1. **One URL style everywhere: no trailing slash.** I'll set the build to save `/shop.html`-style files, or give you an Nginx rule (`try_files $uri $uri.html $uri/index.html /index.html`). Either way, `/shop` serves straight away and `/shop/` redirects to `/shop`. The sitemap, address tags, internal links and the Torob feed will all use that same style.
2. **Include admin-added products.** At build time, fetch the product list from your local backend, with the source file as a fallback so the build still works offline. Every product then gets a saved page and a sitemap entry.
3. **Clean up redirects:** add a permanent redirect from old `/product/<slug>` links to `/shop/<slug>`, and make sure nothing that redirects stays in the sitemap.
4. **Never return a 5xx for a page:** unknown pages fall back to the app's own "not found" page with a noindex tag, instead of reaching the backend.
5. **Get ready for multiple languages:** pages will live under `/en/...`, `/tr/...` and `/ar/...`, with Persian staying at the root. The address helper already supports this. I'll add:
   - The language prefix to the page list and the sitemap, with alternate-language links for each page in the sitemap.
   - A per-language `<html lang/dir>` setting (rtl for fa and ar, ltr for en and tr).
   - Alternate-language and default tags in each page's head, switched on only when a language actually has content. This avoids pointing Google at empty pages.
   The translated content itself is a separate step.
6. **Your steps after uploading:** an updated Nginx block to paste. Then in Search Console, resubmit the sitemap and click "Validate fix" on all three reasons.

## Technical details

- Build pages list comes from `fetch(http://127.0.0.1:3002/api/products)` with a timeout, falling back to the slug list from `products.ts`.
- `seo.ts`: `LOCALES` grows, plus an `ENABLED_LOCALES` gate. Sitemap entries emit `xhtml:link` alternates.
- Nginx: `location ~ ^/(.+)/$ { return 301 /$1; }`, `rewrite ^/product/(.*)$ /shop/$1 permanent;`. `/api` and `/uploads` stay as they are, and gandomakshop is not touched.

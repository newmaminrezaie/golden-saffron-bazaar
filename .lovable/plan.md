# SEO and technical cleanup across the site

Goal: every page gets its own correct address tags, share preview, and structured data; images stop causing layout jumps; the sitemap points at the real domain. Product pages stay at `/shop/[slug]` as they are today.

## What's wrong right now

- One single canonical address (`https://khajavisaffron.ir/`) is stamped on every page, including all product and article pages. Search engines are told every page is the homepage — this is the main indexing problem.
- The same is true for the share-preview address (`og:url`).
- The sitemap written during the build uses a placeholder domain (`https://yourdomain.com`) unless an environment variable happens to be set, so the published sitemap is likely wrong.
- Product pages have no Product structured data (price, availability, brand).
- Most images have no declared size, so the page jumps around while loading; several below-the-fold images also load immediately instead of lazily.

Already fine and left alone: `robots.txt` (already exactly as requested), Persian/RTL setting on the root, the Organization data on the homepage, and fonts (they are bundled locally — no Google Fonts, which also keeps the site fully offline-capable). The homepage already splits its lower sections into separate chunks; I'll re-check for any stray heavy imports.

## What I'll do

**1. One address helper, multi-language ready**
A single small module holds the base address `https://khajavisaffron.ir` and builds page addresses from it. Everything — canonicals, share tags, sitemap, product data — reads from it. When English, Turkish and Arabic arrive, adding `/en`, `/tr`, `/ar` and their language-alternate tags becomes a change in one place.

**2. Per-page canonical and share tags**
Remove the hardcoded canonical and share address from the shared root, then add the correct ones to each page: home, shop, blog, about, contact, each product, each article. Each page also gets its own share title, description and type (`product` for products, `article` for posts, `website` elsewhere). Checkout, payment and admin pages get marked "do not index".

**3. Product structured data**
Each product page gets Product data: name, description, image, brand, and an offer with price, currency IRR and availability, plus its own breadcrumb trail.

**4. Images**
Measure every image file in the project and set its real width and height (with `height: auto` so responsive layouts are unaffected). The first hero image, logo and top banner load eagerly with high priority; everything else loads lazily.

**5. Sitemap and robots**
Fix the build step to always use `https://khajavisaffron.ir` instead of the placeholder, covering home, shop, blog, about, contact, every product and every article. Remove the second, unused sitemap page so there is only one source. Robots stays as it is.

**6. Homepage weight**
Audit homepage imports and push anything only used on inner pages into those pages.

## Constraints respected

No www, no service worker or manifest, no in-app HTTP→HTTPS redirect, asset paths stay relative, homepage Organization data untouched, static-only build kept, everything works offline.

## Technical notes

- New `src/lib/seo.ts`: `SITE_URL`, `canonical(path)`, `absoluteUrl(path)`, and a `pageHead()` builder returning `meta` + `links` for a route's `head()`.
- Canonical goes in `links` on leaf routes only (root concatenates, so a root canonical would duplicate).
- `/shop` canonical resolves to `/shop` without the category search param, so filtered views don't split indexing.
- Product/article share images are made absolute via the helper; bundled assets that can't resolve absolutely are omitted rather than tagged relative.
- `vite.config.ts`: replace `process.env.VITE_SITE_URL || "https://yourdomain.com"` with the constant; delete `src/routes/sitemap[.]xml.tsx`.
- Image sizes read with an image tool over `src/assets` and `public/blog`; runtime-uploaded product images keep aspect-ratio containers since their size isn't known at build time.

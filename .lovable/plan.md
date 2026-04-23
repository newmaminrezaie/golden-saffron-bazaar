

## Add a blog (`مقالات`) page — prerendered & Google-indexable

A `/blog` listing + `/blog/$slug` article pages, with content sourced from a single hosted JSON file so you can add new articles without code changes (just edit the JSON, redeploy or re-fetch on next build).

### Key decision: how "hosted" works with this site

The site is built as **static prerendered HTML** (`vite.config.ts` → `target: "static"`, `prerender.enabled: true`). For Google to actually index articles, the article HTML must exist at build time. So:

- Articles live in **one JSON file you host yourself** (recommended: `public/articles.json` in this project, or any external URL like GitHub raw, a CDN, or your own server).
- At **build time**, `vite.config.ts` fetches/reads that JSON and feeds article slugs into the prerender list — same pattern already used for product slugs.
- Each article page is also generated as a fully-populated static `.html` file (title, meta description, og tags, full article body) → fully crawlable by Google.
- To "add an article", you edit the JSON and trigger a rebuild. No code changes.

If you want truly **no-rebuild** publishing (edit JSON → live in seconds with no deploy), that requires switching off static prerender for `/blog/*` and accepting weaker SEO. Default plan below uses the prerender approach for best SEO. I'll flag the alternative at the end.

### Article JSON schema (`public/articles.json`)

```json
[
  {
    "slug": "khavass-zafaran",
    "title": "خواص زعفران برای سلامتی",
    "excerpt": "نگاهی کوتاه به فواید زعفران اصل قائنات…",
    "coverImage": "/blog/khavass-cover.jpg",
    "author": "خانواده خواجوی",
    "publishedAt": "2025-01-15",
    "tags": ["سلامتی", "زعفران"],
    "content": "## مقدمه\n\nزعفران یکی از…\n\n### بخش دوم\n\n…"
  }
]
```

- `content` is **Markdown** so you can write rich articles (headings, lists, links, images) in plain text.
- `coverImage` doubles as the `og:image` for that article.
- File can live at `public/articles.json` (shipped with the build) **or** any external URL — both are supported by the build script.

### Files to add / change

1. **`public/articles.json`** — new file, seeded with 2 example articles in Persian so you can see the layout immediately.

2. **`src/lib/articles.ts`** — typed `Article` interface + a tiny helper to fetch/parse the JSON. Used by both the route loaders and the prerender step.

3. **`src/routes/blog.tsx`** — `/blog` listing page, title `مقالات`. Loader reads `articles.json`, renders a responsive grid of cards (cover image, title, excerpt, date, author). Persian RTL, matching the existing site styling. Per-route `head()` with title/description/og.

4. **`src/routes/blog_.$slug.tsx`** — single-article page (uses the `blog_` underscore convention you already established for `shop_.$slug.tsx` so it doesn't nest under the listing). Loader finds the article by slug, renders Markdown via `react-markdown` + `remark-gfm`, with prose typography. Per-article `head()` derives `title`, `description` (from `excerpt`), `og:title`, `og:description`, `og:image` (from `coverImage`), `og:type: article`. Includes JSON-LD `Article` schema for richer Google results. 404 boundary if slug unknown.

5. **`src/components/site-header.tsx`** — add `{ to: "/blog", label: "مقالات" }` to `navItems` (appears in both desktop nav and mobile menu automatically).

6. **`src/components/site-footer.tsx`** — add a "مقالات" link (small touch, helps internal linking & SEO).

7. **`vite.config.ts`** — extend the existing slug-extraction pattern: read `public/articles.json`, push `/blog` and `/blog/${slug}` for every article into the `prerender.routes` array. This guarantees every article gets a static HTML file even if the crawler misses one.

8. **New deps**: `react-markdown`, `remark-gfm` (small, well-supported, pure JS — safe for the static build).

### SEO specifics (what makes Google actually index this)

- Each article becomes a real `.html` file at `/blog/<slug>/index.html` with full content in the body — Google crawls it like any static page.
- Per-article `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:image`, `og:type=article` derived from loader data.
- JSON-LD `Article` schema (headline, author, datePublished, image) embedded in `<head>` — boosts rich-result eligibility.
- `<html lang="fa" dir="rtl">` already set in `__root.tsx` ✅.
- Listing page links to every article with `<Link>` — internal linking for crawl discovery.
- (Optional follow-up if you want it later: add `/sitemap.xml` and `/robots.txt`. Out of scope for this turn unless you want them included.)

### How to add a new article (the "easy" part)

1. Open `public/articles.json`.
2. Append a new object: slug, title, excerpt, coverImage, author, publishedAt, tags, content (Markdown).
3. Commit & redeploy → new article auto-appears on `/blog` and gets its own prerendered, Google-indexable page.

That's it — no React, no route files, no rebuild config to touch.

### Alternative (if you'd rather skip rebuilds)

Set the article page to fetch JSON at runtime from an external URL instead of prerendering. Pros: edit JSON → instant publish, no deploy. Cons: Google sees an empty shell on first crawl (Google does run JS, but indexing is slower and weaker for SEO-critical content; social previews like WhatsApp/Telegram won't see the article at all). **I do not recommend this for an SEO-focused blog**, but say the word and I'll switch the plan.

### Out of scope

- Comments, search, pagination (can add later if the blog grows).
- Categories/tag pages.
- RSS feed.
- Sitemap.xml (mention it for a follow-up).


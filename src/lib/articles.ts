// ============================================================
//  HOW TO ADD A NEW BLOG ARTICLE
// ============================================================
//
// 1. Open `public/articles.json`.
// 2. Append a new object inside the `articles` array with these fields:
//
//    {
//      "slug": "my-new-article",            // URL: /blog/my-new-article (don't change after publish)
//      "title": "عنوان مقاله",
//      "excerpt": "خلاصه یکی-دو خطی (meta description + پیش‌نمایش واتساپ)",
//      "coverImage": "/blog/cover.jpg",     // optional. put file in public/blog/
//      "author": "خانواده خواجوی",
//      "publishedAt": "2025-04-23",         // YYYY-MM-DD, used for sorting
//      "tags": ["سلامتی"],                  // optional
//      "content": "## عنوان\n\nمتن مارک‌داون..."
//    }
//
// 3. Re-deploy. The new article auto-appears on /blog and gets its own
//    prerendered, Google-indexable HTML page at /blog/<slug>.
//
// (The full guide is also embedded in `_README` inside articles.json.)
//
// ============================================================

// We import the JSON at build time. This is critical for two reasons:
//   1. The static prerenderer can't fetch its own assets — so loaders
//      that did `fetch("/articles.json")` were crashing the build.
//   2. Bundling guarantees the data is part of the prerendered HTML
//      payload (great for SEO — no client-side fetch needed).
import articlesData from "../../public/articles.json";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author: string;
  publishedAt: string; // ISO date (YYYY-MM-DD)
  tags?: string[];
  content: string; // Markdown
}

interface ArticlesFile {
  _README?: unknown;
  articles: Article[];
}

const ALL_ARTICLES: Article[] = ((articlesData as ArticlesFile).articles ?? [])
  .slice()
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getArticles(): Article[] {
  return ALL_ARTICLES;
}

export function getArticleBySlug(slug: string): Article | null {
  return ALL_ARTICLES.find((a) => a.slug === slug) ?? null;
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
export function toFaDigits(s: string | number): string {
  return String(s).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function formatPersianDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return toFaDigits(`${y}/${m}/${d}`);
}

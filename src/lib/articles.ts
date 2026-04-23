// Type + loader helpers for blog articles.
//
// Articles live in `public/articles.json` and are served as a static asset
// at `/articles.json`. Loaders fetch this URL — works in both dev (Vite
// serves /public) and production (file is copied to dist/).
//
// To add an article: edit `public/articles.json` and rebuild. The vite
// config also reads this file at build time to register a prerendered HTML
// page per article slug for full Google indexability.

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

export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch("/articles.json");
  if (!res.ok) throw new Error(`Failed to load articles.json (${res.status})`);
  const data = (await res.json()) as Article[];
  // Sort newest first
  return data
    .slice()
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const all = await fetchArticles();
  return all.find((a) => a.slug === slug) ?? null;
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
export function toFaDigits(s: string | number): string {
  return String(s).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function formatPersianDate(iso: string): string {
  // Render YYYY-MM-DD as Persian-digit YYYY/MM/DD (Gregorian — simple + safe).
  // For Jalali conversion the user can swap this helper later.
  const [y, m, d] = iso.split("-");
  return toFaDigits(`${y}/${m}/${d}`);
}

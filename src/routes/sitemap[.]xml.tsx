import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { getArticles } from "@/lib/articles";

const SITE_URL = "https://khajavisaffron.ir";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(opts: {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}): string {
  const parts: string[] = [`    <loc>${escapeXml(opts.loc)}</loc>`];
  if (opts.lastmod) parts.push(`    <lastmod>${opts.lastmod}</lastmod>`);
  if (opts.changefreq) parts.push(`    <changefreq>${opts.changefreq}</changefreq>`);
  if (opts.priority) parts.push(`    <priority>${opts.priority}</priority>`);
  return `  <url>\n${parts.join("\n")}\n  </url>`;
}

async function buildSitemap(): Promise<string> {
  const today = new Date().toISOString().split("T")[0];
  const urls: string[] = [];

  urls.push(
    urlEntry({ loc: `${SITE_URL}/`, lastmod: today, changefreq: "weekly", priority: "1.0" }),
    urlEntry({ loc: `${SITE_URL}/about`, lastmod: today, changefreq: "monthly", priority: "0.7" }),
    urlEntry({ loc: `${SITE_URL}/contact`, lastmod: today, changefreq: "monthly", priority: "0.6" }),
    urlEntry({ loc: `${SITE_URL}/blog`, lastmod: today, changefreq: "weekly", priority: "0.8" }),
  );

  for (const c of CATEGORIES) {
    const qs = `?category=${encodeURIComponent(c)}`;
    urls.push(
      urlEntry({
        loc: `${SITE_URL}/shop${c === "همه" ? "" : qs}`,
        lastmod: today,
        changefreq: "weekly",
        priority: c === "همه" ? "0.9" : "0.7",
      }),
    );
  }

  for (const p of PRODUCTS) {
    urls.push(
      urlEntry({
        loc: `${SITE_URL}/shop/${p.slug}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.8",
      }),
    );
  }

  const articles = await getArticles();
  for (const a of articles) {
    urls.push(
      urlEntry({
        loc: `${SITE_URL}/blog/${a.slug}`,
        lastmod: a.publishedAt
          ? new Date(a.publishedAt).toISOString().split("T")[0]
          : today,
        changefreq: "monthly",
        priority: "0.6",
      }),
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  beforeLoad: async () => {
    const xml = await buildSitemap();
    throw new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
  component: () => null,
});

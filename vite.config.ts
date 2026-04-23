// Static-site build for self-hosted Nginx deployment.
// We still use Lovable's wrapper (so the in-app preview/HMR keeps working),
// but we disable the Cloudflare Worker preset and ask TanStack Start to
// prerender every route to plain HTML in `dist/`.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

// Read product slugs straight from the source file with a regex so this
// config doesn't depend on the `@/` alias or on the file being importable
// in the Vite config's Node context (it imports image assets).
const productsSrc = readFileSync(
  fileURLToPath(new URL("./src/data/products.ts", import.meta.url)),
  "utf-8",
);
const PRODUCT_SLUGS = Array.from(
  productsSrc.matchAll(/^\s{4}slug:\s*"([^"]+)"/gm),
  (m) => m[1],
);

// Read article slugs from the hosted articles.json so each blog post gets a
// fully prerendered HTML page (Google-indexable, social-preview-friendly).
// To add a new article: edit `public/articles.json` and rebuild — no code changes.
type Article = { slug: string; publishedAt?: string };
let ARTICLES: Article[] = [];
try {
  const articlesRaw = readFileSync(
    fileURLToPath(new URL("./public/articles.json", import.meta.url)),
    "utf-8",
  );
  const parsed = JSON.parse(articlesRaw) as { articles?: Article[] };
  ARTICLES = (parsed.articles ?? []).filter((a) => a && a.slug);
} catch {
  // articles.json missing or invalid — blog will simply have no prerendered posts
  ARTICLES = [];
}
const ARTICLE_SLUGS = ARTICLES.map((a) => a.slug);

// ---------------------------------------------------------------------------
// SEO files (sitemap.xml + robots.txt) — generated at build time.
// Runs after the prerender step so we know all output files are in place.
// Writes into `dist/client/` (Nginx web root per DEPLOYMENT.md).
// ---------------------------------------------------------------------------
const SITE_URL = (process.env.VITE_SITE_URL || "https://yourdomain.com").replace(
  /\/$/,
  "",
);
const TODAY = new Date().toISOString().slice(0, 10);

type SitemapEntry = {
  loc: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
};

function buildSitemapEntries(): SitemapEntry[] {
  const staticPages: SitemapEntry[] = [
    { loc: "/", lastmod: TODAY, changefreq: "weekly", priority: "1.0" },
    { loc: "/shop", lastmod: TODAY, changefreq: "weekly", priority: "0.9" },
    { loc: "/blog", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
    { loc: "/about", lastmod: TODAY, changefreq: "monthly", priority: "0.5" },
    { loc: "/contact", lastmod: TODAY, changefreq: "monthly", priority: "0.5" },
  ];
  const products: SitemapEntry[] = PRODUCT_SLUGS.map((slug) => ({
    loc: `/shop/${slug}`,
    lastmod: TODAY,
    changefreq: "monthly",
    priority: "0.8",
  }));
  const blog: SitemapEntry[] = ARTICLES.map((a) => ({
    loc: `/blog/${a.slug}`,
    lastmod: a.publishedAt || TODAY,
    changefreq: "monthly",
    priority: "0.7",
  }));
  return [...staticPages, ...products, ...blog];
}

function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n` +
        `    <loc>${SITE_URL}${e.loc}</loc>\n` +
        `    <lastmod>${e.lastmod}</lastmod>\n` +
        `    <changefreq>${e.changefreq}</changefreq>\n` +
        `    <priority>${e.priority}</priority>\n` +
        `  </url>`,
    )
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`
  );
}

function writeSeoFiles() {
  return {
    name: "khajavi-write-seo-files",
    apply: "build" as const,
    closeBundle: {
      // Run AFTER all other closeBundle hooks (i.e. after prerender writes HTML).
      order: "post" as const,
      sequential: true,
      handler() {
        // Only emit when targeting the client output, not the SSR build.
        const outDir = resolve(process.cwd(), "dist/client");
        if (!existsSync(outDir)) {
          // The client bundle hasn't been written yet (we're in the SSR pass);
          // skip silently — we'll run again for the client pass.
          return;
        }

        const entries = buildSitemapEntries();
        const sitemapPath = resolve(outDir, "sitemap.xml");
        mkdirSync(dirname(sitemapPath), { recursive: true });
        writeFileSync(sitemapPath, renderSitemap(entries), "utf-8");

        // Rewrite robots.txt with the resolved Sitemap: URL.
        const robotsPath = resolve(outDir, "robots.txt");
        let robots = "";
        try {
          robots = readFileSync(robotsPath, "utf-8");
        } catch {
          robots = "User-agent: *\nAllow: /\n\nSitemap: PLACEHOLDER\n";
        }
        const sitemapLine = `Sitemap: ${SITE_URL}/sitemap.xml`;
        robots = /^Sitemap:.*$/m.test(robots)
          ? robots.replace(/^Sitemap:.*$/m, sitemapLine)
          : robots.trimEnd() + `\n\n${sitemapLine}\n`;
        writeFileSync(robotsPath, robots, "utf-8");

        // eslint-disable-next-line no-console
        console.log(
          `[seo] wrote sitemap (${entries.length} urls) and robots.txt to ${outDir}`,
        );
      },
    },
  };
}

export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    target: "static",
    prerender: {
      enabled: true,
      crawlLinks: true,
      routes: [
        "/",
        "/about",
        "/contact",
        "/shop",
        "/blog",
        ...PRODUCT_SLUGS.map((slug) => `/shop/${slug}`),
        ...ARTICLE_SLUGS.map((slug) => `/blog/${slug}`),
      ],
    },
  },

  vite: {
    base: "/",
    build: {
      outDir: "dist",
    },
    plugins: [writeSeoFiles()],
  },
});

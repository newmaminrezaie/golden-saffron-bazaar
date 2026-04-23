// Static-site build for self-hosted Nginx deployment.
// We still use Lovable's wrapper (so the in-app preview/HMR keeps working),
// but we disable the Cloudflare Worker preset and ask TanStack Start to
// prerender every route to plain HTML in `dist/`.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

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
let ARTICLE_SLUGS: string[] = [];
try {
  const articlesRaw = readFileSync(
    fileURLToPath(new URL("./public/articles.json", import.meta.url)),
    "utf-8",
  );
  const articles = JSON.parse(articlesRaw) as Array<{ slug: string }>;
  ARTICLE_SLUGS = articles.map((a) => a.slug).filter(Boolean);
} catch {
  // articles.json missing or invalid — blog will simply have no prerendered posts
  ARTICLE_SLUGS = [];
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
  },
});

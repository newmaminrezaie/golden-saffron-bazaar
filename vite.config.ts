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

export default defineConfig({
  // Turn off Cloudflare Workers build target — output is plain static files.
  cloudflare: false,

  // Forwarded to tanstackStart(). `target: "static"` + `prerender` produces
  // one .html file per route in the build output directory.
  tanstackStart: {
    target: "static",
    prerender: {
      enabled: true,
      // Crawl every <Link> at build time so all reachable routes get HTML.
      crawlLinks: true,
      // Explicit fallback list for dynamic routes, in case a slug is not
      // linked from anywhere reachable by the crawler.
      routes: [
        "/",
        "/about",
        "/contact",
        "/shop",
        ...PRODUCT_SLUGS.map((slug) => `/shop/${slug}`),
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

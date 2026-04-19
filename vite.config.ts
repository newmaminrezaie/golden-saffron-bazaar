// Static-site build for self-hosted Nginx deployment.
// We still use Lovable's wrapper (so the in-app preview/HMR keeps working),
// but we disable the Cloudflare Worker preset and ask TanStack Start to
// prerender every route to plain HTML in `dist/`.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { PRODUCTS } from "./src/data/products";

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
        ...PRODUCTS.map((p) => `/shop/${p.slug}`),
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

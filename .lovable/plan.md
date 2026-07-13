## Problem

The `@lovable.dev/vite-tanstack-config` wrapper auto-loads Nitro whenever the `nitro` package is present in `node_modules`, defaulting its preset to `cloudflare-module` and writing to `.output/` + `wrangler.json` + `dist/server/`. This runs regardless of `tanstackStart.target: "static"`, and it collides with TanStack Start's own prerender step — hence "Cannot find module dist/server/server.js" and Internal Server Error on every prerendered page.

The previous "working static build" was accidentally masked by `@cloudflare/vite-plugin`. Removing that package exposed the underlying Nitro pipeline.

## Fix

1. **`vite.config.ts`** — add `nitro: false` at the top level of `defineConfig({...})` (sibling of `tanstackStart` and `vite`). This tells the wrapper to skip loading Nitro entirely, so the build stays pure TanStack Start → prerender → `dist/client/*.html`.

2. **`package.json`** — remove the stray `"nitro": "3.0.260603-beta"` dependency (added inadvertently). It's an optional peer of the wrapper and only needed for Worker/Node deploy targets. Removing it is a belt-and-braces safety net so no future edit re-enables Nitro implicitly.

3. Keep everything else as-is:
   - `tanstackStart.target: "static"` + `prerender.enabled: true` + explicit `routes: [...]` — unchanged.
   - `vite.build.outDir: "dist"` — unchanged; prerendered HTML still lands under `dist/client/`.
   - The `writeSeoFiles()` plugin still emits `sitemap.xml` + `robots.txt` into `dist/client/` — unchanged.

## Expected build output after the fix

```
dist/client/
  index.html
  about/index.html
  contact/index.html
  shop/index.html
  shop/<slug>/index.html
  blog/index.html
  blog/<slug>/index.html
  assets/*
  sitemap.xml
  robots.txt
```

No `.output/`, no `wrangler.json`, no `dist/server/` at runtime. Nginx keeps serving `dist/client/` exactly as before.

## Verification (build mode)

- Run `npm install` then `npm run build`.
- Confirm `.output/` and `wrangler.json` are NOT created.
- Confirm `dist/client/index.html` and at least one product/blog HTML file are non-empty.

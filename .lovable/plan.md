
## Goal
Produce a fully static `dist/` folder (HTML + assets for every route) that Nginx can serve directly. No SSR runtime, no Worker, no Node process needed on the VPS. Payment backend is out of scope here — frontend will just call its URL via env var.

## Reality check on the current stack
- Project is **TanStack Start** with the `cloudflare` build preset baked into `@lovable.dev/vite-tanstack-config`.
- TanStack Start v1 supports static prerendering via the `prerender` option on routes + a build-time crawler, but the Lovable config wrapper currently outputs a Worker bundle, not a flat static site.
- All routes are known at build time:
  - `/`, `/about`, `/contact`, `/shop`
  - `/shop/$slug` — finite, derived from `PRODUCTS` in `src/data/products.ts`
- 404 page exists in `__root.tsx`.

So SSG is feasible. The work is: switch the build target from Worker → static prerender, enumerate dynamic routes, configure Nginx, document env.

## Plan

### 1. Switch build target to static
- Replace `@lovable.dev/vite-tanstack-config` default with an explicit `vite.config.ts` that:
  - Uses `@tanstack/react-start` Vite plugin directly (no `cloudflare` preset).
  - Sets `tanstackStart({ target: "static", prerender: { enabled: true, crawlLinks: true } })` so the build crawls every `<Link>` and emits static HTML.
  - Keeps `@` alias, `tailwindcss`, `tsConfigPaths`, `viteReact`.
  - Sets `base: "/"` explicitly.
- Remove `wrangler.jsonc` (no longer needed for VPS deploy; keep a note in README in case user wants to revert).
- Output directory: confirm/force `outDir: "dist"` for the client build.

### 2. Enumerate dynamic product routes for prerender
In `src/router.tsx` (or route file), add explicit prerender paths so `/shop/<slug>` for every product is generated:
```ts
// src/routes/shop.$slug.tsx
export const Route = createFileRoute("/shop/$slug")({
  staticData: { /* ... */ },
  // tells the prerenderer which params to render
  prerender: {
    enabled: true,
    paths: PRODUCTS.map(p => `/shop/${p.slug}`),
  },
  ...
});
```
(Exact API per TanStack Start static preset; `crawlLinks: true` will also pick them up automatically because the shop page links to each.)

### 3. Env var hygiene
- Audit code for any hardcoded Lovable/Cloud URLs → none expected, but verify.
- Create `.env.example` documenting only what the frontend needs:
  ```
  # URL of the separate Zarinpal/Express payment backend
  VITE_PAYMENT_API_URL=https://payments.example.com
  ```
- Add `.env` to `.gitignore` (already is via standard ignore).
- Note in README: only `VITE_*` vars are exposed to the client bundle; everything else belongs to the payment service.

### 4. Nginx config (documentation only — provided in README)
Add `DEPLOYMENT.md` with a copy-paste Nginx server block:
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /var/www/khajavi-saffron/dist;
  index index.html;

  # Static assets — long cache
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # Pretty URLs: try exact file, then directory's index.html, then 404
  location / {
    try_files $uri $uri.html $uri/index.html /404.html;
  }

  error_page 404 /404.html;
}
```
Plus build/deploy steps:
```
bun install
bun run build       # outputs to ./dist
rsync -avz --delete dist/ user@vps:/var/www/khajavi-saffron/dist/
sudo systemctl reload nginx
```

### 5. SPA-style fallback (not needed)
Because every route is prerendered to its own `.html` file, there's no `try_files … /index.html` fallback needed (and we explicitly don't want it — that would mask real 404s). The `404.html` from TanStack Start's `notFoundComponent` handles unmatched URLs.

### 6. Verify after build
- Confirm `dist/` contains: `index.html`, `about.html` (or `about/index.html`), `contact.html`, `shop.html`, and one HTML file per product slug.
- Confirm no references to `*.lovable.app`, no Cloudflare Worker bundle, no `_worker.js`.

## Files to change
- `vite.config.ts` — rewrite to use TanStack Start static target
- `src/routes/shop.$slug.tsx` — add explicit prerender paths
- `package.json` — ensure `@tanstack/react-start` + Vite plugin deps are present (drop `@lovable.dev/vite-tanstack-config` if it forces Cloudflare; keep if it supports a static option)
- `wrangler.jsonc` — delete
- `.env.example` — create
- `DEPLOYMENT.md` — create with Nginx config + deploy steps
- `README.md` — short pointer to `DEPLOYMENT.md`

## Risks / caveats (worth knowing)
- The Lovable preview environment expects the Cloudflare/Worker setup. After this change, the Lovable in-app preview may behave differently (it will run dev mode, which still works, but "Publish" via Lovable's Cloudflare flow won't apply anymore — that's fine since you're self-hosting).
- If `@lovable.dev/vite-tanstack-config` cannot be opted out of the `cloudflare` plugin, we replace it with raw `@tanstack/react-start/plugin/vite` + standard Vite plugins. I'll verify which path works during implementation.
- Any future feature that needs server-side code (e.g. a contact form that emails) will have to live in the separate payment-backend service or another small API — the frontend is now 100% static.

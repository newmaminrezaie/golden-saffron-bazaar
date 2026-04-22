

## Performance: preload critical assets and defer JS

Goal: reduce render-blocking by hinting the browser to fetch the main CSS and JS earlier, and ensure the main JS bundle is non-blocking.

### Reality check on this stack

TanStack Start + Vite handles bundle injection automatically via `<HeadContent />` and `<Scripts />`. We do **not** hand-write `<script src="/assets/main-xxxx.js">` tags — the filenames are hashed at build time and injected by the framework. So:

- We **cannot** statically write `<link rel="preload" href="/assets/index-abc123.js">` in `__root.tsx` — the hash changes every build and the link would 404.
- Vite's `<Scripts />` already emits the main bundle as `<script type="module">`, which is **deferred by default** per the HTML spec (module scripts behave like `defer`). No `defer` attribute needs to be added manually — it would be redundant/no-op.
- The main CSS (`appCss` from `styles.css?url`) is currently loaded as `<link rel="stylesheet">` via the route's `links` array. This IS render-blocking by design (CSS must block to prevent FOUC).

### What we can actually do

1. **Add `modulepreload` for the main JS entry** — but again, the hashed filename is unknown at source time. The correct way in Vite is to enable Vite's built-in `modulePreload` (it's on by default and auto-injects `<link rel="modulepreload">` for the entry chunk and its static imports). I'll verify it's not disabled in `vite.config.ts`.

2. **Preconnect / preload third-party fonts** — the bigger render-blocking culprit on this site is the three external font stylesheets (Google Fonts + 2 jsDelivr CDNs) loaded in `__root.tsx`. These ARE blocking and ARE worth optimizing. We already have `preconnect` for `fonts.googleapis.com` and `fonts.gstatic.com`, but **missing preconnect for `cdn.jsdelivr.net`**. Adding it gives a measurable TTFB win for the two CDN-hosted font CSS files.

3. **Add `media="print" onload` swap pattern for non-critical font CSS** (optional, more aggressive) — loads font stylesheets without blocking render, then swaps to `all` once loaded. Worth it for the jsDelivr Estedad/Vazirmatn fonts since they're large.

### Plan

**File: `src/routes/__root.tsx`** — update the `links` array:

- **Add** `{ rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" }` so the two jsDelivr font stylesheets resolve DNS/TLS in parallel with HTML parsing.
- **Add** `{ rel: "preload", href: appCss, as: "style" }` BEFORE the existing `<link rel="stylesheet">` for `appCss`. This is a no-op in most cases (browsers already prioritize the stylesheet) but explicitly hints the highest priority for the critical app CSS, which is useful when the HTML is served from a CDN with prefetch hints.
- **Keep** the existing stylesheet links unchanged (removing them would break styling).

**File: `vite.config.ts`** — verify `build.modulePreload` is not set to `false`. It defaults to `{ polyfill: true }`, which auto-injects `<link rel="modulepreload">` for the entry JS chunk into the prerendered HTML. No change needed unless it has been disabled. (I'll confirm during implementation; if it's disabled, I'll re-enable it.)

### What this plan deliberately does NOT do

- **Does not** add `defer` to `<script>` tags manually — `<Scripts />` already emits ES module scripts which are deferred by spec. Adding `defer` would be redundant and we can't edit the auto-emitted tags anyway.
- **Does not** hand-write a `<link rel="preload" as="script" href="/assets/...">` for the main JS — Vite's modulePreload already handles this with the correct hashed filename, which we cannot know at source-edit time.
- **Does not** remove or async-load the app CSS — that would cause a flash of unstyled content (FOUC) and is a regression, not an optimization.

### Expected impact

- ~100–300ms faster start of font download on first visit (preconnect to jsDelivr).
- Vite's existing `modulepreload` continues to handle JS preloading with correct hashed paths.
- Module scripts continue to be non-blocking via the spec's implicit `defer` behavior.

If you want a more aggressive optimization (async-loading the jsDelivr font CSS with the `media="print"` swap trick, accepting a brief FOUT — flash of unstyled text — on first paint), say the word and I'll add it as a follow-up.


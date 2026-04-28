## Set uploaded image as favicon

Use the uploaded saffron-mark image as the site favicon, served as both `favicon.png` and `favicon.ico`.

### Changes

1. **Replace `public/favicon.png`** with the uploaded image.
2. **Add `public/favicon.ico`** (same image bytes — modern browsers accept PNG content under the `.ico` filename for the legacy `/favicon.ico` request).
3. **Update `src/routes/__root.tsx`** `links` array to register both:
   - `{ rel: "icon", type: "image/png", href: "/favicon.png" }` (already present)
   - `{ rel: "shortcut icon", href: "/favicon.ico" }`
   - `{ rel: "apple-touch-icon", href: "/favicon.png" }`

### Out of scope
- Generating multi-resolution true ICO container (16/32/48 px). Not needed — the uploaded PNG already renders crisply at favicon sizes in all modern browsers.

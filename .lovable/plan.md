

## Remove Lovable Favicon & Add Custom Saffron Favicon

**Goal:** Completely replace any Lovable favicon branding with a saffron-colored placeholder favicon.

### Steps

1. **Clean up public/ directory**
   - Delete `public/favicon.svg` (existing custom saffron SVG)
   - Delete any `public/favicon.ico` or `public/favicon-*.png` if they exist

2. **Create new favicon.png**
   - Generate a 64x64 PNG with saffron/golden-orange color (#FF9933)
   - Save to `public/favicon.png`

3. **Update `src/routes/__root.tsx` head configuration**
   - Remove lines:
     - `{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }`
     - `{ rel: "apple-touch-icon", href: "/favicon.svg" }`
   - Replace with single line:
     - `{ rel: "icon", type: "image/png", href: "/favicon.png" }`
   -
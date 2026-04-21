

## Use the new artwork as the header logo

### Goal
Replace the current text-only header lockup with the uploaded calligraphic artwork (saffron crocus + "زعفران خواجوی" wordmark). Keep the footer using the same artwork for consistency, and store a copy for social sharing.

### Approach

**1. Save the asset**
- Copy `user-uploads://log-png.png` → `src/assets/brand-logo.png` (used by header + footer via bundler import).
- Copy the same file → `public/og-image.png` (referenced by absolute URL in social meta tags).

**2. Update `BrandLockup` component**
Replace the text/SVG markup with an `<img>` of the artwork. The artwork already contains both wordmark and icon, so no extra elements are needed.
- `header` variant: `h-10` (40px tall) on mobile, `h-12` (48px) on `md+`. Width auto.
- `footer` variant: `h-20` (80px tall). Width auto. The artwork has transparent background so it sits cleanly on the dark footer — but since the ink is dark brown, we'll wrap it in a subtle parchment-tinted backdrop (`bg-[color:var(--parchment)]/95 rounded-md px-4 py-3`) so it stays legible against the deep brown footer.
- Drop the `font-brand` text spans entirely.

**3. Header sizing check**
Current header is `h-16` (64px). A 48px logo leaves 8px padding top/bottom — comfortable. The artwork is wide (~5:1 aspect ratio at 48px tall ≈ 240px wide), which fits the header on desktop. On mobile, 40px tall ≈ 200px wide — still fine alongside the icon cluster.

**4. Social sharing meta**
Add to `src/routes/__root.tsx` `head()`:
- `<meta property="og:image" content="/og-image.png" />`
- `<meta name="twitter:image" content="/og-image.png" />`
- `<meta name="twitter:card" content="summary_large_image" />`

Note: this is the wordmark artwork, not a 1200×630 social card. It will display as the share preview but won't fill the full WhatsApp/Twitter card area. Acceptable as a starting point; a dedicated 1200×630 composition can be generated later if desired.

### Files touched
- `src/assets/brand-logo.png` — new (copied from upload)
- `public/og-image.png` — new (copied from upload)
- `src/components/brand/brand-lockup.tsx` — swap text markup for `<img>`
- `src/routes/__root.tsx` — add og:image / twitter:image meta tags

### Out of scope
- No changes to `site-header.tsx` or `site-footer.tsx` — they already render `<BrandLockup />`, so updating the lockup component cascades automatically.
- `saffron-mark.tsx` stays in the codebase but unused (can be deleted later if you want).
- No dedicated 1200×630 social card generated this round — using the logo artwork directly.


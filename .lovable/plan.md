
## Replace favicon with saffron crocus design

### Goal
Replace the current placeholder `public/favicon.png` with a new favicon inspired by the uploaded image: a stylized white/light crocus flower (5 petals + stem) on a saffron purple background.

### Approach
Generate the favicon programmatically as an SVG, then rasterize to a 256×256 PNG so it stays crisp on retina tabs and bookmarks. No new dependencies, no markup changes needed — `__root.tsx` already points `<link rel="icon">` at `/favicon.png`.

### Design
- **Background**: rounded square, saffron-crocus purple (`#A05CC4`), matching the uploaded reference.
- **Crocus**: light off-white (`#E8E6E1`) — 5 teardrop petals fanned at the top, thin tapered stem dropping to the bottom. Subtle thin purple vein lines down each petal (like the reference).
- **Padding**: ~10% safe margin so the shape stays legible at 16×16.
- **No text** (favicon size is too small for letters).

### Implementation steps
1. Write an SVG (256×256) of the crocus + stem on the purple rounded-square background to `/tmp/favicon.svg`.
2. Use ImageMagick (via `nix run nixpkgs#imagemagick`) to render it to `public/favicon.png` at 256×256.
3. QA: open the generated PNG with `code--view` to confirm the shape, colors, and centering look correct. Iterate on the SVG if needed.
4. No code changes to `__root.tsx` — the existing `<link rel="icon" type="image/png" href="/favicon.png">` will pick up the new file automatically (cache-bust by hard-refresh if needed).

### Files touched
- `public/favicon.png` — overwritten with the new crocus design.

### Out of scope
- No `.ico`, no Apple touch icon, no multi-size set — single PNG per the earlier decision in this project.
- No changes to site header logo or other branding.

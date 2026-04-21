

## Logo: Icon + wordmark with saffron-thread mark (mixed approach)

### Goal
Replace the plain text header with a real brand lockup: a small saffron-thread icon paired with the Persian wordmark "زعفران خواجوی", styled with a polished display font and saffron accent. Mirror the same lockup in the footer (replacing the current "Khajavi Saffron" English display text).

This mixes Option 1 (typographic polish) + Option 2 (icon + wordmark), with consistency to the new crocus favicon.

### Design

**Icon — saffron threads mark**
- Inline SVG component (`src/components/brand/saffron-mark.tsx`), no external asset.
- Three curved stigma threads fanning upward from a single base point.
- Color: saffron red-gold (`#C8531C` / uses `--saffron` token) for the threads, with a subtle deeper tip.
- Size: 28px in header, 40px in footer. Scales cleanly because it's SVG.
- Sits to the **right** of the wordmark in RTL flow (visually leads the brand name).

**Wordmark — "زعفران خواجوی"**
- Font: **Vazirmatn** (already a strong Persian display face, free via Google Fonts / @fontsource).
- Weight: 700 for "خواجوی", 500 for "زعفران" — creates subtle hierarchy.
- Color: `--brown-deep` on light header, `--parchment` on dark footer.
- Optional accent: a thin 2px saffron underline under "خواجوی" only (very subtle, footer version only).

**Lockup spacing**
- Icon and text separated by 10px gap.
- Vertically center-aligned.
- Header: single-line horizontal lockup.
- Footer: same horizontal lockup but larger (replaces the current oversized "Khajavi Saffron" English line).

### Implementation steps

1. **Add Vazirmatn font** via `@fontsource/vazirmatn` (weights 500, 700). Import in `src/styles.css`. Add a CSS variable `--font-brand: "Vazirmatn", system-ui, sans-serif;` and a utility class `.font-brand`.

2. **Create `src/components/brand/saffron-mark.tsx`** — inline SVG of three curved saffron threads. Accepts `className` and `size` props for reuse.

3. **Create `src/components/brand/brand-lockup.tsx`** — composes `<SaffronMark />` + `<span class="font-brand">زعفران خواجوی</span>`. Accepts a `variant` prop (`"header"` | `"footer"`) to switch sizes and colors.

4. **Update `src/components/site-header.tsx`** — replace the current plain `<span>زعفران خواجوی</span>` inside the logo `<Link>` with `<BrandLockup variant="header" />`.

5. **Update `src/components/site-footer.tsx`** — replace the current `<div className="font-display text-3xl ...">Khajavi Saffron</div>` with `<BrandLockup variant="footer" />`. Removes the English wordmark (consistent with the earlier header cleanup).

### Files touched
- `src/styles.css` — add Vazirmatn import + `--font-brand` variable
- `src/components/brand/saffron-mark.tsx` — new SVG icon component
- `src/components/brand/brand-lockup.tsx` — new lockup component
- `src/components/site-header.tsx` — swap text for `<BrandLockup />`
- `src/components/site-footer.tsx` — swap English wordmark for `<BrandLockup />`
- `package.json` — add `@fontsource/vazirmatn`

### Out of scope
- No full emblem/badge logo (Option 3) — can layer on later for packaging.
- No bilingual Latin lockup (Option 4) — staying Persian-only per earlier decision.
- No changes to favicon — the crocus favicon stays; the header/footer mark uses saffron threads to add visual variety while staying in the same color family.


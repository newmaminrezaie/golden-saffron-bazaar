

## Footer layout reset

Reset the footer's spacing, alignment, and column structure so the four blocks read evenly and breathe properly inside the dark band, instead of the current mix of ad-hoc negative margins and per-element offsets.

### Goals
- One consistent horizontal padding from the viewport edges — no per-column negative margins, no `mr-[30px]` on a single paragraph.
- Even vertical rhythm: same gap between heading and list in every column, same gap between columns.
- Emblem sits cleanly above the grid with predictable top spacing on mobile and desktop.
- Trust seals align as a tidy row/column with the same visual weight as the other columns.

### Changes in `src/components/site-footer.tsx`

**Container**
- Replace `w-full px-6 md:px-12 pt-40 md:pt-48 pb-12` with a centered max-width container: `mx-auto max-w-7xl px-6 md:px-10 pt-32 md:pt-36 pb-10`.
- Grid: `grid gap-10 md:gap-8 md:grid-cols-12` so columns can be weighted (intro wider than the others).

**Column widths (RTL order: intro → categories → contact → trust)**
- Intro + Quick Links: `md:col-span-4`
- Categories: `md:col-span-2`
- Contact: `md:col-span-3`
- Trust seals: `md:col-span-3`

**Per-column normalization**
- Remove `mr-[30px]` from the intro paragraph and `-ml-6 md:-ml-12` from the trust column. All columns share the container's padding only.
- Standardize heading: `text-base font-bold mb-4 text-white` stays, but add `tracking-tight`.
- Standardize lists: `space-y-2.5 text-sm leading-7 text-white/80` everywhere (currently mixed `space-y-2` / `space-y-3`).
- Intro paragraph: `text-sm leading-7 text-white/75 mb-6` (no horizontal margin).
- Add a small `mt-2` above the "دسترسی سریع" heading so it separates from the intro paragraph.

**Trust seals**
- Convert to a 3-up row on desktop, stacked on mobile, so it reads as a unit instead of a tall column:
  `grid grid-cols-3 gap-3` (mobile stays `grid-cols-3` since tiles are small; switch to `grid-cols-1 sm:grid-cols-3` if cramped).
- Tile size normalized to `w-full aspect-square` (instead of fixed `w-24 h-24`) so they scale with the column.
- Keep icon + label + sub, same typography as today.

**Emblem**
- Keep absolute positioning but reduce overlap: `-translate-y-[35%]` and `h-24 md:h-28` so the new `pt-32 md:pt-36` clears it without the previous huge `pt-40/pt-48`.

**Bottom bar**
- Keep border + copyright row; align inside the same `mx-auto max-w-7xl px-6 md:px-10` wrapper for visual consistency with the grid above.

### Out of scope
- No color, font, icon, or copy changes.
- No new dependencies.
- No changes to other components.


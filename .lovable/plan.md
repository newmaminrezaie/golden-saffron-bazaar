

## Replace footer center emblem with new Khajavi logo

Swap the current `BrandLockup` cut-out at the top of the footer for the uploaded Khajavi Saffron emblem, positioned so only a short tip of the artwork peeks above the divider line — the rest sits inside the brown footer area, elegantly bridging the page and the footer.

### Changes

**1. Add the new asset**
- Copy `user-uploads://khajavi-logo.png` → `src/assets/khajavi-emblem.png`.

**2. Update `src/components/site-footer.tsx`**
- Replace the existing `<BrandLockup variant="footer" />` block at the top of the footer with a direct `<img>` of the new emblem (no parchment card background — the artwork already has its own cream backdrop).
- Sizing: `h-28 md:h-32 w-auto` so it reads clearly at the divider.
- Positioning: keep `absolute left-1/2 top-0 -translate-x-1/2` but change the vertical translate from `-translate-y-1/2` (centered on the line) to roughly `-translate-y-[18%]` so only a short tip (~18% of the emblem's height) rises above the divider line and the bulk sits inside the brown footer.
- Remove the brown background pill (`bg-[color:var(--brown-deep)] px-4`) — the emblem's own cream background gives it a natural framed-medallion look against the brown footer, which is the desired "dividing" effect.
- Keep `z-10` so it sits above the border line.
- Increase footer top padding slightly (`pt-20`) to give the now-larger emblem visual breathing room above the three columns.

**3. Drop the unused import**
- Remove `import { BrandLockup } from "./brand/brand-lockup";` from `site-footer.tsx` (the component itself stays in the codebase, still used in the header).

### Out of scope
- No changes to header, colors, columns, or copyright row.
- No edits to `brand-lockup.tsx`.


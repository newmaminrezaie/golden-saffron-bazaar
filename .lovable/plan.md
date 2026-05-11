## Problem

On mobile, the cart drawer's items list (`<ul>` with `flex-1`) gets squeezed by the large footer (customer form + payment methods + totals + CTA). The result: the user can barely see the product they just added — often only a sliver of one row is visible above the form.

## Fix — `src/components/cart-drawer.tsx`

Change the cart drawer layout so the items area is guaranteed enough vertical space on mobile, and the whole drawer scrolls naturally when content overflows.

**1. Make the entire drawer body a single scroll container (mobile-first)**
- `SheetContent` stays `flex flex-col`, but the inner area becomes `overflow-y-auto` as one scroll region instead of having a pinned footer fighting the items list.
- Header stays sticky at top (`sticky top-0 z-10 bg-background`) so the title + close stay visible while scrolling.

**2. Give the items list a real minimum height**
- `<ul>` gets `min-h-[42vh]` on mobile (`sm:min-h-0`) so at least ~2 full item rows are always visible before the form appears.
- Remove `flex-1` + inner `overflow-y-auto` on the list (now part of the outer scroll). On `sm:` and up, restore the previous split-pane behavior (`sm:flex-1 sm:overflow-y-auto`) so desktop keeps a pinned checkout footer.

**3. Slightly taller item rows on mobile for breathing room**
- Row padding `py-5` → `py-6` on mobile (`sm:py-5`).
- Thumbnail `size-20 sm:size-24` → `size-24 sm:size-24` (mobile thumbnails match desktop, so the row reads as a real product card, not a thin strip).
- Product title bumped from `text-sm` to `text-[15px] sm:text-sm` for legibility.

**4. Keep the primary CTA reachable**
- On mobile (single scroll), CTA naturally sits at the end of scroll — fine, since user reaches it after reviewing items + filling form.
- On `sm:` and up, footer stays pinned exactly as today.

## Out of scope

No logic, copy, color, validation, API, or storage-key changes. Pure layout / sizing adjustment to give the items list room to breathe on small screens.

## Verification

- Mobile (375 wide): open cart with 1–3 items → at least 2 full item rows visible without scrolling; scrolling reveals the form, totals, and CTA.
- Desktop (`sm:` and up): unchanged — items scroll inside their pane, footer stays pinned at the bottom.

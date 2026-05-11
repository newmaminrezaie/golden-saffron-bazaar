## Goal

The cart drawer feels cramped on mobile. Increase breathing room around items, form, totals, and footer actions so it scans cleanly without changing functionality, copy, or colors.

## Changes — `src/components/cart-drawer.tsx`

**Drawer width**
- `sm:max-w-md` → `sm:max-w-lg` so the desktop sheet has more room (mobile stays full width).

**Header**
- `px-5 py-4` → `px-6 py-5`; bump title to `text-lg`.

**Empty state**
- Increase vertical gap and padding for a less cramped look.

**Line items list**
- `divide-y` keep, but switch row spacing from `py-4` to `py-5` and `gap-3` → `gap-4`.
- Thumbnail `size-20` → `size-24` on `sm:`, keep `size-20` on mobile (`size-20 sm:size-24`).
- Row inner content: bump variant label from `text-[11px]` to `text-xs`, add `mt-1`.
- Quantity stepper: `size-8` → `size-9`, increase min-width of count.
- Container horizontal padding `px-5` → `px-6`.

**Footer panel** (form + totals + buttons)
- Padding `px-5 py-4` → `px-6 py-5`.
- Form gap `gap-2` → `gap-3`; inputs `py-2` → `py-2.5`, add `rounded-xl`.
- Section spacing: bump `mb-3` between form / payment / totals to `mb-4`.
- Payment method buttons: `py-2` → `py-2.5`, label from `text-xs` → `text-[13px]`.
- Totals `dl`: `space-y-1.5` → `space-y-2`; final row `pt-2` → `pt-3 mt-3`.
- Primary checkout button: `py-3` → `py-3.5`, increase top margin `mt-4` → `mt-5`.
- "ادامه خرید" link: `mt-2` → `mt-3`, `text-xs` → `text-[13px]`.

**No logic changes**: API calls, validation, storage keys, totals math, props, and component structure stay identical. Pure spacing / sizing / typography polish.

## Verification

- Open cart on mobile (375 width) and desktop: items have visible breathing room, totals are not cramped against form, primary CTA is comfortably tappable (≥48px).
- Confirm scrollable items area still works and totals/CTA stay pinned at the bottom.

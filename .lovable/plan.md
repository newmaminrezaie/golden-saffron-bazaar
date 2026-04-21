

## Refine footer: trust seals size/position + Contact RTL alignment

### Changes to `src/components/site-footer.tsx`

**1. Trust seals — smaller + flipped to the other column**
- Reduce card size: `w-32 h-32` → `w-24 h-24`, padding `p-3` → `p-2`, icon `size-8` → `size-6`, label `text-xs` → `text-[11px]`, sub-label `text-[10px]` unchanged but tightened.
- Move the trust-seals column from the **first** position (right edge in RTL) to the **last** position (left edge in RTL). New column order in JSX:
  1. Contact (تماس با ما) — first → appears on the right
  2. Categories (دسته‌بندی‌ها)
  3. Quick links + intro (دسترسی سریع)
  4. Trust seals (نمادهای اعتماد) — last → appears on the left

**2. Contact column — fix RTL alignment**
- Remove any default list indent: add `list-none p-0 m-0` (or rely on `ps-0`) on the `<ul>` so items sit flush against the right edge.
- Ensure each `<li>` uses `flex items-center gap-2` with **icons on the right** in RTL. Since the column container is RTL, a normal `flex` row already places the first child on the right — so icon must be the FIRST child of each `<li>` (it already is). Remove the `dir="ltr"` overrides on the phone/email lines that currently flip them to LTR (which puts icons on the left); keep numbers/emails readable by wrapping just the number/email span in `dir="ltr"` instead of the whole `<li>`.
- Drop `mt-1` vertical offsets on icons; use `items-center` for clean baseline alignment. For multi-line items (address, messenger list) keep `items-start` only on those.
- Normalize icon size to `size-4 shrink-0` across all rows.

**3. No other changes**
- Emblem, grid gaps, top padding, categories list, quick links, copyright row, colors — all unchanged.


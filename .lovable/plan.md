

## Footer tweaks: trust seals stack + column reorder

### Changes to `src/components/site-footer.tsx`

**1. Trust seals — vertical stack, flush to the left edge**
- Change the seals container from `flex flex-row flex-wrap gap-3 justify-start` to `flex flex-col gap-3 items-start`.
- Result: the three placeholder cards stack vertically, one per row, aligned to the start of the column (which is the left edge in RTL since this column is the last/leftmost).

**2. Reorder columns**
New JSX order (RTL visual order, right → left):
1. Quick links + intro (دسترسی سریع) — first → appears on the right
2. Categories (دسته‌بندی‌ها)
3. Contact (تماس با ما)
4. Trust seals (نمادهای اعتماد) — last → stays on the left

This swaps the Contact column with the Quick links + intro column.

**3. No other changes**
- Emblem, top padding (`pt-40 md:pt-48`), grid (`md:grid-cols-4`), gaps, copyright row, colors, card sizes, icon sizes — all unchanged.


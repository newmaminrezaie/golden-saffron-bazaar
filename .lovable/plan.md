
Remove the "زعفران سرگل" category (the large hero "a" tile) from the category grid while restructuring the layout so the remaining 5 categories form a balanced, polished arrangement.

### Current layout
- 6 cards with grid areas a-f
- Mobile: a (full-width hero) → b/c → d/e → f (full-width)
- Desktop: a-a-b-b / c-d-e-f

### New layout (5 cards)
Promote "بسته‌های هدیه" (gift boxes) to the new visual hero since it's the most premium-feeling category, and rebalance:

- **Mobile** (2 cols):
  ```
  e e      (gift boxes — hero, full width)
  b c      (نگین | پوشال)
  d f      (پودر | عمده‌فروشی)
  ```
- **Desktop** (4 cols):
  ```
  e e b b   (gift boxes hero left, نگین right)
  c c d d f f  → actually: c d f spanning evenly
  ```
  Cleaner: `e e e b b / c c d d f f` using 6-col desktop grid, OR keep 4-col with `e e b b / c d f f`.

I'll use a **4-col desktop grid**:
```
"e e b b"
"c d f f"
```
This gives gift boxes a 2-col hero, نگین a 2-col feature, then پوشال + پودر as squares and عمده‌فروشی as a 2-col wide closer — visually balanced (2+2 / 1+1+2).

### Changes to `src/components/home/category-grid.tsx`
1. Delete the first entry (`زعفران سرگل`, area "a") from the `CATS` array.
2. Update mobile `gridTemplateAreas` to `"e e" / "b c" / "d f"`.
3. Update desktop media query areas to `"e e b b" / "c d f f"`.
4. Adjust `minHeight` rule so the hero tiles (now `e` and `f`) get the taller 240px and others stay 200px.
5. Tweak the `labelStyle` for `e` if needed so its text sits well as the new hero (already bottom-right friendly via existing top-right; switch to bottom-right for hero prominence).

No other files touched. No new assets needed.



## Move "نگین" and "پوشال" to top on mobile

Reorder the category grid on mobile so زعفران نگین (b) and زعفران پوشال (c) appear first, before the gift boxes (e), wholesale (f), powder (d), and dried fruits (g) tiles. Desktop layout stays unchanged.

### Change in `src/components/home/category-grid.tsx`

Update the mobile `gridTemplateAreas` on the `.cat-grid` inline style from:

```text
"e e"
"b c"
"d f"
"g g"
```

to:

```text
"b c"
"e e"
"d f"
"g g"
```

This puts نگین (b) and پوشال (c) side-by-side at the very top on mobile. The desktop override inside the `<style>` block (`@media (min-width: 768px)`) already defines its own `grid-template-areas` with `!important`, so desktop ordering (`e e b b` / `c d f f` / `g g g g`) is unaffected.

No other changes — same images, same labels, same scrims, same min-heights.


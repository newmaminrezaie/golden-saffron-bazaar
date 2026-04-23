

## Fix: category cards should filter the shop page

Right now every category card on the home page links to `/shop`, so they all land on the unfiltered "همه" view. I'll wire them to deep-link into a filtered shop view via a `?category=` URL parameter.

### Problem details

- `src/components/home/category-grid.tsx` — all 6 cards use `<Link to="/shop">` with no params.
- `src/routes/shop.tsx` — filter state is a local `useState`, not URL-driven, so it can't be linked into.
- Several category card names don't match the `CATEGORIES` list in `src/data/products.ts`. Mismatches mean even after we pass a filter, "همه" would still show:
  - Card "زعفران پوشال" → CATEGORIES has no "پوشال" (closest: "زعفران دسته")
  - Card "پودر زعفران" → CATEGORIES has no "پودر" (closest: "زعفران نرمه")
  - Card "بسته‌های هدیه" → not in CATEGORIES at all
  - Card "خشکبار" / "عمده‌فروشی" / "زعفران نگین" → match ✅

### Changes

**1. `src/routes/shop.tsx` — read filter from URL search param**

- Add Zod-like `validateSearch` so `?category=...` is typed.
- Replace `useState<active>` with `Route.useSearch()` to read `category`, defaulting to `"همه"`.
- Filter chip clicks become `<Link to="/shop" search={{ category: c }}>` (or `navigate({ search })`) so chip state stays URL-synced. This also gives shareable filtered URLs (good for SEO / sharing).
- Unknown/invalid category values fall back to `"همه"`.

**2. `src/components/home/category-grid.tsx` — link each card to its filtered shop view**

- Add a `category?: string` field to each `Cat` (omit it for "بسته‌های هدیه" since no matching category exists — that card will link to `/shop` unfiltered, OR we add a new category, see Q below).
- Change `<Link to="/shop">` to `<Link to="/shop" search={{ category: c.category ?? "همه" }}>`.

**3. Fix category-name mismatches** in `category-grid.tsx`:
- "زعفران پوشال" → rename card to "زعفران دسته" (matches existing data)
- "پودر زعفران" → rename card to "زعفران نرمه"
- "بسته‌های هدیه" → either remove the card, link to unfiltered shop, OR add a "بسته هدیه" category (needs your call — see question)

Also update each card's `count: "X محصول"` to the actual count from `PRODUCTS.filter(p => p.category === ...).length` (computed at module load, formatted with Persian digits) so the numbers stop being made up.

### Open question

The "بسته‌های هدیه" card has no matching category in `CATEGORIES` and no products tagged that way. Options:
- **A)** Remove the card from the grid.
- **B)** Keep the card, link it to `/shop` unfiltered (current broken behavior, just intentional).
- **C)** Add a new "بسته هدیه" category to `CATEGORIES` and tag relevant products with it (you'd tell me which products).

I'll default to **A (remove)** unless you say otherwise — having a card that leads nowhere meaningful is worse than not having it.

### Files touched

1. `src/routes/shop.tsx` — URL-driven filter via `validateSearch` + `Route.useSearch()`; chips become Links.
2. `src/components/home/category-grid.tsx` — add `category` to each card, rename mismatched names, recompute counts from PRODUCTS, point Links to `/shop?category=…`, drop the gift-box card (pending your answer).

### Out of scope

- No new product data, no schema changes to `Product`.
- No new categories unless you pick option C above.


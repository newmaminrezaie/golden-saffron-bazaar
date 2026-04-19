
The user wants to keep products static in `products.ts` but enhance the data shape so it's easy to extend and supports two new UX features later:

1. Multiple images per product (cycled on hover/touch on cards).
2. A single-product detail page with descriptions.

I'll only restructure the data + types now, plus scaffold a single-product route and update the card to handle multiple images. No CMS, no DB.

## Proposed `Product` shape

```ts
export type Product = {
  id: string;          // stable slug, used in URL: /shop/p1
  slug: string;        // URL-friendly (defaults to id, can be Persian-friendly later)
  name: string;
  category: string;
  weight: string;
  price: number;
  oldPrice?: number;
  images: string[];    // [primary, ...alts] — was `image: string`
  badge?: string;
  shortDescription?: string;  // 1-line, shown on card / meta
  description?: string;       // long-form, single-product page (supports \n paragraphs)
  highlights?: string[];      // bullet points (origin, harvest, certifications…)
  inStock?: boolean;          // defaults true
};
```

Backwards-friendly: existing single images become `images: [productP1]`. Optional fields stay optional so adding a new product is still a small object literal.

## Changes

1. **`src/data/products.ts`**
   - Update `Product` type as above.
   - Convert all 12 existing products: `image: X` → `images: [X]`.
   - Add `slug` (= id for now).
   - Add empty/optional `shortDescription`, `description`, `highlights` placeholders on 2-3 products as examples so future edits are obvious.
   - Keep `formatToman` and `CATEGORIES` unchanged.
   - Add a top-of-file comment block: "How to add a product" with a copy-paste template.

2. **`src/components/product-card.tsx`**
   - Read `p.images[0]` as the primary image.
   - If `images.length > 1`: on hover (desktop) and on touch (mobile), cycle through images with a small fade. Show dot indicators at the bottom of the image.
   - Wrap the card in a `<Link to="/shop/$slug" params={{ slug: p.slug }}>` so clicking opens the detail page (the "افزودن" button stays a button with `stopPropagation`).

3. **New route `src/routes/shop.$slug.tsx`** (single product page)
   - Looks up product by slug from `PRODUCTS`; if not found → `notFoundComponent`.
   - Layout: image gallery (thumbnails + main image) on one side, info on the other (name, category, weight, price/oldPrice, badge, shortDescription, description paragraphs, highlights bullet list, "افزودن به سبد" button).
   - Per-route `head()` with title / description / og:image (uses primary product image) per the routing rules.
   - `errorComponent` and `notFoundComponent` defined.

4. **Optional small touch in `src/routes/shop.tsx`**: no logic change, just ensures cards still work after the type change.

## File diagram

```text
src/
  data/products.ts            (type updated, images[] everywhere, doc comment)
  components/
    product-card.tsx          (image cycling + link to detail)
  routes/
    shop.tsx                  (unchanged behavior)
    shop.$slug.tsx            (NEW — single product page)
```

## How you'll edit products afterwards (the goal)

Open `src/data/products.ts` and either:
- **Change price/title/image**: edit the field on the product object.
- **Add images**: append to the `images: [...]` array — first one is the cover.
- **Add a product**: copy the template comment at the top, paste into the `PRODUCTS` array, give it a unique `id`/`slug`, fill fields. It auto-appears in the shop, in the right category filter, and gets its own `/shop/<slug>` page.

No other files need touching for routine product updates.



## Add خشکبار category with three products

### Catalog changes (`src/data/products.ts`)

**1. Add new category** to the `CATEGORIES` tuple:
- `"خشکبار"` — appended after `"عمده‌فروشی"` so it shows as the last filter chip in the shop.

**2. Add three new products** to the `PRODUCTS` array:

| id  | name           | weight  | price (تومان) | notes |
|-----|----------------|---------|---------------|-------|
| p13 | زرشک پفکی     | ۲۵۰ گرم | 320,000       | reuse existing `productP2` (already a barberry image) as cover |
| p14 | توت خشک       | ۲۵۰ گرم | 280,000       | Unsplash dried mulberry image |
| p15 | برگه زردآلو   | ۲۵۰ گرم | 350,000       | Unsplash dried apricot image |

Each product gets:
- `category: "خشکبار"`
- A short Persian `shortDescription` (one line)
- A longer `description` (origin + usage, 2 short paragraphs)
- 2–3 `highlights` bullets (origin, packaging, no additives)
- Sensible defaults: `inStock: true`, no badge

Note: existing `p2` ("زرشک پفکی قائنات") is currently mis-categorized as "زعفران نگین". It will be **re-categorized to "خشکبار"** so the catalog stays consistent (zereshk is dried fruit, not saffron). Its other fields stay untouched.

### Why no other files change
- The shop page (`src/routes/shop.tsx`) reads `CATEGORIES` and `PRODUCTS` directly, so the new chip and product cards appear automatically.
- Single-product routes (`src/routes/shop.$slug.tsx`) are generated from product slugs, so `/shop/p13`, `/shop/p14`, `/shop/p15` will work with no extra wiring.
- Category grid on the homepage (`src/components/home/category-grid.tsx`) — will check during implementation; if it has a hardcoded list, I'll add خشکبار there too. If it derives from `CATEGORIES`, no change needed.

### Out of scope
- No real product photography — using one existing asset + two stock images. Swap later by editing the `images: [...]` arrays.
- Prices are reasonable placeholders for Iranian dried-fruit market; adjust as needed.


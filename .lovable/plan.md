

## Per-category SEO metadata on `/shop?category=...`

Right now `/shop` has one static `head()` regardless of which category filter is active. I'll make the `<title>`, `<meta description>`, `og:title`, and `og:description` change based on the `?category=` search param so each filtered view gets its own SEO-friendly preview in Persian.

### How it works in TanStack Router

`head()` receives `{ match }`, and `match.search` contains the validated search params. Since `validateSearch` already normalizes `category` to a valid `Category` value (or `"همه"`), we can safely build per-category metadata from it.

```tsx
head: ({ match }) => {
  const category = match.search.category;
  const meta = buildShopMeta(category);
  return { meta };
}
```

### Per-category copy (Persian)

A small lookup map keyed by category, each entry providing `title` and `description`. Examples:

| Category | Title | Description |
|---|---|---|
| همه | فروشگاه زعفران خواجوی \| زعفران اصل قائنات | خرید آنلاین انواع زعفران سرگل، نگین، دسته، نرمه و خشکبار اصل قائنات مستقیم از تولیدکننده. |
| زعفران سرگل | خرید زعفران سرگل اصل قائنات \| زعفران خواجوی | زعفران سرگل ممتاز قائنات با عطر و رنگ بی‌نظیر، مستقیم از مزرعه با ضمانت اصالت. |
| زعفران نگین | خرید زعفران نگین درجه یک \| زعفران خواجوی | زعفران نگین قائنات با رشته‌های بلند و یکدست، مناسب هدیه و مصارف ویژه. |
| زعفران دسته | خرید زعفران دسته اصل \| زعفران خواجوی | زعفران دسته قائنات همراه با ریشه سفید، با قیمت اقتصادی و کیفیت تضمین‌شده. |
| زعفران نرمه | خرید زعفران نرمه و پودر \| زعفران خواجوی | زعفران نرمه و پودر زعفران اصل قائنات، مناسب آشپزی روزمره و صنایع غذایی. |
| خشکبار | خرید خشکبار قائنات \| زعفران خواجوی | خشکبار درجه یک قائنات شامل زرشک، عناب و سایر محصولات منطقه با کیفیت ممتاز. |
| عمده‌فروشی | عمده‌فروشی زعفران قائنات \| زعفران خواجوی | فروش عمده زعفران اصل قائنات برای صادرات، صنایع غذایی و فروشگاه‌ها با قیمت ویژه. |

(Final wording can be tweaked — these are my proposed defaults. If you want to edit any, tell me which.)

### Files touched

**`src/routes/shop.tsx`** — only file changed:
1. Add a `SHOP_META: Record<Category, { title: string; description: string }>` map at module scope.
2. Replace the static `head` block with a function form `head: ({ match }) => { ... }` that reads `match.search.category` and emits `title`, `description`, `og:title`, `og:description` from the map.
3. Fall back to the "همه" entry if anything's off (defensive, though `validateSearch` already prevents it).

### Out of scope

- No `og:image` per category (no per-category artwork exists yet — would just be a generic image, which the SSR guidance says to omit rather than reuse).
- No JSON-LD `ItemList` schema (can add later if you want richer Google results for category pages).
- No `<link rel="canonical">` handling for `?category=همه` vs `/shop` — can add if you want to consolidate duplicates.
- No changes to product detail or blog metadata.




## Add "محصولات کادویی و سازمانی" section

A new horizontal-sliding showcase below `محصولات پرفروش` on the home page, featuring the gift-packaged Negin saffrons in ornate boxes, set against a deep crimson Persian ornamental pattern background like the reference image.

### What gets featured

Filter `PRODUCTS` to the four gift/boxed Negin items already in the catalog:
- زعفران سوپرنگین ظرف چوبی (`p-598`)
- زعفران سوپرنگین ظرف گرد (`p-622`)
- زعفران سوپرنگین جعبه مخمل (`p-762`)
- زعفران سوپرنگین ظرف خاتم (`p-768`)

Selection rule: `category === "زعفران نگین"` AND name matches gift-packaging keywords (`ظرف چوبی`, `ظرف گرد`, `جعبه مخمل`, `ظرف خاتم`). This stays data-driven — adding a new gift box product later auto-appears.

### The ornamental background

Save the uploaded reference (`user-uploads://layer-desktop.jpg`) to `src/assets/ornament-crimson.jpg` and use it as a `background-image` on the section with:
- `background-repeat: repeat` so the pattern tiles seamlessly across any width
- A subtle dark vignette overlay (`radial-gradient` from transparent center to `rgba(0,0,0,0.35)` edges) so cards stay readable
- The crimson tone (`#a8131a`-ish) frames the gold/wood gift boxes beautifully and ties to saffron's "طلای سرخ" identity

### The slider

Native CSS scroll-snap horizontal carousel (no extra library — keeps bundle lean and matches the project's existing lightweight approach):

```text
┌──────────────────────────────────────────────────────┐
│   [crimson ornamental pattern background]            │
│                                                      │
│   محصولات کادویی و سازمانی                          │
│   gift & corporate                                   │
│                                                      │
│   ◄  ┌────┐ ┌────┐ ┌────┐ ┌────┐  ►                 │
│      │card│ │card│ │card│ │card│                    │
│      └────┘ └────┘ └────┘ └────┘                    │
│   • • • •  (scroll dots / snap indicators)           │
└──────────────────────────────────────────────────────┘
```

Behavior:
- Horizontal `overflow-x: auto` with `scroll-snap-type: x mandatory`
- Each card `scroll-snap-align: start`, fixed width (~260px mobile, ~300px desktop)
- Two arrow buttons (right/left, RTL-aware) scroll by one card-width via `scrollBy({ left: ±width })`
- Hide native scrollbar (cosmetic), keep keyboard + touch swipe working
- Cards reuse the existing `<ProductCard>` so prices, badges, image hover-cycle, and links to `/shop/$slug` all work for free

Section heading styled like `featured-products.tsx` (Persian title + small English overline), but with light/parchment text colors since the background is dark crimson.

### Files

1. **`src/assets/ornament-crimson.jpg`** (new) — copy of the uploaded pattern.
2. **`src/components/home/gift-corporate.tsx`** (new) — the section component (background, heading, scroll-snap rail, arrow controls, dot indicators).
3. **`src/routes/index.tsx`** (edit) — import and render `<GiftCorporate />` directly under `<FeaturedProducts />`.

### Out of scope

- No new products or schema changes — purely a curated view of existing data.
- No separate `/gifts` route (can add later if you want a dedicated landing).
- No autoplay (gift shoppers want to browse at their own pace; autoplay tends to feel pushy on premium products).
- No CMS-style admin to pick which products show — selection stays in code via the keyword rule.


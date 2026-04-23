

## Add tiered/volume pricing to product detail page

Let users buy a product in different quantities (e.g., ۱ گرم, ۲ گرم, ۵ گرم) with per-tier pricing, showing the savings vs. base per-unit price.

### Data model — `src/data/products.ts`

Extend the `Product` type with one optional field:

```ts
export type Product = {
  // ...existing fields
  priceTiers?: { quantity: number; price: number; label?: string }[];
};
```

- `quantity` — numeric grams (used for math + sorting).
- `price` — total price for that tier (Toman).
- `label` — optional Persian label override (e.g., "نیم مثقال"). If absent, derived from `quantity` as `${toFa(quantity)} گرم`.

**Invariant (per user clarification):** `priceTiers[0]` MUST mirror the base `price` field exactly — same quantity (the unit/base quantity for that product) and same price. This guarantees a consistent per-gram base for savings math. Will be enforced by:
- A clear comment in the HOW-TO header at the top of `products.ts`.
- A dev-only `console.warn` in the route component if `priceTiers[0].price !== product.price` (silent in production, helpful while authoring data).

I'll add `priceTiers` to **two example products** following this rule:
- `zafaran-negin-1gram` — base 1g matches `product.price`, then larger tiers (2g, 5g, 10g) at progressively better per-gram rates.
- `zafaran-narmeh` — same pattern.

The user can copy the pattern to other products later.

### UI — `src/routes/shop_.$slug.tsx`

Add a tier selector block between the price display and the "add to cart" button, only when `product.priceTiers?.length` is truthy.

**Selector**: horizontal row of pill buttons (one per tier) showing the Persian quantity label. Selected button uses the deep-brown background like the CTA; unselected uses bordered/secondary style. Wraps on mobile.

**Selected-tier display** (replaces the existing single price line when tiers exist):
- Total price (large, bold) — `formatToman(selectedTier.price)`.
- Per-gram price below it in muted text — e.g., `هر گرم: ۱۷۰٬۰۰۰ تومان`.
- Savings badge when the selected tier's per-gram price is lower than the base per-gram (computed from `priceTiers[0]`): `صرفه‌جویی ۱۰٪ نسبت به خرید تکی` in accent color. Hidden for the base tier or when savings ≤ 0.

**CTA button**: when tiers exist, the button text becomes `افزودن به سبد — {formatToman(selectedTier.price)}`. Default selected tier on mount = index `0` (the base tier).

When `priceTiers` is absent, the page renders exactly as today (no behavioral change).

### State

Single `useState<number>(0)` for the selected tier index. Derived values (`selectedTier`, `perGram`, `savingsPct`) computed inline from the tiers array — no extra effects.

### Persian-digit helper

A tiny local `toFa(n: number): string` helper inside the route file mapping `0-9` to `۰-۹` for quantity labels and per-gram price.

### Out of scope

- No cart state changes (cart isn't wired up yet).
- No changes to the product card / shop listing — tiers are detail-page only.
- No backend / persistence.

### Files touched

1. `src/data/products.ts` — extend type, add `priceTiers` to two products, update HOW-TO comment with the `priceTiers[0] === base price` invariant.
2. `src/routes/shop_.$slug.tsx` — tier selector UI, swap price display + CTA label when tiers exist, dev-only invariant warning.


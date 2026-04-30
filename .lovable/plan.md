# Cart drawer — pop-up sidebar instead of redirecting to a cart page

Right now the "افزودن" buttons on `ProductCard` and the big "افزودن به سبد خرید" button on the product page do nothing, the header bag icon is a static stub showing `۰`, and there is no cart state at all. We'll add a real cart that lives in `localStorage` and surfaces as a slide-in drawer (using the existing shadcn `Sheet`). Adding a product opens the drawer and shows a toast — never navigates away from the current page.

---

## What will be built

### 1. Cart store — `src/lib/cart.tsx` (new)

Tiny React Context provider, no extra dependency.

- `CartItem` shape: `{ lineId, productId, slug, name, variantLabel?, unitPrice, qty, image?, weight? }`
  - `lineId = "${productId}::${variantLabel ?? "default"}"` so different tiers of the same product (e.g. ۱ گرم vs ۲ گرم نگین) become separate lines.
- API exposed via `useCart()`:
  - `items`, `count`, `subtotal`
  - `isOpen`, `open()`, `close()`
  - `add(item)` — merges qty if `lineId` exists, **auto-opens the drawer**
  - `remove(lineId)`, `setQty(lineId, qty)` (qty ≤ 0 removes), `clear()`
- Persists to `localStorage` under `khajavi.cart.v1`. SSR-safe: hydrate on mount only, never read storage during render.

### 2. Drawer UI — `src/components/cart-drawer.tsx` (new)

Uses `Sheet` (`side="left"` so it slides in from the visual leading edge in RTL — with `dir="rtl"` set on the panel).

- Header: bag icon + "سبد خرید" + count badge.
- **Empty state**: friendly illustration + "مشاهده فروشگاه" link (closes drawer, navigates to `/shop`).
- **Item list**: thumbnail (links to product page), title, variant/weight, qty stepper (`-` / number / `+`), line total, trash icon.
- **Footer summary**:
  - جمع کالاها (subtotal)
  - هزینه پست و بسته‌بندی — fixed **30,000 تومان** (matches the backend rule we locked in)
  - مبلغ قابل پرداخت (subtotal + 30k)
  - "ادامه فرایند خرید" button (for now it just closes — checkout page is a future task; we'll wire it to the payment backend later)
  - "ادامه خرید" link to close the drawer

### 3. Mount the provider + drawer — `src/routes/__root.tsx`

Wrap the existing layout content (`AnnouncementBar`, `SiteHeader`, `<Outlet />`, `SiteFooter`, etc.) inside `<CartProvider>` and render `<CartDrawer />` once at the root so it's available on every page.

### 4. Wire the bag icon — `src/components/site-header.tsx`

- Replace the static `۰` badge with the live `count` from `useCart()`; hide the badge when count is 0.
- Bag button calls `open()` on click.
- Mobile menu unchanged.

### 5. Wire the "افزودن" button on cards — `src/components/product-card.tsx`

The button already calls `e.preventDefault()` to stop the surrounding `<Link>`. Add an `onClick` that:
- Builds `lineId = ${p.id}::default`.
- Calls `add({ ..., unitPrice: p.price, image: p.images[0], weight: p.weight })`.
- Fires `toast.success(`${p.name} به سبد افزوده شد`)` via the existing `sonner` toaster (already mounted in `__root.tsx`).
- The drawer auto-opens because `add()` calls `setIsOpen(true)`.

### 6. Wire the product detail page — `src/routes/shop_.$slug.tsx`

The big "افزودن به سبد خرید — {price}" button:
- For products **without** tiers: add a single line at `product.price`.
- For products **with** `priceTiers` (e.g. نگین ۱ گرمی, نرمه): use the currently-selected tier (`tiers[tierIdx]`).
  - `variantLabel` = `t.label ?? "${t.quantity} گرم"`
  - `qty` added = `t.quantity` (selecting "۲ گرم" adds 2 units of the ۱ گرمی line; cleaner UX = treat each tier as its own line so the cart shows "۲ گرم × 1" rather than "۱ گرم × 2"). **Decision: treat each tier as its own line** — `lineId = "${product.id}::${label}"`, qty starts at 1, `unitPrice = t.price`. This keeps the cart math identical to what the user clicked.
- Disabled when `inStock === false`.
- After add: toast + drawer opens automatically.

### 7. No new dependencies

- Sheet, Sonner toaster, all icons (`ShoppingBag`, `Trash2`, `Plus`, `Minus`, `X`) already exist in the project.
- No router redirects, no new routes.

---

## RTL / styling notes

- Drawer slides from `side="left"` so in RTL it enters from the visual right (where the bag icon is) — matches user mental model.
- Uses existing brand tokens: `--brown-deep`, `--brown-medium`, `--parchment`, plus shadcn semantic tokens (`bg-secondary`, `text-foreground`, etc.). No hardcoded colors.
- Numbers shown via existing `toFa()` helper for Persian digits; prices via `formatToman()` from `src/data/products.ts`.

---

## Files

**Created**
- `src/lib/cart.tsx`
- `src/components/cart-drawer.tsx`

**Edited**
- `src/routes/__root.tsx` — wrap with `CartProvider`, mount `<CartDrawer />`.
- `src/components/site-header.tsx` — make bag icon open the drawer; live count badge.
- `src/components/product-card.tsx` — implement add-to-cart on the small "افزودن" button.
- `src/routes/shop_.$slug.tsx` — implement add-to-cart on the main product button (handles tier selection).

No backend changes; the 30,000 toman shipping line in the drawer mirrors the rule already enforced server-side in `server/src/utils.js`.

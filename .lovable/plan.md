# Wire frontend checkout flow

The Express backend at `/api/*` is already complete and contractually defines the flow. The frontend only partially uses it (Zibal request only, no result pages, no card-to-card UI). This plan finishes the wiring.

## Backend contract (already implemented, do not change)

```text
POST /api/order          -> Zibal: { ok, order_id, total, redirect }
POST /api/order-sep      -> Saman: { ok, order_id, total, redirect }
POST /api/order-card     -> Card-to-card: { ok, order_id, total, subtotal,
                            shipping, card:{number,holder,bank}, instructions }
GET  /payment/callback     (Zibal -> /payment/success?order=… or /payment/failed?…)
GET/POST /payment/callback-sep (same)
```

All three POSTs accept the same body:
`{ customer:{name,phone,address,postal_code?,note?}, items:[{id,name,qty,price}], subtotal }`

## Changes

### 1. Cart drawer — add payment-method selector
File: `src/components/cart-drawer.tsx`

- Add a small segmented control above the submit button: «زیبال» (default), «کارت‌به‌کارت». (Skip Saman unless requested.)
- Reuse the existing customer form + validation.
- On submit:
  - Zibal: POST `/api/order`, then `window.location.href = data.redirect` (current behaviour).
  - Card: POST `/api/order-card`, then client-side navigate to `/payment/card?order=<id>` carrying the response in `sessionStorage` (key `khajavi.cardOrder.<id>`).
- On any successful response, call `clear()` from `useCart` and `close()` the drawer before navigating, so the cart is empty when the user returns.
- Persist the customer form to `localStorage` (`khajavi.checkoutForm.v1`) so a failed redirect doesn't lose what they typed.

### 2. New route `/payment/success`
File: `src/routes/payment.success.tsx`

- Reads `?order=KHJ-…` from `Route.useSearch()`.
- Shows a confirmation card: green check, "پرداخت با موفقیت انجام شد"، شماره سفارش (with the existing `CopyButton`), and a note that اطلاعات سفارش از طریق تماس/پیامک ارسال خواهد شد.
- Buttons: «بازگشت به فروشگاه» (`/shop`) and «صفحه اصلی» (`/`).
- `head()` sets `noindex,nofollow` (transactional page).
- Calls `clear()` once on mount as a safety net.

### 3. New route `/payment/failed`
File: `src/routes/payment.failed.tsx`

- Reads `?order=…&reason=…` from search.
- Shows a red error card with a Persian explanation and a small details line containing the raw `reason` value (helpful for support).
- Buttons: «بازگشت به سبد خرید» (re-opens the cart drawer via a small URL flag, e.g. `?reopen=cart`) and «تماس با پشتیبانی».
- The cart is **not** cleared so the user can retry.

### 4. New route `/payment/card`
File: `src/routes/payment.card.tsx`

- Reads `?order=…` from search and pulls the saved response from `sessionStorage`.
- Shows:
  - شماره سفارش + مبلغ کل (`total` toman) با دکمه کپی روی شماره سفارش.
  - کادر آبی شماره کارت `6037 9974 6126 4344`، نام صاحب حساب «مجید خواجوی»، بانک ملی ایران، با دکمه‌های کپی (uses existing `CopyButton`).
  - متن `instructions` که سرور فرستاده.
  - دکمه واتس‌اپ که یک متن آماده می‌سازد: شامل شماره سفارش + مبلغ + متن «شماره پیگیری و چهار رقم آخر کارت من: …» و آن را در `wa.me/989XXXXXXXXX` باز می‌کند (شماره از یک ثابت در فایل).
- اگر sessionStorage خالی است (مثلا کاربر مستقیم آدرس را وارد کرده)، یک پیام خطا با لینک بازگشت به سبد نمایش داده می‌شود.

### 5. Re-open cart on `?reopen=cart`
File: `src/routes/__root.tsx` (or wherever `<CartDrawer />` mounts) — add a tiny effect that reads `location.search`, opens the cart if `reopen=cart`, then strips the param via `router.navigate({ replace:true })`.

## Technical notes

- All three new routes use `createFileRoute` with `validateSearch` (zod) to strongly type query params.
- Uses existing `API_BASE = import.meta.env.VITE_API_BASE` pattern; on production this is empty so calls go to `/api/...` on the same origin (matches Nginx setup).
- No Supabase / Lovable Cloud involved — pure fetch to the Express server.
- All copy buttons reuse `src/components/copy-button.tsx`.
- Telegram notification is already fired from the server's verify step; nothing needed on the client.

## Files

Create:
- `src/routes/payment.success.tsx`
- `src/routes/payment.failed.tsx`
- `src/routes/payment.card.tsx`

Edit:
- `src/components/cart-drawer.tsx` (method selector, card flow, cart clearing, form persistence)
- `src/routes/__root.tsx` (handle `?reopen=cart`)

## Out of scope

- Saman (`/api/order-sep`) — backend ready, but no UI entry point added unless you want it.
- A dedicated `/checkout` page — current in-drawer checkout is kept; ask if you want it promoted to a full page later.

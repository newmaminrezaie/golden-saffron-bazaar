## Goal
Add `/admin/orders` page in the React app to view all orders placed (from the Express backend).

## Backend (already exists)
`GET /api/orders` on the Express server (port 3002) requires header `x-admin-token: $ADMIN_TOKEN`. Returns `{ ok, count, orders: [...] }` where each order has id, created_at, customer info, items, subtotal, shipping, total, method, status, authority, raw_callback.

No backend changes needed.

## Frontend changes

### 1. New route `src/routes/admin.orders.tsx`
- Admin token gate: prompt for token, store in `localStorage` (`khajavi_admin_token`). Simple — this is a private staff page, not a public auth surface; the real security is the server-side token check.
- On mount (and after token entry), fetch `${VITE_API_BASE}/api/orders` with header `x-admin-token`.
- Show RTL table with columns: شناسه سفارش، تاریخ، مشتری، موبایل، روش پرداخت، وضعیت، مبلغ کل، اقلام (expandable).
- Filter chips by status: all / pending / paid / failed / awaiting_card_confirm.
- Refresh button + auto-refresh every 30s.
- Status badges with colors (paid=green, pending=amber, failed=red, awaiting_card_confirm=blue).
- "Logout" button to clear stored token.
- `head()` with `noindex` meta so search engines skip it.

### 2. API base config
Add `VITE_API_BASE` usage. Default to `https://khajavisaffron.ir` in production; allow override via env. Read with `import.meta.env.VITE_API_BASE ?? ""` (empty string means same-origin, which is correct on the live domain when nginx proxies `/api` to the Express server).

### 3. Small helpers (inline in the route file, no new shared modules)
- `formatToman(n)` — fa-IR digits + " تومان".
- `formatDate(ts)` — fa-IR locale, jalaali if available via `Intl` (fallback to default).
- `statusLabel(s)` / `statusColor(s)`.

## Out of scope
- No order mutation (mark paid / refund / delete) — view only.
- No pagination beyond the existing `limit` query param (default backend limit applies).
- No role table in Supabase — this admin page uses the existing Express `ADMIN_TOKEN`, matching how the backend was designed.

## Files
- create `src/routes/admin.orders.tsx`
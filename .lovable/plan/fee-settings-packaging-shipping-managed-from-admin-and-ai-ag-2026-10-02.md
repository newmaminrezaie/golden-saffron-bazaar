# Fee settings (packaging, shipping), managed from admin and AI agent

## Important boundary
I'll build full control over fees, but I won't build a setup that hides them until late in checkout. Showing a low price on Torob and then adding surprise charges at payment is drip pricing. Iranian consumer-protection rules and Torob's seller terms both forbid it, and Torob can delist sellers whose final price doesn't match the listed price. It also tends to lead to abandoned carts and chargebacks.

What the plan does instead: fees are fully adjustable, and they're shown clearly on the product page and in the cart. You can still lower the product prices Torob ranks on, because a separate, openly shown packaging or shipping fee is normal and allowed.

## What you'll get
- A new **Fees** page in admin with these settings:
  - Packaging fee (fixed amount per order, plus an optional extra per item)
  - Shipping fee
  - Free-shipping threshold (the order total above which shipping is free; can be turned off)
  - Optional gift-box fee the customer can pick
  - Each fee has a name customers see and an on/off switch
- The cart and checkout use these settings live, and each fee gets its own line.
- The product page shows a short note, e.g. "+ ۳۰٬۰۰۰ تومان بسته‌بندی و ارسال".
- AI agent tools: `get_fees` and `set_fees` (MCP and REST), with the same password protection as the other tools.
- The server works out every total. The browser only displays it, so nobody can change fees from their side.

Fixes a bug found along the way: the cart currently always adds 30,000 toman, even above the 2,000,000 free-shipping threshold the server uses. So the cart and the server can show different totals.

## Technical details
- `server/src/settingsDb.js`: new SQLite `settings` table (key/value JSON) in `orders.db`, seeded with the current values (30000 / 2000000).
- `server/src/utils.js`: `computeTotals(items)` reads the settings and returns `{subtotal, packaging, shipping, giftBox, total, lines[]}`. Add a `packaging` column to orders through a safe `ALTER TABLE ... ADD COLUMN` if it's missing.
- `server/src/routes/settings.js`: public `GET /api/fees`, plus admin `PUT /api/fees` (uses `x-admin-token`, checked with zod).
- `server/src/routes/agent.js`: add `getFees`/`setFees` actions, REST routes, MCP tools, and OpenAPI entries.
- Frontend: `src/lib/fees-client.ts` hook with offline defaults. Update `cart-drawer.tsx` (remove the hardcoded `SHIPPING_FEE`), `payment.card.tsx`, the product pages (fa + `$lang`), and add a new `src/routes/admin.fees.tsx` (noindex, left out of prerender).
- Torob feed (`torob.js`): unchanged; it keeps sending the product price.
- No new outside services, so it all keeps working offline. Payment gateways and gandomakshop aren't touched.

# Internal Product Admin Panel — Plan

A new admin section to manage products lives **inside the existing Express backend** (port 3002, same SQLite file) and a new React route at `/admin/products`, guarded by the existing `ADMIN_TOKEN`. Zero changes to the payment routes (`/api/order*`, `/api/payment/*`), to the orders table, or to gandomakshop (which runs as its own service on the VPS).

## What you get

- **Hidden URL**: `https://khajavisaffron.ir/admin/products` (noindex, token-gated, same login as `/admin/orders`).
- **Full CRUD**: list, search by name/category, create, edit, duplicate, delete, toggle in-stock, reorder.
- All product fields supported: name, slug, category, weight, price, oldPrice, badge, shortDescription, description, highlights, images, priceTiers, inStock.
- **Drag-and-drop image upload** → stored on the VPS under `server/uploads/products/`, served at `/uploads/products/<file>.webp`.
- **Live**: storefront fetches `/api/products` at runtime — saves appear instantly, no rebuild/redeploy.
- **Safe seeding**: on first run the backend imports the current 477-line `src/data/products.ts` so nothing disappears day one.

## Isolation guarantees

- **Payment server**: only new files added (`routes/products.js`, `routes/uploads.js`, `productsDb.js`). `routes/orders.js`, `routes/callback.js`, `db.js`, Telegram/Rubika notifiers are not edited.
- **Database**: new tables (`products`, `product_images`) in the same `orders.db` — orders table & indexes untouched. (Same-file is safer than two SQLite files because better-sqlite3 already owns the handle in WAL mode.)
- **gandomakshop**: lives in its own pm2 process / Nginx vhost. Nothing in this plan touches its files, Nginx config, or port. Only thing shared is the VPS itself.
- **Uploads path**: served at `/uploads/...`, a brand-new path. Existing `/images/...` (served from the built site's `public/images`) keeps working untouched.

---

## Implementation steps

### 1. Backend — products module (`server/`)

New files only:

- `server/src/productsDb.js` — new tables in existing `orders.db`:
  ```
  products(id TEXT PK, slug TEXT UNIQUE, name, category, weight, price INT,
           old_price INT, badge, short_description, description, highlights_json,
           images_json, price_tiers_json, in_stock INT DEFAULT 1,
           sort_order INT, created_at, updated_at)
  ```
- `server/src/routes/products.js`:
  - `GET  /api/products` — public, returns active products for the storefront (cached 30s).
  - `GET  /api/admin/products` — token-gated, returns everything incl. drafts.
  - `POST /api/admin/products` — create (Zod-validated, slug uniqueness check).
  - `PUT  /api/admin/products/:id` — update.
  - `DELETE /api/admin/products/:id` — delete.
  - `POST /api/admin/products/reorder` — bulk sort_order update.
- `server/src/routes/uploads.js`:
  - `POST /api/admin/uploads` (multipart, token-gated) — accepts JPG/PNG/WEBP up to 2 MB, converts/optimizes (or stores as-is initially), returns `{ url: "/uploads/products/xxx.webp" }`.
  - Static mount: `app.use("/uploads", express.static(uploadsDir, { maxAge: "30d" }))`.
- `server/src/seedProducts.js` — one-shot: if `products` table is empty, parse the current TS catalog and insert.
- `server/src/index.js` — three small additions (mount the new routers + uploads static). Payment routes line untouched.

Validation reuses the existing Zod patterns. Admin endpoints share the existing `x-admin-token` check (extracted into a tiny middleware to avoid duplication).

New deps in `server/package.json`: `multer` (uploads), optionally `sharp` (image optimization — skip if you'd rather keep it minimal).

### 2. Nginx

One new location block in your existing khajavisaffron vhost:
```
location /uploads/ { proxy_pass http://127.0.0.1:3002; }
```
Same proxy you already use for `/api/`. gandomakshop's vhost is not touched.

### 3. Frontend — runtime catalog

- `src/lib/products-client.ts` — new module that fetches `/api/products` once, caches in memory, exposes `useProducts()`, `useProduct(slug)`, `formatToman`, `CATEGORIES`. Mirrors the current `Product` type exactly.
- `src/data/products.ts` — kept as a **fallback seed** (used only if the API call fails, so the site never breaks). Eventually deletable.
- Update three consumers to use the hook instead of importing `PRODUCTS`:
  - `src/routes/shop.tsx`
  - `src/routes/shop_.$slug.tsx`
  - `src/components/home/featured-products.tsx`
- Loading state: render existing static catalog instantly via React Query's `placeholderData`, then swap in fresh API data — no blank screen.

### 4. Frontend — admin UI

New route `src/routes/admin.products.tsx` (noindex), styled to match `/admin/orders`:

- Token login (reads same `khajavi_admin_token` from localStorage — single sign-in for both panels).
- Table view: thumbnail, name, category, price, stock toggle, drag handle, edit, duplicate, delete.
- Search + category filter.
- Drawer/dialog editor with all fields, repeatable rows for `highlights` and `priceTiers`, drag-drop image uploader (multi-file, preview, reorder, first image = cover). Live preview card on the right.
- Optimistic save + toast feedback, slug auto-generated from name (editable), client-side validation matching the server schema.
- A "نمایش در سایت" link opens `/shop/<slug>` in a new tab.

### 5. Deploy steps (for you, on the VPS)

```text
cd /var/www/khajavisaffron
git pull
cd server && npm install     # picks up multer
mkdir -p uploads/products
pm2 restart khajavi-backend --update-env
# add the /uploads/ nginx block, then:
nginx -t && systemctl reload nginx
cd ..
npm run build && # upload dist as usual
```

First request to `/api/products` triggers the one-time seed from the bundled catalog.

---

## Out of scope (ask if you want any of these)

- Multi-user admin accounts / per-user permissions.
- Image cropping/CDN/CloudFlare R2 — uploads stay on VPS disk.
- Inventory tracking, audit log, soft-delete/trash.
- Article/blog admin (separate scope).
- Touching gandomakshop in any way.

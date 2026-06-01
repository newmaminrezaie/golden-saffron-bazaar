# Torob API v3 Product Feed

Expose `POST /torob_api/v3/products` from the existing Express service (port 3002) so Torob's non-JS crawler can index the catalog directly from SQLite. Nginx proxies `/torob_api/*` to Node, same as `/api/*`.

## Files

### 1. `server/src/torob.js` (new)
Self-contained module that exports an Express handler.

- **DB access:** read rows directly via `require("./db").db` so the Torob mapper is independent of `productsDb.js`'s camelCase transform (we need raw `created_at`, `updated_at`, `images_json`, etc.). Always include hidden products too (Torob wants the full catalog; `availability` reflects `in_stock`).
- **Row → Torob mapper:**
  - `page_unique` = `id`
  - `page_url` = `${SITE_ORIGIN}/product/${slug}` (absolute)
  - `title` = `name`; `subtitle` = `weight || null`
  - `current_price` = `price`; `old_price` = `old_price || null`
  - `availability` = `in_stock === 1`
  - `category_name` = `category`
  - `image_links`: parse `images_json`, map each entry — if it starts with `http(s)://` keep as-is, else prepend `SITE_ORIGIN` (handles `/uploads/...` and bare paths)
  - `short_desc` = `short_description || null`
  - `spec`: build from non-empty `{ weight, badge }` plus parsed `highlights_json` entries (string array → `{ "ویژگی ۱": "...", ... }`); empty object if none
  - `guarantee` = `null`
  - `date_added` / `date_updated` = `new Date(ms).toISOString()` (UTC `Z`)
  - `product_group_id` = `null`
  - Skip rows where `price <= 0`
- **Three modes (exactly one required):**
  - `page` + `sort`: validate `page` is positive int; `sort` in `{date_added_desc, date_updated_desc}`; ORDER BY `created_at DESC` or `updated_at DESC`; LIMIT 100 OFFSET `(page-1)*100`; compute `total` and `max_pages = ceil(total/100)`.
  - `page_urls`: array of strings; parse trailing `/product/<slug>` segment from each; SELECT by slug list; `current_page=1, max_pages=1, total=products.length`.
  - `page_uniques`: array of strings (our ids); SELECT by id list; `current_page=1, max_pages=1`.
  - Reject with HTTP 400 `{error:"invalid_request"}` if zero or multiple modes are present.
- **JWT verify helper:**
  - Read `TOROB_PUBLIC_KEY` and `TOROB_ENFORCE_JWT` from env at request time.
  - If key empty AND enforce !== "1" → skip.
  - Otherwise require `x-torob-token` header; verify with `jsonwebtoken.verify(token, key, { algorithms: ["RS256","ES256"] })`; 401 on missing/invalid.
- **Response envelope:** `{ api_version: "torob_api_v3", current_page, total, max_pages, products }`.

### 2. `server/src/index.js` (edit)
- `const torobHandler = require("./torob");`
- Mount BEFORE the 404 handler: `app.post("/torob_api/v3/products", torobHandler);`
- Also accept it under `/api/torob_api/...`? No — spec calls for `/torob_api/v3/products` only.

### 3. `server/.env.example` (edit)
Append:
```
# --- Torob feed ---
SITE_ORIGIN=https://khajavisaffron.ir
TOROB_PUBLIC_KEY=
TOROB_ENFORCE_JWT=0
```
`SITE_ORIGIN` falls back to `SITE_URL` in code if unset.

### 4. `server/package.json` (edit)
Add `"jsonwebtoken": "^9.0.2"` to `dependencies`. (Run `npm i jsonwebtoken` on the VPS during deploy.)

### 5. `DEPLOY.md` (new at repo root)
Document:
- Env vars to set in `server/.env` on the VPS.
- `cd server && npm install` after pulling.
- Nginx snippet inside the existing `server { ... }` block for `khajavisaffron.ir`:
  ```nginx
  location /torob_api/ {
      proxy_pass http://127.0.0.1:3002;
      proxy_http_version 1.1;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
  }
  ```
- Reload: `nginx -t && systemctl reload nginx` + `systemctl restart khajavi-pay` (or whatever pm2/systemd unit is in use).
- Final URL to give Torob: `https://khajavisaffron.ir/torob_api/v3/products`.
- Smoke tests (the three curl commands from Acceptance).

## Out of scope
- No changes to the TanStack frontend, admin panel, or `productsDb.js`.
- No caching — reads SQLite live so admin edits show on next call.
- `product_group_id` / `guarantee` left `null` until product schema grows those fields.

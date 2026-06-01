# Deployment notes

## Torob API v3 product feed

The Express service at `server/` exposes `POST /torob_api/v3/products` for
Torob's crawler. Torob does not execute JavaScript, so the SPA cannot feed
it — this endpoint reads products straight from SQLite.

### 1. Install new dependency on the VPS

```bash
cd /var/www/khajavisaffron/server
npm install
```

This pulls in `jsonwebtoken` (added to `package.json`).

### 2. Environment variables

Add to `/var/www/khajavisaffron/server/.env`:

```
SITE_ORIGIN=https://khajavisaffron.ir
TOROB_PUBLIC_KEY=
TOROB_ENFORCE_JWT=0
```

- `SITE_ORIGIN` — origin used to build absolute `page_url` and `image_links`.
  Falls back to `SITE_URL` if unset.
- `TOROB_PUBLIC_KEY` — PEM public key Torob will provide. Paste the whole PEM
  block (use quotes + `\n` or a multi-line `.env` loader). Leave empty until
  Torob hands it over.
- `TOROB_ENFORCE_JWT` — set to `1` once the key is in place to reject
  unsigned requests. Keep `0` during onboarding.

Restart the Node service after editing `.env`:

```bash
systemctl restart khajavi-pay   # or: pm2 restart khajavi-pay
```

### 3. Nginx — proxy `/torob_api/` to the Node service

Inside the existing `server { server_name khajavisaffron.ir; ... }` block,
add (alongside the existing `/api/` location):

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

Reload:

```bash
nginx -t && systemctl reload nginx
```

### 4. Smoke tests

```bash
# Paginated mode
curl -s -X POST https://khajavisaffron.ir/torob_api/v3/products \
  -H 'content-type: application/json' \
  -d '{"page":1,"sort":"date_added_desc"}' | head -c 800

# Lookup by URL
curl -s -X POST https://khajavisaffron.ir/torob_api/v3/products \
  -H 'content-type: application/json' \
  -d '{"page_urls":["https://khajavisaffron.ir/product/some-slug"]}'

# Lookup by internal id
curl -s -X POST https://khajavisaffron.ir/torob_api/v3/products \
  -H 'content-type: application/json' \
  -d '{"page_uniques":["p-abc123"]}'
```

Expected envelope:

```json
{ "api_version": "torob_api_v3", "current_page": 1, "total": N, "max_pages": M, "products": [ ... ] }
```

All `image_links` and `page_url` must be absolute, and `date_added` /
`date_updated` must be ISO8601 with timezone (`...Z`).

With `TOROB_ENFORCE_JWT=1` and a valid `TOROB_PUBLIC_KEY`, requests without
a valid `x-torob-token` header return HTTP 401.

### 5. Hand-off URL

Give Torob: `https://khajavisaffron.ir/torob_api/v3/products`

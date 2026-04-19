# Deployment — Self-hosted Linux VPS + Nginx

This frontend is built as a **fully static site** (HTML + CSS + JS). There is
no Node process to run on the VPS — Nginx serves files directly.

The payment backend (Zarinpal / Express) is a **separate service** and is not
part of this build. The frontend talks to it via `VITE_PAYMENT_API_URL`.

---

## 1. Build locally (or in CI)

```bash
bun install            # or: npm install
cp .env.example .env   # edit VITE_PAYMENT_API_URL to your real backend URL
bun run build          # static site -> ./dist/client
```

After the build, **`dist/client/`** contains the site. Each route is emitted
as `<route>/index.html`:

```
dist/client/
├── index.html              # /
├── about/index.html        # /about
├── contact/index.html      # /contact
├── shop/index.html         # /shop
├── shop/
│   ├── p1/index.html       # /shop/p1
│   ├── p2/index.html
│   └── …                   # one per product slug
└── assets/                 # hashed JS / CSS / images
```

> `dist/server/` is also produced during the build but is **not needed at
> runtime** — it's only used by the prerender step. Do not upload it.

If a product slug is missing, add it to `src/data/products.ts` and rebuild —
the prerender list in `vite.config.ts` is generated from that file.

---

## 2. Upload to the VPS

```bash
rsync -avz --delete dist/client/ user@your-vps:/var/www/khajavi-saffron/
```

---

## 3. Nginx server block

Save as `/etc/nginx/sites-available/khajavi-saffron`, then symlink into
`sites-enabled/` and reload Nginx.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/khajavi-saffron;
    index index.html;

    # Long-cache hashed build assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Pretty URLs:
    #   /about        -> /about/index.html
    #   /shop/p1      -> /shop/p1/index.html
    #   anything else -> serves /index.html, which renders the in-app 404
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    # gzip
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
```

Reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

For HTTPS, run `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`.

### Why the `/index.html` fallback?

The prerender step does not emit a standalone `404.html`. Falling back to
`/index.html` lets the TanStack Router root route handle the unknown URL
client-side and show the existing "صفحه پیدا نشد" page. If you want Nginx
to return an HTTP 404 status for unknown URLs, replace the last `try_files`
target with `=404` instead.

---

## 4. Environment variables

Only `VITE_*` variables are read at build time and inlined into the client
bundle. To change `VITE_PAYMENT_API_URL`, edit `.env` and **rebuild**.
Anything secret (API keys, DB credentials, Zarinpal merchant ID) belongs in
the separate payment service, never in this frontend.

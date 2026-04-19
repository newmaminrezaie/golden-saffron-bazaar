# Deployment — Self-hosted Linux VPS + Nginx

This frontend is built as a **fully static site** (HTML + CSS + JS). There is
no Node process to run on the VPS — Nginx serves files directly from `dist/`.

The payment backend (Zarinpal / Express) is a **separate service** and is not
part of this build. The frontend talks to it via `VITE_PAYMENT_API_URL`.

---

## 1. Build locally (or in CI)

```bash
bun install            # or: npm install
cp .env.example .env   # edit VITE_PAYMENT_API_URL to your real backend URL
bun run build          # outputs static site to ./dist
```

After the build, `dist/` contains an HTML file for every route:

```
dist/
├── index.html              # /
├── about.html              # /about
├── contact.html            # /contact
├── shop.html               # /shop
├── shop/
│   ├── p1.html             # /shop/p1
│   ├── p2.html
│   └── ...                 # one per product slug
├── 404.html                # fallback for unknown URLs
└── assets/                 # hashed JS/CSS/images
```

> If a product slug is missing, add it to `src/data/products.ts` and rebuild —
> the prerender list in `vite.config.ts` is generated from that file.

---

## 2. Upload to the VPS

```bash
rsync -avz --delete dist/ user@your-vps:/var/www/khajavi-saffron/dist/
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

    root /var/www/khajavi-saffron/dist;
    index index.html;

    # Long-cache hashed build assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Pretty URLs:
    #   /about        -> /about.html
    #   /shop/p1      -> /shop/p1.html
    #   anything else -> 404.html (real 404, NOT a SPA fallback)
    location / {
        try_files $uri $uri.html $uri/index.html /404.html;
    }

    error_page 404 /404.html;

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

---

## 4. Why no SPA fallback?

Every route is prerendered to its own `.html` file, so there is no need for
`try_files $uri /index.html`. We deliberately avoid that pattern: it would
mask real 404s by serving the home page for every unknown URL. Unknown URLs
should return the real `404.html`.

---

## 5. Environment variables

Only `VITE_*` variables are read at build time and inlined into the client
bundle. To change `VITE_PAYMENT_API_URL`, edit `.env` and **rebuild**.
Anything secret (API keys, DB credentials, Zarinpal merchant ID) belongs in
the separate payment service, never in this frontend.

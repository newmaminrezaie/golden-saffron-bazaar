# Khajavi Saffron — Payment Backend

Standalone Express server handling checkout and payment for
**khajavisaffron.ir**. Deployed separately from the static frontend.

- Port: **3002** (the gandomakshop backend uses 3001)
- DB: SQLite (`data/orders.db`) via `better-sqlite3`
- Gateways:
  - **به پرداخت ملت (Zibal)** — `/api/order` + `/payment/callback`
  - **سامان (Sep)** — `/api/order-sep` + `/payment/callback-sep`
  - **کارت‌به‌کارت** to **مجید خواجوی** — `/api/order-card`
- Fixed shipping fee: **30,000 تومان** added to every order as
  هزینه بسته‌بندی / پست‌کرایه (no free-shipping threshold).

---

## Run locally

```bash
cd server
cp .env.example .env       # fill in ZIBAL/SEP/CARD values
npm install
npm run dev                # http://127.0.0.1:3002/healthz
```

## Run on the VPS

```bash
cd /var/www/khajavi-pay
npm ci --omit=dev
node src/src/index.js
# or with pm2:
pm2 start src/index.js --name khajavi-pay
pm2 save
```

### Nginx reverse proxy snippet

Add inside the existing `server { … }` block of khajavisaffron.ir:

```nginx
location /api/ {
    proxy_pass         http://127.0.0.1:3002;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
}

location /payment/ {
    proxy_pass         http://127.0.0.1:3002;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
}
```

---

## API

All POST endpoints accept JSON of shape:

```json
{
  "customer": {
    "name": "نام و نام خانوادگی",
    "phone": "09120000000",
    "address": "آدرس کامل",
    "postal_code": "1234567890",
    "note": "اختیاری"
  },
  "items": [
    { "id": "p1", "name": "زعفران سرگل ۱ مثقال", "qty": 2, "price": 450000 }
  ],
  "subtotal": 900000
}
```

Server **always recomputes** `subtotal` from `items` and adds the fixed
30,000 toman shipping. The client `subtotal` is used only as a sanity
check — a mismatch returns `400 subtotal_mismatch`.

| Method | Path                       | Purpose                                   |
| ------ | -------------------------- | ----------------------------------------- |
| GET    | `/healthz`                 | Health probe                              |
| POST   | `/api/order`               | Start Zibal payment                       |
| GET    | `/payment/callback`        | Zibal verify + redirect to success/fail   |
| POST   | `/api/order-sep`           | Start Saman/Sep payment                   |
| POST   | `/payment/callback-sep`    | Saman verify (browser POST)               |
| GET    | `/payment/callback-sep`    | Saman verify (fallback)                   |
| POST   | `/api/order-card`          | Record card-to-card order, return card #  |
| GET    | `/api/orders`              | Admin list (header `x-admin-token`)       |

### Successful gateway start response

```json
{
  "ok": true,
  "order_id": "KHJ-1730000000-AB12",
  "total": 930000,
  "redirect": "https://gateway.zibal.ir/start/<trackId>"
}
```

The frontend should `window.location = redirect`.

### After verify

Both Zibal and Sep callbacks redirect to:

- success → `${SITE_URL}/payment/success?order=<id>`
- failure → `${SITE_URL}/payment/failed?order=<id>&reason=<code>`

These pages will be added to the frontend later.

---

## Telegram notifications

Optional. If `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set, the
server sends an HTML message on:

- `paid` — successful Zibal/Sep verify
- `awaiting_card_confirm` — new card-to-card order

Failures in Telegram never block the payment flow.

---

## Admin

```bash
curl -H "x-admin-token: $ADMIN_TOKEN" \
     "https://khajavisaffron.ir/api/orders?status=paid&limit=50"
```

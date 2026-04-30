# Express Payment Backend — `server/` for khajavisaffron.ir

A standalone Node/Express backend living in `server/` (its own `package.json`, deployed separately on the VPS). Frontend reaches it via `VITE_PAYMENT_API_URL`. SQLite stores orders. Three payment methods: **به پرداخت ملت (Zibal)**, **سامان (Sep)**, and **کارت‌به‌کارت** (manual transfer to مجید خواجوی).

---

## Folder layout

```text
server/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── data/                  # SQLite db lives here (gitignored)
│   └── .gitkeep
└── src/
    ├── index.js           # Express bootstrap, CORS, routes mount
    ├── db.js              # better-sqlite3 init + migrations
    ├── telegram.js        # notify() helper (no-op if env missing)
    ├── utils.js           # money/order id helpers, constants
    └── routes/
        ├── orders.js      # POST /api/order (Zibal), POST /api/order-sep,
        │                  # POST /api/order-card, GET /api/orders
        └── callback.js    # GET /payment/callback (Zibal),
                           # GET /payment/callback-sep (Saman POST→GET bridge)
```

---

## Dependencies (`server/package.json`)

- `express`, `cors`, `dotenv`, `better-sqlite3`, `node-fetch@3`, `zod`
- dev: `nodemon`
- scripts: `start` → `node src/index.js`, `dev` → `nodemon src/index.js`

Node ≥ 18. Listens on `PORT` (default **3002**).

---

## `.env.example`

```text
ZIBAL_MERCHANT_ID=your_zibal_merchant_id
SEP_MERCHANT_ID=your_sep_merchant_id
SEP_TERMINAL_ID=your_sep_terminal_id
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
ADMIN_TOKEN=khajavi_admin_2026
PORT=3002

# Public site origin used to build callback URLs and success/fail redirects
SITE_URL=https://khajavisaffron.ir

# Card-to-card details (shown to user on /payment/card)
CARD_NUMBER=PLACEHOLDER-XXXX-XXXX-XXXX-XXXX
CARD_HOLDER=مجید خواجوی
CARD_BANK=
```

---

## Database (SQLite via better-sqlite3)

Single table created on boot:

```sql
CREATE TABLE IF NOT EXISTS orders (
  id              TEXT PRIMARY KEY,         -- e.g. KHJ-1730000000-AB12
  created_at      INTEGER NOT NULL,
  customer_name   TEXT,
  phone           TEXT,
  address         TEXT,
  postal_code     TEXT,
  note            TEXT,
  items_json      TEXT NOT NULL,            -- cart snapshot
  subtotal        INTEGER NOT NULL,         -- toman
  shipping        INTEGER NOT NULL,         -- always 30000
  total           INTEGER NOT NULL,         -- subtotal + shipping
  method          TEXT NOT NULL,            -- 'zibal' | 'sep' | 'card'
  gateway_ref     TEXT,                     -- trackId (Zibal) / RefNum (Sep)
  authority       TEXT,                     -- token returned by gateway
  status          TEXT NOT NULL,            -- 'pending'|'paid'|'failed'|'awaiting_card_confirm'
  paid_at         INTEGER,
  raw_callback    TEXT
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
```

---

## Pricing rule (locked)

Every order: `total = subtotal + 30000`. The 30,000 toman is the **fixed هزینه بسته‌بندی / پست‌کرایه**, applied regardless of cart total or method. No free-shipping threshold, ever.

---

## Endpoints

All POSTs accept JSON: `{ customer, items, subtotal }` where `customer = { name, phone, address, postal_code, note? }` and `items` is an array of `{ id, name, qty, price }`. Server **recomputes** subtotal from items (never trusts client total) and adds shipping.

### 1. `POST /api/order` — Zibal (به پرداخت ملت)

1. Validate body with zod, recompute totals.
2. Insert order with `status='pending'`, `method='zibal'`.
3. Call `https://gateway.zibal.ir/v1/request`:
   ```json
   {
     "merchant": "<ZIBAL_MERCHANT_ID>",
     "amount": <total * 10>,           // Zibal expects rial
     "callbackUrl": "https://khajavisaffron.ir/payment/callback",
     "orderId": "<order.id>",
     "description": "سفارش زعفران خواجوی",
     "mobile": "<phone>"
   }
   ```
4. On `result === 100`, store `authority = trackId`, return `{ ok:true, redirect: "https://gateway.zibal.ir/start/<trackId>" }`.
5. On error, mark order `failed`, return `{ ok:false, message }`.

### 2. `GET /payment/callback` — Zibal verify

Query: `?success=1&trackId=...&orderId=...&status=...`.

1. Look up order by `orderId`.
2. POST to `https://gateway.zibal.ir/v1/verify` with `{ merchant, trackId }`.
3. If `result === 100` → mark `paid`, save `paid_at`, fire Telegram notify, redirect `302` to `${SITE_URL}/payment/success?order=<id>`.
4. Else → mark `failed`, redirect to `${SITE_URL}/payment/failed?order=<id>&reason=<code>`.

### 3. `POST /api/order-sep` — Saman (Sep)

1. Validate + insert order (`method='sep'`, `status='pending'`).
2. Call Sep token endpoint `https://sep.shaparak.ir/onlinepg/onlinepg`-style token API
   `https://sep.shaparak.ir/MobilePG/MobilePayment` with:
   ```json
   {
     "Action": "Token",
     "TerminalId": "<SEP_TERMINAL_ID>",
     "Amount": <total * 10>,           // rial
     "ResNum": "<order.id>",
     "RedirectUrl": "https://khajavisaffron.ir/payment/callback-sep",
     "CellNumber": "<phone>"
   }
   ```
3. On `Status === 1`, store `authority = Token`, return `{ ok:true, redirect: "https://sep.shaparak.ir/OnlinePG/SendToken?token=<Token>" }`.
4. Otherwise mark failed.

### 4. `POST /payment/callback-sep` (with GET bridge)

Saman POSTs `application/x-www-form-urlencoded` (`State, RefNum, ResNum, TraceNo, ...`).

1. Express route accepts both `POST` and `GET` on `/payment/callback-sep`.
2. Look up order by `ResNum`. If `State !== 'OK'` → mark failed, redirect to `${SITE_URL}/payment/failed`.
3. Else verify with Sep `VerifyTransaction`:
   ```json
   { "RefNum": "<RefNum>", "TerminalNumber": "<SEP_TERMINAL_ID>" }
   ```
4. If verified amount === stored total*10 → `paid`, store `gateway_ref=RefNum`, notify, redirect `302` to `${SITE_URL}/payment/success?order=<id>`. Otherwise mark failed and redirect.

### 5. `POST /api/order-card` — کارت‌به‌کارت (مجید خواجوی)

1. Validate + insert order with `method='card'`, `status='awaiting_card_confirm'`.
2. No gateway call. Send Telegram notification (if configured) tagged "💳 کارت‌به‌کارت — در انتظار تایید".
3. Return:
   ```json
   {
     "ok": true,
     "order_id": "<id>",
     "total": <total>,
     "card": {
       "number": "<CARD_NUMBER>",
       "holder": "مجید خواجوی",
       "bank": "<CARD_BANK>"
     },
     "instructions": "پس از واریز، شماره پیگیری و ۴ رقم آخر کارت خود را به همراه شماره سفارش به ما اعلام کنید."
   }
   ```
   Frontend later renders a static "card transfer" page using this data.

### 6. `GET /api/orders` — admin list

- Header `x-admin-token` must equal `process.env.ADMIN_TOKEN`, else `401`.
- Optional `?status=paid|pending|...` and `?limit=100` query params.
- Returns newest-first array.

### 7. `GET /healthz`

`{ ok: true, ts }` — for uptime checks.

---

## Telegram notification (`telegram.js`)

`notifyOrder(order, eventType)`:
- If `TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` missing → return silently (no throw).
- Otherwise `POST https://api.telegram.org/bot<token>/sendMessage` with HTML body containing order id, method, total, customer name + phone, items list. All errors caught and logged — never block the payment flow.

Triggered on: successful Zibal verify, successful Sep verify, new card-to-card order.

---

## CORS / security

- `cors({ origin: [SITE_URL, 'http://localhost:5173'], credentials: false })`.
- `express.json({ limit: '64kb' })`.
- Every input validated with zod; phone digits-only, length 10–11; `items.length` 1–50; `qty` 1–999; `price` positive integer.
- Server **always recomputes** subtotal from `items` server-side; client `subtotal` is only used as a sanity check (mismatch → 400).
- SQLite path: `server/data/orders.db` — folder created on boot if missing.

---

## Notes for later (not built now)

- Frontend wiring (checkout form posting to these endpoints, success/failed pages) is out of scope for this task — the backend is standalone.
- Real merchant IDs / card number go into `server/.env` on the VPS; placeholders ship in `.env.example` only.
- `server/` deploys independently (e.g. `pm2 start src/index.js --name khajavi-pay`); behind Nginx as `/api/` and `/payment/` reverse-proxy to `127.0.0.1:3002`.

---

## Files to create (all new)

- `server/package.json`
- `server/.env.example`
- `server/.gitignore` (`node_modules`, `data/*.db`, `.env`)
- `server/README.md` (run + deploy instructions, Nginx snippet)
- `server/src/index.js`
- `server/src/db.js`
- `server/src/telegram.js`
- `server/src/utils.js`
- `server/src/routes/orders.js`
- `server/src/routes/callback.js`
- `server/data/.gitkeep`

No existing project files are modified.

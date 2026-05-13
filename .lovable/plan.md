# Web Push Notifications for New Orders

Goal: when a new paid (or card-to-card) order arrives, your phone/desktop gets a real OS notification with sound — even if the browser is closed — by subscribing the `/admin/orders` page as a PWA to Web Push.

## How it will work

```text
[Customer pays] → Express server marks order paid
                       │
                       ├─► Telegram (already works)
                       └─► Web Push: POST to every saved subscription
                                       │
                                       ▼
                          Service Worker on your phone
                                       │
                                       ▼
                       OS notification + sound + tap → /admin/orders
```

You open `khajavisaffron.ir/admin/orders` once on each device, log in, click "Enable notifications", approve the browser prompt — that device is now subscribed forever (until you revoke).

## Pieces to build

### 1. Frontend (React / TanStack Start)
- `public/sw.js` — minimal service worker that handles `push` and `notificationclick` events. Plays the default OS notification sound; on tap, focuses or opens `/admin/orders`.
- `public/manifest.webmanifest` + icons (192, 512) — makes the site installable as a PWA on Android (Add to Home Screen) and desktop Chrome.
- Manifest/SW link tags in `__root.tsx` head.
- New component `EnableNotificationsButton` shown on `/admin/orders` only:
  - Registers the SW.
  - Calls `Notification.requestPermission()`.
  - Subscribes via `pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: VAPID_PUBLIC })`.
  - POSTs the subscription JSON + admin token to `/api/admin/push/subscribe`.
  - Shows current state: Not supported / Blocked / Enabled / Disable.
- Guard SW registration so it does NOT register inside Lovable preview iframes (per Lovable PWA rules).

### 2. Express backend (`/var/www/khajavi-pay`)
- `npm i web-push`
- One-time: generate VAPID key pair (`npx web-push generate-vapid-keys`), store in `.env`:
  - `VAPID_PUBLIC_KEY`
  - `VAPID_PRIVATE_KEY`
  - `VAPID_SUBJECT=mailto:you@khajavisaffron.ir`
- New SQLite table `push_subscriptions(endpoint TEXT PRIMARY KEY, p256dh, auth, created_at)`.
- New routes (admin-token protected, mounted under `/api/admin/push`):
  - `GET  /api/admin/push/public-key` → returns VAPID public key (so the frontend doesn't need to bundle it).
  - `POST /api/admin/push/subscribe` → upsert subscription row.
  - `POST /api/admin/push/unsubscribe` → delete by endpoint.
  - `POST /api/admin/push/test` → sends a test push to all saved subs (handy after setup).
- New helper `notifyOrderPush(order)` (mirrors `notifyOrder` Telegram helper). Iterates subscriptions, calls `webpush.sendNotification(...)` with payload `{ title, body, orderId, total, url: "/admin/orders" }`. On `410 Gone` / `404`, deletes the dead subscription.
- Hook `notifyOrderPush` into the same places `notifyOrder` is already called: Zibal verify success, Sep verify success, card-to-card create.

### 3. Nginx
Already proxies `/api/*` → 3002, so the new `/api/admin/push/*` routes work with no config change. `/sw.js` and `/manifest.webmanifest` are served as static files from `dist/client` — no change needed.

## What you'll do once after deploy

1. Visit `https://khajavisaffron.ir/admin/orders` on your Android phone in Chrome.
2. Log in with the admin token.
3. Tap **Enable notifications** → Allow.
4. (Optional) Chrome menu → **Add to Home Screen** to install as a PWA.
5. Tap **Send test notification** to confirm sound + popup work.
6. Repeat on desktop Chrome / any device you want alerts on.

After that, every new order pushes a notification to all subscribed devices, with sound, even if the browser is fully closed. Tapping it opens the orders page.

## Notes / limits

- **iPhone**: Web Push only works if the user installs the site to the Home Screen first (iOS 16.4+). Android/desktop Chrome works without install.
- **Custom sound**: browsers play the OS default notification sound; custom audio files in push notifications are not supported on Android Chrome. Sound on/off is controlled by your phone's notification settings for the site.
- **The "every 6 hours" polling** you mentioned isn't needed with Web Push — push is event-driven and instant. I'll skip the polling entirely. If you'd like a 6-hour "still alive" heartbeat ping anyway, say so and I'll add it.
- Telegram notifications stay on as a backup — both fire together.

## Files to add / change

**Frontend**
- add `public/sw.js`
- add `public/manifest.webmanifest`
- add `public/icons/icon-192.png`, `public/icons/icon-512.png` (generate)
- edit `src/routes/__root.tsx` — manifest + theme-color link tags
- add `src/components/admin/enable-notifications-button.tsx`
- edit `src/routes/admin.orders.tsx` — render the button

**Backend (`server/`)**
- `npm i web-push`
- edit `server/.env.example` — add VAPID + subject
- edit `server/src/db.js` — create `push_subscriptions` table
- add `server/src/push.js` — webpush client + `notifyOrderPush(order)` + sub CRUD
- add `server/src/routes/push.js` — admin-protected push routes
- edit `server/src/index.js` — mount push router
- edit `server/src/routes/orders.js` and `server/src/routes/callback.js` — call `notifyOrderPush` next to existing `notifyOrder` calls

## VPS steps after I push the code

```bash
cd /var/www/khajavi-pay
git pull
npm i
npx web-push generate-vapid-keys     # paste into .env
nano .env                             # add VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT
pm2 restart khajavi-pay
```

"use strict";

const webpush = require("web-push");
const { db } = require("./db");
const { formatToman } = require("./utils");

// ---- one-time table ----
db.exec(`
  CREATE TABLE IF NOT EXISTS push_subscriptions (
    endpoint    TEXT PRIMARY KEY,
    p256dh      TEXT NOT NULL,
    auth        TEXT NOT NULL,
    created_at  INTEGER NOT NULL
  );
`);

// ---- VAPID setup (lazy) ----
let configured = false;
function configure() {
  if (configured) return true;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@khajavisaffron.ir";
  if (!pub || !priv) return false;
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
  return true;
}

function getPublicKey() {
  return process.env.VAPID_PUBLIC_KEY || "";
}

// ---- subscription CRUD ----
const insertSubStmt = db.prepare(`
  INSERT INTO push_subscriptions (endpoint, p256dh, auth, created_at)
  VALUES (@endpoint, @p256dh, @auth, @created_at)
  ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth
`);
const deleteSubStmt = db.prepare("DELETE FROM push_subscriptions WHERE endpoint = ?");
const listSubsStmt = db.prepare("SELECT * FROM push_subscriptions");

function saveSubscription(sub) {
  if (!sub || !sub.endpoint || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
    throw new Error("invalid_subscription");
  }
  insertSubStmt.run({
    endpoint: sub.endpoint,
    p256dh: sub.keys.p256dh,
    auth: sub.keys.auth,
    created_at: Date.now(),
  });
}

function deleteSubscription(endpoint) {
  if (!endpoint) return;
  deleteSubStmt.run(endpoint);
}

function listSubscriptions() {
  return listSubsStmt.all();
}

// ---- send ----
async function sendToAll(payload) {
  if (!configure()) {
    console.warn("[push] VAPID keys missing; skip send");
    return { sent: 0, removed: 0 };
  }
  const subs = listSubscriptions();
  if (subs.length === 0) return { sent: 0, removed: 0 };

  const body = JSON.stringify(payload);
  let sent = 0;
  let removed = 0;

  await Promise.all(
    subs.map(async (row) => {
      const sub = {
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth },
      };
      try {
        await webpush.sendNotification(sub, body, { TTL: 60 });
        sent++;
      } catch (err) {
        const code = err && err.statusCode;
        if (code === 404 || code === 410) {
          deleteSubscription(row.endpoint);
          removed++;
        } else {
          console.warn("[push] send failed:", code, err && err.body);
        }
      }
    })
  );

  return { sent, removed };
}

const METHOD_LABEL = {
  zibal: "به پرداخت ملت",
  sep: "بانک سامان",
  card: "کارت‌به‌کارت",
};
const STATUS_LABEL = {
  paid: "✅ پرداخت موفق",
  awaiting_card_confirm: "⏳ کارت‌به‌کارت جدید",
};

async function notifyOrderPush(order, eventType) {
  const title = STATUS_LABEL[eventType] || `سفارش جدید (${eventType})`;
  const method = METHOD_LABEL[order.method] || order.method;
  const body =
    `${order.customer_name || "مشتری"} — ${formatToman(order.total)}\n` +
    `${method} · ${order.phone || ""}`;
  return sendToAll({
    title,
    body,
    orderId: order.id,
    total: order.total,
    url: "/admin/orders",
    tag: `order-${order.id}`,
    ts: Date.now(),
  });
}

module.exports = {
  configure,
  getPublicKey,
  saveSubscription,
  deleteSubscription,
  listSubscriptions,
  sendToAll,
  notifyOrderPush,
};

"use strict";

const express = require("express");
const {
  getPublicKey,
  saveSubscription,
  deleteSubscription,
  listSubscriptions,
  sendToAll,
} = require("../push");

const router = express.Router();

function requireAdmin(req, res, next) {
  const token = req.header("x-admin-token");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  next();
}

// Public so the admin page can fetch the VAPID public key before login.
router.get("/public-key", (_req, res) => {
  const key = getPublicKey();
  if (!key) return res.status(503).json({ ok: false, error: "vapid_not_configured" });
  res.json({ ok: true, publicKey: key });
});

router.post("/subscribe", requireAdmin, (req, res) => {
  try {
    saveSubscription(req.body);
    res.json({ ok: true, count: listSubscriptions().length });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.post("/unsubscribe", requireAdmin, (req, res) => {
  const endpoint = req.body && req.body.endpoint;
  deleteSubscription(endpoint);
  res.json({ ok: true });
});

router.post("/test", requireAdmin, async (_req, res) => {
  const result = await sendToAll({
    title: "🔔 تست اعلان",
    body: "اعلان آزمایشی از سرور خواجوی - اگر این پیام را می‌بینید همه‌چیز درست کار می‌کند.",
    url: "/admin/orders",
    tag: "test",
    ts: Date.now(),
  });
  res.json({ ok: true, ...result });
});

module.exports = router;

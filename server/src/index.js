"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const ordersRoutes = require("./routes/orders");
const callbackRoutes = require("./routes/callback");
const pushRoutes = require("./routes/push");
const { configure: configurePush } = require("./push");

const app = express();

const SITE_URL = (process.env.SITE_URL || "https://khajavisaffron.ir").replace(
  /\/$/,
  ""
);

app.use(
  cors({
    origin: [SITE_URL, "http://localhost:5173", "http://localhost:3000"],
    credentials: false,
  })
);
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));

// Trust reverse proxy (Nginx) so req.ip / secure cookies behave correctly
app.set("trust proxy", 1);

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.use("/api", ordersRoutes);
app.use("/api/admin/push", pushRoutes);
app.use("/payment", callbackRoutes);

if (configurePush()) {
  console.log("[khajavi-pay] web-push VAPID configured");
} else {
  console.warn("[khajavi-pay] VAPID keys missing — push notifications disabled");
}

// 404
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "not_found", path: req.path });
});

// error handler
app.use((err, _req, res, _next) => {
  console.error("[server] error:", err);
  res.status(500).json({ ok: false, error: "internal_error", message: err.message });
});

const PORT = Number(process.env.PORT) || 3002;
app.listen(PORT, () => {
  console.log(`[khajavi-pay] listening on http://127.0.0.1:${PORT}`);
  console.log(`[khajavi-pay] SITE_URL = ${SITE_URL}`);
});

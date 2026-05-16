"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const ordersRoutes = require("./routes/orders");
const callbackRoutes = require("./routes/callback");
const productsRoutes = require("./routes/products");
const { router: uploadsRoutes, UPLOADS_DIR } = require("./routes/uploads");
const { seedFromJsonIfEmpty } = require("./productsDb");

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
app.use("/api", productsRoutes);
app.use("/api", uploadsRoutes);
app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "30d", fallthrough: true }));
app.use("/api/payment", callbackRoutes);
app.use("/payment", callbackRoutes);

// Seed products from bundled JSON on first boot (no-op if table is populated)
try { seedFromJsonIfEmpty(); } catch (e) { console.error("[seed] failed:", e.message); }

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

"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const { requireAdmin } = require("../middleware/admin-auth");

const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads", "products");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = ALLOWED.has(ext) ? ext : ".bin";
    const id = crypto.randomBytes(8).toString("hex");
    cb(null, `${Date.now()}-${id}${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB per image
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.has(ext)) return cb(new Error("unsupported_file_type"));
    cb(null, true);
  },
});

const router = express.Router();

router.post("/admin/uploads", requireAdmin, (req, res) => {
  upload.array("files", 8)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }
    const files = (req.files || []).map((f) => ({
      url: `/uploads/products/${f.filename}`,
      size: f.size,
    }));
    res.json({ ok: true, files });
  });
});

router.delete("/admin/uploads", requireAdmin, express.json(), (req, res) => {
  const url = String(req.body?.url || "");
  if (!url.startsWith("/uploads/products/")) {
    return res.status(400).json({ ok: false, error: "invalid_url" });
  }
  const filename = path.basename(url);
  const full = path.join(UPLOADS_DIR, filename);
  if (full.startsWith(UPLOADS_DIR) && fs.existsSync(full)) {
    fs.unlinkSync(full);
  }
  res.json({ ok: true });
});

module.exports = { router, UPLOADS_DIR };

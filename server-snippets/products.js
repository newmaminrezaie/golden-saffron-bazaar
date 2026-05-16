// server/src/routes/products.js
// Drop-in Express router for dynamic product catalog + admin CRUD + image upload.
// Storage: JSON file at server/data/products.json (auto-created).
// Auth: admin endpoints require header  x-admin-token: <ADMIN_TOKEN>
// Mount in src/index.js:
//   const productsRoutes = require("./routes/products");
//   app.use("/api", productsRoutes);
//   app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const router = express.Router();

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

// ---- storage helpers --------------------------------------------------------
function loadAll() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error("[products] load failed:", e);
    return [];
  }
}
function saveAll(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
}

// ---- auth middleware --------------------------------------------------------
function requireAdmin(req, res, next) {
  const token = req.header("x-admin-token") || "";
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  next();
}

// ---- public: list products --------------------------------------------------
router.get("/products", (req, res) => {
  const products = loadAll().sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
  res.json({ ok: true, products });
});

// ---- admin: list ------------------------------------------------------------
router.get("/admin/products", requireAdmin, (req, res) => {
  const products = loadAll().sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
  res.json({ ok: true, products });
});

// ---- admin: create ----------------------------------------------------------
router.post("/admin/products", requireAdmin, express.json({ limit: "2mb" }), (req, res) => {
  const list = loadAll();
  const body = req.body || {};
  if (!body.id || !body.slug || !body.name) {
    return res.status(400).json({ ok: false, error: "id, slug, name required" });
  }
  if (list.some((p) => p.id === body.id)) {
    return res.status(409).json({ ok: false, error: "id already exists" });
  }
  const product = { ...body, sortOrder: body.sortOrder ?? list.length };
  list.push(product);
  saveAll(list);
  res.json({ ok: true, product });
});

// ---- admin: update ----------------------------------------------------------
router.put("/admin/products/:id", requireAdmin, express.json({ limit: "2mb" }), (req, res) => {
  const list = loadAll();
  const idx = list.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });
  list[idx] = { ...list[idx], ...req.body, id: list[idx].id };
  saveAll(list);
  res.json({ ok: true, product: list[idx] });
});

// ---- admin: delete ----------------------------------------------------------
router.delete("/admin/products/:id", requireAdmin, (req, res) => {
  const list = loadAll();
  const next = list.filter((p) => p.id !== req.params.id);
  if (next.length === list.length) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }
  saveAll(next);
  res.json({ ok: true });
});

// ---- admin: image upload ----------------------------------------------------
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().replace(/[^.\w]/g, "");
      const name = crypto.randomBytes(8).toString("hex") + ext;
      cb(null, name);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

router.post("/admin/uploads", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: "No file" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ ok: true, url });
});

module.exports = router;

"use strict";

const path = require("path");
const fs = require("fs");
const { db } = require("./db");

// New tables in the EXISTING orders.db. The orders table is not touched.
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id                  TEXT PRIMARY KEY,
    slug                TEXT NOT NULL UNIQUE,
    name                TEXT NOT NULL,
    category            TEXT NOT NULL,
    weight              TEXT,
    price               INTEGER NOT NULL,
    old_price           INTEGER,
    badge               TEXT,
    short_description   TEXT,
    description         TEXT,
    highlights_json     TEXT,
    images_json         TEXT,
    price_tiers_json    TEXT,
    in_stock            INTEGER NOT NULL DEFAULT 1,
    sort_order          INTEGER NOT NULL DEFAULT 0,
    created_at          INTEGER NOT NULL,
    updated_at          INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order ASC);
`);

function rowToProduct(r) {
  if (!r) return null;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    weight: r.weight || "",
    price: r.price,
    oldPrice: r.old_price ?? undefined,
    badge: r.badge || undefined,
    shortDescription: r.short_description || undefined,
    description: r.description || undefined,
    highlights: r.highlights_json ? JSON.parse(r.highlights_json) : undefined,
    images: r.images_json ? JSON.parse(r.images_json) : [],
    priceTiers: r.price_tiers_json ? JSON.parse(r.price_tiers_json) : undefined,
    inStock: r.in_stock === 1,
    sortOrder: r.sort_order,
  };
}

function listProducts({ includeHidden = false } = {}) {
  const rows = includeHidden
    ? db.prepare("SELECT * FROM products ORDER BY sort_order ASC, created_at ASC").all()
    : db.prepare("SELECT * FROM products WHERE in_stock = 1 ORDER BY sort_order ASC, created_at ASC").all();
  return rows.map(rowToProduct);
}

function getProduct(id) {
  return rowToProduct(db.prepare("SELECT * FROM products WHERE id = ?").get(id));
}

function getProductBySlug(slug) {
  return rowToProduct(db.prepare("SELECT * FROM products WHERE slug = ?").get(slug));
}

const insertStmt = db.prepare(`
  INSERT INTO products (
    id, slug, name, category, weight, price, old_price, badge,
    short_description, description, highlights_json, images_json,
    price_tiers_json, in_stock, sort_order, created_at, updated_at
  ) VALUES (
    @id, @slug, @name, @category, @weight, @price, @old_price, @badge,
    @short_description, @description, @highlights_json, @images_json,
    @price_tiers_json, @in_stock, @sort_order, @created_at, @updated_at
  )
`);

function productToRow(p, { id, now }) {
  return {
    id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    weight: p.weight || "",
    price: p.price,
    old_price: p.oldPrice ?? null,
    badge: p.badge || null,
    short_description: p.shortDescription || null,
    description: p.description || null,
    highlights_json: p.highlights ? JSON.stringify(p.highlights) : null,
    images_json: JSON.stringify(p.images || []),
    price_tiers_json: p.priceTiers ? JSON.stringify(p.priceTiers) : null,
    in_stock: p.inStock === false ? 0 : 1,
    sort_order: typeof p.sortOrder === "number" ? p.sortOrder : 0,
    created_at: now,
    updated_at: now,
  };
}

function insertProduct(p) {
  const now = Date.now();
  const id = p.id || `p-${Math.random().toString(36).slice(2, 8)}`;
  insertStmt.run(productToRow(p, { id, now }));
  return getProduct(id);
}

function updateProduct(id, p) {
  const existing = getProduct(id);
  if (!existing) return null;
  const merged = { ...existing, ...p };
  const now = Date.now();
  db.prepare(`
    UPDATE products SET
      slug=@slug, name=@name, category=@category, weight=@weight, price=@price,
      old_price=@old_price, badge=@badge, short_description=@short_description,
      description=@description, highlights_json=@highlights_json,
      images_json=@images_json, price_tiers_json=@price_tiers_json,
      in_stock=@in_stock, sort_order=@sort_order, updated_at=@updated_at
    WHERE id=@id
  `).run({ ...productToRow(merged, { id, now }), id });
  return getProduct(id);
}

function deleteProduct(id) {
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

function reorderProducts(order) {
  // order: [{ id, sort_order }]
  const stmt = db.prepare("UPDATE products SET sort_order = ?, updated_at = ? WHERE id = ?");
  const now = Date.now();
  const tx = db.transaction((rows) => {
    for (const r of rows) stmt.run(r.sort_order, now, r.id);
  });
  tx(order);
}

function countProducts() {
  return db.prepare("SELECT COUNT(*) as n FROM products").get().n;
}

function seedFromJsonIfEmpty() {
  if (countProducts() > 0) return 0;
  const seedPath = path.join(__dirname, "seed-products.json");
  if (!fs.existsSync(seedPath)) return 0;
  try {
    const data = JSON.parse(fs.readFileSync(seedPath, "utf8"));
    let i = 0;
    for (const p of data) {
      insertProduct({ ...p, sortOrder: i });
      i += 10;
    }
    console.log(`[products] seeded ${data.length} products from seed-products.json`);
    return data.length;
  } catch (err) {
    console.error("[products] seed failed:", err.message);
    return 0;
  }
}

module.exports = {
  listProducts,
  getProduct,
  getProductBySlug,
  insertProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
  countProducts,
  seedFromJsonIfEmpty,
};

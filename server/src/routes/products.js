"use strict";

const express = require("express");
const { z } = require("zod");
const {
  listProducts,
  getProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
  getProductBySlug,
} = require("../productsDb");
const { requireAdmin } = require("../middleware/admin-auth");

const router = express.Router();

const tierSchema = z.object({
  quantity: z.number().int().min(1).max(1000),
  price: z.number().int().min(0).max(10_000_000_000),
  label: z.string().max(40).optional(),
});

const productSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/i, "اسلاگ نامعتبر"),
  name: z.string().min(1).max(200),
  category: z.string().min(1).max(80),
  weight: z.string().max(80).optional().default(""),
  price: z.number().int().min(0).max(10_000_000_000),
  oldPrice: z.number().int().min(0).max(10_000_000_000).optional().nullable(),
  badge: z.string().max(40).optional().nullable(),
  shortDescription: z.string().max(500).optional().nullable(),
  description: z.string().max(8000).optional().nullable(),
  highlights: z.array(z.string().min(1).max(200)).max(20).optional(),
  images: z.array(z.string().min(1).max(500)).max(20).default([]),
  priceTiers: z.array(tierSchema).max(20).optional(),
  inStock: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional(),
});

// PUBLIC — storefront catalog
router.get("/products", (_req, res) => {
  res.set("Cache-Control", "public, max-age=30");
  const products = listProducts({ includeHidden: false });
  res.json({ ok: true, products });
});

const handleBySlug = (req, res) => {
  const p = getProductBySlug(req.params.slug);
  if (!p || !p.inStock) return res.status(404).json({ ok: false, error: "not_found" });
  res.json({ ok: true, product: p });
};
router.get("/products/by-slug/:slug", handleBySlug);
// Alias so external callers / older clients can hit /api/products/:slug too.
// Placed AFTER the literal "by-slug" route so it doesn't shadow it.
router.get("/products/:slug", handleBySlug);

// ADMIN
router.get("/admin/products", requireAdmin, (_req, res) => {
  res.json({ ok: true, products: listProducts({ includeHidden: true }) });
});

router.post("/admin/products", requireAdmin, (req, res) => {
  let parsed;
  try {
    parsed = productSchema.parse(req.body);
  } catch (e) {
    return res.status(400).json({ ok: false, error: "invalid_input", detail: e.errors });
  }
  if (getProductBySlug(parsed.slug)) {
    return res.status(409).json({ ok: false, error: "slug_taken" });
  }
  try {
    const created = insertProduct(parsed);
    res.json({ ok: true, product: created });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.put("/admin/products/:id", requireAdmin, (req, res) => {
  const existing = getProduct(req.params.id);
  if (!existing) return res.status(404).json({ ok: false, error: "not_found" });
  let parsed;
  try {
    parsed = productSchema.parse(req.body);
  } catch (e) {
    return res.status(400).json({ ok: false, error: "invalid_input", detail: e.errors });
  }
  // slug uniqueness if changed
  if (parsed.slug !== existing.slug) {
    const conflict = getProductBySlug(parsed.slug);
    if (conflict) return res.status(409).json({ ok: false, error: "slug_taken" });
  }
  const updated = updateProduct(req.params.id, parsed);
  res.json({ ok: true, product: updated });
});

router.delete("/admin/products/:id", requireAdmin, (req, res) => {
  deleteProduct(req.params.id);
  res.json({ ok: true });
});

router.post("/admin/products/reorder", requireAdmin, (req, res) => {
  const schema = z.object({
    order: z.array(z.object({ id: z.string(), sort_order: z.number().int() })).max(500),
  });
  let parsed;
  try {
    parsed = schema.parse(req.body);
  } catch (e) {
    return res.status(400).json({ ok: false, error: "invalid_input", detail: e.errors });
  }
  reorderProducts(parsed.order);
  res.json({ ok: true });
});

module.exports = router;

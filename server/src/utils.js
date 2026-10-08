"use strict";

const { getFees } = require("./settingsDb");
const { getProduct } = require("../src/productsDb");

function generateOrderId() {
  const ts = Math.floor(Date.now() / 1000);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KHJ-${ts}-${rand}`;
}

function tomanToRial(toman) {
  return Math.round(Number(toman) * 10);
}

// 1 mithqal = 4.608 g (site-wide definition, also used by the frontend).
const MITHQAL_GRAMS = 4.608;
const round2 = (n) => Math.round(n * 100) / 100;

function normalizeDigits(s) {
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  const ar = "٠١٢٣٤٥٦٧٨٩";
  return String(s ?? "").replace(/[۰-۹٠-٩]/g, (d) => {
    const i = fa.indexOf(d);
    return String(i >= 0 ? i : ar.indexOf(d));
  });
}

/**
 * Parse a Persian/English weight string into mithqal of saffron.
 * Understands: "۱ مثقال (۴.۶۰۸ گرم)", "نیم مثقال", "۵ مثقال",
 * "۱۰ گرم", "۵۰۰ گرم", "۱ کیلوگرم".
 */
function weightToMithqal(text) {
  if (!text) return 0;
  const t = normalizeDigits(text).replace(/[٬,]/g, " ");
  const m = t.match(/([\d.]+|نیم)\s*مثقال/);
  if (m) return m[1] === "نیم" ? 0.5 : parseFloat(m[1]) || 0;
  const g = t.match(/([\d.]+)\s*(کیلوگرم|کیلو|گرم)/);
  if (g) {
    const grams = parseFloat(g[1]) || 0;
    return round2(/کیلو/.test(g[2]) ? (grams * 1000) / MITHQAL_GRAMS : grams / MITHQAL_GRAMS);
  }
  return 0;
}

/**
 * Mithqal of saffron in one cart line. Only saffron products count
 * (barberry, dried fruit, cardamom etc. never contribute).
 *
 * For tiered lines the cart appends the chosen tier to the name,
 * e.g. "زعفران نرمه (۴.۶ گرمی) (۵ مثقال)" — the last parenthesised group is
 * the variant and defines the pack size. The product DB is consulted as a
 * fallback so plain products resolve from their authoritative weight.
 */
function lineMithqal(item) {
  const name = String(item.name || "");
  let product = null;
  try {
    product = getProduct(String(item.id));
  } catch {
    /* product DB unavailable — fall back to name parsing */
  }

  const isSaffron =
    /زعفران/.test(name) || /زعفران/.test(`${product?.name || ""} ${product?.category || ""}`);
  if (!isSaffron) return 0;

  const qty = Math.max(1, Number(item.qty) || 1);
  const price = Number(item.price) || 0;

  // Tiered products: the chosen tier (matched by unit price) defines the pack.
  const tiers = product?.priceTiers;
  if (Array.isArray(tiers) && tiers.length > 0) {
    const tier = tiers.find((t) => Number(t.price) === price);
    if (tier) {
      const perUnit =
        weightToMithqal(tier.label) ||
        weightToMithqal(product.weight) * (Number(tier.quantity) || 1);
      return round2(perUnit) * qty;
    }
  }

  const parens = name.match(/\(([^()]*)\)/g) || [];
  const variant = parens.length > 1 ? parens[parens.length - 1].slice(1, -1) : "";
  const perUnit =
    weightToMithqal(variant) ||
    weightToMithqal(product?.weight) ||
    weightToMithqal(name);
  return round2(perUnit) * qty;
}

/** Total mithqal of saffron across all cart lines. */
function orderMithqal(items) {
  return round2((items || []).reduce((sum, it) => sum + lineMithqal(it), 0));
}

/**
 * Server-authoritative totals using the fee settings.
 * Returns a breakdown plus display lines (label + amount) for every charged fee.
 */
function computeTotals(items, { giftBox = false } = {}) {
  const f = getFees();
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const qty = items.reduce((s, it) => s + it.qty, 0);
  const mithqal = orderMithqal(items);

  const packaging = f.packaging.enabled ? f.packaging.perOrder + f.packaging.perItem * qty : 0;
  const free =
    f.freeShipping.enabled &&
    (f.freeShipping.mode === "mithqal"
      ? mithqal >= f.freeShipping.mithqal
      : subtotal >= f.freeShipping.threshold);
  const shipping = f.shipping.enabled && !free ? f.shipping.amount : 0;
  const gift = giftBox && f.giftBox.enabled ? f.giftBox.amount : 0;

  const lines = [];
  if (f.packaging.enabled && packaging > 0) lines.push({ key: "packaging", label: f.packaging.label, amount: packaging });
  if (f.shipping.enabled) lines.push({ key: "shipping", label: f.shipping.label, amount: shipping, free });
  if (gift > 0) lines.push({ key: "giftBox", label: f.giftBox.label, amount: gift });

  return {
    subtotal,
    mithqal,
    packaging,
    shipping,
    giftBox: gift,
    total: subtotal + packaging + shipping + gift,
    lines,
  };
}

function formatToman(n) {
  return Number(n).toLocaleString("en-US") + " تومان";
}

module.exports = {
  generateOrderId,
  tomanToRial,
  computeTotals,
  orderMithqal,
  lineMithqal,
  weightToMithqal,
  formatToman,
};
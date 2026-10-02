"use strict";

const { getFees } = require("./settingsDb");

function generateOrderId() {
  const ts = Math.floor(Date.now() / 1000);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KHJ-${ts}-${rand}`;
}

function tomanToRial(toman) {
  return Math.round(Number(toman) * 10);
}

/**
 * Server-authoritative totals using the fee settings.
 * Returns a breakdown plus display lines (label + amount) for every charged fee.
 */
function computeTotals(items, { giftBox = false } = {}) {
  const f = getFees();
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const qty = items.reduce((s, it) => s + it.qty, 0);

  const packaging = f.packaging.enabled ? f.packaging.perOrder + f.packaging.perItem * qty : 0;
  const free = f.freeShipping.enabled && subtotal >= f.freeShipping.threshold;
  const shipping = f.shipping.enabled && !free ? f.shipping.amount : 0;
  const gift = giftBox && f.giftBox.enabled ? f.giftBox.amount : 0;

  const lines = [];
  if (f.packaging.enabled && packaging > 0) lines.push({ key: "packaging", label: f.packaging.label, amount: packaging });
  if (f.shipping.enabled) lines.push({ key: "shipping", label: f.shipping.label, amount: shipping, free });
  if (gift > 0) lines.push({ key: "giftBox", label: f.giftBox.label, amount: gift });

  return { subtotal, packaging, shipping, giftBox: gift, total: subtotal + packaging + shipping + gift, lines };
}

function formatToman(n) {
  return Number(n).toLocaleString("en-US") + " تومان";
}

module.exports = { generateOrderId, tomanToRial, computeTotals, formatToman };

"use strict";

// Packaging / postal fee. Waived for orders at/above the free-shipping threshold.
const SHIPPING_FEE_TOMAN = 30000;
const FREE_SHIPPING_THRESHOLD_TOMAN = 2000000;

function generateOrderId() {
  const ts = Math.floor(Date.now() / 1000);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KHJ-${ts}-${rand}`;
}

function tomanToRial(toman) {
  return Math.round(Number(toman) * 10);
}

function computeTotals(items) {
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_TOMAN ? 0 : SHIPPING_FEE_TOMAN;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

function formatToman(n) {
  return Number(n).toLocaleString("en-US") + " تومان";
}

module.exports = {
  SHIPPING_FEE_TOMAN,
  FREE_SHIPPING_THRESHOLD_TOMAN,
  generateOrderId,
  tomanToRial,
  computeTotals,
  formatToman,
};

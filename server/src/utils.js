"use strict";

// Fixed packaging / postal fee added to every order, regardless of total.
const SHIPPING_FEE_TOMAN = 30000;

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
  const shipping = SHIPPING_FEE_TOMAN;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

function formatToman(n) {
  return Number(n).toLocaleString("en-US") + " تومان";
}

module.exports = {
  SHIPPING_FEE_TOMAN,
  generateOrderId,
  tomanToRial,
  computeTotals,
  formatToman,
};

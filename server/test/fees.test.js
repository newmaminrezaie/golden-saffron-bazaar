"use strict";

// Tests for the mithqal-based free-shipping rule.
// Run with: node --test server/test/

const { test } = require("node:test");
const assert = require("node:assert");
const { computeTotals, weightToMithqal, orderMithqal } = require("../src/utils");
const { setFees, getFees } = require("../src/settingsDb");

// Reset to the current store rule: free shipping at 5+ mithqal of saffron.
setFees({ freeShipping: { enabled: true, mode: "mithqal", threshold: 2000000, mithqal: 5 } });

test("weight parsing: mithqal, grams, kilos", () => {
  assert.equal(weightToMithqal("۱ مثقال (۴.۶۰۸ گرم)"), 1);
  assert.equal(weightToMithqal("نیم مثقال"), 0.5);
  assert.equal(weightToMithqal("۵ مثقال"), 5);
  assert.equal(weightToMithqal("۴.۶۰۸ گرم"), 1);
  assert.equal(weightToMithqal("۱۰ گرم"), Math.round((10 / 4.608) * 100) / 100);
  assert.equal(weightToMithqal("۱ کیلوگرم"), Math.round((1000 / 4.608) * 100) / 100);
  assert.equal(weightToMithqal("بسته ویژه"), 0);
});

test("orders with 5+ mithqal of saffron ship free", () => {
  const r = computeTotals([
    { id: "narmeh", name: "زعفران نرمه (۴.۶ گرمی) (۵ مثقال)", qty: 1, price: 1700000 },
  ]);
  assert.equal(r.shipping, 0);
  assert.equal(r.mithqal, 5);
});

test("orders below 5 mithqal pay shipping", () => {
  const r = computeTotals([
    { id: "narmeh", name: "زعفران نرمه (۴.۶ گرمی) (۲ مثقال)", qty: 1, price: 720000 },
  ]);
  assert.equal(r.shipping, getFees().shipping.amount);
  assert.equal(r.mithqal, 2);
});

test("saffron weight adds up across lines and tiers", () => {
  // 1-gram negin packs: 10 × 1 g = 10 g ≈ 2.17 mithqal, plus a 5-mithqal pack → free.
  const m = orderMithqal([
    { id: "negin1g", name: "زعفران نگین (۱ گرمی) (۱۰ گرم)", qty: 2, price: 400000 },
    { id: "narmeh", name: "زعفران نرمه (۴.۶ گرمی) (۵ مثقال)", qty: 1, price: 1700000 },
  ]);
  const r = computeTotals([
    { id: "negin1g", name: "زعفران نگین (۱ گرمی) (۱۰ گرم)", qty: 2, price: 400000 },
    { id: "narmeh", name: "زعفران نرمه (۴.۶ گرمی) (۵ مثقال)", qty: 1, price: 1700000 },
  ]);
  assert.equal(r.shipping, 0);
  assert.ok(m >= 5);
});

test("non-saffron products never count toward the mithqal rule", () => {
  // Expensive barberry order: 0 mithqal → shipping still charged.
  const r = computeTotals([
    { id: "barberry", name: "زرشک (۵۰۰ گرم)", qty: 5, price: 900000 },
  ]);
  assert.equal(r.mithqal, 0);
  assert.equal(r.shipping, getFees().shipping.amount);
});

test("amount mode still works when selected", () => {
  setFees({ freeShipping: { mode: "amount", threshold: 2000000 } });
  const free = computeTotals([{ id: "narmeh", name: "زعفران نرمه", qty: 1, price: 2500000 }]);
  const notFree = computeTotals([{ id: "narmeh", name: "زعفران نرمه", qty: 1, price: 500000 }]);
  assert.equal(free.shipping, 0);
  assert.equal(notFree.shipping, getFees().shipping.amount);
  setFees({ freeShipping: { mode: "mithqal", threshold: 2000000, mithqal: 5 } });
});

test("half-mithqal lines accumulate correctly", () => {
  const r = computeTotals([
    { id: "half", name: "زعفران (نیم مثقال)", qty: 9, price: 300000 },
  ]);
  assert.equal(r.mithqal, 4.5);
  assert.equal(r.shipping, getFees().shipping.amount);
});

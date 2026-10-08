"use strict";

// Store-wide fee settings (packaging, shipping, free-shipping threshold, gift box).
// Kept in the same SQLite file as orders. All amounts are Toman.
const { z } = require("zod");
const { db } = require("./db");

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

// Safe migrations for order breakdown columns
for (const col of ["packaging INTEGER", "gift_box INTEGER"]) {
  try { db.exec(`ALTER TABLE orders ADD COLUMN ${col}`); } catch { /* exists */ }
}

const money = z.number().int().min(0).max(100_000_000);
const label = z.string().trim().min(1).max(80);

const feesSchema = z.object({
  packaging: z.object({ enabled: z.boolean(), label, perOrder: money, perItem: money }),
  shipping: z.object({ enabled: z.boolean(), label, amount: money }),
  freeShipping: z.object({
    enabled: z.boolean(),
    // "mithqal" = free by total mithqal of saffron, "amount" = free by order subtotal
    mode: z.enum(["amount", "mithqal"]),
    threshold: money,
    mithqal: z.number().min(0).max(10000),
  }),
  giftBox: z.object({ enabled: z.boolean(), label, amount: money }),
});

// Current rule: shipping is free for orders with 5+ mithqal of saffron.
const DEFAULT_FEES = {
  packaging: { enabled: false, label: "بسته‌بندی", perOrder: 0, perItem: 0 },
  shipping: { enabled: true, label: "هزینه پست و بسته‌بندی", amount: 30000 },
  freeShipping: { enabled: true, mode: "mithqal", threshold: 2000000, mithqal: 5 },
  giftBox: { enabled: false, label: "جعبه کادویی", amount: 0 },
};

function deepMerge(base, patch) {
  const out = { ...base };
  for (const k of Object.keys(patch || {})) {
    const v = patch[k];
    out[k] = v && typeof v === "object" && !Array.isArray(v) ? deepMerge(base[k] || {}, v) : v;
  }
  return out;
}

function getFees() {
  const row = db.prepare("SELECT value_json FROM settings WHERE key = 'fees'").get();
  if (!row) return DEFAULT_FEES;
  try {
    return feesSchema.parse(deepMerge(DEFAULT_FEES, JSON.parse(row.value_json)));
  } catch {
    return DEFAULT_FEES;
  }
}

/** Partial update; throws ZodError on invalid input. */
function setFees(patch) {
  const next = feesSchema.parse(deepMerge(getFees(), patch));
  db.prepare(
    "INSERT INTO settings (key, value_json, updated_at) VALUES ('fees', ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at"
  ).run(JSON.stringify(next), Date.now());
  return next;
}

module.exports = { getFees, setFees, feesSchema, DEFAULT_FEES };

"use strict";

const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const DATA_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(path.join(DATA_DIR, "orders.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id              TEXT PRIMARY KEY,
    created_at      INTEGER NOT NULL,
    customer_name   TEXT,
    phone           TEXT,
    address         TEXT,
    postal_code     TEXT,
    note            TEXT,
    items_json      TEXT NOT NULL,
    subtotal        INTEGER NOT NULL,
    shipping        INTEGER NOT NULL,
    total           INTEGER NOT NULL,
    method          TEXT NOT NULL,
    gateway_ref     TEXT,
    authority       TEXT,
    status          TEXT NOT NULL,
    paid_at         INTEGER,
    raw_callback    TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
`);

const insertOrderStmt = db.prepare(`
  INSERT INTO orders (
    id, created_at, customer_name, phone, address, postal_code, note,
    items_json, subtotal, shipping, total, method, status
  ) VALUES (
    @id, @created_at, @customer_name, @phone, @address, @postal_code, @note,
    @items_json, @subtotal, @shipping, @total, @method, @status
  )
`);

function insertOrder(o) {
  insertOrderStmt.run(o);
  return getOrder(o.id);
}

function getOrder(id) {
  return db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
}

function updateOrder(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return getOrder(id);
  const set = keys.map((k) => `${k} = @${k}`).join(", ");
  db.prepare(`UPDATE orders SET ${set} WHERE id = @id`).run({ ...fields, id });
  return getOrder(id);
}

function listOrders({ status, limit = 100 } = {}) {
  const lim = Math.max(1, Math.min(500, Number(limit) || 100));
  if (status) {
    return db
      .prepare(
        "SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC LIMIT ?"
      )
      .all(status, lim);
  }
  return db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT ?")
    .all(lim);
}

module.exports = { db, insertOrder, getOrder, updateOrder, listOrders };

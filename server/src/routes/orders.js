"use strict";

const express = require("express");
const { z } = require("zod");

const {
  insertOrder,
  getOrder,
  updateOrder,
  listOrders,
} = require("../db");
const {
  generateOrderId,
  tomanToRial,
  computeTotals,
} = require("../utils");
const { notifyOrder } = require("../telegram");
const { notifyOrderPush } = require("../push");
const { notifyOrderRubika } = require("../rubika");

const router = express.Router();

// ---------- Validation ----------

const itemSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string().min(1).max(200),
  qty: z.number().int().min(1).max(999),
  price: z.number().int().min(0).max(1_000_000_000), // toman
});

const customerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^0?9\d{9}$/, "شماره موبایل نامعتبر است"),
  address: z.string().trim().min(5).max(500),
  postal_code: z.string().trim().regex(/^\d{10}$/).optional().or(z.literal("")),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

const orderBodySchema = z.object({
  customer: customerSchema,
  items: z.array(itemSchema).min(1).max(50),
  subtotal: z.number().int().min(0).optional(), // sanity-check only
});

function buildOrderRow(parsed, method, status) {
  const { subtotal, shipping, total } = computeTotals(parsed.items);

  if (
    typeof parsed.subtotal === "number" &&
    parsed.subtotal !== subtotal
  ) {
    const err = new Error("subtotal_mismatch");
    err.statusCode = 400;
    err.detail = { expected: subtotal, received: parsed.subtotal };
    throw err;
  }

  return {
    id: generateOrderId(),
    created_at: Date.now(),
    customer_name: parsed.customer.name,
    phone: parsed.customer.phone,
    address: parsed.customer.address,
    postal_code: parsed.customer.postal_code || null,
    note: parsed.customer.note || null,
    items_json: JSON.stringify(parsed.items),
    subtotal,
    shipping,
    total,
    method,
    status,
  };
}

function siteUrl() {
  return (process.env.SITE_URL || "https://khajavisaffron.ir").replace(/\/$/, "");
}

// ---------- Zibal (به پرداخت ملت) ----------

router.post("/order", async (req, res) => {
  let parsed;
  try {
    parsed = orderBodySchema.parse(req.body);
  } catch (err) {
    return res.status(400).json({ ok: false, error: "invalid_input", detail: err.errors });
  }

  let order;
  try {
    order = insertOrder(buildOrderRow(parsed, "zibal", "pending"));
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ ok: false, error: err.message, detail: err.detail });
  }

  try {
    const r = await fetch("https://gateway.zibal.ir/v1/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant: process.env.ZIBAL_MERCHANT_ID || "69f20f536bb5e9f6dbf68c25",
        amount: tomanToRial(order.total),
        callbackUrl: `${siteUrl()}/payment/callback`,
        orderId: order.id,
        description: `سفارش زعفران خواجوی - ${order.id}`,
        mobile: order.phone,
      }),
    });
    const data = await r.json();

    if (data.result === 100 && data.trackId) {
      updateOrder(order.id, { authority: String(data.trackId) });
      return res.json({
        ok: true,
        order_id: order.id,
        total: order.total,
        redirect: `https://gateway.zibal.ir/start/${data.trackId}`,
      });
    }

    updateOrder(order.id, {
      status: "failed",
      raw_callback: JSON.stringify(data),
    });
    return res.status(502).json({
      ok: false,
      error: "gateway_request_failed",
      message: data.message || "خطا در ایجاد تراکنش",
      result: data.result,
    });
  } catch (err) {
    updateOrder(order.id, { status: "failed", raw_callback: err.message });
    return res
      .status(502)
      .json({ ok: false, error: "gateway_unreachable", message: err.message });
  }
});

// ---------- Sep / Saman ----------

router.post("/order-sep", async (req, res) => {
  let parsed;
  try {
    parsed = orderBodySchema.parse(req.body);
  } catch (err) {
    return res.status(400).json({ ok: false, error: "invalid_input", detail: err.errors });
  }

  let order;
  try {
    order = insertOrder(buildOrderRow(parsed, "sep", "pending"));
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ ok: false, error: err.message, detail: err.detail });
  }

  try {
    const r = await fetch(
      "https://sep.shaparak.ir/MobilePG/MobilePayment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Action: "Token",
          TerminalId: process.env.SEP_TERMINAL_ID || "0",
          Amount: tomanToRial(order.total),
          ResNum: order.id,
          RedirectUrl: `${siteUrl()}/payment/callback-sep`,
          CellNumber: order.phone,
        }),
      }
    );
    const data = await r.json();

    if (data.Status === 1 && data.Token) {
      updateOrder(order.id, { authority: String(data.Token) });
      return res.json({
        ok: true,
        order_id: order.id,
        total: order.total,
        redirect: `https://sep.shaparak.ir/OnlinePG/SendToken?token=${encodeURIComponent(
          data.Token
        )}`,
      });
    }

    updateOrder(order.id, {
      status: "failed",
      raw_callback: JSON.stringify(data),
    });
    return res.status(502).json({
      ok: false,
      error: "gateway_request_failed",
      message: data.ErrorDesc || "خطا در ایجاد تراکنش سامان",
      status: data.Status,
    });
  } catch (err) {
    updateOrder(order.id, { status: "failed", raw_callback: err.message });
    return res
      .status(502)
      .json({ ok: false, error: "gateway_unreachable", message: err.message });
  }
});

// ---------- Card-to-card (مجید خواجوی) ----------

router.post("/order-card", async (req, res) => {
  let parsed;
  try {
    parsed = orderBodySchema.parse(req.body);
  } catch (err) {
    return res.status(400).json({ ok: false, error: "invalid_input", detail: err.errors });
  }

  let order;
  try {
    order = insertOrder(buildOrderRow(parsed, "card", "awaiting_card_confirm"));
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ ok: false, error: err.message, detail: err.detail });
  }

  // fire-and-forget telegram
  notifyOrder(order, "awaiting_card_confirm").catch(() => {});
  notifyOrderPush(order, "awaiting_card_confirm").catch(() => {});
  notifyOrderRubika(order, "awaiting_card_confirm").catch(() => {});

  return res.json({
    ok: true,
    order_id: order.id,
    total: order.total,
    subtotal: order.subtotal,
    shipping: order.shipping,
    card: {
      number: process.env.CARD_NUMBER || "6037 9974 6126 4344",
      holder: process.env.CARD_HOLDER || "مجید خواجوی",
      bank: process.env.CARD_BANK || "بانک ملی ایران",
    },
    instructions:
      "پس از واریز، شماره پیگیری و چهار رقم آخر کارت خود را به همراه شماره سفارش از طریق واتس‌اپ یا تماس برای ما ارسال کنید.",
  });
});

// ---------- Admin list ----------

router.get("/orders", (req, res) => {
  const token = req.header("x-admin-token");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  const rows = listOrders({
    status: req.query.status ? String(req.query.status) : undefined,
    limit: req.query.limit,
  });
  res.json({
    ok: true,
    count: rows.length,
    orders: rows.map((r) => ({
      ...r,
      items: JSON.parse(r.items_json || "[]"),
    })),
  });
});

module.exports = router;

"use strict";

const express = require("express");
const { getOrder, updateOrder } = require("../db");
const { tomanToRial } = require("../utils");
const { notifyOrder } = require("../telegram");
const { notifyOrderPush } = require("../push");
const { notifyOrderRubika } = require("../rubika");

const router = express.Router();

function siteUrl() {
  return (process.env.SITE_URL || "https://khajavisaffron.ir").replace(/\/$/, "");
}

function redirectSuccess(res, orderId) {
  return res.redirect(302, `${siteUrl()}/payment/success?order=${encodeURIComponent(orderId)}`);
}
function redirectFailed(res, orderId, reason = "") {
  const q = new URLSearchParams({ order: orderId || "", reason: String(reason) }).toString();
  return res.redirect(302, `${siteUrl()}/payment/failed?${q}`);
}

// ---------- Zibal callback ----------
// Zibal sends GET with: success, trackId, orderId, status, message
router.get("/callback", async (req, res) => {
  const { trackId, orderId, success, status } = req.query;
  const order = orderId ? getOrder(String(orderId)) : null;
  if (!order) return redirectFailed(res, String(orderId || ""), "order_not_found");

  // user cancelled / not paid
  if (String(success) !== "1") {
    updateOrder(order.id, {
      status: "failed",
      raw_callback: JSON.stringify(req.query),
    });
    return redirectFailed(res, order.id, `cancelled_${status || ""}`);
  }

  try {
    const r = await fetch("https://gateway.zibal.ir/v1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant: process.env.ZIBAL_MERCHANT_ID || "69f20f536bb5e9f6dbf68c25",
        trackId: Number(trackId),
      }),
    });
    const data = await r.json();

    if (data.result === 100 || data.result === 201) {
      const updated = updateOrder(order.id, {
        status: "paid",
        paid_at: Date.now(),
        gateway_ref: String(data.refNumber || trackId),
        raw_callback: JSON.stringify(data),
      });
      notifyOrder(updated, "paid").catch(() => {});
      notifyOrderPush(updated, "paid").catch(() => {});
      return redirectSuccess(res, order.id);
    }

    updateOrder(order.id, {
      status: "failed",
      raw_callback: JSON.stringify(data),
    });
    return redirectFailed(res, order.id, `verify_${data.result}`);
  } catch (err) {
    updateOrder(order.id, { status: "failed", raw_callback: err.message });
    return redirectFailed(res, order.id, "verify_error");
  }
});

// ---------- Sep / Saman callback ----------
// Saman POSTs application/x-www-form-urlencoded; we accept GET as well.
async function handleSepCallback(req, res) {
  const src = { ...(req.body || {}), ...(req.query || {}) };
  const { State, RefNum, ResNum, Amount } = src;

  const order = ResNum ? getOrder(String(ResNum)) : null;
  if (!order) return redirectFailed(res, String(ResNum || ""), "order_not_found");

  if (String(State) !== "OK" || !RefNum) {
    updateOrder(order.id, {
      status: "failed",
      raw_callback: JSON.stringify(src),
    });
    return redirectFailed(res, order.id, `sep_${State || "no_state"}`);
  }

  try {
    const r = await fetch(
      "https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTransaction",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RefNum: String(RefNum),
          TerminalNumber: process.env.SEP_TERMINAL_ID || "0",
        }),
      }
    );
    const data = await r.json();

    // Sep returns Success + TransactionDetail.OrgAmount (rial)
    const expectedRial = tomanToRial(order.total);
    const verifiedAmount =
      Number(data?.TransactionDetail?.OrgAmount) ||
      Number(data?.OriginalAmount) ||
      Number(Amount) ||
      0;

    if (data.Success === true && verifiedAmount === expectedRial) {
      const updated = updateOrder(order.id, {
        status: "paid",
        paid_at: Date.now(),
        gateway_ref: String(RefNum),
        raw_callback: JSON.stringify({ callback: src, verify: data }),
      });
      notifyOrder(updated, "paid").catch(() => {});
      notifyOrderPush(updated, "paid").catch(() => {});
      return redirectSuccess(res, order.id);
    }

    updateOrder(order.id, {
      status: "failed",
      raw_callback: JSON.stringify({ callback: src, verify: data }),
    });
    return redirectFailed(res, order.id, `sep_verify_${data.ResultCode || "fail"}`);
  } catch (err) {
    updateOrder(order.id, { status: "failed", raw_callback: err.message });
    return redirectFailed(res, order.id, "sep_verify_error");
  }
}

router.post("/callback-sep", handleSepCallback);
router.get("/callback-sep", handleSepCallback);

module.exports = router;

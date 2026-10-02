"use strict";

const express = require("express");
const { z } = require("zod");
const { getFees, setFees } = require("../settingsDb");
const { requireAdmin } = require("../middleware/admin-auth");

const router = express.Router();

// Public: the shop reads this to show fees openly on product pages and the cart.
router.get("/fees", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ ok: true, fees: getFees() });
});

router.put("/fees", requireAdmin, (req, res) => {
  try {
    res.json({ ok: true, fees: setFees(req.body || {}) });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ ok: false, error: "invalid_input", detail: e.errors });
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;

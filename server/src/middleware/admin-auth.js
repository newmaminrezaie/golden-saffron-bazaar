"use strict";

function requireAdmin(req, res, next) {
  const token = req.header("x-admin-token");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  next();
}

module.exports = { requireAdmin };

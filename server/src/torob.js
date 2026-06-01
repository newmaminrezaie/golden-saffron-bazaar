"use strict";

const jwt = require("jsonwebtoken");
const { db } = require("./db");

const PAGE_SIZE = 100;

function getSiteOrigin() {
  return (process.env.SITE_ORIGIN || process.env.SITE_URL || "https://khajavisaffron.ir").replace(/\/$/, "");
}

function absoluteUrl(origin, url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return origin + (url.startsWith("/") ? url : "/" + url);
}

function verifyJwt(req) {
  const key = (process.env.TOROB_PUBLIC_KEY || "").trim();
  const enforce = process.env.TOROB_ENFORCE_JWT === "1";
  if (!key && !enforce) return { ok: true };
  if (!key && enforce) return { ok: false, error: "server_misconfigured: TOROB_PUBLIC_KEY missing" };

  const token = req.headers["x-torob-token"];
  if (!token || typeof token !== "string") return { ok: false, error: "missing_token" };
  try {
    jwt.verify(token, key, { algorithms: ["RS256", "ES256"] });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "invalid_token: " + e.message };
  }
}

function mapRow(r, origin) {
  let images = [];
  try {
    const parsed = r.images_json ? JSON.parse(r.images_json) : [];
    if (Array.isArray(parsed)) images = parsed.map((u) => absoluteUrl(origin, u)).filter(Boolean);
  } catch (_) {}

  let highlights = [];
  try {
    const parsed = r.highlights_json ? JSON.parse(r.highlights_json) : [];
    if (Array.isArray(parsed)) highlights = parsed.filter((x) => typeof x === "string" && x.trim());
  } catch (_) {}

  const spec = {};
  if (r.weight) spec["وزن"] = r.weight;
  if (r.badge) spec["برچسب"] = r.badge;
  highlights.forEach((h, i) => { spec[`ویژگی ${i + 1}`] = h; });

  return {
    page_unique: String(r.id),
    page_url: `${origin}/product/${r.slug}`,
    product_group_id: null,
    title: r.name,
    subtitle: r.weight || null,
    current_price: Number(r.price) || 0,
    old_price: r.old_price && r.old_price > 0 ? Number(r.old_price) : null,
    availability: r.in_stock === 1,
    category_name: r.category || null,
    image_links: images,
    short_desc: r.short_description || null,
    spec,
    guarantee: null,
    date_added: new Date(Number(r.created_at) || Date.now()).toISOString(),
    date_updated: new Date(Number(r.updated_at) || Date.now()).toISOString(),
  };
}

function slugFromUrl(url) {
  if (typeof url !== "string") return null;
  const m = url.match(/\/product\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

module.exports = function torobHandler(req, res) {
  const auth = verifyJwt(req);
  if (!auth.ok) {
    return res.status(401).json({ error: "unauthorized", message: auth.error });
  }

  const body = req.body || {};
  const modes = ["page", "page_urls", "page_uniques"].filter((k) => body[k] !== undefined);
  if (modes.length !== 1) {
    return res.status(400).json({ error: "invalid_request", message: "exactly one of page, page_urls, page_uniques is required" });
  }

  const origin = getSiteOrigin();
  const mode = modes[0];

  try {
    if (mode === "page") {
      const page = Number(body.page);
      if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({ error: "invalid_request", message: "page must be a positive integer" });
      }
      const sort = body.sort === "date_updated_desc" ? "updated_at" : "created_at";
      if (body.sort && body.sort !== "date_added_desc" && body.sort !== "date_updated_desc") {
        return res.status(400).json({ error: "invalid_request", message: "invalid sort" });
      }
      const total = db.prepare("SELECT COUNT(*) AS n FROM products WHERE price > 0").get().n;
      const rows = db.prepare(`SELECT * FROM products WHERE price > 0 ORDER BY ${sort} DESC LIMIT ? OFFSET ?`)
        .all(PAGE_SIZE, (page - 1) * PAGE_SIZE);
      const products = rows.map((r) => mapRow(r, origin));
      return res.json({
        api_version: "torob_api_v3",
        current_page: page,
        total,
        max_pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
        products,
      });
    }

    if (mode === "page_urls") {
      const urls = Array.isArray(body.page_urls) ? body.page_urls : [];
      const slugs = urls.map(slugFromUrl).filter(Boolean);
      let products = [];
      if (slugs.length) {
        const placeholders = slugs.map(() => "?").join(",");
        const rows = db.prepare(`SELECT * FROM products WHERE slug IN (${placeholders})`).all(...slugs);
        products = rows.map((r) => mapRow(r, origin));
      }
      return res.json({
        api_version: "torob_api_v3",
        current_page: 1,
        total: products.length,
        max_pages: 1,
        products,
      });
    }

    // page_uniques
    const ids = Array.isArray(body.page_uniques) ? body.page_uniques.map(String) : [];
    let products = [];
    if (ids.length) {
      const placeholders = ids.map(() => "?").join(",");
      const rows = db.prepare(`SELECT * FROM products WHERE id IN (${placeholders})`).all(...ids);
      products = rows.map((r) => mapRow(r, origin));
    }
    return res.json({
      api_version: "torob_api_v3",
      current_page: 1,
      total: products.length,
      max_pages: 1,
      products,
    });
  } catch (err) {
    console.error("[torob] error:", err);
    return res.status(500).json({ error: "internal_error", message: err.message });
  }
};

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

function err(res, status, message) {
  return res.status(status).json({ error: message });
}

function verifyJwt(req) {
  const key = (process.env.TOROB_PUBLIC_KEY || "").trim();
  const enforce = process.env.TOROB_ENFORCE_JWT === "1";
  if (!key && !enforce) return { ok: true };
  if (!key && enforce) return { ok: false, error: "server misconfigured: TOROB_PUBLIC_KEY missing" };

  const token = req.headers["x-torob-token"];
  if (!token || typeof token !== "string") return { ok: false, error: "missing X-Torob-Token header" };
  try {
    jwt.verify(token, key, { algorithms: ["RS256", "ES256"] });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "invalid X-Torob-Token: " + e.message };
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

  // Pick the lowest tier price so Torob indexes the cheapest weight option.
  let tiers = [];
  try {
    const parsed = r.price_tiers_json ? JSON.parse(r.price_tiers_json) : [];
    if (Array.isArray(parsed)) {
      tiers = parsed
        .map((t) => ({
          quantity: Number(t && t.quantity) || 0,
          price: Math.max(0, Math.trunc(Number(t && t.price) || 0)),
          label: typeof (t && t.label) === "string" ? t.label : null,
        }))
        .filter((t) => t.price > 0);
    }
  } catch (_) {}

  const basePrice = Math.max(0, Math.trunc(Number(r.price) || 0));
  const lowestTier = tiers.length
    ? tiers.reduce((min, t) => (t.price < min.price ? t : min), tiers[0])
    : null;
  const currentPrice = lowestTier ? lowestTier.price : basePrice;
  const subtitle =
    (lowestTier && (lowestTier.label || (lowestTier.quantity ? `${lowestTier.quantity} گرم` : null))) ||
    r.weight ||
    null;

  const spec = {};
  if (subtitle) spec["وزن"] = subtitle;
  if (r.badge) spec["برچسب"] = r.badge;
  highlights.forEach((h, i) => { spec[`ویژگی ${i + 1}`] = h; });

  return {
    page_unique: String(r.id),
    page_url: `${origin}/product/${r.slug}`,
    product_group_id: null,
    title: r.name,
    subtitle,
    current_price: currentPrice,
    old_price: r.old_price && r.old_price > 0 ? Math.trunc(Number(r.old_price)) : null,
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
  if (!auth.ok) return err(res, 401, auth.error);

  const body = req.body || {};
  const hasPage = body.page !== undefined || body.sort !== undefined;
  const hasUrls = body.page_urls !== undefined;
  const hasUniques = body.page_uniques !== undefined;
  const modeCount = [hasPage, hasUrls, hasUniques].filter(Boolean).length;
  if (modeCount === 0) {
    return err(res, 400, "request body must contain one of: (page + sort), page_urls, page_uniques");
  }
  if (modeCount > 1) {
    return err(res, 400, "request must contain exactly one of: (page + sort), page_urls, page_uniques");
  }

  const origin = getSiteOrigin();

  try {
    if (hasPage) {
      if (body.page === undefined) return err(res, 400, "page parameter is not provided");
      if (body.sort === undefined) return err(res, 400, "sort parameter is not provided");
      const page = Number(body.page);
      if (!Number.isInteger(page) || page < 1) {
        return err(res, 400, "page must be a positive integer starting from 1");
      }
      if (body.sort !== "date_added_desc" && body.sort !== "date_updated_desc") {
        return err(res, 400, "sort must be one of: date_added_desc, date_updated_desc");
      }
      const orderCol = body.sort === "date_updated_desc" ? "updated_at" : "created_at";
      const total = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
      const rows = db.prepare(`SELECT * FROM products ORDER BY ${orderCol} DESC, id ASC LIMIT ? OFFSET ?`)
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

    if (hasUrls) {
      if (!Array.isArray(body.page_urls) || body.page_urls.length === 0) {
        return err(res, 400, "page_urls must be a non-empty array of product URLs");
      }
      const slugs = body.page_urls.map(slugFromUrl).filter(Boolean);
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
    if (!Array.isArray(body.page_uniques) || body.page_uniques.length === 0) {
      return err(res, 400, "page_uniques must be a non-empty array of product ids");
    }
    const ids = body.page_uniques.map(String);
    const placeholders = ids.map(() => "?").join(",");
    const rows = db.prepare(`SELECT * FROM products WHERE id IN (${placeholders})`).all(...ids);
    const products = rows.map((r) => mapRow(r, origin));
    return res.json({
      api_version: "torob_api_v3",
      current_page: 1,
      total: products.length,
      max_pages: 1,
      products,
    });
  } catch (e) {
    console.error("[torob] error:", e);
    return err(res, 500, "internal server error: " + e.message);
  }
};

"use strict";

// AI-agent control surface. Everything runs locally on the VPS (no external deps).
//   REST quick actions : /api/agent/*            (header x-admin-token or Authorization: Bearer)
//   OpenAPI schema     : GET /api/agent/openapi.json (public, describes the API)
//   MCP server         : POST /api/mcp            (JSON-RPC 2.0, Streamable HTTP, same token)

const express = require("express");
const { z } = require("zod");
const P = require("../productsDb");
const { getOrder, updateOrder, listOrders } = require("../db");
const Fees = require("../settingsDb");

const router = express.Router();

function tokenOf(req) {
  const h = req.header("authorization") || "";
  if (h.toLowerCase().startsWith("bearer ")) return h.slice(7).trim();
  return req.header("x-admin-token") || "";
}
function requireAgent(req, res, next) {
  const t = tokenOf(req);
  if (!process.env.ADMIN_TOKEN || t !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  next();
}

const ORDER_STATUSES = ["pending", "awaiting_card_confirm", "paid", "failed", "shipped", "delivered", "cancelled"];

function shapeOrder(o) {
  if (!o) return null;
  let items = [];
  try { items = JSON.parse(o.items_json || "[]"); } catch {}
  const { items_json, raw_callback, ...rest } = o;
  return { ...rest, items };
}

function findProduct(idOrSlug) {
  return P.getProduct(idOrSlug) || P.getProductBySlug(idOrSlug);
}

// ---------- shared actions (used by REST + MCP) ----------
const actions = {
  summary() {
    const all = P.listProducts({ includeHidden: true });
    const orders = listOrders({ limit: 500 });
    const byStatus = {};
    let revenue = 0;
    for (const o of orders) {
      byStatus[o.status] = (byStatus[o.status] || 0) + 1;
      if (o.status === "paid" || o.status === "shipped" || o.status === "delivered") revenue += o.total;
    }
    return {
      products: { total: all.length, inStock: all.filter((p) => p.inStock).length, outOfStock: all.filter((p) => !p.inStock).length },
      orders: { recentCount: orders.length, byStatus, paidRevenueToman: revenue },
    };
  },
  listProducts({ includeHidden = true } = {}) {
    return P.listProducts({ includeHidden });
  },
  getProduct({ id }) {
    const p = findProduct(id);
    if (!p) throw new Error("product_not_found");
    return p;
  },
  setPrice({ id, price, oldPrice }) {
    const p = findProduct(id);
    if (!p) throw new Error("product_not_found");
    const patch = { price };
    if (oldPrice !== undefined) patch.oldPrice = oldPrice === null ? undefined : oldPrice;
    return P.updateProduct(p.id, patch);
  },
  setStock({ id, inStock }) {
    const p = findProduct(id);
    if (!p) throw new Error("product_not_found");
    return P.updateProduct(p.id, { inStock });
  },
  updateProduct({ id, fields }) {
    const p = findProduct(id);
    if (!p) throw new Error("product_not_found");
    if (fields.slug && fields.slug !== p.slug && P.getProductBySlug(fields.slug)) throw new Error("slug_taken");
    return P.updateProduct(p.id, fields);
  },
  createProduct(fields) {
    if (P.getProductBySlug(fields.slug)) throw new Error("slug_taken");
    return P.insertProduct(fields);
  },
  deleteProduct({ id }) {
    const p = findProduct(id);
    if (!p) throw new Error("product_not_found");
    P.deleteProduct(p.id);
    return { deleted: p.id };
  },
  listOrders({ status, limit = 50 } = {}) {
    return listOrders({ status, limit }).map(shapeOrder);
  },
  getOrder({ id }) {
    const o = getOrder(id);
    if (!o) throw new Error("order_not_found");
    return shapeOrder(o);
  },
  getFees() {
    return Fees.getFees();
  },
  setFees(patch) {
    return Fees.setFees(patch);
  },
  setOrderStatus({ id, status }) {
    const o = getOrder(id);
    if (!o) throw new Error("order_not_found");
    const fields = { status };
    if (status === "paid" && !o.paid_at) fields.paid_at = Date.now();
    return shapeOrder(updateOrder(id, fields));
  },
};

// ---------- schemas ----------
const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const tier = z.object({ quantity: z.number().int().min(1).max(1000), price: z.number().int().min(0), label: z.string().max(40).optional() });
const productFields = z.object({
  slug: z.string().min(1).max(120).regex(slugRe),
  name: z.string().min(1).max(200),
  category: z.string().min(1).max(80),
  weight: z.string().max(80).optional(),
  price: z.number().int().min(0).max(10_000_000_000),
  oldPrice: z.number().int().min(0).optional().nullable(),
  badge: z.string().max(40).optional().nullable(),
  shortDescription: z.string().max(500).optional().nullable(),
  description: z.string().max(8000).optional().nullable(),
  highlights: z.array(z.string().max(200)).max(20).optional(),
  images: z.array(z.string().max(500)).max(20).optional(),
  priceTiers: z.array(tier).max(20).optional(),
  inStock: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});
const S = {
  id: z.object({ id: z.string().min(1).max(200) }),
  price: z.object({ id: z.string().min(1), price: z.number().int().min(0).max(10_000_000_000), oldPrice: z.number().int().min(0).nullable().optional() }),
  stock: z.object({ id: z.string().min(1), inStock: z.boolean() }),
  update: z.object({ id: z.string().min(1), fields: productFields.partial() }),
  create: productFields,
  orders: z.object({ status: z.string().max(40).optional(), limit: z.number().int().min(1).max(500).optional() }),
  orderStatus: z.object({ id: z.string().min(1), status: z.enum(ORDER_STATUSES) }),
  products: z.object({ includeHidden: z.boolean().optional() }),
  empty: z.object({}).passthrough(),
  fees: Fees.feesSchema.deepPartial(),
};

function run(res, fn) {
  try {
    res.json({ ok: true, result: fn() });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ ok: false, error: "invalid_input", detail: e.errors });
    const code = /not_found/.test(e.message) ? 404 : /taken/.test(e.message) ? 409 : 500;
    res.status(code).json({ ok: false, error: e.message });
  }
}

// ---------- REST quick actions ----------
router.get("/agent/summary", requireAgent, (_q, res) => run(res, () => actions.summary()));
router.get("/agent/products", requireAgent, (_q, res) => run(res, () => actions.listProducts()));
router.get("/agent/products/:id", requireAgent, (q, res) => run(res, () => actions.getProduct({ id: q.params.id })));
router.post("/agent/products", requireAgent, (q, res) => run(res, () => actions.createProduct(S.create.parse(q.body))));
router.patch("/agent/products/:id", requireAgent, (q, res) => run(res, () => actions.updateProduct(S.update.parse({ id: q.params.id, fields: q.body }))));
router.patch("/agent/products/:id/price", requireAgent, (q, res) => run(res, () => actions.setPrice(S.price.parse({ ...q.body, id: q.params.id }))));
router.patch("/agent/products/:id/stock", requireAgent, (q, res) => run(res, () => actions.setStock(S.stock.parse({ ...q.body, id: q.params.id }))));
router.delete("/agent/products/:id", requireAgent, (q, res) => run(res, () => actions.deleteProduct({ id: q.params.id })));
router.get("/agent/fees", requireAgent, (_q, res) => run(res, () => actions.getFees()));
router.patch("/agent/fees", requireAgent, (q, res) => run(res, () => actions.setFees(S.fees.parse(q.body || {}))));
router.get("/agent/orders", requireAgent, (q, res) =>
  run(res, () => actions.listOrders(S.orders.parse({ status: q.query.status || undefined, limit: q.query.limit ? Number(q.query.limit) : undefined }))));
router.get("/agent/orders/:id", requireAgent, (q, res) => run(res, () => actions.getOrder({ id: q.params.id })));
router.patch("/agent/orders/:id/status", requireAgent, (q, res) => run(res, () => actions.setOrderStatus(S.orderStatus.parse({ ...q.body, id: q.params.id }))));

// ---------- MCP tools ----------
const productJson = {
  type: "object",
  properties: {
    slug: { type: "string", description: "lowercase-latin-with-hyphens" }, name: { type: "string" }, category: { type: "string" },
    weight: { type: "string" }, price: { type: "integer", description: "Toman" }, oldPrice: { type: ["integer", "null"] },
    badge: { type: ["string", "null"] }, shortDescription: { type: ["string", "null"] }, description: { type: ["string", "null"] },
    highlights: { type: "array", items: { type: "string" } }, images: { type: "array", items: { type: "string" } },
    priceTiers: { type: "array", items: { type: "object", properties: { quantity: { type: "integer" }, price: { type: "integer" }, label: { type: "string" } }, required: ["quantity", "price"] } },
    inStock: { type: "boolean" }, sortOrder: { type: "integer" },
  },
};
const idProp = { id: { type: "string", description: "Product id or slug" } };
const feesJson = {
  type: "object",
  description: "Partial update; only send what changes. Amounts in Toman. Fees are shown openly to customers on product pages and in the cart.",
  properties: {
    packaging: { type: "object", properties: { enabled: { type: "boolean" }, label: { type: "string" }, perOrder: { type: "integer" }, perItem: { type: "integer" } } },
    shipping: { type: "object", properties: { enabled: { type: "boolean" }, label: { type: "string" }, amount: { type: "integer" } } },
    freeShipping: { type: "object", properties: { enabled: { type: "boolean" }, threshold: { type: "integer", description: "Subtotal at/above which shipping is free" } } },
    giftBox: { type: "object", properties: { enabled: { type: "boolean" }, label: { type: "string" }, amount: { type: "integer" } } },
  },
};
const TOOLS = [
  { name: "get_fees", title: "Get fees", description: "Read packaging, shipping, free-shipping threshold and gift-box fee settings.", schema: S.empty, run: () => actions.getFees(), inputSchema: { type: "object", properties: {} }, annotations: { readOnlyHint: true } },
  { name: "set_fees", title: "Set fees", description: "Update packaging/shipping/gift-box fees and the free-shipping threshold (partial update).", schema: S.fees, run: (a) => actions.setFees(a), inputSchema: feesJson, annotations: { readOnlyHint: false, idempotentHint: true } },
  { name: "store_summary", title: "Store summary", description: "Counts of products and orders by status, plus paid revenue (Toman).", schema: S.empty, run: () => actions.summary(), inputSchema: { type: "object", properties: {} }, annotations: { readOnlyHint: true } },
  { name: "list_products", title: "List products", description: "List all products including out-of-stock ones.", schema: S.products, run: (a) => actions.listProducts(a), inputSchema: { type: "object", properties: { includeHidden: { type: "boolean" } } }, annotations: { readOnlyHint: true } },
  { name: "get_product", title: "Get product", description: "Get one product by id or slug.", schema: S.id, run: (a) => actions.getProduct(a), inputSchema: { type: "object", properties: idProp, required: ["id"] }, annotations: { readOnlyHint: true } },
  { name: "set_product_price", title: "Set product price", description: "Change a product's price in Toman (optionally the crossed-out old price).", schema: S.price, run: (a) => actions.setPrice(a), inputSchema: { type: "object", properties: { ...idProp, price: { type: "integer" }, oldPrice: { type: ["integer", "null"] } }, required: ["id", "price"] }, annotations: { readOnlyHint: false, idempotentHint: true } },
  { name: "set_product_stock", title: "Set product stock", description: "Mark a product in stock or out of stock (hidden from the shop).", schema: S.stock, run: (a) => actions.setStock(a), inputSchema: { type: "object", properties: { ...idProp, inStock: { type: "boolean" } }, required: ["id", "inStock"] }, annotations: { readOnlyHint: false, idempotentHint: true } },
  { name: "update_product", title: "Update product", description: "Update any product fields (name, description, images, tiers, etc.).", schema: S.update, run: (a) => actions.updateProduct(a), inputSchema: { type: "object", properties: { ...idProp, fields: productJson }, required: ["id", "fields"] }, annotations: { readOnlyHint: false } },
  { name: "create_product", title: "Create product", description: "Add a new product to the shop.", schema: S.create, run: (a) => actions.createProduct(a), inputSchema: { ...productJson, required: ["slug", "name", "category", "price"] }, annotations: { readOnlyHint: false } },
  { name: "delete_product", title: "Delete product", description: "Permanently delete a product.", schema: S.id, run: (a) => actions.deleteProduct(a), inputSchema: { type: "object", properties: idProp, required: ["id"] }, annotations: { readOnlyHint: false, destructiveHint: true } },
  { name: "list_orders", title: "List orders", description: "List recent orders, optionally filtered by status.", schema: S.orders, run: (a) => actions.listOrders(a), inputSchema: { type: "object", properties: { status: { type: "string", enum: ORDER_STATUSES }, limit: { type: "integer" } } }, annotations: { readOnlyHint: true } },
  { name: "get_order", title: "Get order", description: "Get one order with customer and items.", schema: S.id, run: (a) => actions.getOrder(a), inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] }, annotations: { readOnlyHint: true } },
  { name: "set_order_status", title: "Set order status", description: "Change an order's status (e.g. confirm card payment as paid, mark shipped).", schema: S.orderStatus, run: (a) => actions.setOrderStatus(a), inputSchema: { type: "object", properties: { id: { type: "string" }, status: { type: "string", enum: ORDER_STATUSES } }, required: ["id", "status"] }, annotations: { readOnlyHint: false } },
];

function rpcResult(id, result) { return { jsonrpc: "2.0", id, result }; }
function rpcError(id, code, message) { return { jsonrpc: "2.0", id: id ?? null, error: { code, message } }; }

function handleRpc(msg) {
  const { id, method, params } = msg || {};
  if (id === undefined) return null; // notification
  switch (method) {
    case "initialize":
      return rpcResult(id, {
        protocolVersion: params?.protocolVersion || "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "golden-saffron-bazaar", title: "Golden Saffron Bazaar", version: "1.0.0" },
        instructions: "Manage the Khajavi Saffron shop: products (prices in Toman, stock, details) and orders. Use store_summary first.",
      });
    case "ping":
      return rpcResult(id, {});
    case "tools/list":
      return rpcResult(id, { tools: TOOLS.map(({ name, title, description, inputSchema, annotations }) => ({ name, title, description, inputSchema, annotations })) });
    case "tools/call": {
      const tool = TOOLS.find((t) => t.name === params?.name);
      if (!tool) return rpcError(id, -32602, `Unknown tool: ${params?.name}`);
      try {
        const data = tool.run(tool.schema.parse(params?.arguments || {}));
        return rpcResult(id, { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: { result: data } });
      } catch (e) {
        const text = e instanceof z.ZodError ? `Invalid input: ${JSON.stringify(e.errors)}` : e.message;
        return rpcResult(id, { content: [{ type: "text", text }], isError: true });
      }
    }
    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

router.post("/mcp", requireAgent, express.json({ limit: "256kb" }), (req, res) => {
  const body = req.body;
  if (Array.isArray(body)) {
    const out = body.map(handleRpc).filter(Boolean);
    return out.length ? res.json(out) : res.status(202).end();
  }
  const out = handleRpc(body);
  if (!out) return res.status(202).end();
  res.json(out);
});
router.get("/mcp", (_q, res) => res.status(405).set("Allow", "POST").end());
router.delete("/mcp", (_q, res) => res.status(204).end());

// ---------- OpenAPI ----------
router.get("/agent/openapi.json", (_q, res) => {
  const sec = [{ bearer: [] }, { adminToken: [] }];
  const op = (summary, extra = {}) => ({ summary, security: sec, responses: { 200: { description: "ok" }, 401: { description: "unauthorized" } }, ...extra });
  const idParam = [{ name: "id", in: "path", required: true, schema: { type: "string" } }];
  const body = (schema) => ({ requestBody: { required: true, content: { "application/json": { schema } } } });
  res.json({
    openapi: "3.1.0",
    info: { title: "Khajavi Saffron Agent API", version: "1.0.0", description: "Control products and orders. Prices are in Toman." },
    servers: [{ url: "/api" }],
    components: { securitySchemes: { bearer: { type: "http", scheme: "bearer" }, adminToken: { type: "apiKey", in: "header", name: "x-admin-token" } }, schemas: { ProductInput: productJson, FeesInput: feesJson } },
    paths: {
      "/agent/summary": { get: op("Store summary") },
      "/agent/products": { get: op("List all products"), post: op("Create product", body({ $ref: "#/components/schemas/ProductInput" })) },
      "/agent/products/{id}": { get: op("Get product", { parameters: idParam }), patch: op("Update product fields", { parameters: idParam, ...body({ $ref: "#/components/schemas/ProductInput" }) }), delete: op("Delete product", { parameters: idParam }) },
      "/agent/products/{id}/price": { patch: op("Set price", { parameters: idParam, ...body({ type: "object", properties: { price: { type: "integer" }, oldPrice: { type: ["integer", "null"] } }, required: ["price"] }) }) },
      "/agent/products/{id}/stock": { patch: op("Set stock", { parameters: idParam, ...body({ type: "object", properties: { inStock: { type: "boolean" } }, required: ["inStock"] }) }) },
      "/agent/fees": { get: op("Get fee settings"), patch: op("Update fee settings (partial)", body({ $ref: "#/components/schemas/FeesInput" })) },
      "/agent/orders": { get: op("List orders", { parameters: [{ name: "status", in: "query", schema: { type: "string", enum: ORDER_STATUSES } }, { name: "limit", in: "query", schema: { type: "integer" } }] }) },
      "/agent/orders/{id}": { get: op("Get order", { parameters: idParam }) },
      "/agent/orders/{id}/status": { patch: op("Set order status", { parameters: idParam, ...body({ type: "object", properties: { status: { type: "string", enum: ORDER_STATUSES } }, required: ["status"] }) }) },
      "/mcp": { post: op("MCP JSON-RPC endpoint (Streamable HTTP)") },
    },
  });
});

module.exports = router;

import { useEffect, useState } from "react";

// Fee settings mirror server/src/settingsDb.js. The server always recalculates totals;
// these are only used to show the fees openly before checkout.
export type FreeShippingMode = "amount" | "mithqal";

export type Fees = {
  packaging: { enabled: boolean; label: string; perOrder: number; perItem: number };
  shipping: { enabled: boolean; label: string; amount: number };
  freeShipping: {
    enabled: boolean;
    /** "mithqal" = free by saffron mithqal count, "amount" = free by order subtotal */
    mode: FreeShippingMode;
    threshold: number;
    mithqal: number;
  };
  giftBox: { enabled: boolean; label: string; amount: number };
};

export const DEFAULT_FEES: Fees = {
  packaging: { enabled: false, label: "بسته‌بندی", perOrder: 0, perItem: 0 },
  shipping: { enabled: true, label: "هزینه پست و بسته‌بندی", amount: 30000 },
  freeShipping: { enabled: true, mode: "mithqal", threshold: 2000000, mithqal: 5 },
  giftBox: { enabled: false, label: "جعبه کادویی", amount: 0 },
};

// 1 mithqal = 4.608 g — same constant as server/src/utils.js
const MITHQAL_GRAMS = 4.608;

function normalizeDigits(s: string): string {
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  const ar = "٠١٢٣٤٥٦٧٨٩";
  return s.replace(/[۰-۹٠-٩]/g, (d) => {
    const i = fa.indexOf(d);
    return String(i >= 0 ? i : ar.indexOf(d));
  });
}

/** Parse a Persian/English weight string ("۱ مثقال (۴.۶۰۸ گرم)", "نیم مثقال", "۵۰۰ گرم") into mithqal. */
export function weightToMithqal(text?: string): number {
  if (!text) return 0;
  const t = normalizeDigits(text).replace(/[٬,]/g, " ");
  const m = t.match(/([\d.]+|نیم)\s*مثقال/);
  if (m) return m[1] === "نیم" ? 0.5 : parseFloat(m[1]) || 0;
  const g = t.match(/([\d.]+)\s*(کیلوگرم|کیلو|گرم)/);
  if (g) {
    const grams = parseFloat(g[1]) || 0;
    const total = /کیلو/.test(g[2]) ? grams * 1000 : grams;
    return Math.round((total / MITHQAL_GRAMS) * 100) / 100;
  }
  return 0;
}

export type FeeItem = {
  name: string;
  variantLabel?: string;
  weight?: string;
  qty: number;
  unitPrice: number;
};

/** Mithqal of saffron in one cart line (only saffron products count). */
export function lineMithqal(it: FeeItem): number {
  if (!/زعفران/.test(it.name || "")) return 0;
  // For tiered lines the chosen variant defines the pack size.
  const perUnit =
    weightToMithqal(it.variantLabel) ||
    weightToMithqal(it.weight) ||
    weightToMithqal(it.name);
  return Math.round(perUnit * Math.max(1, it.qty) * 100) / 100;
}

export function orderMithqal(items: FeeItem[]): number {
  return Math.round(items.reduce((s, it) => s + lineMithqal(it), 0) * 100) / 100;
}

export type FeeLine = { key: string; label: string; amount: number; free?: boolean };

export function computeFees(fees: Fees, items: FeeItem[], giftBox: boolean) {
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.qty, 0);
  const qty = items.reduce((s, it) => s + it.qty, 0);
  const mithqal = orderMithqal(items);

  const packaging = fees.packaging.enabled ? fees.packaging.perOrder + fees.packaging.perItem * qty : 0;
  const free =
    fees.freeShipping.enabled &&
    (fees.freeShipping.mode === "mithqal"
      ? mithqal >= fees.freeShipping.mithqal
      : subtotal >= fees.freeShipping.threshold);
  const shipping = fees.shipping.enabled && !free ? fees.shipping.amount : 0;
  const gift = giftBox && fees.giftBox.enabled ? fees.giftBox.amount : 0;

  const lines: FeeLine[] = [];
  if (fees.packaging.enabled && packaging > 0) lines.push({ key: "packaging", label: fees.packaging.label, amount: packaging });
  if (fees.shipping.enabled) lines.push({ key: "shipping", label: fees.shipping.label, amount: shipping, free });
  if (gift > 0) lines.push({ key: "giftBox", label: fees.giftBox.label, amount: gift });
  return { lines, total: subtotal + packaging + shipping + gift, mithqal };
}

/** Per-order fees a single-item buyer pays on top of the product price. */
export function baseOrderFees(fees: Fees, price: number) {
  return computeFees(fees, [{ name: "", qty: 1, unitPrice: price }], false).total - price;
}

export function useFees(): Fees {
  const [fees, setFees] = useState<Fees>(cache ?? DEFAULT_FEES);
  useEffect(() => {
    let alive = true;
    fetchFees().then((f) => alive && setFees(f));
    return () => {
      alive = false;
    };
  }, []);
  return fees;
}

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";

let cache: Fees | null = null;
let inflight: Promise<Fees> | null = null;

export function fetchFees(force = false): Promise<Fees> {
  if (cache && !force) return Promise.resolve(cache);
  if (inflight && !force) return inflight;
  inflight = fetch(`${API_BASE}/api/fees`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((d: { fees?: Fees }) => (cache = d.fees ?? DEFAULT_FEES))
    .catch(() => DEFAULT_FEES)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

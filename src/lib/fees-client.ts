import { useEffect, useState } from "react";

// Fee settings mirror server/src/settingsDb.js. The server always recalculates totals;
// these are only used to show the fees openly before checkout.
export type Fees = {
  packaging: { enabled: boolean; label: string; perOrder: number; perItem: number };
  shipping: { enabled: boolean; label: string; amount: number };
  freeShipping: { enabled: boolean; threshold: number };
  giftBox: { enabled: boolean; label: string; amount: number };
};

export const DEFAULT_FEES: Fees = {
  packaging: { enabled: false, label: "بسته‌بندی", perOrder: 0, perItem: 0 },
  shipping: { enabled: true, label: "هزینه پست و بسته‌بندی", amount: 30000 },
  freeShipping: { enabled: true, threshold: 2000000 },
  giftBox: { enabled: false, label: "جعبه کادویی", amount: 0 },
};

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

export type FeeLine = { key: string; label: string; amount: number; free?: boolean };

export function computeFees(fees: Fees, subtotal: number, qty: number, giftBox: boolean) {
  const packaging = fees.packaging.enabled ? fees.packaging.perOrder + fees.packaging.perItem * qty : 0;
  const free = fees.freeShipping.enabled && subtotal >= fees.freeShipping.threshold;
  const shipping = fees.shipping.enabled && !free ? fees.shipping.amount : 0;
  const gift = giftBox && fees.giftBox.enabled ? fees.giftBox.amount : 0;
  const lines: FeeLine[] = [];
  if (fees.packaging.enabled && packaging > 0) lines.push({ key: "packaging", label: fees.packaging.label, amount: packaging });
  if (fees.shipping.enabled) lines.push({ key: "shipping", label: fees.shipping.label, amount: shipping, free });
  if (gift > 0) lines.push({ key: "giftBox", label: fees.giftBox.label, amount: gift });
  return { lines, total: subtotal + packaging + shipping + gift };
}

/** Per-order fees a single-item buyer pays on top of the product price. */
export function baseOrderFees(fees: Fees, price: number) {
  return computeFees(fees, price, 1, false).total - price;
}

// Runtime product catalog client.
// Fetches /api/products from the backend (port 3002 in prod, behind nginx /api proxy)
// and falls back to the bundled static seed so the site never breaks.
//
// The static `src/data/products.ts` is intentionally kept as a fallback +
// type source. The admin panel writes to the backend; storefront reads here.

import { useEffect, useState } from "react";
import {
  PRODUCTS as STATIC_PRODUCTS,
  CATEGORIES,
  formatToman,
  getProductBySlug as getStaticBySlug,
  type Product,
} from "@/data/products";

export type { Product };
export { CATEGORIES, formatToman };

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";

let cache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;
const subscribers = new Set<(p: Product[]) => void>();

async function fetchProducts(): Promise<Product[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const r = await fetch(`${API_BASE}/api/products`, { credentials: "omit" });
      const data = await r.json();
      if (!r.ok || !data.ok || !Array.isArray(data.products)) {
        throw new Error(data?.error || `HTTP ${r.status}`);
      }
      const list = data.products as Product[];
      cache = list;
      subscribers.forEach((cb) => cb(list));
      return list;
    } catch (err) {
      console.warn("[products] API fetch failed, using static seed:", err);
      cache = STATIC_PRODUCTS;
      return STATIC_PRODUCTS;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/** Force a refetch (used by admin after edits if it shares the same tab). */
export function invalidateProducts() {
  cache = null;
}

export function useProducts(): { products: Product[]; loading: boolean } {
  const [products, setProducts] = useState<Product[]>(() => cache ?? STATIC_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(!cache);
  useEffect(() => {
    let alive = true;
    const cb = (p: Product[]) => alive && setProducts(p);
    subscribers.add(cb);
    if (cache) {
      setProducts(cache);
      setLoading(false);
    } else {
      fetchProducts().then((p) => {
        if (!alive) return;
        setProducts(p);
        setLoading(false);
      });
    }
    return () => {
      alive = false;
      subscribers.delete(cb);
    };
  }, []);
  return { products, loading };
}

export function useProduct(slug: string): { product: Product | null; loading: boolean } {
  const { products, loading } = useProducts();
  const product = products.find((p) => p.slug === slug) ?? getStaticBySlug(slug) ?? null;
  return { product, loading: loading && !product };
}

/** Synchronous best-effort lookup for route loaders (uses static seed). */
export function getProductBySlugSync(slug: string): Product | null {
  if (cache) {
    const fromCache = cache.find((p) => p.slug === slug);
    if (fromCache) return fromCache;
  }
  return getStaticBySlug(slug) ?? null;
}

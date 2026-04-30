import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type CartItem = {
  /** unique line id: `${productId}::${variantLabel ?? "default"}` */
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  /** display label for the variant (e.g. "۲ گرم") — empty for products w/o tiers */
  variantLabel?: string;
  /** unit price in toman (already reflects the chosen tier) */
  unitPrice: number;
  qty: number;
  image?: string;
  weight?: string;
};

type AddPayload = Omit<CartItem, "qty"> & { qty?: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: AddPayload) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "khajavi.cart.v1";

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return [];
    return parsed.items.filter((i: CartItem) => i && i.lineId);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  // Hydrate from localStorage after mount (SSR-safe).
  useEffect(() => {
    setItems(readStorage());
    hydrated.current = true;
  }, []);

  // Persist after hydration.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
    } catch {
      /* ignore quota / privacy errors */
    }
  }, [items]);

  const add = useCallback((payload: AddPayload) => {
    const qty = Math.max(1, payload.qty ?? 1);
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.lineId === payload.lineId);
      if (idx >= 0) {
        const next = prev.slice();
        next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + qty) };
        return next;
      }
      return [...prev, { ...payload, qty }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const setQty = useCallback((lineId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.lineId !== lineId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.lineId === lineId ? { ...i, qty: Math.min(99, qty) } : i,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const { count, subtotal } = useMemo(() => {
    let c = 0;
    let s = 0;
    for (const i of items) {
      c += i.qty;
      s += i.qty * i.unitPrice;
    }
    return { count: c, subtotal: s };
  }, [items]);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    isOpen,
    open,
    close,
    add,
    remove,
    setQty,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

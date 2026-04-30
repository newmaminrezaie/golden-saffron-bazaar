import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

// Card-to-card payment details shown to admins so they can match a customer's transfer.
const CARD_NUMBER = "6037 9974 6126 4344";
const CARD_HOLDER = "مجید خواجوی";
const CARD_BANK = "بانک ملی ایران";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "مدیریت سفارش‌ها — زعفران خواجوی" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminOrdersPage,
});

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";
const TOKEN_KEY = "khajavi_admin_token";

type OrderItem = { id: string; name: string; qty: number; price: number };
type Order = {
  id: string;
  created_at: number;
  customer_name: string;
  phone: string;
  address: string;
  postal_code: string | null;
  note: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  method: "zibal" | "sep" | "card" | string;
  status: string;
  authority?: string | null;
  raw_callback?: string | null;
};

const STATUS_OPTIONS = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "paid", label: "پرداخت‌شده" },
  { value: "awaiting_card_confirm", label: "کارت‌به‌کارت" },
  { value: "failed", label: "ناموفق" },
] as const;

function formatToman(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}
function formatDate(ts: number) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}
function methodLabel(m: string) {
  if (m === "zibal") return "به پرداخت ملت";
  if (m === "sep") return "بانک سامان";
  if (m === "card") return "کارت‌به‌کارت";
  return m;
}
function statusBadge(s: string) {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "پرداخت‌شده", cls: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    pending: { label: "در انتظار", cls: "bg-amber-100 text-amber-800 border-amber-300" },
    failed: { label: "ناموفق", cls: "bg-red-100 text-red-800 border-red-300" },
    awaiting_card_confirm: {
      label: "در انتظار تایید کارت",
      cls: "bg-sky-100 text-sky-800 border-sky-300",
    },
  };
  const v = map[s] ?? { label: s, cls: "bg-muted text-foreground border-border" };
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${v.cls}`}>
      {v.label}
    </span>
  );
}

function AdminOrdersPage() {
  const [token, setToken] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (t) setToken(t);
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE}/api/orders`, window.location.origin);
      if (statusFilter !== "all") url.searchParams.set("status", statusFilter);
      const r = await fetch(url.toString(), {
        headers: { "x-admin-token": token },
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        if (r.status === 401) {
          setError("توکن نامعتبر است.");
          localStorage.removeItem(TOKEN_KEY);
          setToken("");
          return;
        }
        throw new Error(data.error || `HTTP ${r.status}`);
      }
      setOrders(data.orders || []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "خطا در دریافت سفارش‌ها";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter]);

  useEffect(() => {
    if (!token) return;
    fetchOrders();
    const id = setInterval(fetchOrders, 30_000);
    return () => clearInterval(id);
  }, [token, fetchOrders]);

  const totalSum = useMemo(
    () => orders.reduce((s, o) => s + (o.total || 0), 0),
    [orders],
  );

  if (!token) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = tokenInput.trim();
            if (!v) return;
            localStorage.setItem(TOKEN_KEY, v);
            setToken(v);
          }}
          className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-sm"
        >
          <h1 className="text-xl font-bold">ورود مدیر</h1>
          <p className="text-sm text-muted-foreground">
            برای مشاهده سفارش‌ها توکن مدیر را وارد کنید.
          </p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="ADMIN_TOKEN"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            ورود
          </button>
        </form>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">سفارش‌ها</h1>
            <p className="text-sm text-muted-foreground">
              {orders.length} سفارش — مجموع {formatToman(totalSum)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="rounded-md border bg-card px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
            >
              {loading ? "در حال بارگذاری…" : "بروزرسانی"}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem(TOKEN_KEY);
                setToken("");
                setOrders([]);
              }}
              className="rounded-md border bg-card px-3 py-1.5 text-sm hover:bg-accent"
            >
              خروج
            </button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-full border px-3 py-1 text-xs ${
                statusFilter === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-accent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-right text-sm">
            <thead className="bg-muted/50 text-xs uppercase">
              <tr>
                <th className="px-3 py-2">شناسه</th>
                <th className="px-3 py-2">تاریخ</th>
                <th className="px-3 py-2">مشتری</th>
                <th className="px-3 py-2">موبایل</th>
                <th className="px-3 py-2">روش</th>
                <th className="px-3 py-2">وضعیت</th>
                <th className="px-3 py-2">مبلغ کل</th>
                <th className="px-3 py-2">جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                    سفارشی یافت نشد.
                  </td>
                </tr>
              )}
              {orders.map((o) => {
                const open = !!expanded[o.id];
                return (
                  <Row
                    key={o.id}
                    order={o}
                    open={open}
                    onToggle={() =>
                      setExpanded((p) => ({ ...p, [o.id]: !p[o.id] }))
                    }
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({
  order,
  open,
  onToggle,
}: {
  order: Order;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-t hover:bg-accent/40">
        <td className="px-3 py-2 font-mono text-xs">{order.id}</td>
        <td className="px-3 py-2 whitespace-nowrap">{formatDate(order.created_at)}</td>
        <td className="px-3 py-2">{order.customer_name}</td>
        <td className="px-3 py-2 font-mono text-xs">{order.phone}</td>
        <td className="px-3 py-2">{methodLabel(order.method)}</td>
        <td className="px-3 py-2">{statusBadge(order.status)}</td>
        <td className="px-3 py-2 whitespace-nowrap font-medium">
          {formatToman(order.total)}
        </td>
        <td className="px-3 py-2">
          <button
            onClick={onToggle}
            className="rounded border px-2 py-0.5 text-xs hover:bg-accent"
          >
            {open ? "بستن" : "نمایش"}
          </button>
        </td>
      </tr>
      {open && (
        <tr className="border-t bg-muted/30">
          <td colSpan={8} className="px-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">آدرس: </span>
                  {order.address}
                </div>
                {order.postal_code && (
                  <div>
                    <span className="text-muted-foreground">کدپستی: </span>
                    <span className="font-mono">{order.postal_code}</span>
                  </div>
                )}
                {order.note && (
                  <div>
                    <span className="text-muted-foreground">یادداشت: </span>
                    {order.note}
                  </div>
                )}
                {order.authority && (
                  <div>
                    <span className="text-muted-foreground">کد پیگیری: </span>
                    <span className="font-mono text-xs">{order.authority}</span>
                  </div>
                )}
                <div className="pt-2 text-xs text-muted-foreground">
                  جمع اقلام: {formatToman(order.subtotal)} · ارسال:{" "}
                  {formatToman(order.shipping)}
                </div>
              </div>
              <div>
                <table className="w-full text-xs">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="py-1 text-right">محصول</th>
                      <th className="py-1 text-right">تعداد</th>
                      <th className="py-1 text-right">قیمت واحد</th>
                      <th className="py-1 text-right">جمع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((it, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-1">{it.name}</td>
                        <td className="py-1">{it.qty}</td>
                        <td className="py-1">{formatToman(it.price)}</td>
                        <td className="py-1">{formatToman(it.price * it.qty)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DEFAULT_FEES, fetchFees, type Fees } from "@/lib/fees-client";

export const Route = createFileRoute("/admin/fees")({
  head: () => ({
    meta: [
      { title: "مدیریت هزینه‌ها | زعفران خواجوی" },
      { name: "description", content: "تنظیم هزینه بسته‌بندی و ارسال" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminFees,
});

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";
const TOKEN_KEY = "khajavi_admin_token";

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2"><span className="text-sm">{label}</span>{children}</div>
  );
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="rounded-xl border border-border bg-card p-4"><h2 className="mb-2 font-extrabold">{title}</h2>{children}</section>
  );


function AdminFees() {
  const [token, setToken] = useState("");
  const [fees, setFees] = useState<Fees>(DEFAULT_FEES);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY) ?? "");
    fetchFees(true).then(setFees);
  }, []);

  const set = <K extends keyof Fees>(k: K, patch: Partial<Fees[K]>) =>
    setFees((f) => ({ ...f, [k]: { ...f[k], ...patch } }));

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const r = await fetch(`${API_BASE}/api/fees`, {
        method: "PUT",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify(fees),
      });
      const d = await r.json().catch(() => ({}));
      if (r.status === 401) setMsg("رمز مدیریت نادرست است.");
      else if (!r.ok) setMsg("ذخیره نشد: مقادیر را بررسی کنید.");
      else {
        localStorage.setItem(TOKEN_KEY, token);
        setFees(d.fees);
        setMsg("ذخیره شد.");
      }
    } catch (e) {
      setMsg(`ارتباط با سرور برقرار نشد: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  }

  const num = (v: number, on: (n: number) => void) => (
    <input
      type="number"
      min={0}
      value={v}
      onChange={(e) => on(Math.max(0, Math.round(Number(e.target.value) || 0)))}
      className="w-40 rounded-md border border-border bg-background px-2 py-1"
    />
  );
  const txt = (v: string, on: (s: string) => void) => (
    <input value={v} onChange={(e) => on(e.target.value)} className="w-56 rounded-md border border-border bg-background px-2 py-1" />
  );
  const sw = (v: boolean, on: (b: boolean) => void) => (
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v} onChange={(e) => on(e.target.checked)} /> فعال</label>
  );
  return (
    <div dir="rtl" className="mx-auto max-w-2xl space-y-4 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">هزینه‌های بسته‌بندی و ارسال</h1>
        <Link to="/admin/products" className="text-sm font-bold text-accent">محصولات ←</Link>
      </div>
      <p className="text-sm text-muted-foreground">همه مبالغ به تومان است و به‌صورت شفاف در صفحه محصول و سبد خرید به مشتری نمایش داده می‌شود.</p>

      <Card title="بسته‌بندی">
        <Row label="وضعیت">{sw(fees.packaging.enabled, (b) => set("packaging", { enabled: b }))}</Row>
        <Row label="عنوان نمایشی">{txt(fees.packaging.label, (s) => set("packaging", { label: s }))}</Row>
        <Row label="مبلغ ثابت هر سفارش">{num(fees.packaging.perOrder, (n) => set("packaging", { perOrder: n }))}</Row>
        <Row label="مبلغ اضافه به ازای هر عدد کالا">{num(fees.packaging.perItem, (n) => set("packaging", { perItem: n }))}</Row>
      </Card>
      <Card title="ارسال">
        <Row label="وضعیت">{sw(fees.shipping.enabled, (b) => set("shipping", { enabled: b }))}</Row>
        <Row label="عنوان نمایشی">{txt(fees.shipping.label, (s) => set("shipping", { label: s }))}</Row>
        <Row label="مبلغ">{num(fees.shipping.amount, (n) => set("shipping", { amount: n }))}</Row>
      </Card>
      <Card title="ارسال رایگان">
        <Row label="وضعیت">{sw(fees.freeShipping.enabled, (b) => set("freeShipping", { enabled: b }))}</Row>
        <Row label="نحوه محاسبه">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["mithqal", "بر اساس مثقال زعفران"],
                ["amount", "بر اساس مبلغ سفارش"],
              ] as const
            ).map(([mode, lbl]) => (
              <button
                key={mode}
                type="button"
                onClick={() => set("freeShipping", { mode })}
                className={`rounded-full border px-3 py-1 text-sm font-bold transition ${
                  fees.freeShipping.mode === mode
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground/70 hover:text-foreground"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </Row>
        {fees.freeShipping.mode === "mithqal" ? (
          <Row label="برای خرید بالای (مثقال زعفران)">
            {num(fees.freeShipping.mithqal, (n) => set("freeShipping", { mithqal: n }))}
          </Row>
        ) : (
          <Row label="برای خرید بالای (تومان)">
            {num(fees.freeShipping.threshold, (n) => set("freeShipping", { threshold: n }))}
          </Row>
        )}
      </Card>
      <Card title="جعبه کادویی (اختیاری برای مشتری)">
        <Row label="وضعیت">{sw(fees.giftBox.enabled, (b) => set("giftBox", { enabled: b }))}</Row>
        <Row label="عنوان نمایشی">{txt(fees.giftBox.label, (s) => set("giftBox", { label: s }))}</Row>
        <Row label="مبلغ">{num(fees.giftBox.amount, (n) => set("giftBox", { amount: n }))}</Row>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <input type="password" placeholder="رمز مدیریت" value={token} onChange={(e) => setToken(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2" />
        <button onClick={save} disabled={saving || !token} className="rounded-full bg-primary px-6 py-2 font-bold text-primary-foreground disabled:opacity-50">
          {saving ? "در حال ذخیره…" : "ذخیره"}
        </button>
        {msg && <span role="status" className="text-sm font-bold">{msg}</span>}
      </div>
    </div>
  );
}

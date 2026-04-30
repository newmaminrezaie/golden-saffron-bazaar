import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatToman } from "@/data/products";

const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const toFa = (n: number) => String(n).replace(/\d/g, (d) => FA[Number(d)]);

const SHIPPING_FEE = 30000;
const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";

type CustomerForm = {
  name: string;
  phone: string;
  address: string;
  postal_code: string;
  note: string;
};

const EMPTY_FORM: CustomerForm = {
  name: "",
  phone: "",
  address: "",
  postal_code: "",
  note: "",
};

function validate(form: CustomerForm): string | null {
  if (form.name.trim().length < 2) return "نام و نام خانوادگی را وارد کنید.";
  if (!/^0?9\d{9}$/.test(form.phone.trim()))
    return "شماره موبایل نامعتبر است (مثال: 09121234567).";
  if (form.address.trim().length < 5) return "آدرس کامل را وارد کنید.";
  if (form.postal_code && !/^\d{10}$/.test(form.postal_code.trim()))
    return "کدپستی باید ۱۰ رقم باشد.";
  return null;
}

export function CartDrawer() {
  const { items, isOpen, close, remove, setQty, subtotal, count } = useCart();
  const total = subtotal + (items.length > 0 ? SHIPPING_FEE : 0);

  const [form, setForm] = useState<CustomerForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField =
    (key: keyof CustomerForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleZibalCheckout = async () => {
    if (submitting) return;
    setError(null);
    if (items.length === 0) return;

    const v = validate(form);
    if (v) {
      setError(v);
      return;
    }

    const payload = {
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        postal_code: form.postal_code.trim() || undefined,
        note: form.note.trim() || undefined,
      },
      items: items.map((it) => ({
        id: it.productId,
        name: it.variantLabel ? `${it.name} (${it.variantLabel})` : it.name,
        qty: it.qty,
        price: it.unitPrice,
      })),
      subtotal,
    };

    setSubmitting(true);
    try {
      const r = await fetch(`${API_BASE}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await r.json().catch(() => null)) as
        | { ok: boolean; redirect?: string; message?: string; error?: string }
        | null;

      if (!r.ok || !data?.ok || !data.redirect) {
        setError(
          data?.message ||
            data?.error ||
            "ثبت سفارش با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
        );
        setSubmitting(false);
        return;
      }

      window.location.href = data.redirect;
    } catch (err) {
      setError(
        err instanceof Error
          ? `ارتباط با سرور برقرار نشد: ${err.message}`
          : "ارتباط با سرور برقرار نشد.",
      );
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent
        side="left"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        dir="rtl"
      >
        <SheetHeader className="border-b border-border/60 px-5 py-4 text-right">
          <SheetTitle className="flex items-center gap-2 text-base font-extrabold">
            <ShoppingBag className="size-5 text-[color:var(--brown-medium)]" />
            سبد خرید
            {count > 0 && (
              <span className="mr-1 rounded-full bg-[color:var(--brown-deep)] px-2 py-0.5 text-xs font-bold text-[color:var(--parchment)]">
                {toFa(count)}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid size-20 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="size-9 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">
                سبد خرید شما خالی است
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                از فروشگاه محصول مورد علاقه خود را انتخاب کنید.
              </p>
            </div>
            <Link
              to="/shop"
              search={{ category: "همه" }}
              onClick={close}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[color:var(--brown-deep)] px-5 py-2.5 text-sm font-bold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)]"
            >
              مشاهده فروشگاه
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border/60 overflow-y-auto px-5">
              {items.map((it) => (
                <li key={it.lineId} className="flex gap-3 py-4">
                  <Link
                    to="/shop/$slug"
                    params={{ slug: it.slug }}
                    onClick={close}
                    className="size-20 shrink-0 overflow-hidden rounded-xl bg-secondary"
                  >
                    {it.image && (
                      <img
                        src={it.image}
                        alt={it.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to="/shop/$slug"
                        params={{ slug: it.slug }}
                        onClick={close}
                        className="text-sm font-bold text-foreground line-clamp-2 hover:text-accent"
                      >
                        {it.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(it.lineId)}
                        aria-label="حذف"
                        className="-m-1 p-1 text-muted-foreground transition hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    {(it.variantLabel || it.weight) && (
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {it.variantLabel || it.weight}
                      </p>
                    )}

                    <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                      <div className="inline-flex items-center rounded-full border border-border/70 bg-background">
                        <button
                          type="button"
                          onClick={() => setQty(it.lineId, it.qty - 1)}
                          aria-label="کاهش"
                          className="grid size-8 place-items-center text-foreground/70 transition hover:text-foreground"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-7 text-center text-sm font-bold tabular-nums">
                          {toFa(it.qty)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(it.lineId, it.qty + 1)}
                          aria-label="افزایش"
                          className="grid size-8 place-items-center text-foreground/70 transition hover:text-foreground"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <div className="text-sm font-extrabold text-foreground">
                        {formatToman(it.unitPrice * it.qty)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border/60 bg-secondary/40 px-5 py-4">
              {/* Customer form */}
              <div className="mb-3 grid gap-2">
                <input
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  value={form.name}
                  onChange={updateField("name")}
                  className="w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-[color:var(--brown-medium)]"
                  autoComplete="name"
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="شماره موبایل (مثال: ۰۹۱۲۱۲۳۴۵۶۷)"
                  value={form.phone}
                  onChange={updateField("phone")}
                  className="w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-[color:var(--brown-medium)]"
                  autoComplete="tel"
                  dir="ltr"
                />
                <textarea
                  placeholder="آدرس کامل پستی"
                  value={form.address}
                  onChange={updateField("address")}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-[color:var(--brown-medium)]"
                  autoComplete="street-address"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="کدپستی (۱۰ رقمی، اختیاری)"
                  value={form.postal_code}
                  onChange={updateField("postal_code")}
                  className="w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-[color:var(--brown-medium)]"
                  autoComplete="postal-code"
                  dir="ltr"
                />
              </div>

              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-foreground/80">
                  <dt>جمع کالاها</dt>
                  <dd className="font-bold">{formatToman(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <dt>هزینه پست و بسته‌بندی</dt>
                  <dd className="font-bold">{formatToman(SHIPPING_FEE)}</dd>
                </div>
                <div className="mt-2 flex justify-between border-t border-border/60 pt-2 text-base">
                  <dt className="font-extrabold">مبلغ قابل پرداخت</dt>
                  <dd className="font-extrabold text-[color:var(--brown-deep)]">
                    {formatToman(total)}
                  </dd>
                </div>
              </dl>

              {error && (
                <p
                  role="alert"
                  className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive"
                >
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleZibalCheckout}
                disabled={submitting}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--brown-deep)] px-5 py-3 text-sm font-extrabold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    در حال انتقال به درگاه…
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-4" />
                    پرداخت با زیبال
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={close}
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
              >
                <X className="size-3.5" />
                ادامه خرید
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CreditCard,
  Landmark,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatToman } from "@/data/products";
import {
  CARD_ORDER_STORAGE_PREFIX,
  type CardOrderPayload,
} from "@/routes/payment.card";

const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const toFa = (n: number) => String(n).replace(/\d/g, (d) => FA[Number(d)]);

const SHIPPING_FEE = 30000;
const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";
const FORM_STORAGE_KEY = "khajavi.checkoutForm.v1";

type CustomerForm = {
  name: string;
  phone: string;
  address: string;
  postal_code: string;
  note: string;
};

type PaymentMethod = "zibal" | "card";

const EMPTY_FORM: CustomerForm = {
  name: "",
  phone: "",
  address: "",
  postal_code: "",
  note: "",
};

function readSavedForm(): CustomerForm {
  if (typeof window === "undefined") return EMPTY_FORM;
  try {
    const raw = window.localStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return EMPTY_FORM;
    const parsed = JSON.parse(raw) as Partial<CustomerForm>;
    return { ...EMPTY_FORM, ...parsed };
  } catch {
    return EMPTY_FORM;
  }
}

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
  const { items, isOpen, close, remove, setQty, subtotal, count, clear } = useCart();
  const navigate = useNavigate();
  const total = subtotal + (items.length > 0 ? SHIPPING_FEE : 0);

  const [form, setForm] = useState<CustomerForm>(EMPTY_FORM);
  const [method, setMethod] = useState<PaymentMethod>("zibal");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate the saved form once on mount.
  useEffect(() => {
    setForm(readSavedForm());
  }, []);

  // Persist form (debounce-light) so a failed payment redirect doesn't lose it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(form));
    } catch {
      /* ignore quota */
    }
  }, [form]);

  const updateField =
    (key: keyof CustomerForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const buildPayload = () => ({
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
  });

  const handleCheckout = async () => {
    if (submitting) return;
    setError(null);
    if (items.length === 0) return;

    const v = validate(form);
    if (v) {
      setError(v);
      return;
    }

    const payload = buildPayload();
    setSubmitting(true);

    try {
      const endpoint = method === "card" ? "/api/order-card" : "/api/order";
      const r = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await r.json().catch(() => null)) as
        | (CardOrderPayload & {
            ok: boolean;
            redirect?: string;
            message?: string;
            error?: string;
          })
        | null;

      if (!r.ok || !data?.ok) {
        setError(
          data?.message ||
            data?.error ||
            "ثبت سفارش با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
        );
        setSubmitting(false);
        return;
      }

      if (method === "zibal") {
        if (!data.redirect) {
          setError("درگاه پرداخت پاسخ معتبر برنگرداند.");
          setSubmitting(false);
          return;
        }
        // Empty cart and dismiss drawer before leaving the SPA.
        clear();
        close();
        window.location.href = data.redirect;
        return;
      }

      // Card-to-card: stash the response so the dedicated page can render it.
      try {
        sessionStorage.setItem(
          CARD_ORDER_STORAGE_PREFIX + data.order_id,
          JSON.stringify({
            order_id: data.order_id,
            total: data.total,
            subtotal: data.subtotal,
            shipping: data.shipping,
            card: data.card,
            instructions: data.instructions,
          } satisfies CardOrderPayload),
        );
      } catch {
        /* ignore */
      }
      clear();
      close();
      setSubmitting(false);
      navigate({
        to: "/payment/card",
        search: { order: data.order_id },
      });
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
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
        dir="rtl"
      >
        <SheetHeader className="border-b border-border/60 px-6 py-5 text-right">
          <SheetTitle className="flex items-center gap-2 text-lg font-extrabold">
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
            <ul className="flex-1 divide-y divide-border/60 overflow-y-auto px-6">
              {items.map((it) => (
                <li key={it.lineId} className="flex gap-4 py-5">
                  <Link
                    to="/shop/$slug"
                    params={{ slug: it.slug }}
                    onClick={close}
                    className="size-20 shrink-0 overflow-hidden rounded-xl bg-secondary sm:size-24"
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
                      <p className="mt-1 text-xs text-muted-foreground">
                        {it.variantLabel || it.weight}
                      </p>
                    )}

                    <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                      <div className="inline-flex items-center rounded-full border border-border/70 bg-background">
                        <button
                          type="button"
                          onClick={() => setQty(it.lineId, it.qty - 1)}
                          aria-label="کاهش"
                          className="grid size-9 place-items-center text-foreground/70 transition hover:text-foreground"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-bold tabular-nums">
                          {toFa(it.qty)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(it.lineId, it.qty + 1)}
                          aria-label="افزایش"
                          className="grid size-9 place-items-center text-foreground/70 transition hover:text-foreground"
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

            <div className="border-t border-border/60 bg-secondary/40 px-6 py-5">
              {/* Customer form */}
              <div className="mb-4 grid gap-3">
                <input
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  value={form.name}
                  onChange={updateField("name")}
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-[color:var(--brown-medium)]"
                  autoComplete="name"
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="شماره موبایل (مثال: 09121234567)"
                  value={form.phone}
                  onChange={updateField("phone")}
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-[color:var(--brown-medium)]"
                  autoComplete="tel"
                  dir="ltr"
                />
                <textarea
                  placeholder="آدرس کامل پستی"
                  value={form.address}
                  onChange={updateField("address")}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-[color:var(--brown-medium)]"
                  autoComplete="street-address"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="کدپستی (۱۰ رقمی، اختیاری)"
                  value={form.postal_code}
                  onChange={updateField("postal_code")}
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-[color:var(--brown-medium)]"
                  autoComplete="postal-code"
                  dir="ltr"
                />
              </div>

              {/* Payment method */}
              <div className="mb-3">
                <div className="mb-1.5 text-[11px] font-bold text-muted-foreground">
                  روش پرداخت
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MethodOption
                    active={method === "zibal"}
                    onSelect={() => setMethod("zibal")}
                    icon={<CreditCard className="size-4" />}
                    label="پرداخت آنلاین (به پرداخت ملت)"
                  />
                  <MethodOption
                    active={method === "card"}
                    onSelect={() => setMethod("card")}
                    icon={<Landmark className="size-4" />}
                    label="کارت‌به‌کارت"
                  />
                </div>
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
                onClick={handleCheckout}
                disabled={submitting}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--brown-deep)] px-5 py-3 text-sm font-extrabold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {method === "zibal" ? "در حال انتقال به درگاه…" : "در حال ثبت سفارش…"}
                  </>
                ) : method === "zibal" ? (
                  <>
                    <CreditCard className="size-4" />
                    پرداخت با به پرداخت ملت
                  </>
                ) : (
                  <>
                    <Landmark className="size-4" />
                    ثبت سفارش کارت‌به‌کارت
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

function MethodOption({
  active,
  onSelect,
  icon,
  label,
}: {
  active: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={
        "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition " +
        (active
          ? "border-[color:var(--brown-deep)] bg-[color:var(--brown-deep)]/10 text-[color:var(--brown-deep)]"
          : "border-border/70 bg-background text-foreground/70 hover:border-[color:var(--brown-medium)]/60 hover:text-foreground")
      }
    >
      {icon}
      <span className="leading-tight">{label}</span>
    </button>
  );
}

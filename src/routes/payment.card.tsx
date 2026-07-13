import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Landmark, MessageCircle, Phone } from "lucide-react";
import { z } from "zod";
import { CopyButton } from "@/components/copy-button";
import { formatToman } from "@/data/products";

const searchSchema = z.object({
  order: z.string().trim().min(1).max(64).optional().default(""),
});

export const CARD_ORDER_STORAGE_PREFIX = "khajavi.cardOrder.";

// Support hotline used for the WhatsApp deep link. Keep digits only, no '+'.
const SUPPORT_WHATSAPP = "989155600000";
const SUPPORT_PHONE = "09155600000";

export type CardOrderPayload = {
  order_id: string;
  total: number;
  subtotal: number;
  shipping: number;
  card: { number: string; holder: string; bank: string };
  instructions: string;
};

export const Route = createFileRoute("/payment/card")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "پرداخت کارت‌به‌کارت — زعفران خواجوی" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PaymentCardPage,
});

const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const toFa = (s: string | number) =>
  String(s).replace(/\d/g, (d) => FA[Number(d)]);

function PaymentCardPage() {
  const { order } = Route.useSearch();
  const [data, setData] = useState<CardOrderPayload | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CARD_ORDER_STORAGE_PREFIX + order);
      if (!raw) {
        setMissing(true);
        return;
      }
      setData(JSON.parse(raw) as CardOrderPayload);
    } catch {
      setMissing(true);
    }
  }, [order]);

  if (typeof window === "undefined") return null;

  if (missing) {
    return (
      <section className="mx-auto max-w-xl px-4 py-16 text-center" dir="rtl">
        <h1 className="text-xl font-extrabold text-foreground">
          اطلاعات سفارش پیدا نشد
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          ممکن است این صفحه را مستقیماً باز کرده باشید یا مرورگر اطلاعات را پاک کرده باشد. لطفاً دوباره از سبد خرید اقدام کنید.
        </p>
        <Link
          to="/"
          search={{ reopen: "cart" }}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[color:var(--brown-deep)] px-5 py-2.5 text-sm font-bold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)]"
        >
          بازگشت به سبد خرید
        </Link>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="mx-auto max-w-xl px-4 py-16 text-center text-sm text-muted-foreground" dir="rtl">
        در حال بارگذاری…
      </section>
    );
  }

  const cardClean = data.card.number.replace(/\s+/g, "");
  const waText = encodeURIComponent(
    [
      "سلام، سفارش من را کارت‌به‌کارت پرداخت کردم.",
      `شماره سفارش: ${data.order_id}`,
      `مبلغ: ${formatToman(data.total)}`,
      "شماره پیگیری: ____________",
      "چهار رقم آخر کارت من: ____",
    ].join("\n"),
  );

  return (
    <section className="mx-auto max-w-2xl px-4 py-12" dir="rtl">
      <header className="text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-sky-100 text-sky-700">
          <Landmark className="size-8" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">
          پرداخت کارت‌به‌کارت
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          سفارش شما با موفقیت ثبت شد. لطفاً مبلغ زیر را به کارت اعلام‌شده واریز کنید و سپس شماره پیگیری را برای ما ارسال کنید.
        </p>
      </header>

      {/* Order summary */}
      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">شماره سفارش</div>
            <div className="mt-0.5 font-mono text-sm font-bold" dir="ltr">
              {data.order_id}
            </div>
          </div>
          <CopyButton value={data.order_id} label="کپی شماره سفارش" />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-sm">
          <span className="font-bold">مبلغ قابل پرداخت</span>
          <span className="font-extrabold text-[color:var(--brown-deep)]">
            {formatToman(data.total)}
          </span>
        </div>
      </div>

      {/* Card details */}
      <div className="mt-4 rounded-2xl border border-sky-300/60 bg-sky-50/60 p-5">
        <div className="text-xs font-bold text-sky-900">شماره کارت برای واریز</div>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span
            className="font-mono text-lg tracking-[0.2em] text-foreground"
            dir="ltr"
          >
            {data.card.number}
          </span>
          <CopyButton value={data.card.number} label="کپی شماره کارت" />
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
          <div className="flex items-center justify-between gap-2 rounded-lg bg-background/70 px-3 py-2">
            <span>
              <span className="text-muted-foreground">به نام: </span>
              <span className="font-bold">{data.card.holder}</span>
            </span>
            <CopyButton value={data.card.holder} label="کپی" compact />
          </div>
          <div className="rounded-lg bg-background/70 px-3 py-2">
            <span className="text-muted-foreground">بانک: </span>
            <span className="font-bold">{data.card.bank}</span>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-lg bg-background/70 px-3 py-2 sm:col-span-2">
            <span>
              <span className="text-muted-foreground">۴ رقم آخر کارت مقصد: </span>
              <span className="font-mono font-bold">{toFa(cardClean.slice(-4))}</span>
            </span>
            <CopyButton value={cardClean.slice(-4)} label="کپی" compact />
          </div>
        </dl>
      </div>

      {/* Instructions */}
      <div className="mt-4 rounded-2xl border border-border/60 bg-card p-5 text-sm leading-7 text-foreground/90">
        {data.instructions}
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <a
          href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          <MessageCircle className="size-4" />
          ارسال شماره پیگیری در واتس‌اپ
        </a>
        <a
          href={`tel:${SUPPORT_PHONE}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-background px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-accent"
        >
          <Phone className="size-4" />
          تماس با پشتیبانی
        </a>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/shop"
          search={{ category: "همه" }}
          className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    </section>
  );
}

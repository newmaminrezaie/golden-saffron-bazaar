import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { CopyButton } from "@/components/copy-button";
import { useCart } from "@/lib/cart";

const searchSchema = z.object({
  order: z.string().trim().min(1).max(64).optional(),
});

export const Route = createFileRoute("/payment/success")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "پرداخت موفق — زعفران خواجوی" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  const { order } = Route.useSearch();
  const { clear } = useCart();

  // The backend already verified the payment; once the user lands here, the
  // cart should be empty so re-opening the drawer doesn't show stale items.
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center" dir="rtl">
      <div className="grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="size-12" />
      </div>
      <h1 className="mt-5 text-2xl font-extrabold text-foreground">
        پرداخت با موفقیت انجام شد
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        از خرید شما متشکریم. اطلاعات سفارش از طریق تماس یا پیامک با شما در میان گذاشته خواهد شد.
      </p>

      {order && (
        <div className="mt-6 w-full rounded-2xl border border-border/60 bg-card p-4 text-right">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs text-muted-foreground">شماره سفارش</div>
              <div className="mt-0.5 font-mono text-sm font-bold" dir="ltr">
                {order}
              </div>
            </div>
            <CopyButton value={order} label="کپی شماره سفارش" />
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground">
            این شماره را برای پیگیری سفارش نزد خود نگه دارید.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/shop"
          search={{ category: "همه" }}
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--brown-deep)] px-5 py-2.5 text-sm font-bold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)]"
        >
          بازگشت به فروشگاه
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full border border-border/70 bg-background px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-accent"
        >
          صفحه اصلی
        </Link>
      </div>
    </section>
  );
}

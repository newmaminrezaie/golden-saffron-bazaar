import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import { z } from "zod";
import { CopyButton } from "@/components/copy-button";

const searchSchema = z.object({
  order: z.string().trim().max(64).optional(),
  reason: z.string().trim().max(120).optional(),
});

export const Route = createFileRoute("/payment/failed")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "پرداخت ناموفق — زعفران خواجوی" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PaymentFailedPage,
});

const REASON_HINTS: Record<string, string> = {
  order_not_found: "سفارش شما یافت نشد. لطفاً دوباره از سبد خرید اقدام کنید.",
  verify_error: "خطا در تأیید تراکنش از سمت درگاه. اگر مبلغی کسر شد، طی ۷۲ ساعت بازگردانده می‌شود.",
};

function explain(reason?: string) {
  if (!reason) return "تراکنش انجام نشد یا توسط شما لغو شد.";
  if (REASON_HINTS[reason]) return REASON_HINTS[reason];
  if (reason.startsWith("cancelled_")) return "تراکنش توسط شما لغو شد.";
  if (reason.startsWith("verify_")) return "تأیید پرداخت توسط درگاه ناموفق بود.";
  if (reason.startsWith("sep_")) return "تراکنش از سمت بانک سامان ناموفق بود.";
  return "تراکنش ناموفق بود.";
}

function PaymentFailedPage() {
  const { order, reason } = Route.useSearch();

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center" dir="rtl">
      <div className="grid size-20 place-items-center rounded-full bg-destructive/10 text-destructive">
        <XCircle className="size-12" />
      </div>
      <h1 className="mt-5 text-2xl font-extrabold text-foreground">
        پرداخت ناموفق بود
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{explain(reason)}</p>

      {(order || reason) && (
        <div className="mt-6 w-full space-y-2 rounded-2xl border border-border/60 bg-card p-4 text-right text-xs">
          {order && (
            <div className="flex items-center justify-between gap-2">
              <span>
                <span className="text-muted-foreground">شماره سفارش: </span>
                <span className="font-mono" dir="ltr">{order}</span>
              </span>
              <CopyButton value={order} label="کپی" compact />
            </div>
          )}
          {reason && (
            <div>
              <span className="text-muted-foreground">کد خطا: </span>
              <span className="font-mono" dir="ltr">{reason}</span>
            </div>
          )}
          <p className="pt-1 text-[11px] text-muted-foreground">
            در صورت کسر وجه، مبلغ طی ۷۲ ساعت توسط بانک به حساب شما بازگردانده می‌شود.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          search={{ reopen: "cart" }}
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--brown-deep)] px-5 py-2.5 text-sm font-bold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)]"
        >
          بازگشت به سبد خرید
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center rounded-full border border-border/70 bg-background px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-accent"
        >
          تماس با پشتیبانی
        </Link>
      </div>
    </section>
  );
}

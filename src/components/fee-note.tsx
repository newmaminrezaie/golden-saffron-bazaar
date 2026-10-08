import { useFees, baseOrderFees } from "@/lib/fees-client";

const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const fa = (n: number) => n.toLocaleString("en-US").replace(/\d/g, (d) => FA[Number(d)]);

type Lang = "fa" | "en" | "tr" | "ar";
const TXT: Record<Lang, { plus: (a: string, l: string) => string; free: (t: string) => string; freeMithqal: (t: string) => string; toman: string }> = {
  fa: { plus: (a, l) => `+ ${a} تومان ${l}`, free: (t) => `ارسال رایگان برای خرید بالای ${t} تومان`, freeMithqal: (t) => `ارسال رایگان برای خرید بالای ${t} مثقال زعفران`, toman: "" },
  en: { plus: (a) => `+ ${a} Toman packaging & shipping`, free: (t) => `Free shipping over ${t} Toman`, freeMithqal: (t) => `Free shipping on orders over ${t} mithqal of saffron`, toman: "" },
  tr: { plus: (a) => `+ ${a} Toman paketleme ve kargo`, free: (t) => `${t} Toman üzeri ücretsiz kargo`, freeMithqal: (t) => `${t} miskal zerdeçal üzeri ücretsiz kargo`, toman: "" },
  ar: { plus: (a) => `+ ${a} تومان للتغليف والشحن`, free: (t) => `شحن مجاني للطلبات فوق ${t} تومان`, freeMithqal: (t) => `شحن مجاني للطلبات فوق ${t} مثقال زعفران`, toman: "" },
};

/** Openly shows extra per-order fees next to a product price. */
export function FeeNote({ price, lang = "fa" }: { price: number; lang?: Lang }) {
  const fees = useFees();
  const extra = baseOrderFees(fees, price);
  const t = TXT[lang];
  const num = (n: number) => (lang === "fa" || lang === "ar" ? fa(n) : n.toLocaleString("en-US"));
  const labels = [fees.packaging.enabled && fees.packaging.label, fees.shipping.enabled && fees.shipping.label]
    .filter(Boolean)
    .join(" و ");
  return (
    <p className="mt-2 text-xs text-muted-foreground">
      {extra > 0 && t.plus(num(extra), labels)}
      {extra > 0 && fees.freeShipping.enabled && " · "}
      {fees.freeShipping.enabled && fees.shipping.enabled &&
        (fees.freeShipping.mode === "mithqal"
          ? t.freeMithqal(num(fees.freeShipping.mithqal))
          : t.free(num(fees.freeShipping.threshold)))}
    </p>
  );
}

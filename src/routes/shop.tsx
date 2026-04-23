import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";

type Category = (typeof CATEGORIES)[number];

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { category: Category } => {
    const raw = typeof search.category === "string" ? search.category : "همه";
    const valid = (CATEGORIES as readonly string[]).includes(raw) ? (raw as Category) : "همه";
    return { category: valid };
  },
  head: ({ match }) => {
    const category = (match.search as { category: Category }).category;
    const m = SHOP_META[category] ?? SHOP_META["همه"];
    return {
      meta: [
        { title: m.title },
        { name: "description", content: m.description },
        { property: "og:title", content: m.title },
        { property: "og:description", content: m.description },
      ],
    };
  },
  component: ShopPage,
});

const SHOP_META: Record<Category, { title: string; description: string }> = {
  "همه": {
    title: "فروشگاه زعفران خواجوی | زعفران اصل قائنات",
    description:
      "خرید آنلاین انواع زعفران سرگل، نگین، دسته، نرمه و خشکبار اصل قائنات مستقیم از تولیدکننده.",
  },
  "ریشه زعفران": {
    title: "خرید ریشه زعفران قائنات | زعفران خواجوی",
    description:
      "ریشه زعفران اصل قائنات با عطر طبیعی، مناسب دمنوش و مصارف خانگی با قیمت مناسب.",
  },
  "دمنوش و چای": {
    title: "خرید دمنوش و چای زعفران | زعفران خواجوی",
    description:
      "انواع دمنوش‌های گیاهی و چای زعفران اصل قائنات، طبیعی و خوش‌عطر برای لحظات آرامش.",
  },
  "زعفران نگین": {
    title: "خرید زعفران نگین درجه یک | زعفران خواجوی",
    description:
      "زعفران نگین قائنات با رشته‌های بلند و یکدست، مناسب هدیه و مصارف ویژه.",
  },
  "زعفران دسته": {
    title: "خرید زعفران دسته اصل | زعفران خواجوی",
    description:
      "زعفران دسته قائنات همراه با ریشه سفید، با قیمت اقتصادی و کیفیت تضمین‌شده.",
  },
  "زعفران نرمه": {
    title: "خرید زعفران نرمه و پودر | زعفران خواجوی",
    description:
      "زعفران نرمه و پودر زعفران اصل قائنات، مناسب آشپزی روزمره و صنایع غذایی.",
  },
  "خشکبار": {
    title: "خرید خشکبار قائنات | زعفران خواجوی",
    description:
      "خشکبار درجه یک قائنات شامل زرشک، عناب و سایر محصولات منطقه با کیفیت ممتاز.",
  },
  "عمده‌فروشی": {
    title: "عمده‌فروشی زعفران قائنات | زعفران خواجوی",
    description:
      "فروش عمده زعفران اصل قائنات برای صادرات، صنایع غذایی و فروشگاه‌ها با قیمت ویژه.",
  },
};

function ShopPage() {
  const { category: active } = Route.useSearch();
  const items = active === "همه" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  return (
    <div className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <p className="font-display text-3xl text-[color:var(--brown-medium)]">our shop</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">فروشگاه زعفران</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/70 leading-7">
            مجموعه‌ای از بهترین محصولات زعفران اصل قائنات را با خیال راحت انتخاب کنید.
          </p>
        </header>

        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/shop"
              search={{ category: c }}
              className={cn(
                "rounded-full border px-4 py-2 text-xs md:text-sm font-bold transition",
                active === c
                  ? "border-[color:var(--brown-deep)] bg-[color:var(--brown-deep)] text-[color:var(--parchment)]"
                  : "border-border bg-card text-foreground/80 hover:border-[color:var(--brown-medium)]",
              )}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">محصولی در این دسته یافت نشد.</p>
        )}
      </div>
    </div>
  );
}

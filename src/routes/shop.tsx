import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "فروشگاه زعفران | زعفران خواجوی" },
      {
        name: "description",
        content:
          "فروشگاه آنلاین زعفران خواجوی؛ خرید انواع زعفران سرگل، نگین، پوشال، پودر زعفران و بسته‌های هدیه با قیمت مستقیم از تولیدکننده.",
      },
      { property: "og:title", content: "فروشگاه زعفران خواجوی" },
      {
        property: "og:description",
        content: "تنوع کامل محصولات زعفران اصل قائنات با ضمانت کیفیت.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("همه");
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
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs md:text-sm font-bold transition",
                active === c
                  ? "border-[color:var(--brown-deep)] bg-[color:var(--brown-deep)] text-[color:var(--parchment)]"
                  : "border-border bg-card text-foreground/80 hover:border-[color:var(--brown-medium)]",
              )}
            >
              {c}
            </button>
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

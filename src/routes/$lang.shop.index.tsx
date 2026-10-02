import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/data/products";
import { useProducts } from "@/lib/products-client";
import { UI } from "@/i18n/ui";
import type { OtherLocale } from "@/i18n/locales";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { LocaleProductCard } from "@/components/i18n/locale-shell";

type Category = (typeof CATEGORIES)[number];

export const Route = createFileRoute("/$lang/shop/")({
  validateSearch: (search: Record<string, unknown>): { category?: Category } => {
    const raw = search.category;
    return typeof raw === "string" && (CATEGORIES as readonly string[]).includes(raw)
      ? { category: raw as Category }
      : {};
  },
  head: ({ params }) => {
    const t = UI[params.lang as OtherLocale] ?? UI.en;
    return pageHead({ path: "/shop", locale: params.lang, title: t.shop.title, description: t.shop.description });
  },
  component: LocaleShop,
});

function LocaleShop() {
  const lang = Route.useParams().lang as OtherLocale;
  const active = Route.useSearch().category ?? "همه";
  const t = UI[lang];
  const { products } = useProducts();
  const items = active === "همه" ? products : products.filter((p) => p.category === active);

  return (
    <div className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">{t.shop.heading}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-foreground/70">{t.shop.sub}</p>
        </header>
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/$lang/shop"
              params={{ lang }}
              search={c === "همه" ? {} : { category: c }}
              className={cn(
                "rounded-full border px-4 py-2 text-xs md:text-sm font-bold transition",
                active === c
                  ? "border-[color:var(--brown-deep)] bg-[color:var(--brown-deep)] text-[color:var(--parchment)]"
                  : "border-border bg-card text-foreground/80",
              )}
            >
              {t.categories[c] ?? c}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {items.map((p) => (
            <LocaleProductCard key={p.id} p={p} lang={lang} />
          ))}
        </div>
        {items.length === 0 && <p className="py-16 text-center text-muted-foreground">{t.shop.empty}</p>}
      </div>
    </div>
  );
}

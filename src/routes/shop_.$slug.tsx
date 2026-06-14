import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { formatToman, type Product } from "@/data/products";
import { useProduct, useProducts, getProductBySlugSync } from "@/lib/products-client";
import { useCart } from "@/lib/cart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProductImageGallery } from "@/components/ProductImageGallery";

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
function toFa(n: number): string {
  return String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export const Route = createFileRoute("/shop_/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlugSync(params.slug);
    return { product, slug: params.slug };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    if (!product) {
      return {
        meta: [
          { title: "محصول یافت نشد | زعفران خواجوی" },
          { name: "description", content: "این محصول در فروشگاه موجود نیست." },
        ],
      };
    }
    const desc =
      product.shortDescription ??
      `${product.name} — ${product.weight} — ${formatToman(product.price)}`;
    return {
      meta: [
        { title: `${product.name} | زعفران خواجوی` },
        { name: "description", content: desc },
        { property: "og:title", content: product.name },
        { property: "og:description", content: desc },
        ...(product.images[0]
          ? [
              { property: "og:image", content: product.images[0] },
              { property: "twitter:image", content: product.images[0] },
            ]
          : []),
      ],
    };
  },
  component: ProductPage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">خطایی رخ داد</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-full bg-[color:var(--brown-deep)] px-5 py-2 text-sm font-bold text-[color:var(--parchment)]"
        >
          تلاش دوباره
        </button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-extrabold text-foreground">محصول پیدا نشد</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        محصولی با این آدرس در فروشگاه موجود نیست.
      </p>
      <Link
        to="/shop"
        search={{ category: "همه" }}
        className="mt-6 inline-block rounded-full bg-[color:var(--brown-deep)] px-5 py-2 text-sm font-bold text-[color:var(--parchment)]"
      >
        بازگشت به فروشگاه
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const { product, loading } = useProduct(slug);
  const { products } = useProducts();
  const [tierIdx, setTierIdx] = useState(0);
  const { add } = useCart();

  // Dev-only invariant check
  useEffect(() => {
    if (!product) return;
    const tiers = product.priceTiers;
    if (import.meta.env.DEV && tiers && tiers.length > 0 && tiers[0].price !== product.price) {
      console.warn(
        `[products] "${product.slug}": priceTiers[0].price (${tiers[0].price}) does not match product.price (${product.price}). They MUST be equal.`,
      );
    }
  }, [product]);

  if (!product) {
    if (loading) {
      return (
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-12 w-full md:w-60" />
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            در حال بارگذاری محصول…
          </p>
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">محصول پیدا نشد</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          محصولی با این آدرس در فروشگاه موجود نیست.
        </p>
        <Link
          to="/shop"
          search={{ category: "همه" }}
          className="mt-6 inline-block rounded-full bg-[color:var(--brown-deep)] px-5 py-2 text-sm font-bold text-[color:var(--parchment)]"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const tiers = product.priceTiers;
  const hasTiers = !!tiers && tiers.length > 0;
  const selectedTier = hasTiers ? tiers![tierIdx] ?? tiers![0] : null;
  const basePerGram = hasTiers ? tiers![0].price / tiers![0].quantity : 0;
  const selectedPerGram = selectedTier ? selectedTier.price / selectedTier.quantity : 0;
  const savingsPct =
    hasTiers && tierIdx > 0 && basePerGram > 0
      ? Math.round((1 - selectedPerGram / basePerGram) * 100)
      : 0;
  const displayPrice = selectedTier ? selectedTier.price : product.price;

  const related = products.filter(
    (p: Product) => p.category === product.category && p.slug !== product.slug,
  ).slice(0, 4);

  return (
    <div className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            خانه
          </Link>
          <ChevronRight className="size-3 rotate-180" />
          <Link to="/shop" search={{ category: "همه" }} className="hover:text-foreground">
            فروشگاه
          </Link>
          <ChevronRight className="size-3 rotate-180" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Gallery */}
          <ProductImageGallery
            images={product.images}
            alt={product.name}
            badge={product.badge}
          />

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs font-bold text-[color:var(--brown-medium)]">
              {product.category}
            </p>
            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-foreground">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{product.weight}</p>

            {product.shortDescription && (
              <p className="mt-4 text-sm leading-7 text-foreground/80">
                {product.shortDescription}
              </p>
            )}

            <div className="mt-6 flex items-end gap-3">
              {product.oldPrice && !hasTiers && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatToman(product.oldPrice)}
                </span>
              )}
              <span className="text-2xl font-extrabold text-foreground">
                {formatToman(displayPrice)}
              </span>
              {hasTiers && (
                <span className="pb-1 text-xs text-muted-foreground">
                  هر گرم: {formatToman(Math.round(selectedPerGram))}
                </span>
              )}
            </div>

            {hasTiers && savingsPct > 0 && (
              <p className="mt-2 text-xs font-bold text-[color:var(--brown-medium)]">
                صرفه‌جویی {toFa(savingsPct)}٪ نسبت به خرید تکی
              </p>
            )}

            {hasTiers && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-bold text-foreground/80">انتخاب مقدار:</p>
                <div className="flex flex-wrap gap-2">
                  {tiers!.map((t: { quantity: number; price: number; label?: string }, i: number) => {
                    const label = t.label ?? `${toFa(t.quantity)} گرم`;
                    const active = i === tierIdx;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setTierIdx(i)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-xs font-bold transition",
                          active
                            ? "border-[color:var(--brown-deep)] bg-[color:var(--brown-deep)] text-[color:var(--parchment)]"
                            : "border-border bg-background text-foreground/80 hover:border-[color:var(--brown-medium)]",
                        )}
                        aria-pressed={active}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={product.inStock === false}
              onClick={() => {
                if (product.inStock === false) return;
                const variantLabel =
                  hasTiers && selectedTier
                    ? selectedTier.label ?? `${toFa(selectedTier.quantity)} گرم`
                    : undefined;
                add({
                  lineId: `${product.id}::${variantLabel ?? "default"}`,
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  variantLabel,
                  unitPrice: displayPrice,
                  image: product.images[0],
                  weight: product.weight,
                });
                toast.success(`${product.name} به سبد افزوده شد`);
              }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--brown-deep)] px-6 py-3 text-sm font-bold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            >
              <ShoppingBag className="size-4" />
              {product.inStock === false
                ? "ناموجود"
                : hasTiers
                  ? `افزودن به سبد — ${formatToman(displayPrice)}`
                  : "افزودن به سبد خرید"}
            </button>

            {product.description && (
              <div className="mt-8 border-t border-border/60 pt-6">
                <h2 className="mb-3 text-lg font-extrabold text-foreground">
                  درباره این محصول
                </h2>
                <div className="space-y-3 text-sm leading-7 text-foreground/80">
                  {product.description.split("\n\n").map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-6 border-t border-border/60 pt-6">
                <h2 className="mb-3 text-lg font-extrabold text-foreground">ویژگی‌ها</h2>
                <ul className="space-y-2 text-sm text-foreground/80">
                  {product.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--brown-medium)]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-border/60 pt-10">
            <h2 className="mb-6 text-xl font-extrabold text-foreground">
              محصولات مشابه
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((p: Product) => (
                <Link
                  key={p.id}
                  to="/shop/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:shadow-lg"
                >
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-1 text-sm font-bold text-foreground">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-xs font-extrabold text-foreground">
                      {formatToman(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

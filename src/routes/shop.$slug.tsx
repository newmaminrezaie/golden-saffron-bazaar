import { useState } from "react";
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { formatToman, getProductBySlug, PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
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
        { property: "og:image", content: product.images[0] },
        { property: "twitter:image", content: product.images[0] },
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
        className="mt-6 inline-block rounded-full bg-[color:var(--brown-deep)] px-5 py-2 text-sm font-bold text-[color:var(--parchment)]"
      >
        بازگشت به فروشگاه
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [activeImg, setActiveImg] = useState(0);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
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
          <Link to="/shop" className="hover:text-foreground">
            فروشگاه
          </Link>
          <ChevronRight className="size-3 rotate-180" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-secondary">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 right-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow">
                  {product.badge}
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition",
                      i === activeImg
                        ? "border-[color:var(--brown-deep)]"
                        : "border-transparent opacity-70 hover:opacity-100",
                    )}
                    aria-label={`تصویر ${i + 1}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

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
              {product.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatToman(product.oldPrice)}
                </span>
              )}
              <span className="text-2xl font-extrabold text-foreground">
                {formatToman(product.price)}
              </span>
            </div>

            <button
              type="button"
              disabled={product.inStock === false}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--brown-deep)] px-6 py-3 text-sm font-bold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            >
              <ShoppingBag className="size-4" />
              {product.inStock === false ? "ناموجود" : "افزودن به سبد خرید"}
            </button>

            {product.description && (
              <div className="mt-8 border-t border-border/60 pt-6">
                <h2 className="mb-3 text-lg font-extrabold text-foreground">
                  درباره این محصول
                </h2>
                <div className="space-y-3 text-sm leading-7 text-foreground/80">
                  {product.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-6 border-t border-border/60 pt-6">
                <h2 className="mb-3 text-lg font-extrabold text-foreground">ویژگی‌ها</h2>
                <ul className="space-y-2 text-sm text-foreground/80">
                  {product.highlights.map((h, i) => (
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
              {related.map((p) => (
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

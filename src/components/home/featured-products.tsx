import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { PRODUCTS } from "@/data/products";

export function FeaturedProducts() {
  const featured = PRODUCTS.slice(0, 4);
  return (
    <section className="px-4 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-2xl text-[color:var(--brown-medium)]">bestsellers</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              محصولات پرفروش
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-bold text-[color:var(--brown-medium)] hover:text-accent transition"
          >
            مشاهده همه ←
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

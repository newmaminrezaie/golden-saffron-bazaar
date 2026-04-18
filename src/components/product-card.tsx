import { ShoppingBag } from "lucide-react";
import { formatToman, type Product } from "@/data/products";

export function ProductCard({ p }: { p: Product }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {p.badge && (
          <span className="absolute top-3 right-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow">
            {p.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-bold text-foreground line-clamp-1">{p.name}</h3>
        <p className="text-xs text-muted-foreground">{p.weight}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="leading-tight">
            {p.oldPrice && (
              <div className="text-xs text-muted-foreground line-through">
                {formatToman(p.oldPrice)}
              </div>
            )}
            <div className="text-sm font-extrabold text-foreground">
              {formatToman(p.price)}
            </div>
          </div>
          <button
            className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brown-deep)] px-3 py-2 text-xs font-bold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)]"
            aria-label={`افزودن ${p.name} به سبد خرید`}
          >
            <ShoppingBag className="size-3.5" />
            افزودن
          </button>
        </div>
      </div>
    </article>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { formatToman, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductCard({ p }: { p: Product }) {
  const images = p.images.length > 0 ? p.images : [""];
  const hasMultiple = images.length > 1;
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCycle = () => {
    if (!hasMultiple || intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 1100);
  };
  const stopCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIndex(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Link
      to="/shop/$slug"
      params={{ slug: p.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brown-medium)]"
    >
      <div
        className="relative aspect-square overflow-hidden bg-secondary"
        onMouseEnter={startCycle}
        onMouseLeave={stopCycle}
        onTouchStart={startCycle}
        onTouchEnd={stopCycle}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={p.name}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:scale-105",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        {p.badge && (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow">
            {p.badge}
          </span>
        )}
        {hasMultiple && (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index
                    ? "w-4 bg-white/90"
                    : "w-1.5 bg-white/50",
                )}
              />
            ))}
          </div>
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
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brown-deep)] px-3 py-2 text-xs font-bold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)]"
            aria-label={`افزودن ${p.name} به سبد خرید`}
          >
            <ShoppingBag className="size-3.5" />
            افزودن
          </button>
        </div>
      </div>
    </Link>
  );
}

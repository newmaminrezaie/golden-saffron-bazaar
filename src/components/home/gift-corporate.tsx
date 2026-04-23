import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { PRODUCTS } from "@/data/products";
import ornament from "@/assets/ornament-crimson.jpg";

const GIFT_KEYWORDS = ["ظرف چوبی", "ظرف گرد", "جعبه مخمل", "ظرف خاتم"];

export function GiftCorporate() {
  const giftProducts = PRODUCTS.filter(
    (p) =>
      p.category === "زعفران نگین" &&
      GIFT_KEYWORDS.some((kw) => p.name.includes(kw)),
  );

  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollByCard = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-gift-card]");
    const width = card?.offsetWidth ?? 280;
    const gap = 16;
    // In RTL, scrollLeft goes negative; scrollBy still works intuitively.
    rail.scrollBy({ left: dir * (width + gap), behavior: "smooth" });
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onScroll = () => {
      const card = rail.querySelector<HTMLElement>("[data-gift-card]");
      const width = (card?.offsetWidth ?? 280) + 16;
      const idx = Math.round(Math.abs(rail.scrollLeft) / width);
      setActiveIndex(Math.min(giftProducts.length - 1, Math.max(0, idx)));
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, [giftProducts.length]);

  if (giftProducts.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden px-4 py-16 md:py-24"
      style={{
        backgroundImage: `url(${ornament})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
      aria-label="محصولات کادویی و سازمانی"
    >
      {/* dark vignette overlay for readability */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-2xl text-[color:var(--parchment)]/80">
              gift &amp; corporate
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[color:var(--parchment)]">
              محصولات کادویی و سازمانی
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[color:var(--parchment)]/70">
              زعفران سوپرنگین در جعبه‌های نفیس چوبی، خاتم و مخمل؛ مناسب هدیه و
              سفارش‌های سازمانی.
            </p>
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="قبلی"
              className="grid size-10 place-items-center rounded-full border border-[color:var(--parchment)]/30 bg-black/20 text-[color:var(--parchment)] backdrop-blur transition hover:bg-black/40"
            >
              <ChevronRight className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="بعدی"
              className="grid size-10 place-items-center rounded-full border border-[color:var(--parchment)]/30 bg-black/20 text-[color:var(--parchment)] backdrop-blur transition hover:bg-black/40"
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {giftProducts.map((p) => (
            <div
              key={p.id}
              data-gift-card
              className="w-[260px] shrink-0 snap-start md:w-[300px]"
            >
              <ProductCard p={p} />
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {giftProducts.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex
                  ? "w-6 bg-[color:var(--parchment)]"
                  : "w-1.5 bg-[color:var(--parchment)]/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

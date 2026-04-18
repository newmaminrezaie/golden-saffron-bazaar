import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { PromiseStrip } from "@/components/home/promise-strip";
import { AboutTeaser } from "@/components/home/about-teaser";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "زعفران خواجوی | زعفران اصل قائنات با ضمانت کیفیت" },
      {
        name: "description",
        content:
          "خرید آنلاین زعفران اصل قائنات از زعفران خواجوی؛ سرگل، نگین، پوشال، پودر زعفران و بسته‌های هدیه با عطر و رنگ بی‌نظیر.",
      },
      { property: "og:title", content: "زعفران خواجوی | زعفران اصل قائنات" },
      {
        property: "og:description",
        content: "زعفران ممتاز ایرانی با ضمانت اصالت و ارسال سریع به سراسر کشور.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <PromiseStrip />
      <AboutTeaser />
    </>
  );
}

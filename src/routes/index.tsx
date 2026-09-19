import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { pageHead } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";

// Below-the-fold sections are code-split so the page paints (hero + categories)
// quickly, then each section streams in as its chunk arrives.
const FeaturedProducts = lazy(() =>
  import("@/components/home/featured-products").then((m) => ({ default: m.FeaturedProducts })),
);
const GiftCorporate = lazy(() =>
  import("@/components/home/gift-corporate").then((m) => ({ default: m.GiftCorporate })),
);
const PromiseStrip = lazy(() =>
  import("@/components/home/promise-strip").then((m) => ({ default: m.PromiseStrip })),
);
const AboutTeaser = lazy(() =>
  import("@/components/home/about-teaser").then((m) => ({ default: m.AboutTeaser })),
);
const FounderTeaser = lazy(() =>
  import("@/components/home/founder-teaser").then((m) => ({ default: m.FounderTeaser })),
);
const EnamadPopup = lazy(() =>
  import("@/components/enamad-popup").then((m) => ({ default: m.EnamadPopup })),
);

const SectionFallback = () => <div style={{ minHeight: 200 }} />;

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      path: "/",
      title: "زعفران خواجوی | زعفران اصل قائنات با ضمانت کیفیت",
      description:
        "خرید آنلاین زعفران اصل قائنات از زعفران خواجوی؛ سرگل، نگین، پوشال، پودر زعفران و بسته‌های هدیه با عطر و رنگ بی‌نظیر.",
      type: "website",
    }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <Suspense fallback={<SectionFallback />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <GiftCorporate />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <PromiseStrip />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <AboutTeaser />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FounderTeaser />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <EnamadPopup />
      </Suspense>
    </>
  );
}

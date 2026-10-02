import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-saffron-1.jpg";
import fieldImg from "@/assets/saffron-field.jpg";
import { PRODUCTS } from "@/data/products";
import { UI } from "@/i18n/ui";
import type { OtherLocale } from "@/i18n/locales";
import { pageHead } from "@/lib/seo";
import { LocaleProductCard } from "@/components/i18n/locale-shell";

export const Route = createFileRoute("/$lang/")({
  head: ({ params }) => {
    const t = UI[params.lang as OtherLocale] ?? UI.en;
    return pageHead({ path: "/", locale: params.lang, title: t.home.title, description: t.home.description });
  },
  component: LocaleHome,
});

function LocaleHome() {
  const lang = Route.useParams().lang as OtherLocale;
  const t = UI[lang].home;
  const featured = PRODUCTS.filter((p) => p.inStock !== false).slice(0, 8);

  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt={t.heroTitle}
          width={1620}
          height={907}
          fetchPriority="high"
          decoding="sync"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brown-deep)]/85 via-[color:var(--brown-deep)]/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-end px-4 py-16 text-[color:var(--parchment)]">
          <p className="text-sm font-bold uppercase tracking-widest opacity-90">{t.eyebrow}</p>
          <h1 className="mt-2 max-w-2xl text-3xl md:text-5xl font-extrabold leading-tight">{t.heroTitle}</h1>
          <p className="mt-4 max-w-xl text-sm md:text-base leading-7 opacity-90">{t.heroSub}</p>
          <Link
            to="/$lang/shop"
            params={{ lang }}
            className="mt-7 inline-flex w-fit rounded-full bg-[color:var(--parchment)] px-6 py-3 text-sm font-bold text-[color:var(--brown-deep)]"
          >
            {t.heroCta}
          </Link>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-extrabold">{t.featured}</h2>
            <Link to="/$lang/shop" params={{ lang }} className="text-sm font-bold text-accent">
              {t.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featured.map((p) => (
              <LocaleProductCard key={p.id} p={p} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold">{t.whyTitle}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {t.why.map((w) => (
              <div key={w.title} className="rounded-2xl border border-border/60 bg-card p-6">
                <h3 className="font-extrabold text-[color:var(--brown-deep)]">{w.title}</h3>
                <p className="mt-2 text-sm leading-7 text-foreground/75">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <img src={fieldImg} alt={t.storyTitle} width={1820} height={1213} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold leading-tight">{t.storyTitle}</h2>
            <p className="mt-5 leading-8 text-foreground/80">{t.storyBody}</p>
            <Link
              to="/$lang/about"
              params={{ lang }}
              className="mt-7 inline-flex rounded-full bg-[color:var(--brown-deep)] px-6 py-3 text-sm font-bold text-[color:var(--parchment)]"
            >
              {t.storyCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

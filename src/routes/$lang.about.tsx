import { createFileRoute } from "@tanstack/react-router";
import storefront from "@/assets/storefront-wide.jpg";
import { UI } from "@/i18n/ui";
import type { OtherLocale } from "@/i18n/locales";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/$lang/about")({
  head: ({ params }) => {
    const t = UI[params.lang as OtherLocale] ?? UI.en;
    return pageHead({ path: "/about", locale: params.lang, title: t.about.title, description: t.about.description });
  },
  component: LocaleAbout,
});

function LocaleAbout() {
  const lang = Route.useParams().lang as OtherLocale;
  const t = UI[lang].about;
  return (
    <div className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center text-3xl md:text-4xl font-extrabold">{t.heading}</h1>
        <img
          src={storefront}
          alt={t.heading}
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="mt-8 w-full rounded-3xl object-cover shadow-xl"
          style={{ height: "auto" }}
        />
        <div className="mt-8 space-y-5 text-base leading-8 text-foreground/85">
          {t.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

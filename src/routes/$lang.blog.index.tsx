import { createFileRoute, Link } from "@tanstack/react-router";
import { getArticles } from "@/lib/articles";
import { ARTICLE_I18N } from "@/i18n/articles";
import { UI } from "@/i18n/ui";
import type { OtherLocale } from "@/i18n/locales";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/$lang/blog/")({
  head: ({ params }) => {
    const t = UI[params.lang as OtherLocale] ?? UI.en;
    return pageHead({ path: "/blog", locale: params.lang, title: t.blog.title, description: t.blog.description });
  },
  component: LocaleBlog,
});

function LocaleBlog() {
  const lang = Route.useParams().lang as OtherLocale;
  const t = UI[lang].blog;
  const articles = getArticles().filter((a) => ARTICLE_I18N[a.slug]?.[lang]);
  const date = new Intl.DateTimeFormat(lang, { dateStyle: "medium" });

  return (
    <div className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">{t.heading}</h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">{t.sub}</p>
        </header>
        {articles.length === 0 && <p className="text-center text-sm text-muted-foreground">{t.empty}</p>}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => {
            const tr = ARTICLE_I18N[a.slug][lang];
            return (
              <Link
                key={a.slug}
                to="/$lang/blog/$slug"
                params={{ lang, slug: a.slug }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:shadow-lg"
              >
                {a.coverImage && (
                  <div className="aspect-[16/9] overflow-hidden bg-secondary">
                    <img src={a.coverImage} alt={tr.title} width={1600} height={900} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-extrabold line-clamp-2">{tr.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-7 text-foreground/75 line-clamp-3">{tr.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-bold text-accent">{t.readMore}</span>
                    <time dateTime={a.publishedAt}>{date.format(new Date(a.publishedAt))}</time>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

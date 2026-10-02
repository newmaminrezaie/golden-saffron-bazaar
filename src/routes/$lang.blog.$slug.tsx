import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { getArticleBySlug } from "@/lib/articles";
import { ARTICLE_I18N } from "@/i18n/articles";
import { UI } from "@/i18n/ui";
import type { OtherLocale } from "@/i18n/locales";
import { pageHead, absoluteImage, absoluteUrl, breadcrumbLd, localizedPath } from "@/lib/seo";

export const Route = createFileRoute("/$lang/blog/$slug")({
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    const tr = ARTICLE_I18N[params.slug]?.[params.lang as OtherLocale];
    if (!article || !tr) throw notFound();
    return { article, tr };
  },
  head: ({ params, loaderData }) => {
    const lang = params.lang as OtherLocale;
    const t = UI[lang] ?? UI.en;
    const path = `/blog/${params.slug}`;
    if (!loaderData) {
      return pageHead({ path, locale: lang, title: t.notFound.title, description: t.notFound.body, noindex: true });
    }
    const { article, tr } = loaderData;
    const head = pageHead({
      path,
      locale: lang,
      title: `${tr.title} | ${t.brand}`,
      description: tr.excerpt,
      type: "article",
      image: absoluteImage(article.coverImage),
    });
    return {
      ...head,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: tr.title,
            description: tr.excerpt,
            image: absoluteImage(article.coverImage),
            datePublished: article.publishedAt,
            inLanguage: lang,
            mainEntityOfPage: absoluteUrl(localizedPath(path, lang)),
            author: { "@type": "Organization", name: t.brand },
            publisher: { "@type": "Organization", name: t.brand },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: t.nav.home, path: localizedPath("/", lang) },
              { name: t.nav.blog, path: localizedPath("/blog", lang) },
              { name: tr.title, path: localizedPath(path, lang) },
            ]),
          ),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-extrabold">404</h1>
    </div>
  ),
  component: LocaleArticle,
});

function LocaleArticle() {
  const lang = Route.useParams().lang as OtherLocale;
  const t = UI[lang];
  const { article, tr } = Route.useLoaderData();
  const date = new Intl.DateTimeFormat(lang, { dateStyle: "long" });

  return (
    <article className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <Link to="/$lang/blog" params={{ lang }} className="text-sm font-bold text-accent">
          ← {t.blog.back}
        </Link>
        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">{tr.title}</h1>
        <time dateTime={article.publishedAt} className="mt-3 block text-sm text-muted-foreground">
          {date.format(new Date(article.publishedAt))}
        </time>
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={tr.title}
            width={1600}
            height={1067}
            fetchPriority="high"
            className="mt-8 w-full rounded-2xl object-cover"
            style={{ height: "auto" }}
          />
        )}
        <div className="prose prose-lg mt-8 max-w-none leading-8 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h3]:mt-6 [&_h3]:font-bold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:ps-6 [&_p]:my-4 [&_ul]:list-disc [&_ul]:ps-6">
          <ReactMarkdown>{tr.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}

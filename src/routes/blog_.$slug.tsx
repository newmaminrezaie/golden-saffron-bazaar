import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronRight } from "lucide-react";
import { getArticleBySlug, formatPersianDate } from "@/lib/articles";
import { pageHead, absoluteImage, absoluteUrl, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/blog_/$slug")({
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ params, loaderData }) => {
    const path = `/blog/${params.slug}`;
    const article = loaderData?.article;

    if (!article) {
      return pageHead({
        path,
        title: "مقاله یافت نشد | زعفران خواجوی",
        description: "این مقاله موجود نیست.",
        noindex: true,
      });
    }

    const image = absoluteImage(article.coverImage);
    const head = pageHead({
      path,
      title: `${article.title} | مقالات زعفران خواجوی`,
      description: article.excerpt,
      type: "article",
      image,
    });

    return {
      ...head,
      meta: [
        ...head.meta,
        { name: "author", content: article.author },
        { property: "article:published_time", content: article.publishedAt },
        { property: "article:author", content: article.author },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            image: image ? [image] : undefined,
            datePublished: article.publishedAt,
            mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
            author: { "@type": "Person", name: article.author },
            publisher: {
              "@type": "Organization",
              name: "زعفران خواجوی",
              logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.png") },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: "مقالات", path: "/blog" },
              { name: article.title, path },
            ]),
          ),
        },
      ],
    };
  },
  component: ArticlePage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">خطا در بارگذاری مقاله</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-full bg-[color:var(--brown-deep)] px-5 py-2 text-sm font-bold text-[color:var(--parchment)]"
        >
          تلاش دوباره
        </button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-extrabold text-foreground">مقاله پیدا نشد</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        این مقاله در سایت موجود نیست یا حذف شده است.
      </p>
      <Link
        to="/blog"
        className="mt-6 inline-block rounded-full bg-[color:var(--brown-deep)] px-5 py-2 text-sm font-bold text-[color:var(--parchment)]"
      >
        بازگشت به مقالات
      </Link>
    </div>
  ),
});

function ArticlePage() {
  const { article } = Route.useLoaderData();

  return (
    <div className="px-4 py-10 md:py-14">
      <article className="mx-auto max-w-3xl">
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">خانه</Link>
          <ChevronRight className="size-3 rotate-180" />
          <Link to="/blog" className="hover:text-foreground">مقالات</Link>
          <ChevronRight className="size-3 rotate-180" />
          <span className="text-foreground line-clamp-1">{article.title}</span>
        </nav>

        {article.coverImage && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-border/60 bg-secondary aspect-[16/9]">
            <img
              src={article.coverImage}
              alt={article.title}
              width={1600}
              height={900}
              loading="eager"
              decoding="sync"
              // @ts-expect-error: valid HTML attr, not yet in React types
              fetchpriority="high"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-snug">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>{article.author}</span>
            <span>•</span>
            <time dateTime={article.publishedAt}>
              {formatPersianDate(article.publishedAt)}
            </time>
            {article.tags && article.tags.length > 0 && (
              <>
                <span>•</span>
                <ul className="flex flex-wrap gap-2">
                  {article.tags.map((t: string) => (
                    <li
                      key={t}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold text-foreground/80"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </header>

        <div
          className="prose-article text-[15px] leading-8 text-foreground/85"
          style={{ lineHeight: "2" }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ ...p }) => (
                <h2
                  className="mt-8 mb-3 text-xl md:text-2xl font-extrabold text-foreground"
                  {...p}
                />
              ),
              h3: ({ ...p }) => (
                <h3
                  className="mt-6 mb-2 text-lg font-extrabold text-foreground"
                  {...p}
                />
              ),
              p: ({ ...p }) => <p className="my-4" {...p} />,
              ul: ({ ...p }) => (
                <ul className="my-4 space-y-2 pr-5 list-disc marker:text-[color:var(--brown-medium)]" {...p} />
              ),
              ol: ({ ...p }) => (
                <ol className="my-4 space-y-2 pr-5 list-decimal marker:text-[color:var(--brown-medium)]" {...p} />
              ),
              a: ({ ...p }) => (
                <a className="text-[color:var(--brown-deep)] underline hover:text-[color:var(--brown-medium)]" {...p} />
              ),
              strong: ({ ...p }) => (
                <strong className="font-extrabold text-foreground" {...p} />
              ),
              blockquote: ({ ...p }) => (
                <blockquote
                  className="my-6 border-r-4 border-[color:var(--brown-medium)] bg-secondary/60 px-4 py-3 text-foreground/80"
                  {...p}
                />
              ),
              // In-article images are always below the fold.
              img: ({ ...p }) => (
                <img
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={800}
                  className="my-6 rounded-xl border border-border/60"
                  style={{ height: "auto", maxWidth: "100%" }}
                  {...p}
                />
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 text-center">
          <Link
            to="/blog"
            className="inline-block rounded-full border border-border bg-background px-5 py-2 text-sm font-bold text-foreground hover:border-[color:var(--brown-medium)]"
          >
            ← بازگشت به همه مقالات
          </Link>
        </div>
      </article>
    </div>
  );
}

import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { getArticles, formatPersianDate, type Article } from "@/lib/articles";

export const Route = createFileRoute("/blog")({
  loader: () => getArticles(),
  head: () => ({
    meta: [
      { title: "مقالات | زعفران خواجوی" },
      {
        name: "description",
        content:
          "مقالات آموزشی درباره خواص زعفران، روش تشخیص زعفران اصل، طرز استفاده و نکات نگهداری — به قلم خانواده خواجوی.",
      },
      { property: "og:title", content: "مقالات زعفران خواجوی" },
      {
        property: "og:description",
        content: "مجموعه مقالات تخصصی درباره زعفران اصل قائنات.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BlogIndex,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">خطا در بارگذاری مقالات</h1>
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
      <h1 className="text-2xl font-extrabold text-foreground">مقاله‌ای یافت نشد</h1>
    </div>
  ),
});

function BlogIndex() {
  const articles = Route.useLoaderData() as Article[];

  return (
    <div className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">مقالات</h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            دانستنی‌ها، راهنماها و خواص زعفران اصل قائنات
          </p>
        </header>

        {articles.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            هنوز مقاله‌ای منتشر نشده است.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                to="/blog/$slug"
                params={{ slug: a.slug }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:shadow-lg"
              >
                {a.coverImage && (
                  <div className="aspect-[16/9] overflow-hidden bg-secondary">
                    <img
                      src={a.coverImage}
                      alt={a.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-extrabold text-foreground line-clamp-2">
                    {a.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-7 text-foreground/75 line-clamp-3">
                    {a.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{a.author}</span>
                    <time dateTime={a.publishedAt}>{formatPersianDate(a.publishedAt)}</time>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

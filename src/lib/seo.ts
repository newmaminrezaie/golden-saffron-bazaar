/**
 * Single source of truth for every absolute URL the site emits:
 * canonical tags, Open Graph / Twitter tags, JSON-LD and the build-time
 * sitemap all read from here.
 *
 * Multi-language readiness: when /en, /tr and /ar arrive, add their codes to
 * `LOCALES` and build paths through `localizedPath()`. `pageHead()` will then
 * emit the matching hreflang alternates automatically — no route file needs
 * to change.
 */

export const SITE_URL = "https://khajavisaffron.ir";

/** Locale codes that have a URL prefix. The default locale has no prefix. */
export const DEFAULT_LOCALE = "fa" as const;
export const LOCALES = ["fa"] as const;
export type Locale = (typeof LOCALES)[number];

/** Human-readable BCP-47 tags used in og:locale / hreflang. */
export const LOCALE_TAGS: Record<string, string> = {
  fa: "fa-IR",
  en: "en",
  tr: "tr",
  ar: "ar",
};

/** Normalise any path to a leading-slash, no-trailing-slash form ("/" stays "/"). */
export function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash.replace(/\/+$/, "") || "/";
}

/** Prefix a path with a locale segment (default locale stays unprefixed). */
export function localizedPath(path: string, locale: string = DEFAULT_LOCALE): string {
  const p = normalizePath(path);
  if (locale === DEFAULT_LOCALE) return p;
  return p === "/" ? `/${locale}` : `/${locale}${p}`;
}

/** Absolute URL on the canonical origin (no www, no trailing slash except root). */
export function absoluteUrl(path = "/"): string {
  const p = normalizePath(path);
  return p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`;
}

/**
 * Turn a possibly-relative image reference into an absolute URL.
 * Bundled assets resolve to hashed `/assets/...` paths at build time, which is
 * still site-relative, so they can be made absolute safely. Anything already
 * absolute is returned untouched.
 */
export function absoluteImage(src?: string | null): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}${src.startsWith("/") ? src : `/${src}`}`;
}

export const DEFAULT_OG_IMAGE = absoluteUrl("/og-image.png");

export type PageHeadInput = {
  /** Route path without locale prefix, e.g. "/shop" or "/shop/zafaran-daste". */
  path: string;
  title: string;
  description: string;
  /** og:type — "website" (default), "article" or "product". */
  type?: "website" | "article" | "product";
  /** Absolute or site-relative image URL. Falls back to the site OG image. */
  image?: string | null;
  /** Keep the page out of search results (checkout, admin, payment states). */
  noindex?: boolean;
  locale?: string;
};

type MetaTag = Record<string, string>;
type LinkTag = Record<string, string>;

/**
 * Build the per-route `meta` + `links` for a leaf route's `head()`.
 * Canonical is emitted here (leaf routes only — the root must never carry one,
 * because TanStack concatenates `links` and two canonicals are invalid).
 */
export function pageHead(input: PageHeadInput): { meta: MetaTag[]; links: LinkTag[] } {
  const {
    path,
    title,
    description,
    type = "website",
    image,
    noindex = false,
    locale = DEFAULT_LOCALE,
  } = input;

  const url = absoluteUrl(localizedPath(path, locale));
  const ogImage = absoluteImage(image) ?? DEFAULT_OG_IMAGE;

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { property: "og:locale", content: LOCALE_TAGS[locale] ?? LOCALE_TAGS.fa },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" },
  ];

  const links: LinkTag[] = [{ rel: "canonical", href: url }];

  // hreflang alternates — only meaningful once more than one locale exists.
  if (!noindex && LOCALES.length > 1) {
    for (const loc of LOCALES) {
      links.push({
        rel: "alternate",
        hrefLang: LOCALE_TAGS[loc] ?? loc,
        href: absoluteUrl(localizedPath(path, loc)),
      });
    }
    links.push({
      rel: "alternate",
      hrefLang: "x-default",
      href: absoluteUrl(localizedPath(path, DEFAULT_LOCALE)),
    });
  }

  return { meta, links };
}

/** BreadcrumbList JSON-LD helper. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useProduct, getProductBySlugSync } from "@/lib/products-client";
import { UI } from "@/i18n/ui";
import { localizeProduct } from "@/i18n/products";
import { whatsappLink, type OtherLocale } from "@/i18n/locales";
import { pageHead, absoluteImage, absoluteUrl, breadcrumbLd, localizedPath } from "@/lib/seo";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { formatPrice } from "@/components/i18n/locale-shell";

export const Route = createFileRoute("/$lang/shop/$slug")({
  loader: ({ params }) => ({ product: getProductBySlugSync(params.slug) }),
  head: ({ params, loaderData }) => {
    const lang = params.lang as OtherLocale;
    const t = UI[lang] ?? UI.en;
    const path = `/shop/${params.slug}`;
    const product = loaderData?.product;
    if (!product) {
      return pageHead({ path, locale: lang, title: `${t.product.notFound} | ${t.brand}`, description: t.product.notFound, noindex: true });
    }
    const l = localizeProduct(product, lang);
    const url = absoluteUrl(localizedPath(path, lang));
    const head = pageHead({
      path,
      locale: lang,
      title: `${l.name} | ${t.brand}`,
      description: l.short || l.name,
      type: "product",
      image: absoluteImage(product.images[0]),
    });
    return {
      ...head,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: l.name,
            description: l.short || l.name,
            image: product.images.map((s) => absoluteImage(s)).filter(Boolean),
            sku: product.id,
            brand: { "@type": "Brand", name: t.brand },
            offers: {
              "@type": "Offer",
              url,
              price: product.price * 10,
              priceCurrency: "IRR",
              availability:
                product.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: t.nav.home, path: localizedPath("/", lang) },
              { name: t.nav.shop, path: localizedPath("/shop", lang) },
              { name: l.name, path: localizedPath(path, lang) },
            ]),
          ),
        },
      ],
    };
  },
  component: LocaleProduct,
});

function LocaleProduct() {
  const { lang: rawLang, slug } = Route.useParams();
  const lang = rawLang as OtherLocale;
  const t = UI[lang];
  const initial = Route.useLoaderData().product;
  const { product: fetched } = useProduct(slug);
  const product = fetched ?? initial;

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold">{t.product.notFound}</h1>
        <Link to="/$lang/shop" params={{ lang }} className="mt-6 inline-block font-bold text-accent">
          {t.product.back}
        </Link>
      </div>
    );
  }

  const l = localizeProduct(product, lang);
  return (
    <div className="px-4 py-10 md:py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <ProductImageGallery images={product.images} alt={l.name} />
        <div>
          <Link to="/$lang/shop" params={{ lang }} className="text-sm font-bold text-accent">
            ← {t.product.back}
          </Link>
          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold">{l.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.product.weight}: {l.weight}
          </p>
          <p className="mt-4 text-2xl font-extrabold text-[color:var(--brown-deep)]">{formatPrice(product.price, lang)}</p>
          {product.inStock === false && <p className="mt-2 text-sm font-bold text-destructive">{t.product.outOfStock}</p>}
          {l.short && <p className="mt-6 leading-8 text-foreground/80">{l.short}</p>}
          <a
            href={whatsappLink(t.product.orderMessage(l.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--brown-deep)] px-6 py-3 text-sm font-bold text-[color:var(--parchment)]"
          >
            <MessageCircle className="size-5" /> {t.product.order}
          </a>
          <p className="mt-3 text-xs text-muted-foreground">{t.product.orderNote}</p>
        </div>
      </div>
    </div>
  );
}

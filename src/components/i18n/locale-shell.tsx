import { Link } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { LanguageDropdown } from "@/components/language-dropdown";
import type { Product } from "@/data/products";
import { UI } from "@/i18n/ui";
import { localizeProduct } from "@/i18n/products";
import {
  LANG_LABELS,
  OTHER_LOCALES,
  localeDir,
  pathInLocale,
  stripLocale,
  whatsappLink,
  type OtherLocale,
} from "@/i18n/locales";

export { pathInLocale };

/** Language switcher — plain links so the page reloads with the right direction. */
export function LanguageSwitcher({ pathname, current }: { pathname: string; current: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs font-bold">
      {["fa", ...OTHER_LOCALES].map((l) => (
        <a
          key={l}
          href={pathInLocale(pathname, l)}
          hrefLang={l}
          lang={l}
          aria-current={l === current ? "true" : undefined}
          className={
            l === current
              ? "rounded-full bg-[color:var(--brown-deep)] px-2.5 py-1 text-[color:var(--parchment)]"
              : "rounded-full px-2.5 py-1 text-foreground/70 hover:text-accent"
          }
        >
          {LANG_LABELS[l]}
        </a>
      ))}
    </div>
  );
}

export function LocaleLayout({ lang, pathname, children }: { lang: OtherLocale; pathname: string; children: ReactNode }) {
  const t = UI[lang];
  const [open, setOpen] = useState(false);
  const nav = [
    { to: "/$lang", label: t.nav.home },
    { to: "/$lang/shop", label: t.nav.shop },
    { to: "/$lang/blog", label: t.nav.blog },
    { to: "/$lang/about", label: t.nav.about },
    { to: "/$lang/contact", label: t.nav.contact },
  ] as const;

  return (
    <div dir={localeDir(lang)} lang={lang} className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Link to="/$lang" params={{ lang }} className="font-extrabold text-lg text-[color:var(--brown-deep)]">
            {t.brand}
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                params={{ lang }}
                className="text-foreground/80 hover:text-accent"
                activeProps={{ className: "text-accent" }}
                activeOptions={{ exact: n.to === "/$lang" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <LanguageDropdown pathname={pathname} current={lang} />
          <button aria-label="Menu" className="md:hidden p-2" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <nav className="md:hidden border-t border-border/60 bg-background px-4 py-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} params={{ lang }} onClick={() => setOpen(false)} className="block py-3 font-medium">
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-extrabold text-[color:var(--brown-deep)]">{t.brand}</p>
            <p className="mt-1 text-sm text-foreground/70">{t.footer.tagline}</p>
          </div>
          <LanguageSwitcher pathname={pathname} current={lang} />
        </div>
        <p className="pb-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t.brand}. {t.footer.rights}
        </p>
      </footer>

      <a
        href={whatsappLink(t.product.orderMessage(t.brand))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 end-5 z-50 grid size-14 place-items-center rounded-full bg-[color:var(--brown-deep)] text-[color:var(--parchment)] shadow-lg"
      >
        <MessageCircle className="size-6" />
      </a>
    </div>
  );
}

export function formatPrice(n: number, lang: OtherLocale) {
  const num = n.toLocaleString(lang === "ar" ? "ar-EG" : lang === "tr" ? "tr-TR" : "en-US");
  return `${num} ${UI[lang].product.currency}`;
}

export function LocaleProductCard({ p, lang }: { p: Product; lang: OtherLocale }) {
  const l = localizeProduct(p, lang);
  return (
    <Link
      to="/$lang/shop/$slug"
      params={{ lang, slug: p.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {p.images[0] && (
          <img
            src={p.images[0]}
            alt={l.name}
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm md:text-base font-extrabold text-foreground line-clamp-2">{l.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{l.weight}</p>
        <p className="mt-auto pt-3 text-sm font-bold text-[color:var(--brown-deep)]">{formatPrice(p.price, lang)}</p>
      </div>
    </Link>
  );
}

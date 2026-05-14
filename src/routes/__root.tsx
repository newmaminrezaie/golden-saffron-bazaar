import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { FloatingContact } from "@/components/floating-contact";
import { AnnouncementBar } from "@/components/announcement-bar";
import { CartProvider, useCart } from "@/lib/cart";
import { CartDrawer } from "@/components/cart-drawer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">۴۰۴</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">صفحه پیدا نشد</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "زعفران خواجوی | بهترین زعفران اصل قائنات" },
      {
        name: "description",
        content:
          "زعفران خواجوی - عرضه‌کننده زعفران ممتاز قائنات؛ سرگل، نگین، پوشال و پودر زعفران اصل با ضمانت کیفیت.",
      },
      {
        name: "keywords",
        content:
          "زعفران خواجوی, زعفران قائنات, زعفران نگین, زعفران سرگل, خرید زعفران, طلای سرخ, زعفران اصل, زعفران گناباد, خشکبار قائنات",
      },
      { name: "author", content: "Khajavi Saffron" },
      { name: "robots", content: "index, follow" },
      { httpEquiv: "Content-Language", content: "fa-IR" },
      { property: "og:locale", content: "fa_IR" },
      { property: "og:site_name", content: "زعفران خواجوی" },
      { property: "og:title", content: "زعفران خواجوی" },
      {
        property: "og:description",
        content: "زعفران ممتاز و اصل قائنات با ضمانت کیفیت.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://khajavisaffron.ir/" },
      { property: "og:image", content: "https://khajavisaffron.ir/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "زعفران خواجوی" },
      {
        name: "twitter:description",
        content: "زعفران ممتاز و اصل قائنات با ضمانت کیفیت.",
      },
      { name: "twitter:image", content: "https://khajavisaffron.ir/og-image.png" },
      { name: "theme-color", content: "#5a3e2e" },
    ],
    links: [
      { rel: "preload", href: appCss, as: "style" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "canonical", href: "https://khajavisaffron.ir/" },
      
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "زعفران خواجوی",
          alternateName: "Khajavi Saffron",
          url: "https://khajavisaffron.ir",
          logo: "https://khajavisaffron.ir/favicon.png",
          description:
            "تولید و عرضه زعفران اصل قائنات؛ سرگل، نگین، دسته، نرمه و خشکبار با ضمانت کیفیت.",
          sameAs: [
            "https://instagram.com/khajavi.saffron111",
            "https://rubika.ir/saffron_khajavi",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <CartProvider>
      <ReopenCartFromUrl />
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <AnnouncementBar />
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <Toaster richColors position="top-center" />
        <FloatingContact />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

/**
 * When a route arrives with `?reopen=cart` (e.g. from /payment/failed),
 * open the cart drawer and strip the param so a refresh doesn't reopen it.
 */
function ReopenCartFromUrl() {
  const { open } = useCart();
  const location = useLocation();
  const router = useRouter();

  // location.search is the parsed query object in TanStack Router.
  const search = location.search as Record<string, unknown>;
  const reopen = search?.reopen;

  useEffect(() => {
    if (reopen !== "cart") return;
    open();
    router.navigate({
      to: location.pathname,
      search: (prev: Record<string, unknown>) => {
        const { reopen: _ignored, ...rest } = (prev ?? {}) as Record<string, unknown>;
        void _ignored;
        return rest;
      },
      replace: true,
    });
  }, [reopen, location.pathname, open, router]);

  return null;
}

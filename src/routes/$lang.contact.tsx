import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, Instagram, Send, MapPin } from "lucide-react";
import { UI } from "@/i18n/ui";
import { whatsappLink, type OtherLocale } from "@/i18n/locales";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/$lang/contact")({
  head: ({ params }) => {
    const t = UI[params.lang as OtherLocale] ?? UI.en;
    return pageHead({ path: "/contact", locale: params.lang, title: t.contact.title, description: t.contact.description });
  },
  component: LocaleContact,
});

function LocaleContact() {
  const lang = Route.useParams().lang as OtherLocale;
  const t = UI[lang];
  const c = t.contact;
  const items = [
    { icon: MessageCircle, label: c.whatsapp, value: "+98 915 049 4939", href: whatsappLink(t.product.orderMessage(t.brand)) },
    { icon: Phone, label: c.phone, value: "+98 915 049 4939", href: "tel:+989150494939" },
    { icon: Instagram, label: c.instagram, value: "@khajavi.saffron111", href: "https://instagram.com/khajavi.saffron111" },
    { icon: Send, label: c.rubika, value: "@saffron_khajavi", href: "https://rubika.ir/saffron_khajavi" },
  ];
  return (
    <div className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">{c.heading}</h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">{c.sub}</p>
        </header>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((i) => (
            <a
              key={i.label}
              href={i.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 transition hover:shadow-lg"
            >
              <i.icon className="size-6 text-[color:var(--brown-deep)]" />
              <div>
                <p className="text-xs text-muted-foreground">{i.label}</p>
                <p className="font-bold" dir="ltr">{i.value}</p>
              </div>
            </a>
          ))}
          <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 sm:col-span-2">
            <MapPin className="size-6 text-[color:var(--brown-deep)]" />
            <div>
              <p className="text-xs text-muted-foreground">{c.address}</p>
              <p className="font-bold">{c.addressValue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تماس با ما | زعفران خواجوی" },
      {
        name: "description",
        content:
          "راه‌های ارتباطی با زعفران خواجوی؛ آدرس، شماره تماس، ایمیل و فرم تماس برای پاسخگویی به سوالات و درخواست‌های شما.",
      },
      { property: "og:title", content: "تماس با زعفران خواجوی" },
      {
        property: "og:description",
        content: "ما همیشه آماده پاسخگویی به شما هستیم.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("پیام شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.");
      (e.target as HTMLFormElement).reset();
    }, 700);
  };

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <p className="font-display text-3xl text-[color:var(--brown-medium)]">contact us</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">تماس با ما</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/70 leading-7">
            خوشحال می‌شویم نظرات، پیشنهادات یا سوالات شما را بشنویم.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Info */}
          <div className="space-y-4">
            {[
              { icon: MapPin, title: "آدرس", value: "خراسان جنوبی، قائنات، بیهود، پلاک ۱۲" },
              { icon: Phone, title: "تماس مستقیم", value: "+۹۸ ۹۳۸ ۰۴۳ ۴۹۳۹", ltr: true },
              { icon: MessageCircle, title: "پیام‌رسان‌ها (واتساپ، تلگرام، روبیکا، ایتا، بله)", value: "+۹۸ ۹۱۵ ۰۴۹ ۴۹۳۹", ltr: true },
              { icon: Mail, title: "ایمیل", value: "info@khajavisaffron.ir", ltr: true },
              { icon: Instagram, title: "اینستاگرام", value: "Khajavi.saffron111", ltr: true, href: "https://instagram.com/khajavi.saffron111" },
              { icon: Send, title: "کانال روبیکا", value: "rubika.ir/saffron_khajavi", ltr: true, href: "https://rubika.ir/saffron_khajavi" },
              { icon: Clock, title: "ساعات کاری", value: "شنبه تا پنج‌شنبه، ۹ تا ۲۰" },
            ].map(({ icon: Icon, title, value, ltr, href }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[color:var(--saffron)]/15 text-[color:var(--brown-medium)]">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{title}</h3>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-sm text-foreground/75 hover:text-[color:var(--saffron)]"
                      dir={ltr ? "ltr" : undefined}
                      style={ltr ? { textAlign: "right" } : undefined}
                    >
                      {value}
                    </a>
                  ) : (
                    <p
                      className="mt-1 text-sm text-foreground/75"
                      dir={ltr ? "ltr" : undefined}
                      style={ltr ? { textAlign: "right" } : undefined}
                    >
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm aspect-[16/10]">
              <div
                className="grid h-full w-full place-items-center text-foreground/50"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(90,62,46,0.08) 0%, rgba(245,237,224,1) 100%)",
                }}
              >
                <div className="text-center">
                  <MapPin className="mx-auto size-8 text-[color:var(--brown-medium)]" />
                  <p className="mt-2 text-sm">نقشه موقعیت — قائنات، خراسان جنوبی</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-sm space-y-5"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                <Input id="name" required className="mt-1.5" placeholder="نام شما" />
              </div>
              <div>
                <Label htmlFor="phone">شماره تماس</Label>
                <Input id="phone" required className="mt-1.5" placeholder="۰۹۱۲ ۰۰۰ ۰۰۰۰" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" type="email" className="mt-1.5" placeholder="email@example.com" />
            </div>
            <div>
              <Label htmlFor="subject">موضوع</Label>
              <Input id="subject" required className="mt-1.5" placeholder="موضوع پیام" />
            </div>
            <div>
              <Label htmlFor="message">پیام شما</Label>
              <Textarea
                id="message"
                required
                rows={5}
                className="mt-1.5"
                placeholder="پیام خود را اینجا بنویسید..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--brown-deep)] px-6 py-3.5 text-sm font-bold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)] disabled:opacity-60"
            >
              <Send className="size-4" />
              {submitting ? "در حال ارسال..." : "ارسال پیام"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

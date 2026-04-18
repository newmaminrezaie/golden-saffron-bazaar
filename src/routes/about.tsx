import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, Hand, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "درباره ما | زعفران خواجوی" },
      {
        name: "description",
        content:
          "آشنایی با خانواده خواجوی، تولیدکننده زعفران اصل قائنات با بیش از سه نسل تجربه در پرورش طلای سرخ ایران.",
      },
      { property: "og:title", content: "درباره زعفران خواجوی" },
      {
        property: "og:description",
        content: "سه نسل تجربه در پرورش زعفران اصل قائنات.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ height: "55vh", minHeight: "360px", maxHeight: "560px" }}
      >
        <img
          src="https://images.unsplash.com/photo-1605478371310-9b78ee5fdcce?auto=format&fit=crop&w=1920&q=80"
          alt="مزرعه زعفران"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 45%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(42,26,10,0.35) 0%, rgba(42,26,10,0.15) 50%, hsl(37,54%,95%) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-12 text-center">
          <p className="font-display text-3xl md:text-4xl text-[color:var(--brown-medium)]">
            our heritage
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[color:var(--brown-deep)]">
            داستان زعفران خواجوی
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl space-y-5 text-base leading-9 text-foreground/85">
          <p>
            خانواده خواجوی بیش از سه نسل است که در دل خراسان جنوبی، در سرزمینی
            که آفتاب و خاکش بهترین زعفران جهان را پرورش می‌دهد، با عشق و دقت
            مشغول کاشت و برداشت طلای سرخ ایران است.
          </p>
          <p>
            ما باور داریم زعفران تنها یک ادویه نیست؛ میراثی است از فرهنگ، طبیعت
            و تلاش هزاران ساله. به همین دلیل از لحظه‌ی برداشت گل تا بسته‌بندی
            نهایی، تمام مراحل را با حساسیت و وسواس انجام می‌دهیم تا به دستان
            شما، زعفرانی اصل، تازه و خوش‌عطر برسد.
          </p>
          <p>
            هدف ما زنده نگه‌داشتن نام زعفران ایرانی در سفره‌های جهان است؛ با
            کیفیتی که شایسته نام قائنات باشد.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            { icon: Sprout, title: "کشت طبیعی", text: "بدون استفاده از کود و سموم شیمیایی، با روش‌های سنتی و پایدار." },
            { icon: Hand, title: "برداشت دستی", text: "هر گل با دستان کشاورزان زحمت‌کش ما در سپیده‌دم چیده می‌شود." },
            { icon: Sparkles, title: "کیفیت آزمایشگاهی", text: "تمام محصولات از نظر رنگ، عطر و طعم تست و تأیید می‌شوند." },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm"
            >
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-[color:var(--saffron)]/15 text-[color:var(--brown-medium)]">
                <Icon className="size-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-foreground/75">{text}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-[color:var(--brown-deep)] p-8 text-center text-[color:var(--parchment)]">
          <h3 className="text-xl md:text-2xl font-extrabold">
            طعم اصالت را تجربه کنید
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/75">
            با اعتماد به زعفران خواجوی، طعم خاطره‌انگیز سفره‌های ایرانی را به خانه بیاورید.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--saffron)] px-6 py-3 text-sm font-bold text-[color:var(--brown-deep)] transition hover:opacity-90"
          >
            مشاهده محصولات ←
          </Link>
        </div>
      </section>
    </div>
  );
}

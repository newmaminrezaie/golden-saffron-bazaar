import { Link } from "@tanstack/react-router";
import ownerWorking from "@/assets/owner-working.jpg";

export function FounderTeaser() {
  return (
    <section className="px-4 pb-16 md:pb-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        {/* Text first → on RTL desktop this sits opposite the AboutTeaser layout */}
        <div className="md:order-1">
          <p className="font-display text-3xl text-[color:var(--brown-medium)]">the founder</p>
          <h2 className="mt-1 text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
            مجید خواجوی
            <br />
            بنیان‌گذار مجموعه
          </h2>
          <p className="mt-5 text-base leading-9 text-foreground/80">
            مجید خواجوی، نسل سوم خانواده‌ای است که عمر خود را وقف پرورش زعفران
            قائنات کرده‌اند. او شخصاً بر تمام مراحل کار، از انتخاب پیاز و
            برداشت گل تا جداسازی کلاله و بسته‌بندی نهایی، نظارت می‌کند.
          </p>
          <p className="mt-3 text-base leading-9 text-foreground/80">
            باور او ساده است: زعفرانی که به دست شما می‌رسد باید همان زعفرانی
            باشد که خودش با افتخار سر سفره خانواده‌اش می‌گذارد.
          </p>
          <Link
            to="/about"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[color:var(--saffron)] px-6 py-3 text-sm font-bold text-[color:var(--brown-deep)] transition hover:opacity-90"
          >
            آشنایی با بنیان‌گذار ←
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-3xl shadow-xl aspect-[4/5] md:aspect-[5/6] md:order-2">
          <img
            src={ownerWorking}
            alt="مجید خواجوی در حال بسته‌بندی زعفران اصل قائنات"
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 35%" }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

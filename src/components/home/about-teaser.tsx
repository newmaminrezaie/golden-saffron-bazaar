import { Link } from "@tanstack/react-router";

export function AboutTeaser() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div className="relative overflow-hidden rounded-3xl shadow-xl aspect-[4/5] md:aspect-[5/6]">
          <img
            src="https://images.unsplash.com/photo-1605478371310-9b78ee5fdcce?auto=format&fit=crop&w=1200&q=80"
            alt="مزرعه زعفران قائنات"
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 35%" }}
            loading="lazy"
          />
        </div>
        <div>
          <p className="font-display text-3xl text-[color:var(--brown-medium)]">our story</p>
          <h2 className="mt-1 text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
            از دل مزارع قائنات،
            <br />
            تا سفره‌ی شما
          </h2>
          <p className="mt-5 text-base leading-9 text-foreground/80">
            خانواده خواجوی بیش از سه نسل است که در دل خراسان جنوبی، با عشق و
            دقت، ناب‌ترین زعفران ایرانی را پرورش می‌دهد. هر رشته از زعفران ما
            داستانی دارد از طلوع آفتاب، دستان پرمهر کشاورزان و عطر بی‌نظیر
            قائنات.
          </p>
          <Link
            to="/about"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[color:var(--brown-deep)] px-6 py-3 text-sm font-bold text-[color:var(--parchment)] transition hover:bg-[color:var(--brown-medium)]"
          >
            بیشتر درباره ما بدانید ←
          </Link>
        </div>
      </div>
    </section>
  );
}

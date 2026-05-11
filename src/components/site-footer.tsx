import { Link } from "@tanstack/react-router";
import {
  Instagram,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import khajaviEmblem from "@/assets/khajavi-emblem.png";
import samandehiSeal from "@/assets/samandehi.png";
import storefront from "@/assets/storefront.jpg";
import { EnamadSeal } from "@/components/enamad-seal";

export function SiteFooter() {
  return (
    <footer className="relative mt-16 border-t border-border/60 bg-[color:var(--brown-deep)] text-[color:var(--parchment)]">
      <img
        src={khajaviEmblem}
        alt="زعفران خواجوی"
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[35%] h-24 md:h-28 w-auto z-10 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 85%)",
          maskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 85%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-32 md:pt-36 pb-10 grid gap-10 md:gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-sm leading-7 text-white/75 mb-6">
            زعفران ممتاز و اصل قائنات،<br />
            با ضمانت کیفیت و عطر بی‌نظیر؛<br />
            از مزرعه تا سفره شما.
          </p>
          <h4 className="text-base font-bold tracking-tight mb-4 mt-2 text-white">دسترسی سریع</h4>
          <ul className="list-none p-0 m-0 space-y-2.5 text-sm leading-7 text-white/80">
            <li><Link to="/" className="hover:text-[color:var(--saffron)]">خانه</Link></li>
            <li><Link to="/shop" search={{ category: "همه" }} className="hover:text-[color:var(--saffron)]">فروشگاه</Link></li>
            <li><Link to="/blog" className="hover:text-[color:var(--saffron)]">مقالات</Link></li>
            <li><Link to="/about" className="hover:text-[color:var(--saffron)]">درباره ما</Link></li>
            <li><Link to="/contact" className="hover:text-[color:var(--saffron)]">تماس با ما</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-base font-bold tracking-tight mb-4 text-white">دسته‌بندی‌ها</h4>
          <ul className="list-none p-0 m-0 space-y-2.5 text-sm leading-7 text-white/80">
            <li>زعفران سرگل</li>
            <li>زعفران نگین</li>
            <li>زعفران پوشال</li>
            <li>پودر زعفران</li>
            <li>بسته‌های هدیه</li>
            <li>خشکبار</li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-base font-bold tracking-tight mb-4 text-white">تماس با ما</h4>
          <ul className="list-none p-0 m-0 space-y-2.5 text-sm leading-7 text-white/80">
            <li className="flex items-start gap-2"><MapPin className="size-4 mt-1 shrink-0" /><span>خراسان جنوبی، قائنات، بیهود</span></li>
            <li className="flex items-center gap-2"><Phone className="size-4 shrink-0" /><span>۰۹۳۸ ۰۴۳ ۴۹۳۹</span></li>
            <li className="flex items-start gap-2"><MessageCircle className="size-4 mt-1 shrink-0" /><span>واتساپ / تلگرام / روبیکا / ایتا<br /> / بله: <span dir="ltr">+۹۸ ۹۱۵ ۰۴۹ ۴۹۳۹</span></span></li>
            <li className="flex items-center gap-2"><Mail className="size-4 shrink-0" /><span dir="ltr">info@khajavisaffron.ir</span></li>
            <li>
              <a
                href="https://instagram.com/khajavi.saffron111"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[color:var(--saffron)]"
              >
                <Instagram className="size-4 shrink-0" /><span>Khajavi.saffron111</span>
              </a>
            </li>
            <li>
              <a
                href="https://rubika.ir/saffron_khajavi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[color:var(--saffron)]"
              >
                <MessageCircle className="size-4 shrink-0" /><span>کانال روبیکا</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-base font-bold tracking-tight mb-4 text-white">نمادهای اعتماد</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/95 rounded-xl border border-white/10 p-2 w-full aspect-square flex items-center justify-center shadow-sm hover:bg-white transition [&_a]:block [&_a]:w-full [&_a]:h-full [&_a]:flex [&_a]:items-center [&_a]:justify-center [&_img]:max-w-full [&_img]:max-h-full">
              <EnamadSeal />
            </div>
            <a
              href="https://emalls.ir/Shop/77208/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="نشان اعتباری ایمالز"
              className="bg-white/95 rounded-xl border border-white/10 p-2 w-full aspect-square flex items-center justify-center shadow-sm hover:bg-white transition"
            >
              <img
                referrerPolicy="origin"
                src="https://service.emalls.ir/neshan?id=77208"
                alt="نشان اعتباری ایمالز"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </a>
            <a
              href="https://samandehi.ir"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="نماد ساماندهی"
              className="bg-white/95 rounded-xl border border-white/10 p-2 w-full aspect-square flex items-center justify-center shadow-sm hover:bg-white transition"
            >
              <img
                src={samandehiSeal}
                alt="نماد ساماندهی"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-8 grid gap-5 md:gap-8 md:grid-cols-[180px_1fr] items-center">
          <div className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 aspect-[4/3] w-40 md:w-44">
            <img
              src={storefront}
              alt="ویترین فروشگاه زعفران خواجوی"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h4 className="text-base font-bold tracking-tight mb-2 text-white">درباره فروشگاه</h4>
            <p className="text-sm leading-8 text-white/75 max-w-2xl">
              فروشگاه زعفران خواجوی از سال ۸۹ در قائن و گناباد تأسیس شد و از آن پس به ارائه خدمات در زمینه زعفران و خشکبار در خراسان رضوی پرداخت.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-5 text-center text-xs text-white/60">
          © {new Date().getFullYear()} زعفران خواجوی — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}

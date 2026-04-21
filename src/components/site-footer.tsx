import { Link } from "@tanstack/react-router";
import { Instagram, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { BrandLockup } from "./brand/brand-lockup";

export function SiteFooter() {
  return (
    <footer className="relative mt-16 border-t border-border/60 bg-[color:var(--brown-deep)] text-[color:var(--parchment)]">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-[color:var(--brown-deep)] px-4 z-10">
        <BrandLockup variant="footer" />
      </div>
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-16 pb-12 grid gap-10 md:grid-cols-3">
        <div>
          <p className="text-sm leading-7 text-white/75">
            زعفران ممتاز و اصل قائنات، با ضمانت کیفیت و عطر بی‌نظیر؛ از مزرعه تا سفره شما.
          </p>
        </div>

        <div>
          <h4 className="text-base font-bold mb-4">دسترسی سریع</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/" className="hover:text-[color:var(--saffron)]">خانه</Link></li>
            <li><Link to="/shop" className="hover:text-[color:var(--saffron)]">فروشگاه</Link></li>
            <li><Link to="/about" className="hover:text-[color:var(--saffron)]">درباره ما</Link></li>
            <li><Link to="/contact" className="hover:text-[color:var(--saffron)]">تماس با ما</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-base font-bold mb-4">دسته‌بندی‌ها</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>زعفران سرگل</li>
            <li>زعفران نگین</li>
            <li>زعفران پوشال</li>
            <li>پودر زعفران</li>
            <li>بسته‌های هدیه</li>
          </ul>
        </div>

        <div>
          <h4 className="text-base font-bold mb-4">تماس با ما</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2"><MapPin className="size-4 mt-0.5 shrink-0" /> خراسان جنوبی، قائنات، بیهود</li>
            <li className="flex items-center gap-2" dir="ltr"><Phone className="size-4" /> +۹۸ ۹۳۸ ۰۴۳ ۴۹۳۹</li>
            <li className="flex items-start gap-2"><MessageCircle className="size-4 mt-0.5 shrink-0" /><span>واتساپ / تلگرام / روبیکا / ایتا / بله: <span dir="ltr">+۹۸ ۹۱۵ ۰۴۹ ۴۹۳۹</span></span></li>
            <li className="flex items-center gap-2" dir="ltr"><Mail className="size-4" /> info@khajavisaffron.ir</li>
            <li>
              <a
                href="https://instagram.com/khajavi.saffron111"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[color:var(--saffron)]"
              >
                <Instagram className="size-4" /> Khajavi.saffron111
              </a>
            </li>
            <li>
              <a
                href="https://rubika.ir/saffron_khajavi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[color:var(--saffron)]"
              >
                <MessageCircle className="size-4" /> کانال روبیکا
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-5 text-center text-xs text-white/60">
          © {new Date().getFullYear()} زعفران خواجوی — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}

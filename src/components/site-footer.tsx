import { Link } from "@tanstack/react-router";
import {
  Instagram,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Award,
  BadgeCheck,
} from "lucide-react";
import khajaviEmblem from "@/assets/khajavi-emblem.png";

export function SiteFooter() {
  return (
    <footer className="relative mt-16 border-t border-border/60 bg-[color:var(--brown-deep)] text-[color:var(--parchment)]">
      <img
        src={khajaviEmblem}
        alt="زعفران خواجوی"
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[18%] h-28 md:h-32 w-auto z-10 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 85%)",
          maskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 85%)",
        }}
      />
      <div className="w-full px-6 md:px-12 pt-40 md:pt-48 pb-12 grid gap-10 md:gap-12 md:grid-cols-4">
        <div className="-mr-6 md:-mr-12">
          <p className="text-sm leading-7 text-white/75 mb-6">
            زعفران ممتاز و اصل قائنات، با ضمانت کیفیت و عطر بی‌نظیر؛ از مزرعه تا سفره شما.
          </p>
          <h4 className="text-base font-bold mb-4 text-white">دسترسی سریع</h4>
          <ul className="list-none p-0 m-0 space-y-2 text-sm leading-7 text-white/80">
            <li><Link to="/" className="hover:text-[color:var(--saffron)]">خانه</Link></li>
            <li><Link to="/shop" className="hover:text-[color:var(--saffron)]">فروشگاه</Link></li>
            <li><Link to="/about" className="hover:text-[color:var(--saffron)]">درباره ما</Link></li>
            <li><Link to="/contact" className="hover:text-[color:var(--saffron)]">تماس با ما</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-base font-bold mb-4 text-white">دسته‌بندی‌ها</h4>
          <ul className="list-none p-0 m-0 space-y-2 text-sm leading-7 text-white/80">
            <li>زعفران سرگل</li>
            <li>زعفران نگین</li>
            <li>زعفران پوشال</li>
            <li>پودر زعفران</li>
            <li>بسته‌های هدیه</li>
            <li>خشکبار</li>
          </ul>
        </div>

        <div>
          <h4 className="text-base font-bold mb-4 text-white">تماس با ما</h4>
          <ul className="list-none p-0 m-0 space-y-3 text-sm leading-7 text-white/80">
            <li className="flex items-start gap-2"><MapPin className="size-4 mt-1 shrink-0" /><span>خراسان جنوبی، قائنات، بیهود</span></li>
            <li className="flex items-center gap-2"><Phone className="size-4 shrink-0" /><span dir="ltr">+۹۸ ۹۳۸ ۰۴۳ ۴۹۳۹</span></li>
            <li className="flex items-start gap-2"><MessageCircle className="size-4 mt-1 shrink-0" /><span>واتساپ / تلگرام / روبیکا / ایتا / بله: <span dir="ltr">+۹۸ ۹۱۵ ۰۴۹ ۴۹۳۹</span></span></li>
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

        <div className="-ml-6 md:-ml-12">
          <h4 className="text-base font-bold mb-4 text-white">نمادهای اعتماد</h4>
          <div className="flex flex-col gap-3 items-start text-left">
            {[
              { Icon: ShieldCheck, label: "eNAMAD.ir", sub: "جهت اطمینان کلیک نمایید", aria: "نماد اعتماد الکترونیکی" },
              { Icon: Award, label: "Emalls", sub: "مرجع خرید آنلاین", aria: "ایمالز" },
              { Icon: BadgeCheck, label: "samandehi.ir", sub: "ساماندهی", aria: "ساماندهی" },
            ].map(({ Icon, label, sub, aria }) => (
              <a
                key={label}
                href="#"
                aria-label={aria}
                className="bg-white/95 rounded-xl border border-white/10 p-2 w-24 h-24 flex flex-col items-center justify-center text-center shadow-sm text-[color:var(--brown-deep)] hover:bg-white transition"
              >
                <Icon className="size-6 mb-1" />
                <span className="text-[11px] font-bold leading-tight" dir="ltr">{label}</span>
                <span className="text-[10px] leading-tight text-[color:var(--brown-deep)]/70">{sub}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="w-full px-6 md:px-12 py-5 text-center text-xs text-white/60">
          © {new Date().getFullYear()} زعفران خواجوی — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}

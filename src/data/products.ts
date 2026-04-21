import productP1 from "@/assets/product-p1.jpg";
import productP2 from "@/assets/product-p2.png";
import productP3 from "@/assets/product-p3.jpg";
import productP4 from "@/assets/product-p4.jpeg";

/* ============================================================================
 * HOW TO EDIT / ADD PRODUCTS
 * ----------------------------------------------------------------------------
 * Everything about the catalog lives in this file. No CMS, no database.
 *
 * To CHANGE a price/title/weight/badge:
 *   Find the product object below and edit the field. Save. Done.
 *
 * To CHANGE or ADD images for a product:
 *   Edit its `images: [...]` array. The FIRST item is the cover/thumbnail.
 *   Additional items show on hover (desktop) / touch (mobile) on the card,
 *   and as a gallery on the single-product page.
 *   - Local image: `import myImg from "@/assets/my-image.jpg"` at the top,
 *     then put `myImg` in the array.
 *   - Remote image: just paste the URL string.
 *
 * To ADD a new product:
 *   Copy this template into the PRODUCTS array, give it a UNIQUE `id`/`slug`,
 *   and fill in the fields. It will automatically appear in the shop, in its
 *   category filter, and get its own page at /shop/<slug>.
 *
 *   {
 *     id: "p13",
 *     slug: "p13",
 *     name: "نام محصول",
 *     category: "زعفران سرگل",          // must match a value in CATEGORIES
 *     weight: "۱ گرم",
 *     price: 300000,                    // تومان
 *     // oldPrice: 350000,              // optional, shows strike-through
 *     images: [
 *       "https://example.com/main.jpg", // first = cover
 *       "https://example.com/alt.jpg",
 *     ],
 *     // badge: "جدید",                 // optional pill (پرفروش / جدید / …)
 *     // shortDescription: "یک خط توضیح کوتاه برای کارت و متادیتا.",
 *     // description: "متن بلند چندخطی...\n\nپاراگراف دوم...",
 *     // highlights: ["برداشت ۱۴۰۳", "بسته‌بندی خلأ", "گواهی آزمایشگاه"],
 *     // inStock: true,                 // defaults true
 *   },
 * ========================================================================== */

export type Product = {
  /** Stable unique id. Also used as URL slug by default. */
  id: string;
  /** URL-friendly slug for /shop/<slug>. Usually equals `id`. */
  slug: string;
  name: string;
  /** Must match one of CATEGORIES (excluding "همه"). */
  category: string;
  weight: string;
  /** Price in تومان. */
  price: number;
  /** Optional original price (shows strike-through if set). */
  oldPrice?: number;
  /** First image is the cover. Additional images cycle on hover/touch. */
  images: string[];
  /** Optional pill on the card (e.g. "پرفروش", "جدید"). */
  badge?: string;
  /** One-liner used on cards and meta tags. */
  shortDescription?: string;
  /** Long-form description shown on the single-product page. Supports \n\n for paragraphs. */
  description?: string;
  /** Bullet points (origin, harvest, certifications, …) on the single-product page. */
  highlights?: string[];
  /** Defaults to true if omitted. */
  inStock?: boolean;
};

export const CATEGORIES = [
  "همه",
  "زعفران سرگل",
  "زعفران نگین",
  "زعفران پوشال",
  "پودر زعفران",
  "بسته‌های هدیه",
  "عمده‌فروشی",
  "خشکبار",
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "p1",
    name: "زعفران سرگل ممتاز",
    category: "زعفران سرگل",
    weight: "۱ مثقال (۴.۶ گرم)",
    price: 1280000,
    oldPrice: 1450000,
    images: [productP1],
    badge: "پرفروش",
    shortDescription: "زعفران سرگل ممتاز قائنات، رنگ و عطر فوق‌العاده.",
    description:
      "زعفران سرگل ممتاز ما از مزارع منتخب قائنات برداشت شده و بدون افزودنی به دست شما می‌رسد.\n\nرنگ‌دهی بالا، عطر طبیعی و طعم گرم؛ مناسب برای آشپزی روزمره و مناسبت‌های ویژه.",
    highlights: ["برداشت پاییز ۱۴۰۳", "بدون ریشه و افزودنی", "بسته‌بندی خلأ"],
  },
  {
    id: "p2",
    slug: "p2",
    name: "زرشک پفکی قائنات",
    category: "خشکبار",
    weight: "۲ گرم",
    price: 720000,
    images: [productP2],
  },
  {
    id: "p3",
    slug: "p3",
    name: "زعفران پوشال ممتاز",
    category: "زعفران پوشال",
    weight: "۴.۶ گرم",
    price: 980000,
    images: [productP3],
    shortDescription: "پوشال ممتاز با کلاله بلند و رنگ‌دهی عالی.",
  },
  {
    id: "p4",
    slug: "p4",
    name: "زعفران کادویی ظرف چوبی",
    category: "پودر زعفران",
    weight: "۱ گرم",
    price: 320000,
    images: [productP4],
    badge: "جدید",
  },
  {
    id: "p5",
    slug: "p5",
    name: "جعبه هدیه چوبی زعفران",
    category: "بسته‌های هدیه",
    weight: "۴.۶ گرم",
    price: 1850000,
    images: [
      "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "پیشنهاد ویژه",
    shortDescription: "جعبه هدیه چوبی شکیل، مناسب برای هدیه‌های رسمی.",
    description:
      "جعبه‌ای نفیس از جنس چوب طبیعی که زعفران ممتاز را در دل خود جای داده است.\n\nانتخابی شایسته برای هدیه به مهمانان، شرکا و عزیزان.",
    highlights: ["جعبه چوب طبیعی", "زعفران سرگل ممتاز", "کارت تبریک قابل سفارشی‌سازی"],
  },
  {
    id: "p6",
    slug: "p6",
    name: "زعفران سرگل ۱ گرمی",
    category: "زعفران سرگل",
    weight: "۱ گرم",
    price: 290000,
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "p7",
    slug: "p7",
    name: "زعفران نگین ۴.۶ گرمی",
    category: "زعفران نگین",
    weight: "۱ مثقال",
    price: 1380000,
    oldPrice: 1500000,
    images: [
      "https://images.unsplash.com/photo-1600326145552-327c4df2c246?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "p8",
    slug: "p8",
    name: "بسته خانوار زعفران",
    category: "بسته‌های هدیه",
    weight: "۹.۲ گرم",
    price: 2680000,
    images: [
      "https://images.unsplash.com/photo-1593411739928-b71fea83f7ef?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "p9",
    slug: "p9",
    name: "پودر زعفران ۲ گرمی",
    category: "پودر زعفران",
    weight: "۲ گرم",
    price: 610000,
    images: [
      "https://images.unsplash.com/photo-1606756790138-261d2b21cd75?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "p10",
    slug: "p10",
    name: "زعفران پوشال ۲ گرمی",
    category: "زعفران پوشال",
    weight: "۲ گرم",
    price: 480000,
    images: [
      "https://images.unsplash.com/photo-1542990253-0b8be07d56c3?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "p11",
    slug: "p11",
    name: "زعفران فله عمده",
    category: "عمده‌فروشی",
    weight: "۱۰۰ گرم",
    price: 28500000,
    images: [
      "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "عمده",
  },
  {
    id: "p12",
    slug: "p12",
    name: "جعبه نفیس زعفران",
    category: "بسته‌های هدیه",
    weight: "۲ مثقال",
    price: 3200000,
    images: [
      "https://images.unsplash.com/photo-1571197119282-7c4b1a44b3a3?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "p13",
    slug: "p13",
    name: "زرشک پفکی",
    category: "خشکبار",
    weight: "۲۵۰ گرم",
    price: 320000,
    images: [productP2],
    shortDescription: "زرشک پفکی درشت و خوش‌رنگ قائنات، بدون افزودنی.",
    description:
      "زرشک پفکی ما از باغ‌های منتخب قائنات برداشت و با دقت پاک‌سازی شده است.\n\nمناسب برای زرشک‌پلو، خورش‌ها و تزئین غذا؛ رنگ سرخ طبیعی و طعم ترش دلپذیر.",
    highlights: ["محصول قائنات", "بدون شن و افزودنی", "بسته‌بندی بهداشتی"],
  },
  {
    id: "p14",
    slug: "p14",
    name: "توت خشک",
    category: "خشکبار",
    weight: "۲۵۰ گرم",
    price: 280000,
    images: [
      "https://images.unsplash.com/photo-1591287083773-9a5c8b2bb6f3?auto=format&fit=crop&w=800&q=80",
    ],
    shortDescription: "توت خشک شیرین و طبیعی، جایگزین سالم قند.",
    description:
      "توت خشک مرغوب با شیرینی طبیعی، خشک‌شده در سایه برای حفظ طعم و ارزش غذایی.\n\nمناسب برای میان‌وعده، چای و دسرهای سنتی.",
    highlights: ["شیرینی طبیعی", "بدون شکر افزوده", "خشک‌شده در سایه"],
  },
  {
    id: "p15",
    slug: "p15",
    name: "برگه زردآلو",
    category: "خشکبار",
    weight: "۲۵۰ گرم",
    price: 350000,
    images: [
      "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=800&q=80",
    ],
    shortDescription: "برگه زردآلوی نرم و خوش‌طعم از باغات آذربایجان.",
    description:
      "برگه زردآلو از میوه‌های رسیده و آفتاب‌خشک تهیه شده و طعم و عطر طبیعی خود را حفظ کرده است.\n\nمنبع غنی فیبر و پتاسیم؛ مناسب برای کمپوت، خورش و میان‌وعده.",
    highlights: ["آفتاب‌خشک طبیعی", "بدون گوگرد افزوده", "بسته‌بندی بهداشتی"],
  },
];

export const formatToman = (n: number) =>
  new Intl.NumberFormat("fa-IR").format(n) + " تومان";

export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

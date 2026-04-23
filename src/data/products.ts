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
 * VOLUME / TIERED PRICING (optional):
 *   Add a `priceTiers` array to let customers pick different quantities on the
 *   product detail page (e.g., ۱ گرم / ۲ گرم / ۵ گرم / ۱۰ گرم).
 *   Example:
 *     priceTiers: [
 *       { quantity: 1, price: 190000 },   // base — MUST match `price` below
 *       { quantity: 2, price: 360000 },
 *       { quantity: 5, price: 850000 },
 *       { quantity: 10, price: 1650000 },
 *     ]
 *   ⚠️ INVARIANT: priceTiers[0].price MUST equal the product's `price` field
 *     (and priceTiers[0].quantity should be the base/unit quantity for the
 *     product). The savings percentage on the page is computed by comparing
 *     each tier's per-gram rate to priceTiers[0]'s per-gram rate, so this
 *     must stay in sync. A dev-only console.warn fires if they mismatch.
 * ========================================================================== */

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  weight: string;
  price: number;
  oldPrice?: number;
  images: string[];
  badge?: string;
  shortDescription?: string;
  description?: string;
  highlights?: string[];
  inStock?: boolean;
  /**
   * Optional volume pricing. priceTiers[0] MUST mirror `price` exactly
   * (same base quantity + same total price). See HOW-TO header above.
   */
  priceTiers?: { quantity: number; price: number; label?: string }[];
};

export const CATEGORIES = [
  "همه",
  "زعفران نگین",
  "زعفران دسته",
  "ریشه زعفران",
  "زعفران نرمه",
  "خشکبار",
  "دمنوش و چای",
  "عمده‌فروشی",
] as const;

export const PRODUCTS: Product[] = [
  // ── زعفران نگین ──────────────────────────────────────────────────────────
  {
    id: "p-450",
    slug: "zafaran-negin-1-mesqal",
    name: "زعفران نگین (۴.۶ گرمی)",
    category: "زعفران نگین",
    weight: "۱ مثقال (۴.۶۰۸ گرم)",
    price: 910000,
    oldPrice: 1300000,
    images: [
      "/images/negin1.webp",
      "/images/Negin1-2.webp",
      "/images/Negin1-3.webp",
    ],
    badge: "پرفروش",
    shortDescription: "زعفران نگین طبیعی گناباد، کشت شده در بهترین مزارع خراسان. برداشت آبان ۱۴۰۴، تمام قرمز و پرعطر.",
    description:
      "زعفران نگین طبیعی، طلای سرخ ایران و یکی از ارزشمندترین فرآورده‌های طبیعی دنیاست که نه‌تنها جلوه‌ای خاص به سفره‌های ایرانی می‌بخشد، بلکه به‌عنوان یک داروی طبیعی نیز شناخته می‌شود.\n\nاین نوع زعفران با رشته‌های کاملاً قرمز، ضخیم، صاف و بدون بخش زرد، بالاترین درجه خلوص و کیفیت را دارد. ترکیبات فعال آن سرشار از آنتی‌اکسیدان‌ها، مواد ضدالتهاب و عناصر تقویت‌کننده بدن است.",
    highlights: [
      "کشت شده در گناباد",
      "برداشت آبان ۱۴۰۴ — امسالی و تازه",
      "خشک شده به روش سنتی",
      "بسته‌بندی ساده بدون نام — قابل دوباره‌فروشی",
    ],
  },
  {
    id: "p-807",
    slug: "zafaran-negin-1gram",
    name: "زعفران نگین (۱ گرمی)",
    category: "زعفران نگین",
    weight: "۱ گرم",
    price: 190000,
    oldPrice: 250000,
    images: [
      "/images/1gramNegin1.webp",
      "/images/1gramNegin2.webp",
      "/images/Negin-kilo-second.webp",
    ],
    shortDescription: "زعفران نگین سوپر صادراتی، امسالی و تازه، تمام قرمز. مناسب برای خرید تک‌نفره.",
    priceTiers: [
      { quantity: 1, price: 190000 },
      { quantity: 2, price: 360000 },
      { quantity: 5, price: 850000 },
      { quantity: 10, price: 1650000 },
    ],
    description:
      "زعفران نگین گناباد؛ عطر و رنگی که از دل کویر می‌آید.\n\nاگر به‌دنبال خرید زعفران اصل با بالاترین قدرت رنگ‌دهی هستید، زعفران نگین گناباد انتخابی است که هیچ سرآشپز یا کدبانویی از آن نمی‌گذرد. این محصول که حاصل دسترنج کشاورزان خطه کویری گناباد است، با دقت فراوان پاک شده و تنها شامل کلاله‌های درشت و قرمز رنگ (بدون ذره‌ای خامه یا زردی) است.",
    highlights: [
      "کیفیت صادراتی — قلم‌های درشت نگین درجه یک",
      "رنگ‌دهی خیره‌کننده",
      "امسالی ۱۴۰۴ و تازه",
      "خشک شده به روش طبیعی و سنتی",
    ],
  },
  {
    id: "p-598",
    slug: "zafaran-supernegin-choobi",
    name: "زعفران سوپرنگین ظرف چوبی",
    category: "زعفران نگین",
    weight: "۱ مثقال (۴.۶۰۸ گرم)",
    price: 1100000,
    oldPrice: 1250000,
    images: [
      "/images/final-wooden1-UltraPic.webp",
      "/images/finalwooden22-1.webp",
      "/images/wood2jpg.webp",
      "/images/wooden4-rotated.webp",
    ],
    badge: "هدیه ویژه",
    shortDescription: "زعفران نگین ۱۴۰۴ در ظرف خاتم داخل جعبه چوبی. قلم درشت و تمام قرمز. مناسب هدیه.",
    description:
      "زعفران قلم درشت که برای صادرات به چین و بقیه کشورها استفاده می‌شود. این بسته‌ها به خاطر بسته‌بندی چوبی ظریف و ظرف خاتم داخل آن با طرح‌های ایرانی، پرچمدار فرهنگ و اصالت زعفران ایرانی می‌باشد.",
    highlights: [
      "ظرف خاتم‌کاری ایرانی",
      "جعبه چوبی ظریف",
      "زعفران نگین ۱۴۰۴ خشک شده صنعتی",
      "بدون نشانی — قابل دوباره‌فروشی",
    ],
  },
  {
    id: "p-622",
    slug: "zafaran-supernegin-gerd",
    name: "زعفران سوپرنگین ظرف گرد",
    category: "زعفران نگین",
    weight: "۱ مثقال (۴.۶۰۸ گرم)",
    price: 930000,
    images: [
      "/images/Round1-F.webp",
      "/images/roundNegin2-F.webp",
      "/images/zarfnegin.webp",
    ],
    shortDescription: "زعفران نگین گناباد در ظرف گرد فلزی. برداشت آبان ۱۴۰۴، خشک شده سنتی.",
    description:
      "زعفران نگین یکی از باکیفیت‌ترین و مرغوب‌ترین انواع زعفران ایرانی است که به دلیل ظاهر درشت، رشته‌های کاملاً سالم، رنگ‌دهی بالا و عطر غنی، در بازارهای داخلی و صادراتی جایگاه ویژه‌ای دارد.\n\nزعفران نگین عمدتاً از مناطق ممتاز کشت زعفران مانند قائن و گناباد به دست می‌آید.",
    highlights: [
      "کشت شده در گناباد",
      "برداشت آبان ۱۴۰۴",
      "خشک شده سنتی",
      "بدون نشانی — قابل دوباره‌فروشی",
    ],
  },
  {
    id: "p-762",
    slug: "zafaran-supernegin-makhmal",
    name: "زعفران سوپرنگین جعبه مخمل",
    category: "زعفران نگین",
    weight: "۱ مثقال (۴.۶۰۸ گرم)",
    price: 1030000,
    oldPrice: 1200000,
    images: [
      "/images/redbox1.webp",
      "/images/redbox2.webp",
      "/images/redbox3.webp",
    ],
    badge: "لوکس",
    shortDescription: "زعفران نگین ۱۴۰۴ در ظرف خاتم داخل جعبه مخملی قرمز. هدیه‌ای شایسته برای عزیزان.",
    description:
      "زعفران قائنات اعلا: درخشش طلای سرخ در پوششی مخملین.\n\nتجربه‌ای فراتر از یک چاشنی؛ این زعفران قائنات اصل، نمادی از اصالت و کیفیت برتر خراسان است. ما بهترین کلاله‌های دست‌چین شده را در یک بسته‌بندی لوکس مخملی و قوطی خاتم‌کاری شده جای داده‌ایم تا نه تنها عطر و طعم جادویی آن حفظ شود، بلکه هدیه‌ای شایسته برای عزیزانتان باشد.",
    highlights: [
      "جعبه مخمل قرمز با یراق‌آلات طلایی",
      "ظرف خاتم ایرانی",
      "زعفران نگین ۱۴۰۴ اعلا",
      "کیفیت صادراتی",
    ],
  },
  {
    id: "p-768",
    slug: "zafaran-supernegin-khatam",
    name: "زعفران سوپرنگین ظرف خاتم",
    category: "زعفران نگین",
    weight: "۱ مثقال (۴.۶۰۸ گرم)",
    price: 1200000,
    images: [
      "/images/Khatam1.webp",
      "/images/Khatam-negin-second.webp",
      "/images/Khatam3.webp",
    ],
    shortDescription: "زعفران نگین امسالی در ظرف فلزی طرح ایرانی خاتم. بدون نشانی، قابل دوباره‌فروشی.",
    description:
      "زعفران نگین قائنات؛ عطر و رنگی که تکرار نمی‌شود.\n\nاگر به دنبال اوج کیفیت در دنیای طلای سرخ هستید، این زعفران نگین چیده شده از مزارع درخشان خراسان، همان چیزی است که سفره شما کم دارد. ما خالص‌ترین نوع زعفران قائنات را در ظرف‌های فلزی با طرح اصیل خاتم بسته‌بندی کرده‌ایم تا اصالت هنر ایرانی با کیفیت جهانی پیوند بخورد.",
    highlights: [
      "۱۰۰٪ زعفران نگین اعلا — بدون زردی و شکستگی",
      "ظرف فلزی طرح خاتم ایرانی",
      "دست‌چین شده از برترین مزارع قائنات",
      "بدون نشانی — قابل دوباره‌فروشی",
    ],
  },

  // ── زعفران دسته ──────────────────────────────────────────────────────────
  {
    id: "p-617",
    slug: "zafaran-daste",
    name: "زعفران دسته / دخترپیچ (۴.۶ گرمی)",
    category: "زعفران دسته",
    weight: "۱ مثقال (۴.۶۰۸ گرم)",
    price: 710000,
    oldPrice: 850000,
    images: [
      "/images/Daste1bgF.webp",
      "/images/Dasteh22-1.webp",
      "/images/Daste2F.webp",
      "/images/azarDasteh2.webp",
    ],
    shortDescription: "زعفران دسته (دخترپیچ) قائنات — کامل‌ترین و اصیل‌ترین نوع زعفران. شامل رشته کامل (کلاله + خامه).",
    description:
      "زعفران دسته یا دخترپیچ قائنات کامل‌ترین و اصیل‌ترین نوع زعفران است که شامل رشته کامل زعفران (کلاله + خامه) می‌باشد و بدون هیچ‌گونه جداسازی یا فرآوری اضافی، به همان شکل طبیعی برداشت و خشک می‌شود.\n\nاین نوع زعفران به دلیل حفظ کامل ساختار گل، عطر قوی‌تر، طعم طبیعی‌تر و ماندگاری بالاتر نسبت به انواع بریده‌شده دارد.",
    highlights: [
      "کشت شده در گناباد",
      "برداشت آبان ۱۴۰۴ — امسالی و تازه",
      "خشک شده به روش سنتی",
      "بدون برند و نشانی — قابل دوباره‌فروشی",
    ],
  },

  // ── ریشه زعفران ──────────────────────────────────────────────────────────
  {
    id: "p-613",
    slug: "rishe-zafaran",
    name: "ریشه زعفران (۲.۳ گرمی)",
    category: "ریشه زعفران",
    weight: "نیم مثقال (۲.۳ گرم)",
    price: 130000,
    oldPrice: 150000,
    images: [
      "/images/Sefid1Final.webp",
      "/images/Sefid2Final.webp",
      "/images/Sefid4.webp",
      "/images/photo24048804436.webp",
    ],
    shortDescription: "ریشه زعفران گناباد — سرشار از آنتی‌اکسیدان. انتخابی اقتصادی برای دمنوش و آشپزی.",
    description:
      "این محصول دارای عطر و طعمی بسیار نزدیک به زعفران اصل بوده و سرشار از ترکیبات آنتی‌اکسیدانی مفید برای حفظ سلامت بدن است. انتخابی اقتصادی و کاربردی برای استفاده در انواع غذاها، دمنوش‌ها و فرمولاسیون‌های گیاهی به شمار می‌رود. این محصول کاملاً طبیعی و بدون هیچ‌گونه افزودنی شیمیایی عرضه می‌شود.",
    highlights: [
      "کشت شده در گناباد، خراسان رضوی",
      "برداشت آبان ۱۴۰۴ — امسالی و تازه",
      "خشک شده به روش سنتی",
      "وزن خالص نیم مثقال (۲.۳ گرم)",
    ],
  },

  // ── زعفران نرمه ──────────────────────────────────────────────────────────
  {
    id: "p-821",
    slug: "zafaran-narmeh",
    name: "زعفران نرمه (۴.۶ گرمی)",
    category: "زعفران نرمه",
    weight: "۱ مثقال (۴.۶۰۸ گرم)",
    price: 320000,
    oldPrice: 400000,
    images: [
      "/images/narmeh11.webp",
      "/images/narmeh2.webp",
      "/images/narmeh3.webp",
    ],
    shortDescription: "زعفران نرمه آشپزخانه‌ای، مناسب رستوران‌ها، بستنی‌فروشی‌ها و دمنوش. وکیوم یک مثقالی.",
    description:
      "زعفران نرمه یا آشپزخانه با قیمت ارزان مناسب آشپزخانه‌ها، بستنی‌فروشی‌ها و دمنوش است. این محصول در بسته یک مثقالی وکیوم شده تقدیم شما می‌شود.\n\nزعفران نرمه از باقی‌مانده زعفران نگین و ریشه زعفران ساخته می‌شود. این محصول خواص دارویی بالایی دارد. چاشنی‌دهنده به غذا یا عطردهنده به نوشیدنی دم‌شده شما است.",
    highlights: [
      "امسالی و پرعطر",
      "مناسب آشپزخانه و بستنی‌فروشی",
      "رنگ‌دهی متوسط",
      "بسته‌بندی وکیوم بدون نشانی",
    ],
  },

  // ── خشکبار ────────────────────────────────────────────────────────────────
  {
    id: "p-812",
    slug: "zereshk-ghaen-500g",
    name: "زرشک قائنات (نیم کیلو)",
    category: "خشکبار",
    weight: "۵۰۰ گرم",
    price: 350000,
    oldPrice: 400000,
    images: [
      "/images/500g-barberry1.webp",
      "/images/barberry2.webp",
      "/images/GhaenBarberry3.webp",
    ],
    badge: "پرفروش",
    shortDescription: "زرشک پفکی قائنات (پایتخت زرشک جهان) — محصول تازه ۱۴۰۴، وکیوم بهداشتی.",
    description:
      "شهرت جهانی زرشک ایران از قائنات آغاز می‌شود؛ جایی که اصیل‌ترین و باکیفیت‌ترین زرشک پفکی جهان با رنگ یاقوتی و طعم دلنشین برداشت می‌شود.\n\nزعفران رضائی مفتخر است که زرشک قائنات را به صورت مستقیم از باغات پایتخت زرشک جهان تأمین و با بسته‌بندی کاملاً بهداشتی تقدیم شما عزیزان کند.",
    highlights: [
      "برداشت از مرغوب‌ترین باغات قائنات",
      "فرآوری به روش سنتی",
      "محصول تازه ۱۴۰۴",
      "بسته‌بندی وکیوم بهداشتی",
    ],
  },
  {
    id: "p-106",
    slug: "zereshk-pofaki-1kg",
    name: "زرشک پفکی (۱ کیلویی)",
    category: "خشکبار",
    weight: "۱ کیلوگرم",
    price: 750000,
    images: [
      "/images/500g-barberry1.webp",
      "/images/zereshk.webp",
    ],
    badge: "عمده",
    shortDescription: "یک کیلو زرشک پفکی قائن درجه ۱ — پاک شده، بدون روغن، بسته‌بندی نایلون با کیفیت.",
    description:
      "زرشک پاک شده قائنات، بدون روغن، یک کیلویی بسته‌بندی شده در نایلون با کیفیت. برند عمومی قائنات — مناسب برای فروش مجدد.",
    highlights: [
      "یک کیلو خالص",
      "قائنات درجه ۱",
      "پاک شده و بدون روغن",
      "نایلون با کیفیت",
    ],
  },
  {
    id: "p-795",
    slug: "toot-khoshk-150g",
    name: "توت خشک (۱۵۰ گرمی)",
    category: "خشکبار",
    weight: "۱۵۰ گرم",
    price: 95000,
    oldPrice: 150000,
    images: [
      "/images/mulbery11-1.webp",
      "/images/mulberry2.webp",
      "/images/mulberry3.webp",
    ],
    shortDescription: "توت سفید خشک شده به صورت طبیعی، کاملاً ارگانیک، شیرین و جایگزین قند چای.",
    description:
      "توت خشک طبیعی و درجه‌یک، انتخابی سالم و خوشمزه برای میان‌وعده روزانه شماست. این محصول از بهترین نوع خشکبار تهیه شده و با حفظ طعم طبیعی، بافت نرم و شیرینی ملایم خود، یک گزینه عالی برای مصرف خانگی، پذیرایی و حتی استفاده در ترکیب با غلات صبحانه و دسرها محسوب می‌شود.",
    highlights: [
      "توت سفید خشک شده طبیعی",
      "کاملاً ارگانیک بدون افزودنی",
      "شیرینی طبیعی — جایگزین قند",
      "بسته‌بندی بهداشتی شفاف",
    ],
  },
  {
    id: "p-800",
    slug: "annab-250g",
    name: "عناب درشت (۲۵۰ گرمی)",
    category: "خشکبار",
    weight: "۲۵۰ گرم",
    price: 80000,
    oldPrice: 120000,
    images: [
      "/images/jujubie1.webp",
      "/images/jujubeA22.webp",
    ],
    shortDescription: "عناب دانه درشت بیرجند — امسالی و تازه، خشک شده طبیعی، خوشمزه بدون تلخی.",
    description:
      "عناب بیرجند به‌عنوان یکی از مرغوب‌ترین انواع خشکبار ایران شناخته می‌شود که به دلیل شرایط آب‌وهوایی خاص خراسان جنوبی، طعم شیرین، بافت گوشتی و خواص بی‌نظیری دارد.\n\nاین عناب تازه و دستچین‌شده، در بسته‌بندی بهداشتی و شفاف عرضه شده و کاملاً مناسب مصرف روزانه، تهیه دمنوش و مصارف عطاری است.",
    highlights: [
      "عناب دانه درشت بیرجند",
      "امسالی ۱۴۰۴ — تازه",
      "خشک شده طبیعی",
      "بسته‌بندی وکیوم بدون نشانی",
    ],
  },
  {
    id: "p-803",
    slug: "bargheh-zardalu-200g",
    name: "برگه زردآلو (۲۰۰ گرمی)",
    category: "خشکبار",
    weight: "۲۰۰ گرم",
    price: 90000,
    oldPrice: 150000,
    images: [
      "/images/persimons1.webp",
      "/images/persimons2.webp",
    ],
    shortDescription: "برگه زردآلوی گناباد خراسان — خشک شده طبیعی، بدون مواد نگهدارنده و شکرافشان.",
    description:
      "برگه زردآلوی درجه یک از باغات گناباد خراسان. این محصول لذیذ و پرخاصیت با کیفیت عالی و بسته‌بندی بهداشتی عرضه می‌شود.\n\nطعم شیرین طبیعی و رنگ درخشان، بدون مواد نگهدارنده و شکرافشان. منبع عالی فیبر، آهن و ویتامین‌ها.",
    highlights: [
      "محصول باغات گناباد خراسان",
      "خشک شده طبیعی",
      "بدون مواد نگهدارنده",
      "بسته‌بندی بهداشتی بدون نشانی",
    ],
  },

  // ── دمنوش و چای ───────────────────────────────────────────────────────────
  {
    id: "p-759",
    slug: "hel-10g",
    name: "هل درجه ۱ (۱۰ گرمی)",
    category: "دمنوش و چای",
    weight: "۱۰ گرم",
    price: 69000,
    oldPrice: 80000,
    images: [
      "/images/Hel1.webp",
      "/images/photo24034297951.webp",
    ],
    shortDescription: "هل خشک اکبری درجه یک — بسته‌بندی بدون نشانی، قابل دوباره‌فروشی.",
    description:
      "هل خشک شده اکبری درجه یک، بسته‌بندی ۱۰ گرمی بدون نشانی و تلفن. مناسب برای فروش مجدد. عطر قوی و طبیعی هل.",
    highlights: [
      "هل اکبری درجه یک",
      "خشک شده طبیعی",
      "۱۰ گرم بسته‌بندی شده",
      "بدون نشانی — قابل دوباره‌فروشی",
    ],
  },

  // ── عمده‌فروشی ────────────────────────────────────────────────────────────
  {
    id: "p-817",
    slug: "zafaran-negin-500g-omde",
    name: "زعفران نگین (نیم کیلو — عمده)",
    category: "عمده‌فروشی",
    weight: "۵۰۰ گرم",
    price: 98000000,
    oldPrice: 120000000,
    images: [
      "/images/wholesale11.webp",
      "/images/wholesale2.webp",
      "/images/wholesale3.webp",
    ],
    badge: "عمده",
    shortDescription: "نگین سوپر صادراتی ۵۰۰ گرمی — امسالی ۱۴۰۴، پرعطر، محصول زمین‌های زعفران گناباد.",
    description:
      "زعفران نگین گناباد؛ عطر و رنگی که از دل کویر می‌آید.\n\nاگر به‌دنبال خرید زعفران اصل با بالاترین قدرت رنگ‌دهی هستید، زعفران نگین گناباد انتخابی است که هیچ سرآشپز یا کدبانویی از آن نمی‌گذرد. مناسب برای توزیع‌کنندگان، فروشگاه‌ها و صادرکنندگان.",
    highlights: [
      "وزن خالص ۵۰۰ گرم",
      "نگین سوپر صادراتی",
      "امسالی ۱۴۰۴ و تازه",
      "خشک شده سنتی/طبیعی",
    ],
  },
];

export const formatToman = (n: number) =>
  new Intl.NumberFormat("fa-IR").format(n) + " تومان";

export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

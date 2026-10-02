import type { OtherLocale } from "./locales";

type Dict = {
  brand: string;
  nav: { home: string; shop: string; blog: string; about: string; contact: string };
  home: {
    title: string;
    description: string;
    eyebrow: string;
    heroTitle: string;
    heroSub: string;
    heroCta: string;
    featured: string;
    viewAll: string;
    whyTitle: string;
    why: { title: string; body: string }[];
    storyTitle: string;
    storyBody: string;
    storyCta: string;
  };
  shop: { title: string; description: string; heading: string; sub: string; all: string; empty: string };
  categories: Record<string, string>;
  product: {
    price: string;
    currency: string;
    weight: string;
    highlights: string;
    order: string;
    orderNote: string;
    orderMessage: (name: string) => string;
    back: string;
    outOfStock: string;
    notFound: string;
  };
  blog: { title: string; description: string; heading: string; sub: string; readMore: string; back: string; empty: string };
  about: { title: string; description: string; heading: string; paragraphs: string[] };
  contact: {
    title: string;
    description: string;
    heading: string;
    sub: string;
    whatsapp: string;
    phone: string;
    instagram: string;
    rubika: string;
    address: string;
    addressValue: string;
  };
  footer: { tagline: string; rights: string; persianSite: string };
  notFound: { title: string; body: string; home: string };
};

export const UI: Record<OtherLocale, Dict> = {
  en: {
    brand: "Khajavi Saffron",
    nav: { home: "Home", shop: "Shop", blog: "Articles", about: "About", contact: "Contact" },
    home: {
      title: "Khajavi Saffron | Authentic Persian Saffron from Qaen",
      description:
        "Authentic Qaen saffron straight from the Khajavi family farms: Negin, Dasteh, powder, saffron root, barberries and dried fruit.",
      eyebrow: "Persian red gold",
      heroTitle: "Authentic saffron from the fields of Qaen",
      heroSub:
        "For three generations the Khajavi family has grown, hand-picked and dried saffron in South Khorasan, Iran — the home of the world's finest saffron.",
      heroCta: "Browse products",
      featured: "Featured products",
      viewAll: "View all products",
      whyTitle: "Why Khajavi Saffron",
      why: [
        { title: "Straight from the farm", body: "No middlemen — from our fields in Qaen and Gonabad to you." },
        { title: "Fresh harvest", body: "This year's harvest, dried the traditional way for full colour and aroma." },
        { title: "Guaranteed purity", body: "All-red stigmas, no yellow style, no additives." },
      ],
      storyTitle: "From the fields of Qaen to your table",
      storyBody:
        "Every thread of our saffron carries a story of sunrise over the fields, careful hands and the unique aroma of Qaen. We pack it ourselves so it reaches you as pure as it left the flower.",
      storyCta: "Our story",
    },
    shop: {
      title: "Shop | Khajavi Saffron",
      description: "Buy authentic Persian saffron, saffron root, barberries and dried fruit from Qaen, direct from the producer.",
      heading: "Saffron shop",
      sub: "Choose from the best authentic Qaen saffron products. To order, message us on WhatsApp.",
      all: "All",
      empty: "No products in this category.",
    },
    categories: {
      "همه": "All",
      "زعفران نگین": "Negin saffron",
      "زعفران دسته": "Bunch saffron",
      "ریشه زعفران": "Saffron root",
      "زعفران نرمه": "Saffron powder",
      "خشکبار": "Dried fruit",
      "دمنوش و چای": "Tea & spices",
      "عمده‌فروشی": "Wholesale",
    },
    product: {
      price: "Price",
      currency: "Toman",
      weight: "Weight",
      highlights: "Highlights",
      order: "Order on WhatsApp",
      orderNote: "International and wholesale orders are handled personally on WhatsApp.",
      orderMessage: (n) => `Hello, I would like to order: ${n}`,
      back: "Back to shop",
      outOfStock: "Out of stock",
      notFound: "Product not found",
    },
    blog: {
      title: "Articles | Khajavi Saffron",
      description: "Guides on saffron benefits, how to spot real saffron, how to brew and store it — by the Khajavi family.",
      heading: "Articles",
      sub: "Tips, guides and the benefits of authentic Qaen saffron",
      readMore: "Read more",
      back: "All articles",
      empty: "No articles yet.",
    },
    about: {
      title: "About us | Khajavi Saffron",
      description: "The Khajavi family has grown authentic saffron in Qaen, South Khorasan, for more than three generations.",
      heading: "About Khajavi Saffron",
      paragraphs: [
        "For more than three generations the Khajavi family has grown saffron in the heart of South Khorasan, the region that produces the world's finest saffron.",
        "Every autumn the purple crocus flowers are picked by hand at dawn, the red stigmas are separated one by one and dried the traditional way to keep their colour, taste and aroma.",
        "We sell directly from our farm, without middlemen, so you receive genuine fresh saffron at a fair price. Our range also includes barberries, jujube, dried mulberries and other produce of the region.",
      ],
    },
    contact: {
      title: "Contact | Khajavi Saffron",
      description: "Contact Khajavi Saffron on WhatsApp, phone, Instagram or Rubika for orders and wholesale enquiries.",
      heading: "Contact us",
      sub: "We reply quickly on WhatsApp — for retail, international and wholesale orders.",
      whatsapp: "WhatsApp",
      phone: "Phone",
      instagram: "Instagram",
      rubika: "Rubika",
      address: "Address",
      addressValue: "Qaen, South Khorasan, Iran",
    },
    footer: { tagline: "Authentic saffron from Qaen, direct from the Khajavi family.", rights: "All rights reserved.", persianSite: "Persian site" },
    notFound: { title: "Page not found", body: "The page you are looking for does not exist.", home: "Back to home" },
  },
  tr: {
    brand: "Khajavi Safran",
    nav: { home: "Ana sayfa", shop: "Mağaza", blog: "Makaleler", about: "Hakkımızda", contact: "İletişim" },
    home: {
      title: "Khajavi Safran | Kayen'den Orijinal İran Safranı",
      description:
        "Khajavi ailesinin tarlalarından doğrudan orijinal Kayen safranı: Negin, deste, toz safran, safran kökü, kızamık üzümü ve kuru meyve.",
      eyebrow: "İran'ın kırmızı altını",
      heroTitle: "Kayen tarlalarından orijinal safran",
      heroSub:
        "Khajavi ailesi üç kuşaktır Güney Horasan'da safranı yetiştiriyor, elle topluyor ve kurutuyor — dünyanın en iyi safranının yurdunda.",
      heroCta: "Ürünleri incele",
      featured: "Öne çıkan ürünler",
      viewAll: "Tüm ürünler",
      whyTitle: "Neden Khajavi Safran",
      why: [
        { title: "Doğrudan tarladan", body: "Aracı yok — Kayen ve Gonabad'daki tarlalarımızdan size." },
        { title: "Taze hasat", body: "Bu yılın hasadı, tam renk ve aroma için geleneksel yöntemle kurutuldu." },
        { title: "Garantili saflık", body: "Tamamen kırmızı tepecikler, sarı kısım yok, katkı maddesi yok." },
      ],
      storyTitle: "Kayen tarlalarından sofranıza",
      storyBody:
        "Safranımızın her teli; tarlalarda doğan güneşin, özenli ellerin ve Kayen'in eşsiz kokusunun hikâyesini taşır. Çiçekten çıktığı saflıkta size ulaşması için kendimiz paketliyoruz.",
      storyCta: "Hikâyemiz",
    },
    shop: {
      title: "Mağaza | Khajavi Safran",
      description: "Orijinal İran safranı, safran kökü, kızamık üzümü ve Kayen kuru meyvelerini doğrudan üreticiden alın.",
      heading: "Safran mağazası",
      sub: "En iyi orijinal Kayen safran ürünleri arasından seçin. Sipariş için bize WhatsApp'tan yazın.",
      all: "Tümü",
      empty: "Bu kategoride ürün yok.",
    },
    categories: {
      "همه": "Tümü",
      "زعفران نگین": "Negin safran",
      "زعفران دسته": "Deste safran",
      "ریشه زعفران": "Safran kökü",
      "زعفران نرمه": "Toz safran",
      "خشکبار": "Kuru meyve",
      "دمنوش و چای": "Çay ve baharat",
      "عمده‌فروشی": "Toptan",
    },
    product: {
      price: "Fiyat",
      currency: "Toman",
      weight: "Ağırlık",
      highlights: "Öne çıkanlar",
      order: "WhatsApp ile sipariş ver",
      orderNote: "Uluslararası ve toptan siparişler WhatsApp üzerinden kişisel olarak yürütülür.",
      orderMessage: (n) => `Merhaba, şu ürünü sipariş etmek istiyorum: ${n}`,
      back: "Mağazaya dön",
      outOfStock: "Stokta yok",
      notFound: "Ürün bulunamadı",
    },
    blog: {
      title: "Makaleler | Khajavi Safran",
      description: "Safranın faydaları, gerçek safranın nasıl anlaşılacağı, demleme ve saklama rehberleri — Khajavi ailesinden.",
      heading: "Makaleler",
      sub: "Orijinal Kayen safranı hakkında bilgiler, rehberler ve faydalar",
      readMore: "Devamını oku",
      back: "Tüm makaleler",
      empty: "Henüz makale yok.",
    },
    about: {
      title: "Hakkımızda | Khajavi Safran",
      description: "Khajavi ailesi üç kuşaktan fazla süredir Güney Horasan, Kayen'de orijinal safran yetiştiriyor.",
      heading: "Khajavi Safran hakkında",
      paragraphs: [
        "Khajavi ailesi üç kuşaktan fazla süredir, dünyanın en iyi safranını üreten bölge olan Güney Horasan'ın kalbinde safran yetiştiriyor.",
        "Her sonbahar mor çiğdem çiçekleri şafakta elle toplanır, kırmızı tepecikler tek tek ayrılır ve renk, tat ve aromasını korumak için geleneksel yöntemle kurutulur.",
        "Aracısız, doğrudan çiftliğimizden satıyoruz; böylece gerçek ve taze safranı adil bir fiyata alırsınız. Ürünlerimiz arasında kızamık üzümü, hünnap, kuru dut ve bölgenin diğer ürünleri de var.",
      ],
    },
    contact: {
      title: "İletişim | Khajavi Safran",
      description: "Sipariş ve toptan talepler için Khajavi Safran'a WhatsApp, telefon, Instagram veya Rubika üzerinden ulaşın.",
      heading: "Bize ulaşın",
      sub: "WhatsApp'ta hızlı yanıt veriyoruz — perakende, uluslararası ve toptan siparişler için.",
      whatsapp: "WhatsApp",
      phone: "Telefon",
      instagram: "Instagram",
      rubika: "Rubika",
      address: "Adres",
      addressValue: "Kayen, Güney Horasan, İran",
    },
    footer: { tagline: "Kayen'den orijinal safran, doğrudan Khajavi ailesinden.", rights: "Tüm hakları saklıdır.", persianSite: "Farsça site" },
    notFound: { title: "Sayfa bulunamadı", body: "Aradığınız sayfa mevcut değil.", home: "Ana sayfaya dön" },
  },
  ar: {
    brand: "زعفران خواجوي",
    nav: { home: "الرئيسية", shop: "المتجر", blog: "المقالات", about: "من نحن", contact: "اتصل بنا" },
    home: {
      title: "زعفران خواجوي | زعفران إيراني أصلي من قاين",
      description:
        "زعفران قاين الأصلي مباشرة من مزارع عائلة خواجوي: نگين، دسته، بودرة الزعفران، جذور الزعفران، البرباريس والفواكه المجففة.",
      eyebrow: "الذهب الأحمر الإيراني",
      heroTitle: "زعفران أصلي من حقول قاين",
      heroSub:
        "منذ ثلاثة أجيال تزرع عائلة خواجوي الزعفران وتقطفه يدوياً وتجففه في خراسان الجنوبية بإيران، موطن أجود زعفران في العالم.",
      heroCta: "تصفح المنتجات",
      featured: "منتجات مميزة",
      viewAll: "كل المنتجات",
      whyTitle: "لماذا زعفران خواجوي",
      why: [
        { title: "مباشرة من المزرعة", body: "بلا وسطاء — من حقولنا في قاين وگناباد إليك." },
        { title: "حصاد طازج", body: "حصاد هذا العام، مجفف بالطريقة التقليدية للحفاظ على اللون والرائحة." },
        { title: "نقاء مضمون", body: "مياسم حمراء بالكامل، بلا أجزاء صفراء وبلا إضافات." },
      ],
      storyTitle: "من حقول قاين إلى مائدتك",
      storyBody:
        "كل خيط من زعفراننا يحمل حكاية شروق الشمس على الحقول، وأيادي المزارعين الحانية، وعطر قاين الفريد. نغلّفه بأنفسنا ليصلك نقياً كما خرج من الزهرة.",
      storyCta: "قصتنا",
    },
    shop: {
      title: "المتجر | زعفران خواجوي",
      description: "اشترِ الزعفران الإيراني الأصلي وجذور الزعفران والبرباريس وفواكه قاين المجففة مباشرة من المنتج.",
      heading: "متجر الزعفران",
      sub: "اختر من أفضل منتجات زعفران قاين الأصلي. للطلب راسلنا على واتساب.",
      all: "الكل",
      empty: "لا توجد منتجات في هذه الفئة.",
    },
    categories: {
      "همه": "الكل",
      "زعفران نگین": "زعفران نگين",
      "زعفران دسته": "زعفران دسته",
      "ریشه زعفران": "جذور الزعفران",
      "زعفران نرمه": "بودرة الزعفران",
      "خشکبار": "فواكه مجففة",
      "دمنوش و چای": "شاي وتوابل",
      "عمده‌فروشی": "بيع بالجملة",
    },
    product: {
      price: "السعر",
      currency: "تومان",
      weight: "الوزن",
      highlights: "المميزات",
      order: "اطلب عبر واتساب",
      orderNote: "تتم الطلبات الدولية وطلبات الجملة شخصياً عبر واتساب.",
      orderMessage: (n) => `مرحباً، أرغب في طلب: ${n}`,
      back: "العودة إلى المتجر",
      outOfStock: "غير متوفر",
      notFound: "المنتج غير موجود",
    },
    blog: {
      title: "المقالات | زعفران خواجوي",
      description: "أدلة حول فوائد الزعفران، وكيفية تمييز الزعفران الأصلي، وطريقة نقعه وحفظه — من عائلة خواجوي.",
      heading: "المقالات",
      sub: "معلومات وأدلة وفوائد زعفران قاين الأصلي",
      readMore: "اقرأ المزيد",
      back: "كل المقالات",
      empty: "لا توجد مقالات بعد.",
    },
    about: {
      title: "من نحن | زعفران خواجوي",
      description: "تزرع عائلة خواجوي الزعفران الأصلي في قاين بخراسان الجنوبية منذ أكثر من ثلاثة أجيال.",
      heading: "عن زعفران خواجوي",
      paragraphs: [
        "منذ أكثر من ثلاثة أجيال تزرع عائلة خواجوي الزعفران في قلب خراسان الجنوبية، المنطقة التي تنتج أجود زعفران في العالم.",
        "في كل خريف تُقطف أزهار الزعفران البنفسجية يدوياً عند الفجر، وتُفصل المياسم الحمراء واحدة واحدة وتُجفف بالطريقة التقليدية للحفاظ على لونها وطعمها ورائحتها.",
        "نبيع مباشرة من مزرعتنا دون وسطاء، لتحصل على زعفران أصلي وطازج بسعر عادل. وتشمل منتجاتنا أيضاً البرباريس والعناب والتوت المجفف وغيرها من منتجات المنطقة.",
      ],
    },
    contact: {
      title: "اتصل بنا | زعفران خواجوي",
      description: "تواصل مع زعفران خواجوي عبر واتساب أو الهاتف أو إنستغرام أو روبيكا للطلبات وطلبات الجملة.",
      heading: "تواصل معنا",
      sub: "نرد بسرعة على واتساب — لطلبات التجزئة والطلبات الدولية والجملة.",
      whatsapp: "واتساب",
      phone: "الهاتف",
      instagram: "إنستغرام",
      rubika: "روبيكا",
      address: "العنوان",
      addressValue: "قاين، خراسان الجنوبية، إيران",
    },
    footer: { tagline: "زعفران أصلي من قاين، مباشرة من عائلة خواجوي.", rights: "جميع الحقوق محفوظة.", persianSite: "الموقع الفارسي" },
    notFound: { title: "الصفحة غير موجودة", body: "الصفحة التي تبحث عنها غير موجودة.", home: "العودة إلى الرئيسية" },
  },
};

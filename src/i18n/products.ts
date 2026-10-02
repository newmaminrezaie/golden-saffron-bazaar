import type { OtherLocale } from "./locales";
import type { Product } from "@/data/products";

type T = { name: string; short: string; weight: string };
type Row = Record<OtherLocale, T>;

const M = { en: "1 mithqal (4.608 g)", tr: "1 miskal (4,608 g)", ar: "مثقال واحد (4.608 غ)" };

/**
 * Translations keyed by product slug. Products without an entry (e.g. new
 * products added in the admin panel) fall back to their Persian text.
 */
export const PRODUCT_I18N: Record<string, Row> = {
  "zafaran-negin-1-mesqal": {
    en: { name: "Negin Saffron (4.6 g)", weight: M.en, short: "Natural Negin saffron from Gonabad, grown in the finest fields of Khorasan. Autumn 2025 harvest, all-red and highly aromatic." },
    tr: { name: "Negin Safran (4,6 g)", weight: M.tr, short: "Horasan'ın en iyi tarlalarında yetişen doğal Gonabad Negin safranı. 2025 sonbahar hasadı, tamamen kırmızı ve çok aromatik." },
    ar: { name: "زعفران نگين (4.6 غ)", weight: M.ar, short: "زعفران نگين طبيعي من گناباد، مزروع في أجود حقول خراسان. حصاد خريف 2025، أحمر بالكامل وعطري جداً." },
  },
  "zafaran-negin-1gram": {
    en: { name: "Negin Saffron (1 g)", weight: "1 g", short: "Super export-grade Negin saffron, fresh this year's harvest, all-red. Ideal for a single purchase." },
    tr: { name: "Negin Safran (1 g)", weight: "1 g", short: "Süper ihracat kalitesinde Negin safran, bu yılın taze hasadı, tamamen kırmızı. Tekli alım için ideal." },
    ar: { name: "زعفران نگين (1 غ)", weight: "1 غ", short: "زعفران نگين ممتاز بجودة التصدير، من حصاد هذا العام، أحمر بالكامل. مثالي للشراء الفردي." },
  },
  "zafaran-supernegin-choobi": {
    en: { name: "Super Negin Saffron — Wooden Box", weight: M.en, short: "2025 Negin saffron in a khatam jar inside a wooden box. Thick, all-red threads. A perfect gift." },
    tr: { name: "Süper Negin Safran — Ahşap Kutu", weight: M.tr, short: "Ahşap kutu içinde hatem kavanozda 2025 Negin safranı. Kalın, tamamen kırmızı teller. Mükemmel bir hediye." },
    ar: { name: "زعفران سوبر نگين — علبة خشبية", weight: M.ar, short: "زعفران نگين 2025 في وعاء خاتم داخل علبة خشبية. خيوط سميكة حمراء بالكامل. هدية مثالية." },
  },
  "zafaran-supernegin-gerd": {
    en: { name: "Super Negin Saffron — Round Tin", weight: M.en, short: "Gonabad Negin saffron in a round metal tin. Autumn 2025 harvest, traditionally dried." },
    tr: { name: "Süper Negin Safran — Yuvarlak Teneke", weight: M.tr, short: "Yuvarlak metal tenekede Gonabad Negin safranı. 2025 sonbahar hasadı, geleneksel kurutma." },
    ar: { name: "زعفران سوبر نگين — علبة معدنية مستديرة", weight: M.ar, short: "زعفران نگين من گناباد في علبة معدنية مستديرة. حصاد خريف 2025، مجفف تقليدياً." },
  },
  "zafaran-supernegin-makhmal": {
    en: { name: "Super Negin Saffron — Velvet Box", weight: M.en, short: "2025 Negin saffron in a khatam jar inside a red velvet box. A worthy gift for loved ones." },
    tr: { name: "Süper Negin Safran — Kadife Kutu", weight: M.tr, short: "Kırmızı kadife kutu içinde hatem kavanozda 2025 Negin safranı. Sevdikleriniz için değerli bir hediye." },
    ar: { name: "زعفران سوبر نگين — علبة مخملية", weight: M.ar, short: "زعفران نگين 2025 في وعاء خاتم داخل علبة مخملية حمراء. هدية تليق بأحبائك." },
  },
  "zafaran-supernegin-khatam": {
    en: { name: "Super Negin Saffron — Khatam Tin", weight: M.en, short: "This year's Negin saffron in a metal tin with a Persian khatam pattern. Unbranded, suitable for resale." },
    tr: { name: "Süper Negin Safran — Hatem Teneke", weight: M.tr, short: "İran hatem desenli metal tenekede bu yılın Negin safranı. Markasız, yeniden satışa uygun." },
    ar: { name: "زعفران سوبر نگين — علبة خاتم", weight: M.ar, short: "زعفران نگين من حصاد هذا العام في علبة معدنية بنقش الخاتم الإيراني. بدون علامة تجارية، مناسب لإعادة البيع." },
  },
  "zafaran-daste": {
    en: { name: "Bunch (Dokhtarpich) Saffron (4.6 g)", weight: M.en, short: "Qaen bunch saffron — the most complete and original form of saffron, with the whole thread (stigma + style)." },
    tr: { name: "Deste (Dohterpiç) Safran (4,6 g)", weight: M.tr, short: "Kayen deste safranı — safranın en eksiksiz ve özgün hali; telin tamamı (tepecik + sapçık)." },
    ar: { name: "زعفران دسته / دخترپيچ (4.6 غ)", weight: M.ar, short: "زعفران دسته من قاين — أكمل وأصل أنواع الزعفران، يشمل الخيط كاملاً (الميسم + القلم)." },
  },
  "rishe-zafaran": {
    en: { name: "Saffron Root (2.3 g)", weight: "½ mithqal (2.3 g)", short: "Gonabad saffron root — rich in antioxidants. An economical choice for tea and cooking." },
    tr: { name: "Safran Kökü (2,3 g)", weight: "½ miskal (2,3 g)", short: "Gonabad safran kökü — antioksidan bakımından zengin. Çay ve yemek için ekonomik bir seçim." },
    ar: { name: "جذور الزعفران (2.3 غ)", weight: "نصف مثقال (2.3 غ)", short: "جذور زعفران گناباد — غنية بمضادات الأكسدة. خيار اقتصادي للشاي والطبخ." },
  },
  "zafaran-narmeh": {
    en: { name: "Saffron Narmeh / Fine Grade (4.6 g)", weight: M.en, short: "Kitchen-grade fine saffron, ideal for restaurants, ice-cream shops and tea. Vacuum-packed, 1 mithqal." },
    tr: { name: "Narme Safran / İnce (4,6 g)", weight: M.tr, short: "Mutfak tipi ince safran; restoranlar, dondurmacılar ve çay için ideal. Vakumlu, 1 miskal." },
    ar: { name: "زعفران نرمه (4.6 غ)", weight: M.ar, short: "زعفران ناعم للمطبخ، مناسب للمطاعم ومحلات البوظة والشاي. معبأ بالتفريغ، مثقال واحد." },
  },
  "zereshk-ghaen-500g": {
    en: { name: "Qaen Barberries (500 g)", weight: "500 g", short: "Puffy barberries from Qaen, the barberry capital of the world — fresh 2025 crop, hygienically vacuum-packed." },
    tr: { name: "Kayen Kızamık Üzümü (500 g)", weight: "500 g", short: "Dünyanın kızamık üzümü başkenti Kayen'den — taze 2025 ürünü, hijyenik vakumlu." },
    ar: { name: "برباريس قاين (500 غ)", weight: "500 غ", short: "برباريس منفوش من قاين، عاصمة البرباريس في العالم — محصول 2025 طازج، معبأ بالتفريغ." },
  },
  "zereshk-pofaki-1kg": {
    en: { name: "Puffy Barberries (1 kg)", weight: "1 kg", short: "One kilo of grade-1 Qaen puffy barberries — cleaned, oil-free, quality packaging." },
    tr: { name: "Kabarık Kızamık Üzümü (1 kg)", weight: "1 kg", short: "Bir kilo birinci sınıf Kayen kızamık üzümü — temizlenmiş, yağsız, kaliteli ambalaj." },
    ar: { name: "برباريس منفوش (1 كغ)", weight: "1 كغ", short: "كيلو من برباريس قاين المنفوش درجة أولى — منظف، بدون زيت، تغليف عالي الجودة." },
  },
  "toot-khoshk-150g": {
    en: { name: "Dried Mulberries (150 g)", weight: "150 g", short: "Naturally dried white mulberries, fully organic and sweet — a natural sugar substitute with tea." },
    tr: { name: "Kuru Dut (150 g)", weight: "150 g", short: "Doğal yolla kurutulmuş beyaz dut, tamamen organik ve tatlı — çayda şeker yerine." },
    ar: { name: "توت مجفف (150 غ)", weight: "150 غ", short: "توت أبيض مجفف طبيعياً، عضوي بالكامل وحلو — بديل طبيعي للسكر مع الشاي." },
  },
  "annab-250g": {
    en: { name: "Large Jujube (250 g)", weight: "250 g", short: "Large Birjand jujube — fresh this year, naturally dried, tasty with no bitterness." },
    tr: { name: "İri Hünnap (250 g)", weight: "250 g", short: "İri Bircand hünnabı — bu yılın taze ürünü, doğal kurutulmuş, acılık yok." },
    ar: { name: "عناب كبير (250 غ)", weight: "250 غ", short: "عناب بيرجند كبير الحبة — طازج من هذا العام، مجفف طبيعياً، لذيذ بلا مرارة." },
  },
  "bargheh-zardalu-200g": {
    en: { name: "Dried Apricot Slices (200 g)", weight: "200 g", short: "Gonabad dried apricots from Khorasan — naturally dried, no preservatives or added sugar." },
    tr: { name: "Kuru Kayısı Dilimleri (200 g)", weight: "200 g", short: "Horasan Gonabad kuru kayısısı — doğal kurutulmuş, koruyucu ve şeker yok." },
    ar: { name: "شرائح المشمش المجفف (200 غ)", weight: "200 غ", short: "مشمش مجفف من گناباد خراسان — مجفف طبيعياً، بلا مواد حافظة أو سكر مضاف." },
  },
  "hel-10g": {
    en: { name: "Grade-1 Cardamom (10 g)", weight: "10 g", short: "Grade-1 Akbari green cardamom — unbranded packaging, suitable for resale." },
    tr: { name: "Birinci Sınıf Kakule (10 g)", weight: "10 g", short: "Birinci sınıf Ekberi yeşil kakule — markasız ambalaj, yeniden satışa uygun." },
    ar: { name: "هيل درجة أولى (10 غ)", weight: "10 غ", short: "هيل أكبري أخضر درجة أولى — تغليف بدون علامة تجارية، مناسب لإعادة البيع." },
  },
  "zafaran-negin-500g-omde": {
    en: { name: "Negin Saffron (500 g — Wholesale)", weight: "500 g", short: "Wholesale Negin saffron for exporters, food producers and shops. Contact us for pricing." },
    tr: { name: "Negin Safran (500 g — Toptan)", weight: "500 g", short: "İhracatçılar, gıda üreticileri ve mağazalar için toptan Negin safran. Fiyat için bize ulaşın." },
    ar: { name: "زعفران نگين (500 غ — جملة)", weight: "500 غ", short: "زعفران نگين بالجملة للمصدّرين ومصانع الأغذية والمتاجر. تواصل معنا للأسعار." },
  },
};

export function localizeProduct(p: Product, l: OtherLocale) {
  const t = PRODUCT_I18N[p.slug]?.[l];
  return {
    name: t?.name ?? p.name,
    short: t?.short ?? p.shortDescription ?? "",
    weight: t?.weight ?? p.weight,
  };
}

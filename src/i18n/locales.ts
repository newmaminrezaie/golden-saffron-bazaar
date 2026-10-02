/** Non-Persian site languages. Persian lives at the root (no prefix). */
export const OTHER_LOCALES = ["en", "tr", "ar"] as const;
export type OtherLocale = (typeof OTHER_LOCALES)[number];

export function isOtherLocale(v: unknown): v is OtherLocale {
  return typeof v === "string" && (OTHER_LOCALES as readonly string[]).includes(v);
}

export function localeDir(l: string): "rtl" | "ltr" {
  return l === "fa" || l === "ar" ? "rtl" : "ltr";
}

/** Locale from the first path segment ("fa" when unprefixed). */
export function localeFromPath(pathname: string): string {
  const seg = pathname.split("/")[1];
  return isOtherLocale(seg) ? seg : "fa";
}

/** Strip the locale prefix: "/en/shop" -> "/shop". */
export function stripLocale(pathname: string): string {
  const l = localeFromPath(pathname);
  if (l === "fa") return pathname || "/";
  return pathname.slice(l.length + 1) || "/";
}

export const LANG_LABELS: Record<string, string> = {
  fa: "فارسی",
  en: "English",
  tr: "Türkçe",
  ar: "العربية",
};

export const WHATSAPP = "989150494939";
export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

import sectionAnchors from "./anchors.json";

export const locales = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "it",
  "ja",
  "ko",
  "vi",
  "zh-Hans",
  "zh-Hant",
] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  vi: "Tiếng Việt",
  "zh-Hans": "简体中文",
  "zh-Hant": "繁體中文",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localeFromPath(pathname: string): Locale {
  const parts = pathname.split("/").filter(Boolean);
  const candidate = parts[0] === "docs" ? parts[1] : parts[0];
  return candidate && isLocale(candidate) ? candidate : "en";
}

/** English keeps its original URLs; docs retain Shiso's /docs prefix. */
export function localizedPath(path: string, locale: Locale): string {
  const url = new URL(path, "https://dreamide.co");
  const parts = url.pathname.split("/").filter(Boolean);
  const docs = parts[0] === "docs";
  const languageIndex = docs ? 1 : 0;
  const currentLocale = localeFromPath(url.pathname);
  if (parts[languageIndex] && isLocale(parts[languageIndex]))
    parts.splice(languageIndex, 1);
  if (docs && url.hash) {
    const slug = parts.slice(1).join("/") || "index";
    const sections = (
      sectionAnchors as Record<string, Partial<Record<Locale, string[]>>>
    )[slug];
    let fragment: string;
    try {
      fragment = decodeURIComponent(url.hash.slice(1));
    } catch {
      fragment = url.hash.slice(1);
    }
    const index = sections?.[currentLocale]?.indexOf(fragment) ?? -1;
    if (index >= 0 && sections?.[locale]?.[index])
      url.hash = sections[locale][index];
  }
  if (locale !== "en") parts.splice(languageIndex, 0, locale);
  return `/${parts.join("/")}${url.search}${url.hash}`;
}

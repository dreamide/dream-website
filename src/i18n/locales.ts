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

/** Localized destination for links in Dream's standalone page content. */
export function localizedPath(path: string, locale: Locale): string {
  return locale === "en" ? path : `/${locale}${path === "/" ? "" : path}`;
}

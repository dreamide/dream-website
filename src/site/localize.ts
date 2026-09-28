import type { SiteModel } from "../../node_modules/@umami/shiso/src/lib/types";
import { translate } from "../i18n/context";
import { type Locale, localizedPath } from "../i18n/locales";

export function localizeSite(site: SiteModel, locale: Locale): SiteModel {
  const t = (value: string) => translate(locale, value);
  const link = <T extends { href: string; label?: string; ariaLabel?: string }>(
    value: T,
  ): T => ({
    ...value,
    href:
      value.href.startsWith("/") && !value.href.startsWith("//")
        ? localizedPath(value.href, locale)
        : value.href,
    label: value.label ? t(value.label) : undefined,
    ariaLabel: value.ariaLabel ? t(value.ariaLabel) : undefined,
  });
  return {
    ...site,
    locale,
    logo: { ...site.logo, href: localizedPath("/", locale) },
    labels: Object.fromEntries(
      Object.entries(site.labels).map(([key, value]) => [key, t(value)]),
    ) as unknown as SiteModel["labels"],
    search: { ...site.search, prompt: t(site.search.prompt) },
    navbar: site.navbar
      ? {
          ...site.navbar,
          links: site.navbar.links.map(link),
          primary: site.navbar.primary ? link(site.navbar.primary) : undefined,
        }
      : null,
    footer: site.footer
      ? { ...site.footer, socials: site.footer.socials.map(link) }
      : null,
  };
}

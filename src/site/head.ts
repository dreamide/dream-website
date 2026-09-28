import { useEffect } from "react";
import {
  applyHead,
  type HeadTag,
  buildHead as originalHead,
} from "../../node_modules/@umami/shiso/src/lib/head";
import { SITE_URL } from "../../node_modules/@umami/shiso/src/lib/paths";
import { localeFromPath, locales, localizedPath } from "../i18n/locales";
import { getPageByPathname, getStandalonePage } from "./site-config";

export * from "../../node_modules/@umami/shiso/src/lib/head";

export function buildHead(pathname: string): HeadTag[] {
  const tags = originalHead(pathname);
  if (
    SITE_URL &&
    (getPageByPathname(pathname) || getStandalonePage(pathname))
  ) {
    for (const locale of [...locales, "x-default"] as const) {
      tags.push({
        tag: "link",
        attrs: {
          rel: "alternate",
          hreflang: locale,
          href: new URL(
            localizedPath(pathname, locale === "x-default" ? "en" : locale),
            SITE_URL,
          ).href,
        },
      });
    }
  }
  return tags;
}

export function useHead(pathname: string) {
  useEffect(() => {
    applyHead(buildHead(pathname));
    document.documentElement.lang = localeFromPath(pathname);
    document.documentElement.dir = "ltr";
  }, [pathname]);
}

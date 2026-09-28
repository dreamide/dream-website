import {
  docsSite,
  getScopeByPathname as originalScope,
} from "../../node_modules/@umami/shiso/src/lib/site-config";
import { localeFromPath } from "../i18n/locales";

export * from "../../node_modules/@umami/shiso/src/lib/site-config";

export function getScopeByPathname(pathname: string) {
  const locale = localeFromPath(pathname);
  return (
    docsSite.scopes.find((scope) => scope.language === locale) ??
    originalScope(pathname)
  );
}

export function getLocaleByPathname(pathname: string): {
  lang: string;
  dir: "ltr";
} {
  return { lang: localeFromPath(pathname), dir: "ltr" };
}

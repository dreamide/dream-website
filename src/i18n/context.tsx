import { createContext, useContext } from "react";
import type { Locale } from "./locales";
import messages from "./messages.json";

export const LocaleContext = createContext<Locale>("en");

export function translate(locale: Locale, text: string): string {
  return (
    (messages as Partial<Record<Locale, Record<string, string>>>)[locale]?.[
      text
    ] ?? text
  );
}

export function useTranslation() {
  const locale = useContext(LocaleContext);
  return { locale, t: (text: string) => translate(locale, text) };
}

import { Languages } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "./context";
import { isLocale, localeLabels, locales, localizedPath } from "./locales";

export function LanguageSwitcher() {
  const { locale, t } = useTranslation();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  return (
    <label className="dream-language flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1.5 text-sm">
      <Languages className="size-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">{t("Language")}</span>
      <select
        value={locale}
        className="min-w-0 cursor-pointer bg-card text-foreground outline-offset-2"
        onChange={(event) => {
          const next = event.target.value;
          if (isLocale(next)) {
            // URL is authoritative, so shared links and browser history are deterministic.
            navigate(localizedPath(`${pathname}${search}${hash}`, next));
          }
        }}
      >
        {locales.map((code) => (
          <option key={code} value={code} lang={code}>
            {localeLabels[code]}
          </option>
        ))}
      </select>
    </label>
  );
}

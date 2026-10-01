import { ChevronDown, Languages } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "./context";
import { isLocale, localeLabels, locales, localizedPath } from "./locales";

export function LanguageSwitcher() {
  const { locale, t } = useTranslation();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" />}
        className="dream-language h-auto gap-1.5 bg-card px-2 py-1.5 text-sm"
        aria-label={`${t("Language")}: ${localeLabels[locale]}`}
      >
        <Languages className="size-4 shrink-0" aria-hidden="true" />
        <span lang={locale}>{localeLabels[locale]}</span>
        <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-36">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(next) => {
            if (isLocale(next) && next !== locale) {
              // URL is authoritative, so shared links and browser history are deterministic.
              navigate(localizedPath(`${pathname}${search}${hash}`, next));
            }
          }}
        >
          {locales.map((code) => (
            <DropdownMenuRadioItem key={code} value={code} closeOnClick>
              <span lang={code}>{localeLabels[code]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

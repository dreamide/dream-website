import type { ComponentProps } from "react";
import { useTranslation } from "../../i18n/context";

export function LocalizedLink({
  "aria-label": label,
  href,
  ...props
}: ComponentProps<"a">) {
  const { t } = useTranslation();
  const heading = label?.match(/^Permalink to “(.*)”$/)?.[1];
  return (
    <a
      {...props}
      href={href}
      aria-label={
        heading
          ? t("Permalink to {heading}").replace("{heading}", heading)
          : label
      }
    />
  );
}

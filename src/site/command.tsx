import type { ComponentProps } from "react";
import {
  CommandList as List,
  Command as Menu,
} from "../../node_modules/@umami/shiso/src/components/ui/command";
import { useTranslation } from "../i18n/context";

export * from "../../node_modules/@umami/shiso/src/components/ui/command";

export function Command(props: ComponentProps<typeof Menu>) {
  const { t } = useTranslation();
  return <Menu label={t("Search")} {...props} />;
}

export function CommandList(props: ComponentProps<typeof List>) {
  const { t } = useTranslation();
  return <List label={t("Search results")} {...props} />;
}

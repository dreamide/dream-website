import { X } from "lucide-react";
import type { ComponentProps } from "react";
import {
  SheetContent as Content,
  SheetClose,
} from "../../node_modules/@umami/shiso/src/components/ui/sheet";
import { useTranslation } from "../i18n/context";

export * from "../../node_modules/@umami/shiso/src/components/ui/sheet";

export function SheetContent({
  children,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof Content>) {
  const { t } = useTranslation();
  return (
    <Content {...props} showCloseButton={false}>
      {children}
      {showCloseButton && (
        <SheetClose
          className="absolute top-3 right-3 rounded-md p-2 hover:bg-accent"
          aria-label={t("Close")}
        >
          <X className="size-4" />
        </SheetClose>
      )}
    </Content>
  );
}

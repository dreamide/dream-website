import { X } from "lucide-react";
import type { ComponentProps } from "react";
import {
  DialogContent as Content,
  DialogClose,
} from "../../node_modules/@umami/shiso/src/components/ui/dialog";
import { useTranslation } from "../i18n/context";

export * from "../../node_modules/@umami/shiso/src/components/ui/dialog";

export function DialogContent({
  children,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof Content>) {
  const { t } = useTranslation();
  return (
    <Content {...props} showCloseButton={false}>
      {children}
      {showCloseButton && (
        <DialogClose
          className="absolute top-2 right-2 rounded-md p-2 hover:bg-accent"
          aria-label={t("Close")}
        >
          <X className="size-4" />
        </DialogClose>
      )}
    </Content>
  );
}

"use client";

import type { ComponentProps } from "react";
import { cn } from "../lib/utils";
import Button from "./Button";
import Sparkles, { type SparklesProps } from "./ui/sparkles";

type ButtonProps = ComponentProps<typeof Button>;

type SparkleButtonProps = ButtonProps & {
  /** Props forwarded to the underlying Sparkles field. */
  sparkles?: Omit<SparklesProps, "children">;
};

export default function SparkleButton({
  sparkles,
  className,
  children,
  ...props
}: SparkleButtonProps) {
  return (
    <Sparkles
      position="bottom"
      density={40}
      height={80}
      sway={20}
      groundGlow={false}
      {...sparkles}
      className={cn("inline-block", sparkles?.className)}
    >
      <Button
        {...(props as ButtonProps)}
        className={cn("relative z-10", className)}
      >
        {children}
      </Button>
    </Sparkles>
  );
}

"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/utils";

/*
  Dream's in-app themes: a base gray scale plus an accent color, exactly the
  palettes offered in Settings → Appearance (Tailwind v4 scales). Everything on
  the home page reads from the CSS variables set here, so changing the theme
  re-skins the whole page, including the screenshots (see --dh-shot-filter).
*/

export const BASES = {
  neutral: {
    950: "#0a0a0a",
    900: "#171717",
    800: "#262626",
    700: "#404040",
    500: "#737373",
    400: "#a1a1a1",
  },
  slate: {
    950: "#020618",
    900: "#0f172b",
    800: "#1d293d",
    700: "#314158",
    500: "#62748e",
    400: "#90a1b9",
  },
  gray: {
    950: "#030712",
    900: "#101828",
    800: "#1e2939",
    700: "#364153",
    500: "#6a7282",
    400: "#99a1af",
  },
  zinc: {
    950: "#09090b",
    900: "#18181b",
    800: "#27272a",
    700: "#3f3f46",
    500: "#71717b",
    400: "#9f9fa9",
  },
  stone: {
    950: "#0c0a09",
    900: "#1c1917",
    800: "#292524",
    700: "#44403b",
    500: "#79716b",
    400: "#a6a09b",
  },
} as const;

export const ACCENTS = {
  mono: "#fafafa",
  red: "#fb2c36",
  orange: "#ff6900",
  amber: "#fe9a00",
  yellow: "#f0b100",
  lime: "#7ccf00",
  green: "#00c950",
  emerald: "#00bc7d",
  teal: "#00bba7",
  cyan: "#00b8db",
  sky: "#00a6f4",
  blue: "#2b7fff",
  indigo: "#615fff",
  violet: "#8e51ff",
  purple: "#ad46ff",
  fuchsia: "#e12afb",
  pink: "#f6329a",
  rose: "#ff2056",
} as const;

export type BaseName = keyof typeof BASES;
export type AccentName = keyof typeof ACCENTS;

/** Hue of the green accent the screenshots were captured with. */
const SHOT_HUE = 144;

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function hue(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function themeVars(base: BaseName, accent: AccentName): CSSProperties {
  const b = BASES[base];
  const a = ACCENTS[accent];
  const shift = Math.round(hue(a) - SHOT_HUE);

  return {
    "--dh-950": b[950],
    "--dh-900": b[900],
    "--dh-800": b[800],
    "--dh-700": b[700],
    "--dh-500": b[500],
    "--dh-400": b[400],
    "--dh-accent": a,
    "--dh-accent-fg": luminance(a) > 0.3 ? "#0a0a0a" : "#ffffff",
    "--dh-shot-filter":
      accent === "mono" ? "grayscale(1)" : `hue-rotate(${shift}deg)`,
  } as CSSProperties;
}

/** Sets the theme variables for everything inside it. */
export function DreamTheme({
  base = "zinc",
  accent = "green",
  className,
  children,
}: {
  base?: BaseName;
  accent?: AccentName;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("dh-root", className)} style={themeVars(base, accent)}>
      {children}
    </div>
  );
}

"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../../lib/utils";
import {
  type Frame,
  R,
  type Region,
  SHOT_H,
  SHOT_W,
  SHOTS,
  type ShotName,
} from "./shots";

/**
 * cover:   fill the viewport with the region (may crop it)
 * contain: show the whole region (may reveal letterbox)
 * smart:   show the whole region, but never zoom out so far that the
 *          screenshot stops filling the viewport (default)
 */
export type Fit = "cover" | "contain" | "smart";

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/** Grow a region by `k` of its size on every side, kept inside the shot. */
function pad(r: Region, k: number): Region {
  const w = Math.min(SHOT_W, r.w * (1 + 2 * k));
  const h = Math.min(SHOT_H, r.h * (1 + 2 * k));
  const x = clamp(r.x - (w - r.w) / 2, 0, SHOT_W - w);
  const y = clamp(r.y - (h - r.h) / 2, 0, SHOT_H - h);
  return { x, y, w, h };
}

/** Where to put the 1920×1080 stage so `region` fills a W×H viewport. */
export function computeCamera(
  W: number,
  H: number,
  region: Region,
  fit: Fit,
  clampEdges: boolean,
) {
  if (fit === "smart") region = pad(region, 0.05);
  const coverFull = Math.max(W / SHOT_W, H / SHOT_H);
  const S =
    fit === "cover"
      ? Math.max(W / region.w, H / region.h)
      : fit === "contain"
        ? Math.min(W / region.w, H / region.h)
        : Math.max(Math.min(W / region.w, H / region.h), coverFull);
  const iw = SHOT_W * S;
  const ih = SHOT_H * S;
  let X = W / 2 - (region.x + region.w / 2) * S;
  let Y = H / 2 - (region.y + region.h / 2) * S;

  if (clampEdges) {
    X = iw >= W ? clamp(X, W - iw, 0) : (W - iw) / 2;
    Y = ih >= H ? clamp(Y, H - ih, 0) : (H - ih) / 2;
  }

  return { S, X, Y };
}

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
}

type StageLayerProps = {
  shot: ShotName;
  focus: Region;
  fit: Fit;
  size: { w: number; h: number } | null;
  duration: number;
  ease: string;
  tint?: boolean;
  eager?: boolean;
  visible?: boolean;
  children?: ReactNode;
  imgClassName?: string;
};

/** One screenshot placed on a camera. Children are positioned in shot pixels. */
function StageLayer({
  shot,
  focus,
  fit,
  size,
  duration,
  ease,
  tint,
  eager,
  visible = true,
  children,
  imgClassName,
}: StageLayerProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!size || ready) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setReady(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [size, ready]);

  const cam = size ? computeCamera(size.w, size.h, focus, fit, true) : null;
  const transitions = [`opacity 700ms ease`];
  if (ready && duration > 0)
    transitions.push(`transform ${duration}ms ${ease}`);

  return (
    <div
      className="absolute left-0 top-0 origin-top-left will-change-transform"
      style={
        {
          width: SHOT_W,
          height: SHOT_H,
          transform: cam
            ? `translate3d(${cam.X}px, ${cam.Y}px, 0) scale(${cam.S})`
            : undefined,
          opacity: cam && visible ? 1 : 0,
          transition: transitions.join(", "),
          "--s": cam?.S ?? 1,
        } as CSSProperties
      }
    >
      <img
        src={SHOTS[shot].src}
        alt=""
        width={SHOT_W}
        height={SHOT_H}
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "block h-full w-full max-w-none select-none",
          imgClassName,
        )}
        style={tint ? { filter: "var(--dh-shot-filter)" } : undefined}
      />
      {children}
    </div>
  );
}

export type ShotStageProps = {
  shot: ShotName;
  focus?: Region;
  fit?: Fit;
  /** Camera move duration in ms. 0 = follow instantly (scroll-linked). */
  duration?: number;
  ease?: string;
  tint?: boolean;
  eager?: boolean;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  imgClassName?: string;
  children?: ReactNode;
};

/** A viewport onto one screenshot that can crop / zoom / pan to any region. */
export default function ShotStage({
  shot,
  focus = R.full,
  fit = "smart",
  duration = 1400,
  ease = EASE,
  tint,
  eager,
  alt,
  className,
  style,
  imgClassName,
  children,
}: ShotStageProps) {
  const [ref, size] = useSize<HTMLDivElement>();

  return (
    <div
      ref={ref}
      role="img"
      aria-label={alt ?? SHOTS[shot].alt}
      className={cn("relative overflow-hidden bg-[var(--dh-900)]", className)}
      style={style}
    >
      <StageLayer
        shot={shot}
        focus={focus}
        fit={fit}
        size={size}
        duration={duration}
        ease={ease}
        tint={tint}
        eager={eager}
        imgClassName={imgClassName}
      >
        {children}
      </StageLayer>
    </div>
  );
}

export type ShotReelProps = {
  frames: Frame[];
  index: number;
  fit?: Fit;
  duration?: number;
  ease?: string;
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
  imgClassName?: string;
  /** Overlay rendered above the screenshots (in CSS pixels, not shot pixels). */
  children?: ReactNode;
};

/**
 * A camera that moves across several screenshots. Frames on the same shot
 * pan/zoom; switching shots crossfades while the camera keeps moving.
 */
export function ShotReel({
  frames,
  index,
  fit = "smart",
  duration = 1400,
  ease = EASE,
  eager,
  className,
  style,
  imgClassName,
  children,
}: ShotReelProps) {
  const [ref, size] = useSize<HTMLDivElement>();
  const current = frames[index % frames.length];

  // Each distinct shot keeps the focus of its most recent frame so a
  // crossfade out doesn't jump.
  const lastFocus = useRef<Partial<Record<ShotName, Region>>>({});
  lastFocus.current[current.shot] = current.focus ?? R.full;

  const shots = Array.from(new Set(frames.map((f) => f.shot)));

  return (
    <div
      ref={ref}
      role="img"
      aria-label={current.label ?? SHOTS[current.shot].alt}
      className={cn("relative overflow-hidden bg-[var(--dh-900)]", className)}
      style={style}
    >
      {shots.map((shot) => {
        const firstFrame = frames.find((f) => f.shot === shot);
        const focus = lastFocus.current[shot] ?? firstFrame?.focus ?? R.full;
        const active = shot === current.shot;
        return (
          <StageLayer
            key={shot}
            shot={shot}
            focus={focus}
            fit={(active ? current.fit : firstFrame?.fit) ?? fit}
            size={size}
            duration={duration}
            ease={ease}
            eager={eager}
            visible={active}
            tint={active ? current.tint : firstFrame?.tint}
            imgClassName={imgClassName}
          />
        );
      })}
      {children}
    </div>
  );
}

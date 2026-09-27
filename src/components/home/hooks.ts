"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

export function useInView<T extends Element = HTMLDivElement>({
  once = false,
  rootMargin = "0px",
  threshold = 0.15,
}: {
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
} = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, inView] as const;
}

/** Cycles 0..length-1 every `ms` while `active`. */
export function useCycle(length: number, ms: number, active = true) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % length), ms);
    return () => window.clearInterval(id);
  }, [length, ms, active]);

  return [index, setIndex] as const;
}

/**
 * Scroll progress of an element.
 *  - "through": 0 when its top enters the bottom of the viewport, 1 when its
 *    bottom leaves the top.
 *  - "sticky": 0 when its top reaches the top of the viewport, 1 when its
 *    bottom reaches the bottom (for tall sections with a sticky child).
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  mode: "through" | "sticky" = "through",
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p =
        mode === "sticky"
          ? -rect.top / Math.max(1, rect.height - vh)
          : (vh - rect.top) / (rect.height + vh);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, mode]);

  return progress;
}

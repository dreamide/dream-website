"use client";

import { ArrowUpRight } from "lucide-react";
import {
  LayoutGroup,
  type MotionValue,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import {
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useTranslation } from "../../i18n/context";
import { cn } from "../../lib/utils";
import Button from "../Button";
import GitHubIcon from "../icons/GitHubIcon";
import AppWindow from "../showcase/AppWindow";
import { CANVAS } from "../showcase/data";
import type { Scene } from "../showcase/scene";

export const ease = [0.22, 1, 0.36, 1] as const;

export function useSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

/** Chapter index for each topic, as AppWindow keys a few details off it. */
export const CHAPTER = {
  overview: 0,
  providers: 1,
  tabs: 2,
  chats: 3,
  tools: 4,
  git: 5,
} as const;

/**
 * The app mock rendered at its native size and scaled to fill the width of
 * its container. Each instance gets its own layout group so shared-layout
 * animations (active tab, rail highlight) never jump between windows.
 */
export function ScaledWindow({
  scene: current,
  className,
  zoom = 1,
  originX = 0.5,
  originY = 0.5,
}: {
  scene: Scene;
  className?: string;
  /** Zoom into the window while keeping the frame size. */
  zoom?: number;
  originX?: number;
  originY?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const { width } = useSize(box);
  const scale = width / CANVAS.width;
  const id = useId();
  // Only build the (fairly heavy) app mock once it gets near the viewport.
  const near = useInView(box, { once: true, margin: "50% 50% 50% 50%" });

  return (
    <div
      ref={box}
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${CANVAS.width} / ${CANVAS.height}` }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <motion.div
          initial={false}
          animate={{ scale: zoom }}
          transition={{ type: "spring", duration: 1.2, bounce: 0 }}
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            scale ? "opacity-100" : "opacity-0",
          )}
          style={{ transformOrigin: `${originX * 100}% ${originY * 100}%` }}
        >
          <div
            className="origin-top-left"
            style={{ transform: `scale(${scale || 0})` }}
          >
            {near ? (
              <LayoutGroup id={id}>
                <AppWindow scene={current} />
              </LayoutGroup>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y, filter: "blur(8px)" }
      }
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Words that brighten one by one as the block scrolls through the viewport. */
export function ScrollWords({
  text,
  className,
  offset = ["start 0.85", "end 0.45"],
}: {
  text: string;
  className?: string;
  offset?: [string, string];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // biome-ignore lint/suspicious/noExplicitAny: motion's offset type is a template literal union
    offset: offset as any,
  });
  const { locale } = useTranslation();
  const words = Array.from(
    new Intl.Segmenter(locale, { granularity: "word" }).segment(text),
    (item) => item.segment,
  );

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <Word
          // biome-ignore lint/suspicious/noArrayIndexKey: words are static
          key={index}
          progress={scrollYProgress}
          range={[index / words.length, (index + 1) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/** Breaks out of the page's centred container to the full viewport width. */
export function Bleed({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("relative w-screen left-1/2 -translate-x-1/2", className)}
      style={style}
    >
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-mono text-[10px] font-normal tracking-[0.12em] text-[var(--primary)] uppercase sm:text-xs",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function GitHubButton({
  className,
  eventName = "home-github",
}: {
  className?: string;
  eventName?: string;
}) {
  const { t } = useTranslation();
  return (
    <Button
      href="https://github.com/dreamide/dream"
      target="_blank"
      rel="noopener noreferrer"
      data-umami-event={eventName}
      className={className}
    >
      <GitHubIcon className="size-4" />
      {t("Star on GitHub")}
      <ArrowUpRight className="size-4 opacity-60" />
    </Button>
  );
}

/**
 * A tall section whose content stays pinned under the header while you scroll
 * through it. Children get the 0–1 progress through the section.
 */
export function Pinned({
  height,
  className,
  innerClassName,
  children,
}: {
  /** Total scroll length, in viewport heights. */
  height: number;
  className?: string;
  innerClassName?: string;
  children: (progress: MotionValue<number>) => ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      className={cn("relative", className)}
      style={{ height: `${height}vh` }}
    >
      <div
        className={cn(
          "sticky top-[var(--header-height)] h-[calc(100dvh-var(--header-height))] overflow-hidden",
          innerClassName,
        )}
      >
        {children(scrollYProgress)}
      </div>
    </section>
  );
}

/** Turn a 0–1 progress value into a discrete step from 0 to count - 1. */
export function useStep(progress: MotionValue<number>, count: number) {
  const toStep = (value: number) =>
    Math.min(count - 1, Math.max(0, Math.floor(value * count)));
  const [step, setStep] = useState(() => toStep(progress.get()));
  useMotionValueEvent(progress, "change", (value) => {
    const next = toStep(value);
    setStep((current) => (current === next ? current : next));
  });
  return step;
}

"use client";

import {
  AnimatePresence,
  MotionConfig,
  type MotionValue,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { type RefObject, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import AppWindow from "./AppWindow";
import { CANVAS } from "./data";
import {
  CHAPTERS,
  type Chapter,
  type Scene,
  sameScene,
  sceneAt,
} from "./scene";

/** Scroll distance given to each chapter, in viewport heights. */
const CHAPTER_VH = 95;
const ease = [0.22, 1, 0.36, 1] as const;

function useSize(ref: RefObject<HTMLElement | null>) {
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

function Caption({
  chapter,
  focus,
}: {
  chapter: Chapter;
  focus: string | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
      transition={{ duration: 0.55, ease }}
      className="absolute inset-x-0 top-0 mx-auto flex max-w-3xl flex-col items-center gap-2 px-4 text-center sm:gap-3"
    >
      <div className="text-xs font-medium tracking-[0.18em] text-[var(--primary)] uppercase sm:text-sm">
        {chapter.eyebrow}
      </div>
      <h2 className="text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-foreground">
        {chapter.title}
      </h2>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {chapter.body.map((span) =>
          typeof span === "string" ? (
            span
          ) : (
            <span
              key={span.focus}
              className={cn(
                "relative transition-colors duration-500",
                span.focus === focus && "text-foreground",
              )}
            >
              {span.text}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-[var(--primary)] transition-transform duration-500",
                  span.focus === focus ? "scale-x-100" : "scale-x-0",
                )}
              />
            </span>
          ),
        )}
      </p>
    </motion.div>
  );
}

function Wallpaper({ chapter }: { chapter: number }) {
  return (
    <div className="absolute inset-0">
      {CHAPTERS.map((item, index) => (
        <motion.div
          key={item.id}
          initial={false}
          animate={{
            opacity: index === chapter ? 1 : 0,
            scale: index === chapter ? 1 : 1.08,
          }}
          transition={{ duration: 1.4, ease }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${item.wallpaper})` }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.15),rgba(10,10,10,0.75))]" />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}

function NavItem({
  chapter,
  index,
  active,
  progress,
  onSelect,
}: {
  chapter: Chapter;
  index: number;
  active: boolean;
  progress: MotionValue<number>;
  onSelect: (index: number) => void;
}) {
  const count = CHAPTERS.length;
  const fill = useTransform(
    progress,
    [index / count, (index + 1) / count],
    [0, 1],
  );

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-current={active ? "step" : undefined}
      className={cn(
        "group flex flex-col gap-1.5 px-1.5 pt-2 pb-1 text-[11px] transition-colors sm:px-2.5 sm:text-xs",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {chapter.label}
      <span className="relative block h-0.5 w-full min-w-8 overflow-hidden rounded-full bg-white/10 sm:min-w-14">
        <motion.span
          style={{ scaleX: fill }}
          className="absolute inset-0 origin-left rounded-full bg-foreground"
        />
      </span>
    </button>
  );
}

/** Scales the fixed-size app canvas to fit, and moves the camera around it. */
function Stage({ scene, entry }: { scene: Scene; entry: MotionValue<number> }) {
  const box = useRef<HTMLDivElement>(null);
  const { width, height } = useSize(box);
  const scale = Math.min(width / CANVAS.width, height / CANVAS.height) || 0;

  const mobile = width > 0 && width < 640;
  const camera = scene.camera;
  const zoom = mobile ? (camera.mobileZoom ?? camera.zoom) : camera.zoom;
  // On wide screens the focus point stays put while the camera zooms around
  // it; on narrow ones it is pulled toward the middle of the frame. Either way
  // the shift is clamped so a zoomed window never leaves an empty edge.
  const dx = (camera.x - 0.5) * CANVAS.width * scale;
  const dy = (camera.y - 0.5) * CANVAS.height * scale;
  const clampShift = (ideal: number, size: number, room: number) => {
    const slack = Math.max(0, (size * zoom - room) / 2);
    return Math.max(-slack, Math.min(slack, ideal));
  };
  const shiftX = clampShift(
    mobile ? -dx * zoom : dx * (1 - zoom),
    CANVAS.width * scale,
    width,
  );
  const shiftY = clampShift(
    mobile ? -dy * zoom : dy * (1 - zoom),
    CANVAS.height * scale,
    height,
  );

  const rotateX = useTransform(entry, [0, 1], [26, 0]);
  const lift = useTransform(entry, [0, 1], [0.84, 1]);
  const y = useTransform(entry, [0, 1], [60, 0]);

  return (
    <div
      ref={box}
      className="absolute inset-3 flex items-center justify-center sm:inset-6 lg:inset-8"
      style={{ perspective: 2000 }}
    >
      <motion.div
        style={{ rotateX, scale: lift, y, transformOrigin: "50% 100%" }}
        className={cn(
          "transition-opacity duration-500",
          scale ? "opacity-100" : "opacity-0",
        )}
      >
        <motion.div
          initial={false}
          animate={{ x: shiftX, y: shiftY, scale: zoom }}
          transition={{ type: "spring", duration: 1.2, bounce: 0 }}
          style={{
            width: CANVAS.width * scale,
            height: CANVAS.height * scale,
          }}
        >
          <div
            className="origin-top-left"
            style={{ transform: `scale(${scale})` }}
          >
            <AppWindow scene={scene} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Showcase() {
  const section = useRef<HTMLElement>(null);
  const [scene, setScene] = useState<Scene>(() => sceneAt(0));

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: entry } = useScroll({
    target: section,
    offset: ["start end", "start start"],
  });

  const update = (progress: number) => {
    const next = sceneAt(progress * CHAPTERS.length);
    setScene((current) => (sameScene(current, next) ? current : next));
  };

  useMotionValueEvent(scrollYProgress, "change", update);

  // Pick up the right scene when the page loads part-way down.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    update(scrollYProgress.get());
  }, []);

  const captionOpacity = useTransform(entry, [0.55, 1], [0, 1]);

  const goTo = (index: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + distance * ((index + 0.12) / CHAPTERS.length),
      behavior: "smooth",
    });
  };

  const chapter = CHAPTERS[scene.chapter];

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={section}
        aria-label="Tour of the Dream app"
        className="relative"
        style={{ height: `calc(${CHAPTERS.length * CHAPTER_VH}vh + 100dvh)` }}
      >
        <div className="sticky top-[var(--header-height)] flex h-[calc(100dvh-var(--header-height))] flex-col gap-3 py-4 sm:gap-5 sm:py-6">
          <motion.div
            style={{ opacity: captionOpacity }}
            className="relative h-[168px] shrink-0 sm:h-[196px]"
            aria-live="polite"
          >
            <AnimatePresence initial={false}>
              <Caption key={chapter.id} chapter={chapter} focus={scene.focus} />
            </AnimatePresence>
          </motion.div>

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.06] sm:rounded-3xl">
            <Wallpaper chapter={scene.chapter} />
            <Stage scene={scene} entry={entry} />
          </div>

          <nav
            aria-label="Tour chapters"
            className="flex shrink-0 items-start justify-center"
          >
            {CHAPTERS.map((item, index) => (
              <NavItem
                key={item.id}
                chapter={item}
                index={index}
                active={index === scene.chapter}
                progress={scrollYProgress}
                onSelect={goTo}
              />
            ))}
          </nav>
        </div>
      </section>
    </MotionConfig>
  );
}

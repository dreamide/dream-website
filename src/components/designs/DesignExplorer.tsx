"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { type ComponentType, useCallback, useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import CallToAction from "../CallToAction";
import Hero from "../Hero";
import Showcase from "../showcase/Showcase";
import DesignBento from "./DesignBento";
import DesignCinema from "./DesignCinema";
import DesignGallery from "./DesignGallery";
import DesignPaper from "./DesignPaper";
import DesignPro from "./DesignPro";
import DesignSplit from "./DesignSplit";

function DesignTour() {
  return (
    <div className="flex flex-col">
      <Hero screenshot={false} />
      <Showcase />
      <div className="py-24 sm:py-40">
        <CallToAction />
      </div>
    </div>
  );
}

type Design = {
  id: string;
  name: string;
  summary: string;
  Component: ComponentType;
};

const DESIGNS: Design[] = [
  {
    id: "pro",
    name: "Pro",
    summary:
      "Apple product page: settling hero, highlight carousel, closer-look viewer, stats.",
    Component: DesignPro,
  },
  {
    id: "cinema",
    name: "Cinema",
    summary:
      "Full-bleed chapters with giant type, zoom-out hero and scroll-lit copy.",
    Component: DesignCinema,
  },
  {
    id: "bento",
    name: "Bento",
    summary: "A grid of small live UI demos, one per feature.",
    Component: DesignBento,
  },
  {
    id: "gallery",
    name: "Gallery",
    summary:
      "Rotating provider headline, pinned horizontal scroll, capability ticker.",
    Component: DesignGallery,
  },
  {
    id: "split",
    name: "Split",
    summary: "Sticky app beside scrolling chapters that drive what it shows.",
    Component: DesignSplit,
  },
  {
    id: "paper",
    name: "Paper",
    summary: "Light Apple-style bands, before/after toggle, big numbers.",
    Component: DesignPaper,
  },
  {
    id: "tour",
    name: "Tour",
    summary: "The single-view scroll tour from /preview, for comparison.",
    Component: DesignTour,
  },
];

export default function DesignExplorer() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(true);
  const [ready, setReady] = useState(false);

  // Read the design from the URL after hydration so server and client agree.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("design");
    const found = DESIGNS.findIndex((design) => design.id === id);
    if (found > 0) setIndex(found);
    setReady(true);
  }, []);

  const select = useCallback((next: number) => {
    const wrapped = (next + DESIGNS.length) % DESIGNS.length;
    setIndex(wrapped);
    const url = new URL(window.location.href);
    url.searchParams.set("design", DESIGNS[wrapped].id);
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable]")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "]") select(index + 1);
      if (event.key === "[") select(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, select]);

  const design = DESIGNS[index];
  const Current = design.Component;

  return (
    <MotionConfig reducedMotion="user">
      <div className="designs-root landing-page">
        {ready ? <Current key={design.id} /> : <div className="min-h-dvh" />}
      </div>

      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-3 transition-opacity duration-300 sm:bottom-6",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        <motion.div
          layout
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="pointer-events-auto flex max-w-full flex-col items-center gap-2 rounded-2xl border border-white/10 bg-[#121212]/85 p-1.5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-md overflow-hidden px-3 pt-1.5 text-center text-xs text-muted-foreground"
              >
                <span className="font-medium text-foreground">
                  {index + 1}. {design.name}
                </span>{" "}
                · {design.summary}
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div className="flex max-w-full items-center gap-1">
            <button
              type="button"
              aria-label="Previous design"
              onClick={() => select(index - 1)}
              className="flex size-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {DESIGNS.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => select(i)}
                  aria-current={i === index ? "page" : undefined}
                  className={cn(
                    "relative shrink-0 rounded-xl px-3 py-1.5 text-xs transition-colors sm:text-sm",
                    i === index
                      ? "text-[#0a0a0a]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {i === index ? (
                    <motion.span
                      layoutId="design-pill"
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.2,
                      }}
                      className="absolute inset-0 rounded-xl bg-[var(--primary)]"
                    />
                  ) : null}
                  <span className="relative">{item.name}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Next design"
              onClick={() => select(index + 1)}
              className="flex size-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="hidden shrink-0 rounded-xl px-2 py-1.5 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground sm:block"
            >
              {open ? "Hide info" : "Info"}
            </button>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

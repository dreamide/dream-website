"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import DownloadButton from "../DownloadButton";
import { COMMIT_MESSAGE, PROVIDERS, TERMINAL_UNITS } from "../showcase/data";
import type { Scene } from "../showcase/scene";
import {
  CHAPTER,
  CountUp,
  Eyebrow,
  ease,
  GitHubButton,
  Reveal,
  ScaledWindow,
  ScrollWords,
  Shot,
  type ShotId,
  scene,
} from "./shared";

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [62, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const glow = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  return (
    <section className="flex flex-col items-center pt-16 text-center sm:pt-24">
      <motion.h1
        initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease }}
        className="bg-gradient-to-b from-white to-white/55 bg-clip-text text-[clamp(4.5rem,16vw,12rem)] leading-[0.9] font-semibold tracking-[-0.06em] text-transparent"
      >
        Dream
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.25, ease }}
        className="mt-6 text-[clamp(1.5rem,3.4vw,2.75rem)] font-semibold tracking-tight"
      >
        Every agent.{" "}
        <span className="bg-gradient-to-r from-[#bbf7d0] via-[#6ee7b7] to-[#7dd3fc] bg-clip-text text-transparent">
          One window.
        </span>
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease }}
        className="mt-3 max-w-xl text-muted-foreground"
      >
        The open-source desktop IDE for AI coding. Bring Codex, Claude, OpenCode
        and Cursor into a single workspace.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.55, ease }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        <DownloadButton eventName="designs-pro-hero" />
        <GitHubButton eventName="designs-pro-github" />
      </motion.div>

      <div
        ref={ref}
        className="relative mt-20 w-full max-w-6xl sm:mt-28"
        style={{ perspective: 1800 }}
      >
        <motion.div
          style={{ opacity: glow }}
          className="absolute inset-x-[10%] -bottom-10 h-1/2 rounded-full bg-[#4ade80]/25 blur-[90px]"
        />
        <motion.div
          style={{ rotateX, scale, transformOrigin: "50% 100%" }}
          className="relative rounded-[14px]"
        >
          <ScaledWindow
            scene={scene({ tabsShown: true })}
            className="rounded-[14px]"
          />
        </motion.div>
      </div>
    </section>
  );
}

const HIGHLIGHTS = [
  {
    eyebrow: "Providers",
    title: "Bring your own provider.",
    body: "Use the subscriptions and agent CLIs you already have.",
    shot: "overview" as ShotId,
    wallpaper: "/bg-01.jpg",
  },
  {
    eyebrow: "Projects",
    title: "Every project, one tab away.",
    body: "Files, chats and terminals stay put when you switch.",
    shot: "tabs" as ShotId,
    wallpaper: "/bg-06.jpg",
  },
  {
    eyebrow: "Chats",
    title: "Side-by-side conversations.",
    body: "Compare answers and branch ideas without losing the thread.",
    shot: "chats" as ShotId,
    wallpaper: "/bg-04.jpg",
  },
  {
    eyebrow: "Tools",
    title: "Files, terminal, browser.",
    body: "Everything you need to check an agent's work, built in.",
    shot: "files" as ShotId,
    wallpaper: "/bg-03.jpg",
  },
  {
    eyebrow: "Git",
    title: "From diff to push.",
    body: "Review, commit and push without leaving the app.",
    shot: "git" as ShotId,
    wallpaper: "/bg-08.jpg",
  },
];

function Highlights() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollBy = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = (card?.clientWidth ?? 400) + 20;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = (card?.clientWidth ?? 400) + 20;
    setActive(Math.round(el.scrollLeft / step));
  };

  return (
    <section className="py-28 sm:py-40">
      <Reveal className="mx-auto mb-10 flex max-w-6xl items-end justify-between gap-6">
        <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.04em]">
          Get the highlights.
        </h2>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label="Previous highlight"
            onClick={() => scrollBy(-1)}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next highlight"
            onClick={() => scrollBy(1)}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </Reveal>
      <div
        ref={track}
        onScroll={onScroll}
        className="relative left-1/2 flex w-screen -translate-x-1/2 snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4 [--gutter:max(1.25rem,calc((100vw_-_72rem)/2))] [scrollbar-width:none] scroll-px-[var(--gutter)] [&::-webkit-scrollbar]:hidden"
      >
        {HIGHLIGHTS.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.08, ease }}
            className="group relative flex h-[520px] w-[82vw] max-w-[420px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-[#151515] sm:h-[600px]"
          >
            <div className="relative z-10 flex flex-col gap-2 p-8">
              <Eyebrow>{item.eyebrow}</Eyebrow>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.body}</p>
            </div>
            <div
              className="relative mt-auto h-[58%] overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${item.wallpaper})` }}
            >
              <div className="absolute top-8 left-8 w-full transition-transform duration-700 ease-out group-hover:-translate-x-6 group-hover:-translate-y-2">
                <Shot id={item.shot} />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {HIGHLIGHTS.map((item, index) => (
          <span
            key={item.title}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              index === active ? "w-6 bg-white" : "w-1.5 bg-white/30",
            )}
          />
        ))}
      </div>
    </section>
  );
}

type Look = {
  id: string;
  label: string;
  body: string;
  scene: Scene;
  zoom?: number;
  origin?: [number, number];
};

const LOOKS: Look[] = [
  {
    id: "providers",
    label: "Providers",
    body: "Switch between Codex, Claude, OpenCode and Cursor from the composer. Dream uses your existing subscriptions and local CLIs.",
    scene: scene({ chapter: CHAPTER.providers, menuOpen: true, provider: 1 }),
    zoom: 1.55,
    origin: [0.5, 0.95],
  },
  {
    id: "tabs",
    label: "Project tabs",
    body: "Every project gets a tab with its own chats, files and terminals, exactly as you left them.",
    scene: scene({
      chapter: CHAPTER.tabs,
      tabsShown: true,
      activeTab: "website",
    }),
    zoom: 1.7,
    origin: [0.05, 0],
  },
  {
    id: "chats",
    label: "Multiple chats",
    body: "Run up to three conversations side by side. Compare approaches, or branch from any message.",
    scene: scene({ chapter: CHAPTER.chats, tabsShown: true, columns: 3 }),
  },
  {
    id: "files",
    label: "File explorer",
    body: "Browse and read the files your agent is touching without opening another editor.",
    scene: scene({ chapter: CHAPTER.tools, tabsShown: true, panel: "files" }),
    zoom: 1.12,
    origin: [1, 0.5],
  },
  {
    id: "terminal",
    label: "Terminal",
    body: "Run lint, tests and scripts in integrated terminals right next to the chat.",
    scene: scene({
      chapter: CHAPTER.tools,
      tabsShown: true,
      panel: "terminal",
      terminalUnits: TERMINAL_UNITS,
    }),
    zoom: 1.12,
    origin: [1, 0.5],
  },
  {
    id: "browser",
    label: "Browser",
    body: "Preview your local app in a built-in browser while the agent works on it.",
    scene: scene({ chapter: CHAPTER.tools, tabsShown: true, panel: "browser" }),
    zoom: 1.12,
    origin: [1, 0.5],
  },
  {
    id: "git",
    label: "Git",
    body: "Review diffs, write the commit message and push, all from the Changes panel.",
    scene: scene({
      chapter: CHAPTER.git,
      tabsShown: true,
      panel: "changes",
      commitOpen: true,
      commitChars: COMMIT_MESSAGE.length,
    }),
    zoom: 1.15,
  },
];

function CloserLook() {
  const [active, setActive] = useState(0);
  const look = LOOKS[active];

  return (
    <section className="py-20 sm:py-32">
      <Reveal className="mx-auto mb-12 max-w-6xl">
        <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.04em]">
          Take a closer look.
        </h2>
      </Reveal>
      <Reveal className="mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-[2rem] bg-[#121212] p-4 sm:p-6 lg:grid-cols-[300px_1fr] lg:p-8">
        <div className="order-2 flex flex-wrap gap-2 lg:order-1 lg:flex-col lg:justify-center">
          {LOOKS.map((item, index) => {
            const isActive = index === active;
            return (
              <motion.button
                layout
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
                className={cn(
                  "overflow-hidden rounded-[22px] text-left text-sm transition-colors",
                  isActive
                    ? "bg-white/[0.08] lg:w-full"
                    : "bg-white/[0.04] hover:bg-white/[0.08]",
                )}
              >
                <motion.div
                  layout="position"
                  className="flex items-center gap-2.5 px-4 py-3 font-medium"
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                      isActive
                        ? "rotate-45 border-white/40"
                        : "border-white/20",
                    )}
                  >
                    <Plus className="size-3.5" />
                  </span>
                  {item.label}
                </motion.div>
                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease }}
                      className="hidden px-4 pb-4 text-muted-foreground lg:block"
                    >
                      {item.body}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
        <div
          className="relative order-1 flex items-center justify-center overflow-hidden rounded-2xl bg-cover bg-center p-4 sm:p-10 lg:order-2"
          style={{ backgroundImage: "url(/bg-07.jpg)" }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <ScaledWindow
            scene={look.scene}
            zoom={look.zoom ?? 1}
            originX={look.origin?.[0] ?? 0.5}
            originY={look.origin?.[1] ?? 0.5}
            className="rounded-[10px] shadow-2xl"
          />
        </div>
        <p className="order-3 text-sm text-muted-foreground lg:hidden">
          {look.body}
        </p>
      </Reveal>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: 4, suffix: "", label: "agent providers, one composer" },
    { value: 3, suffix: "", label: "platforms: macOS, Windows and Linux" },
    { value: 100, suffix: "%", label: "open source, on GitHub" },
  ];

  return (
    <section className="mx-auto grid max-w-6xl gap-12 py-24 sm:grid-cols-3 sm:py-32">
      {stats.map((stat, index) => (
        <Reveal
          key={stat.label}
          delay={index * 0.12}
          className="flex flex-col gap-3"
        >
          <div className="bg-gradient-to-br from-[#bbf7d0] to-[#38bdf8] bg-clip-text text-[clamp(4rem,9vw,7.5rem)] leading-none font-semibold tracking-[-0.05em] text-transparent">
            <CountUp to={stat.value} suffix={stat.suffix} />
          </div>
          <p className="max-w-[16rem] text-lg text-muted-foreground">
            {stat.label}
          </p>
        </Reveal>
      ))}
    </section>
  );
}

function Providers() {
  return (
    <section className="py-24 text-center sm:py-36">
      <Reveal>
        <Eyebrow>Providers</Eyebrow>
        <h2 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-semibold tracking-[-0.045em]">
          Four agents.
          <br />
          <span className="text-white/40">Zero new subscriptions.</span>
        </h2>
      </Reveal>
      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
        {PROVIDERS.map((provider, index) => (
          <Reveal key={provider.id} delay={index * 0.1}>
            <div className="group flex aspect-square flex-col items-center justify-center gap-5 rounded-3xl bg-[#141414] transition-colors duration-500 hover:bg-[#1c1c1c]">
              <provider.Icon
                className={cn(
                  "size-12 transition-transform duration-500 group-hover:scale-110",
                  provider.iconClass,
                )}
              />
              <div>
                <div className="font-medium">{provider.name}</div>
                <div className="text-xs text-muted-foreground">
                  {provider.model}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function GitStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_top,#14532d_0%,#0a0a0a_70%)] px-6 py-24 sm:px-16 sm:py-32"
    >
      <div className="mx-auto max-w-4xl text-center">
        <Eyebrow>Git</Eyebrow>
        <ScrollWords
          text="Review the diff. Write the message. Push. Dream keeps you in flow from the first edit to the final commit."
          className="mt-6 text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.15] font-semibold tracking-[-0.03em]"
        />
      </div>
      <motion.div style={{ y }} className="mx-auto mt-16 max-w-5xl">
        <ScaledWindow
          scene={scene({
            chapter: CHAPTER.git,
            tabsShown: true,
            panel: "changes",
            committed: true,
          })}
          className="rounded-[14px]"
        />
      </motion.div>
    </section>
  );
}

function Finale() {
  return (
    <section className="flex flex-col items-center gap-8 py-32 text-center sm:py-48">
      <Reveal>
        <h2 className="text-[clamp(3rem,9vw,7rem)] leading-none font-semibold tracking-[-0.05em]">
          Dream your dream.
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="text-muted-foreground">
          Free and open source for macOS, Windows and Linux.
        </p>
      </Reveal>
      <Reveal delay={0.25}>
        <DownloadButton eventName="designs-pro-cta" />
      </Reveal>
    </section>
  );
}

export default function DesignPro() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Highlights />
      <CloserLook />
      <Stats />
      <Providers />
      <GitStory />
      <Finale />
    </div>
  );
}

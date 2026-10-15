"use client";

import { Check } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import DownloadButton from "../DownloadButton";
import AppleIcon from "../icons/AppleIcon";
import LinuxIcon from "../icons/LinuxIcon";
import WindowsIcon from "../icons/WindowsIcon";
import {
  COMMIT_MESSAGE,
  PROVIDERS,
  type TabId,
  TERMINAL_UNITS,
} from "../showcase/data";
import type { Scene } from "../showcase/scene";
import {
  CHAPTER,
  Eyebrow,
  ease,
  GitHubButton,
  Reveal,
  ScaledWindow,
  scene,
  useCycle,
} from "./shared";

type Step = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  wallpaper: string;
  /** Scenes to cycle through while this step is active. */
  scenes: Scene[];
  zoom?: number;
  origin?: [number, number];
};

const TABS: TabId[] = ["dream", "website", "api"];

const STEPS: Step[] = [
  {
    id: "providers",
    eyebrow: "Providers",
    title: "Bring your own provider.",
    body: "Dream works with your existing subscriptions and local agent CLIs. Pick the model per chat and switch whenever you like.",
    points: PROVIDERS.map((p) => `${p.name} by ${p.vendor}`),
    wallpaper: "/bg-01.jpg",
    scenes: PROVIDERS.map((_, index) =>
      scene({ chapter: CHAPTER.providers, menuOpen: true, provider: index }),
    ),
    zoom: 1.5,
    origin: [0.5, 0.95],
  },
  {
    id: "tabs",
    eyebrow: "Projects",
    title: "Organize with tabs.",
    body: "All your projects live in one window. Switch between them in a flash and keep your context right where you left it.",
    points: [
      "Open files stay open",
      "Chats keep running",
      "Terminals keep their history",
    ],
    wallpaper: "/bg-06.jpg",
    scenes: TABS.map((tab) =>
      scene({ chapter: CHAPTER.tabs, tabsShown: true, activeTab: tab }),
    ),
    zoom: 1.4,
    origin: [0, 0],
  },
  {
    id: "chats",
    eyebrow: "Chats",
    title: "Multiple chats.",
    body: "Run several AI conversations side by side. Compare answers, branch off new ideas and explore different approaches.",
    points: [
      "Up to three chats side by side",
      "Branch from any message",
      "Stash prompts for later",
    ],
    wallpaper: "/bg-04.jpg",
    scenes: ([1, 2, 3] as const).map((columns) =>
      scene({ chapter: CHAPTER.chats, tabsShown: true, columns }),
    ),
  },
  {
    id: "tools",
    eyebrow: "Built-in tools",
    title: "Everything in one place.",
    body: "A file explorer, integrated terminals and a browser are included. View files, run commands and preview your work.",
    points: ["File explorer", "Integrated terminals", "Browser previews"],
    wallpaper: "/bg-03.jpg",
    scenes: (["files", "terminal", "browser"] as const).map((panel) =>
      scene({
        chapter: CHAPTER.tools,
        tabsShown: true,
        panel,
        terminalUnits: TERMINAL_UNITS,
      }),
    ),
    zoom: 1.1,
    origin: [1, 0.5],
  },
  {
    id: "git",
    eyebrow: "Git",
    title: "Faster Git workflow.",
    body: "Review diffs, write commit messages and push without leaving Dream. Stay in flow from first edit to final commit.",
    points: [
      "Review every diff",
      "Commit with a message",
      "Push, or use worktrees for parallel work",
    ],
    wallpaper: "/bg-08.jpg",
    scenes: [
      scene({ chapter: CHAPTER.git, tabsShown: true, panel: "changes" }),
      scene({
        chapter: CHAPTER.git,
        tabsShown: true,
        panel: "changes",
        commitOpen: true,
        commitChars: COMMIT_MESSAGE.length,
      }),
      scene({
        chapter: CHAPTER.git,
        tabsShown: true,
        panel: "changes",
        committed: true,
      }),
    ],
  },
];

function StepText({
  step,
  index,
  onActive,
}: {
  step: Step;
  index: number;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="flex min-h-[85vh] flex-col justify-center py-16">
      <motion.div
        animate={{ opacity: inView ? 1 : 0.25 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-5"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-white/40">0{index + 1}</span>
          <Eyebrow>{step.eyebrow}</Eyebrow>
        </div>
        <h2 className="text-[clamp(2.25rem,4vw,3.75rem)] leading-[1] font-semibold tracking-[-0.04em]">
          {step.title}
        </h2>
        <p className="text-lg text-muted-foreground">{step.body}</p>
        <ul className="mt-2 flex flex-col gap-2.5">
          {step.points.map((point, i) => (
            <motion.li
              key={point}
              initial={false}
              animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -10 }}
              transition={{
                duration: 0.5,
                delay: inView ? 0.1 + i * 0.08 : 0,
                ease,
              }}
              className="flex items-center gap-3"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-[var(--primary)]/15">
                <Check className="size-3 text-[var(--primary)]" />
              </span>
              {point}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

function StickyStage({ active }: { active: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = STEPS[active];
  const sub = useCycle(ref, step.scenes.length, 1900);
  const current = step.scenes[sub % step.scenes.length];

  return (
    <div
      ref={ref}
      className="relative flex aspect-[16/11] w-full items-center justify-center overflow-hidden rounded-[2rem] p-4 sm:p-8 lg:aspect-[4/3]"
    >
      {STEPS.map((item, index) => (
        <motion.div
          key={item.id}
          initial={false}
          animate={{
            opacity: index === active ? 1 : 0,
            scale: index === active ? 1 : 1.1,
          }}
          transition={{ duration: 1, ease }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${item.wallpaper})` }}
        />
      ))}
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative w-full">
        <ScaledWindow
          scene={current}
          zoom={step.zoom ?? 1}
          originX={step.origin?.[0] ?? 0.5}
          originY={step.origin?.[1] ?? 0.5}
          className="rounded-[12px] shadow-2xl"
        />
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {step.scenes.map((_, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: positional dots
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              index === sub % step.scenes.length
                ? "w-5 bg-white"
                : "w-1.5 bg-white/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default function DesignSplit() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col">
      <section className="relative flex flex-col items-center overflow-hidden pt-28 pb-16 text-center sm:pt-40">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="absolute top-0 left-1/2 -z-10 size-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[conic-gradient(from_90deg,transparent,#14532d,transparent,#0c4a6e,transparent)] opacity-60 blur-[100px]"
        />
        <Reveal>
          <Eyebrow>Dream</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-6 max-w-5xl text-[clamp(3rem,8vw,7rem)] leading-[0.95] font-semibold tracking-[-0.05em]">
            The calm place to work with AI agents.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            An open-source desktop IDE for AI coding. Agents, projects, files,
            terminals and Git, all in one window.
          </p>
        </Reveal>
        <Reveal
          delay={0.3}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <DownloadButton eventName="designs-split-hero" />
          <GitHubButton eventName="designs-split-github" />
        </Reveal>
      </section>

      <section className="relative grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <nav
          aria-label="Chapters"
          className="absolute top-0 -left-1 hidden h-full xl:block"
        >
          <div className="sticky top-[40vh] flex flex-col gap-3">
            {STEPS.map((step, index) => (
              <span
                key={step.id}
                className={cn(
                  "w-1 rounded-full transition-all duration-500",
                  index === active
                    ? "h-8 bg-[var(--primary)]"
                    : "h-3 bg-white/15",
                )}
              />
            ))}
          </div>
        </nav>
        <div className="sticky top-[calc(var(--header-height)+0.5rem)] z-10 order-1 self-start lg:order-2 lg:top-[calc(var(--header-height)+12vh)]">
          <StickyStage active={active} />
        </div>
        <div className="order-2 xl:pl-8 lg:order-1">
          {STEPS.map((step, index) => (
            <StepText
              key={step.id}
              step={step}
              index={index}
              onActive={setActive}
            />
          ))}
        </div>
      </section>

      <section className="py-32">
        <Reveal className="mb-12 text-center">
          <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.04em]">
            Free on every desktop.
          </h2>
        </Reveal>
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {[
            {
              Icon: AppleIcon,
              name: "macOS",
              detail: "Apple silicon and Intel",
            },
            { Icon: WindowsIcon, name: "Windows", detail: "x64 installer" },
            {
              Icon: LinuxIcon,
              name: "Linux",
              detail: ".deb, .rpm and AppImage",
            },
          ].map(({ Icon, name, detail }, index) => (
            <Reveal key={name} delay={index * 0.1}>
              <a
                href="/download"
                className="group flex flex-col items-center gap-4 rounded-3xl border border-white/[0.07] bg-[#111] p-10 transition-colors hover:border-white/20"
              >
                <Icon className="size-12 transition-transform duration-500 group-hover:-translate-y-1" />
                <div className="text-center">
                  <div className="text-lg font-semibold">{name}</div>
                  <div className="text-sm text-muted-foreground">{detail}</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-8 pb-40 text-center">
        <Reveal>
          <h2 className="text-[clamp(3rem,9vw,7rem)] leading-none font-semibold tracking-[-0.05em]">
            Dream your dream.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <DownloadButton eventName="designs-split-cta" />
        </Reveal>
      </section>
    </div>
  );
}

"use client";

import {
  AnimatePresence,
  type MotionValue,
  motion,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import DownloadButton from "../DownloadButton";
import { PROVIDERS, TERMINAL_UNITS } from "../showcase/data";
import type { PanelId } from "../showcase/scene";
import {
  Bleed,
  CHAPTER,
  ease,
  GitHubButton,
  Pinned,
  Reveal,
  ScaledWindow,
  SHOTS,
  Shot,
  type ShotId,
  scene,
  useCycle,
  useStep,
} from "./shared";

const PROVIDER_COLORS: Record<string, string> = {
  codex: "#e5e5e5",
  claude: "#d97757",
  opencode: "#a3e635",
  cursor: "#7dd3fc",
};

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useCycle(ref, PROVIDERS.length, 1700);
  const provider = PROVIDERS[step];
  const color = PROVIDER_COLORS[provider.id];

  return (
    <section
      ref={ref}
      className="flex flex-col items-center pt-24 text-center sm:pt-36"
    >
      <h1 className="text-[clamp(3rem,9vw,8rem)] leading-[1] font-semibold tracking-[-0.05em]">
        Code with
        <span className="relative block h-[1.1em] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={provider.id}
              initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
              animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease }}
              className="absolute inset-x-0 flex items-center justify-center gap-[0.25em]"
              style={{ color }}
            >
              <provider.Icon className="size-[0.7em]" />
              {provider.name}.
            </motion.span>
          </AnimatePresence>
        </span>
      </h1>
      <p className="mt-8 max-w-xl text-lg text-muted-foreground">
        Or all four. Dream is the open-source desktop IDE that brings every AI
        coding agent, project and tool into one window.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <DownloadButton eventName="designs-gallery-hero" />
        <GitHubButton eventName="designs-gallery-github" />
      </div>
      <Bleed className="mt-24 overflow-hidden py-10">
        <Filmstrip />
      </Bleed>
    </section>
  );
}

const FILM: ShotId[] = [
  "overview",
  "tabs",
  "chats",
  "files",
  "terminal",
  "git",
];

function Filmstrip() {
  const row = [...FILM, ...FILM];
  return (
    <div className="-rotate-3">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 50,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
        className="flex w-max gap-6"
      >
        {row.map((id, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: duplicated loop
            key={index}
            className="aspect-[1548/904] h-[220px] shrink-0 sm:h-[320px]"
          >
            <ScaledWindow scene={SHOTS[id].scene} className="rounded-xl" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const PANELS = [
  {
    number: "01",
    title: "Bring your own provider.",
    body: "Works with your existing subscriptions and local agent CLIs from OpenAI, Anthropic, OpenCode and Cursor.",
    shot: "overview" as ShotId,
    wallpaper: "/bg-01.jpg",
  },
  {
    number: "02",
    title: "Organize with tabs.",
    body: "All your projects in one window. Switch in a flash and keep your files, chats and terminals where you left them.",
    shot: "tabs" as ShotId,
    wallpaper: "/bg-06.jpg",
  },
  {
    number: "03",
    title: "Multiple chats.",
    body: "Run conversations side by side. Compare answers and branch off new ideas without losing your train of thought.",
    shot: "chats" as ShotId,
    wallpaper: "/bg-04.jpg",
  },
  {
    number: "04",
    title: "Built-in tools.",
    body: "A file explorer, integrated terminals and a browser. View files, run commands and preview your work in one place.",
    shot: "files" as ShotId,
    wallpaper: "/bg-03.jpg",
  },
  {
    number: "05",
    title: "Faster Git workflow.",
    body: "Review diffs, stage changes and write commit messages without leaving Dream.",
    shot: "git" as ShotId,
    wallpaper: "/bg-08.jpg",
  },
];

function Track({ progress }: { progress: MotionValue<number> }) {
  const count = PANELS.length;
  // Each panel is 78vw wide with a 4vw gap; travel until the last one is centred.
  const x = useTransform(
    progress,
    [0.05, 0.95],
    ["11vw", `${11 - (count - 1) * 82}vw`],
  );
  const step = useStep(progress, count);
  const bar = useTransform(progress, [0.05, 0.95], [0, 1]);

  return (
    <div className="flex h-full flex-col justify-center gap-8">
      <motion.div style={{ x }} className="flex w-max gap-[4vw]">
        {PANELS.map((panel, index) => (
          <motion.div
            key={panel.number}
            animate={{
              opacity: index === step ? 1 : 0.35,
              scale: index === step ? 1 : 0.94,
            }}
            transition={{ duration: 0.6, ease }}
            className="grid h-[min(70vh,640px)] w-[78vw] grid-cols-1 overflow-hidden rounded-[2rem] bg-[#121212] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
          >
            <div className="flex flex-col justify-between p-8 sm:p-12">
              <div className="font-mono text-sm text-[var(--primary)]">
                {panel.number} / 0{count}
              </div>
              <div>
                <h3 className="text-[clamp(2rem,3.6vw,3.5rem)] leading-[1] font-semibold tracking-[-0.04em]">
                  {panel.title}
                </h3>
                <p className="mt-5 max-w-sm text-muted-foreground">
                  {panel.body}
                </p>
              </div>
            </div>
            <div
              className="relative hidden overflow-hidden bg-cover bg-center md:block"
              style={{ backgroundImage: `url(${panel.wallpaper})` }}
            >
              <div className="absolute top-12 left-12 w-full">
                <Shot id={panel.shot} width={150} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="mx-auto h-0.5 w-48 overflow-hidden rounded-full bg-white/10">
        <motion.div
          style={{ scaleX: bar }}
          className="h-full origin-left bg-white"
        />
      </div>
    </div>
  );
}

const CAPABILITIES = [
  "Codex",
  "Claude",
  "OpenCode",
  "Cursor",
  "Project tabs",
  "Multi-chat",
  "Branch chats",
  "Stash prompts",
  "Plan mode",
  "Build mode",
  "File explorer",
  "Terminals",
  "Browser previews",
  "Diffs",
  "Commit & push",
  "Worktrees",
  "macOS",
  "Windows",
  "Linux",
  "Open source",
];

function Ticker() {
  const rows = [CAPABILITIES, [...CAPABILITIES].reverse()];
  return (
    <Bleed className="flex flex-col gap-4 overflow-hidden py-24 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
      {rows.map((row, rowIndex) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: two fixed rows
          key={rowIndex}
          animate={{ x: rowIndex === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="flex w-max gap-3"
        >
          {[...row, ...row].map((label, index) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: duplicated loop
              key={index}
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-lg whitespace-nowrap text-white/80"
            >
              {label}
            </span>
          ))}
        </motion.div>
      ))}
    </Bleed>
  );
}

const TOOLS: { id: PanelId; title: string; body: string }[] = [
  {
    id: "files",
    title: "Files",
    body: "Browse the project tree and read any file the agent touched.",
  },
  {
    id: "terminal",
    title: "Terminal",
    body: "Run scripts, tests and Git commands in integrated terminals.",
  },
  {
    id: "browser",
    title: "Browser",
    body: "Open your local app and watch changes land.",
  },
];

function ToolsAccordion() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24">
      <Reveal className="mb-12 text-center">
        <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.04em]">
          Three tools. Zero context switches.
        </h2>
      </Reveal>
      <div className="flex h-[560px] flex-col gap-3 md:flex-row">
        {TOOLS.map((tool, index) => {
          const isActive = index === active;
          return (
            <motion.button
              key={tool.id}
              type="button"
              layout
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              transition={{ type: "spring", duration: 0.7, bounce: 0.1 }}
              className={cn(
                "relative overflow-hidden rounded-3xl bg-[#121212] text-left",
                isActive ? "flex-[4]" : "flex-1",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-cover bg-center transition-opacity duration-700",
                  isActive ? "opacity-100" : "opacity-30",
                )}
                style={{ backgroundImage: `url(/bg-0${index + 2}.jpg)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              {isActive ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease }}
                  className="absolute top-6 right-6 hidden w-[62%] md:block"
                >
                  <ScaledWindow
                    scene={scene({
                      chapter: CHAPTER.tools,
                      tabsShown: true,
                      panel: tool.id,
                      terminalUnits: TERMINAL_UNITS,
                    })}
                    zoom={1.35}
                    originX={1}
                    originY={0.3}
                    className="rounded-[12px] shadow-2xl"
                  />
                </motion.div>
              ) : null}
              <div className="absolute right-8 bottom-8 left-8">
                <div className="text-3xl font-semibold tracking-tight">
                  {tool.title}
                </div>
                <motion.p
                  animate={{ opacity: isActive ? 1 : 0 }}
                  className="mt-2 max-w-sm text-white/70"
                >
                  {tool.body}
                </motion.p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

export default function DesignGallery() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Bleed>
        <Pinned height={520}>{(p) => <Track progress={p} />}</Pinned>
      </Bleed>
      <Ticker />
      <ToolsAccordion />
      <section className="relative flex flex-col items-center gap-8 overflow-hidden py-40 text-center sm:py-56">
        <div className="absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,#bbf7d0,#7dd3fc,#d97757,#a3e635,#bbf7d0)] opacity-20 blur-[120px]" />
        <Reveal className="relative">
          <h2 className="text-[clamp(3rem,9vw,7rem)] leading-none font-semibold tracking-[-0.05em]">
            Dream your dream.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="relative">
          <DownloadButton eventName="designs-gallery-cta" />
        </Reveal>
      </section>
    </div>
  );
}

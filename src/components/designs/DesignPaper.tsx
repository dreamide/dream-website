"use client";

import {
  Code,
  FolderTree,
  GitCommitHorizontal,
  Globe,
  MessagesSquare,
  SquareTerminal,
} from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { type CSSProperties, type ReactNode, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import DownloadButton from "../DownloadButton";
import { PROVIDERS } from "../showcase/data";
import {
  Bleed,
  CHAPTER,
  CountUp,
  ease,
  GitHubButton,
  Reveal,
  ScaledWindow,
  Shot,
  type ShotId,
  scene,
} from "./shared";

/** Re-points the theme tokens so shared components render light. */
const LIGHT = {
  "--background": "#ffffff",
  "--foreground": "#1d1d1f",
  "--muted-foreground": "#6e6e73",
  "--primary": "#15803d",
  background: "#f5f5f7",
  color: "#1d1d1f",
} as CSSProperties;

function Light({
  children,
  className,
  white = false,
}: {
  children: ReactNode;
  className?: string;
  white?: boolean;
}) {
  return (
    <Bleed
      className={cn("px-5", className)}
      style={{ ...LIGHT, background: white ? "#ffffff" : "#f5f5f7" }}
    >
      {children}
    </Bleed>
  );
}

const lightButton =
  "!border-black/10 !bg-black/[0.04] !text-[#1d1d1f] hover:!bg-black/[0.08] !shadow-none";

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <Light className="overflow-hidden pt-24 pb-0 sm:pt-32">
      <div
        ref={ref}
        className="mx-auto flex max-w-6xl flex-col items-center text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          className="text-[clamp(4rem,13vw,10rem)] leading-[0.9] font-semibold tracking-[-0.055em]"
        >
          Dream.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease }}
          className="mt-4 bg-gradient-to-r from-[#15803d] via-[#0d9488] to-[#0369a1] bg-clip-text text-[clamp(1.75rem,4vw,3.25rem)] font-semibold tracking-tight text-transparent"
        >
          Every agent. One window.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <DownloadButton eventName="designs-paper-hero" />
          <GitHubButton
            eventName="designs-paper-github"
            className={lightButton}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.35, ease }}
          className="mt-20 w-full"
        >
          <motion.div
            style={{ y, scale }}
            className="rounded-t-[18px] shadow-[0_-30px_120px_-20px_rgba(0,0,0,0.35)]"
          >
            <ScaledWindow
              scene={scene({ tabsShown: true })}
              className="rounded-[14px]"
            />
          </motion.div>
        </motion.div>
      </div>
    </Light>
  );
}

/** The windows you juggle without Dream, scattered across the "desktop". */
const CLUTTER = [
  { label: "codex", icon: SquareTerminal, x: "6%", y: "10%", r: -6, w: "34%" },
  { label: "claude", icon: SquareTerminal, x: "58%", y: "4%", r: 5, w: "32%" },
  {
    label: "cursor-agent",
    icon: SquareTerminal,
    x: "34%",
    y: "48%",
    r: -3,
    w: "30%",
  },
  { label: "localhost:5173", icon: Globe, x: "64%", y: "52%", r: 7, w: "30%" },
  { label: "editor", icon: Code, x: "2%", y: "56%", r: 4, w: "28%" },
  {
    label: "git client",
    icon: GitCommitHorizontal,
    x: "30%",
    y: "18%",
    r: 2,
    w: "26%",
  },
];

function BeforeAfter() {
  const [mode, setMode] = useState<"before" | "after">("before");

  return (
    <Light white className="py-28 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-semibold tracking-[-0.045em]">
            Stop juggling windows.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[#6e6e73]">
            Agents in one terminal, your app in another, Git somewhere else.
            Dream brings it all together.
          </p>
        </Reveal>
        <div className="mt-10 flex justify-center">
          <LayoutGroup id="paper-toggle">
            <div className="flex rounded-full bg-[#e8e8ed] p-1">
              {(["before", "after"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className="relative px-6 py-2 text-sm font-medium"
                >
                  {mode === value ? (
                    <motion.span
                      layoutId="paper-toggle-pill"
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.2,
                      }}
                      className="absolute inset-0 rounded-full bg-white shadow"
                    />
                  ) : null}
                  <span className="relative">
                    {value === "before" ? "Without Dream" : "With Dream"}
                  </span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
        <div className="relative mt-12 aspect-[16/10] overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#dfe7e1,#d8e3ee)]">
          <AnimatePresence>
            {mode === "before"
              ? CLUTTER.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{
                      opacity: 0,
                      scale: 0.6,
                      x: "-50%",
                      y: "-50%",
                      left: "50%",
                      top: "50%",
                      rotate: 0,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: "0%",
                      y: "0%",
                      left: item.x,
                      top: item.y,
                      rotate: item.r,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.4,
                      left: "50%",
                      top: "50%",
                      x: "-50%",
                      y: "-50%",
                      rotate: 0,
                    }}
                    transition={{
                      type: "spring",
                      duration: 0.9,
                      bounce: 0.2,
                      delay: index * 0.04,
                    }}
                    className="absolute overflow-hidden rounded-xl border border-black/10 bg-[#1b1b1b] text-white shadow-2xl"
                    style={{ width: item.w }}
                  >
                    <div className="flex items-center gap-2 border-white/10 border-b px-3 py-2 text-xs text-white/60">
                      <span className="flex gap-1">
                        <span className="size-2 rounded-full bg-[#ff5f57]" />
                        <span className="size-2 rounded-full bg-[#febc2e]" />
                        <span className="size-2 rounded-full bg-[#28c840]" />
                      </span>
                      <item.icon className="ml-1 size-3.5" />
                      {item.label}
                    </div>
                    <div className="flex flex-col gap-1.5 p-3">
                      <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
                      <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
                      <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
                      <div className="h-1.5 w-1/3 rounded-full bg-white/10" />
                    </div>
                  </motion.div>
                ))
              : null}
          </AnimatePresence>
          <AnimatePresence>
            {mode === "after" ? (
              <motion.div
                key="dream"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  type: "spring",
                  duration: 0.9,
                  bounce: 0.15,
                  delay: 0.15,
                }}
                className="absolute inset-[6%] flex items-center"
              >
                <ScaledWindow
                  scene={scene({
                    chapter: CHAPTER.tools,
                    tabsShown: true,
                    panel: "terminal",
                  })}
                  className="rounded-[12px] shadow-2xl"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </Light>
  );
}

function Numbers() {
  return (
    <section className="py-28 sm:py-40">
      <div className="mx-auto grid max-w-6xl gap-y-16 text-center sm:grid-cols-3">
        {[
          {
            to: 4,
            label: "Agent providers",
            sub: "Codex, Claude, OpenCode, Cursor",
          },
          { to: 3, label: "Built-in tools", sub: "Files, terminal, browser" },
          { to: 1, label: "Window", sub: "For every project you have" },
        ].map((item, index) => (
          <Reveal key={item.label} delay={index * 0.12}>
            <div className="text-[clamp(5rem,12vw,10rem)] leading-none font-semibold tracking-[-0.06em]">
              <CountUp to={item.to} duration={1 + index * 0.3} />
            </div>
            <div className="mt-3 text-xl font-semibold">{item.label}</div>
            <div className="mt-1 text-muted-foreground">{item.sub}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: FolderTree,
    title: "Organize with tabs.",
    body: "All your projects in one window, each with its files, chats and terminals.",
    shot: "tabs" as ShotId,
  },
  {
    icon: MessagesSquare,
    title: "Multiple chats.",
    body: "Run conversations side by side. Compare answers and branch new ideas.",
    shot: "chats" as ShotId,
  },
  {
    icon: GitCommitHorizontal,
    title: "Faster Git.",
    body: "Review diffs, write commit messages and push without leaving Dream.",
    shot: "git" as ShotId,
  },
];

function Features() {
  return (
    <Light className="py-28 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-semibold tracking-[-0.045em]">
            Made for the way
            <br />
            <span className="text-[#86868b]">you work with agents.</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.1}>
              <div className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.04)] transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
                <div className="p-8">
                  <feature.icon className="size-7 text-[#15803d]" />
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[#6e6e73]">{feature.body}</p>
                </div>
                <div className="relative mt-auto h-64 overflow-hidden bg-[#1b1b1b]">
                  <div className="absolute top-6 left-6 w-full transition-transform duration-700 ease-out group-hover:-translate-x-10">
                    <Shot id={feature.shot} width={220} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Light>
  );
}

function Providers() {
  return (
    <Light white className="py-28 sm:py-36">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 className="text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em]">
            Bring your own provider.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#6e6e73]">
            Works with your existing subscriptions and local agent CLIs.
          </p>
        </Reveal>
        <div className="mt-14 flex flex-wrap justify-center gap-x-16 gap-y-10">
          {PROVIDERS.map((provider, index) => (
            <Reveal key={provider.id} delay={index * 0.08}>
              <div className="group flex flex-col items-center gap-3">
                <provider.Icon
                  className={cn(
                    "size-14 text-[#1d1d1f] grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0",
                    provider.iconClass,
                  )}
                />
                <span className="text-sm text-[#6e6e73]">{provider.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Light>
  );
}

export default function DesignPaper() {
  return (
    <div className="flex flex-col">
      <Hero />
      <BeforeAfter />
      <Numbers />
      <Features />
      <Providers />
      <Light className="py-32 sm:py-44">
        <div className="flex flex-col items-center gap-8 text-center">
          <Reveal>
            <h2 className="text-[clamp(3rem,9vw,7rem)] leading-none font-semibold tracking-[-0.05em]">
              Dream your dream.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg text-[#6e6e73]">
              Free and open source for macOS, Windows and Linux.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="flex flex-wrap justify-center gap-3">
            <DownloadButton eventName="designs-paper-cta" />
            <GitHubButton
              eventName="designs-paper-cta-github"
              className={lightButton}
            />
          </Reveal>
        </div>
      </Light>
    </div>
  );
}

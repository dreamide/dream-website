"use client";

import {
  ArrowUp,
  Check,
  ChevronDown,
  GitBranch,
  Globe,
  Lightbulb,
  RotateCw,
  Wrench,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { type ReactNode, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import DownloadButton from "../DownloadButton";
import AppleIcon from "../icons/AppleIcon";
import GitHubIcon from "../icons/GitHubIcon";
import LinuxIcon from "../icons/LinuxIcon";
import WindowsIcon from "../icons/WindowsIcon";
import { COMMIT_FILES, PROVIDERS, TERMINAL } from "../showcase/data";
import {
  ease,
  GitHubButton,
  Reveal,
  ScaledWindow,
  scene,
  useCycle,
} from "./shared";

/** A bento tile with a cursor-following spotlight. */
function Card({
  className,
  title,
  body,
  children,
  delay = 0,
}: {
  className?: string;
  title: string;
  body: string;
  children: ReactNode;
  delay?: number;
}) {
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay, ease }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setSpot({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      }}
      onMouseLeave={() => setSpot(null)}
      className={cn(
        "group relative flex min-h-[300px] flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-[#111111]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: spot ? 1 : 0,
          background: spot
            ? `radial-gradient(420px circle at ${spot.x}px ${spot.y}px, rgba(187,247,208,0.09), transparent 60%)`
            : undefined,
        }}
      />
      <div className="relative flex min-h-0 flex-1 items-center justify-center p-6">
        {children}
      </div>
      <div className="relative p-6 pt-0">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </motion.div>
  );
}

function ProviderDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useCycle(ref, PROVIDERS.length, 1800);
  const provider = PROVIDERS[step];

  return (
    <div ref={ref} className="w-full max-w-md">
      <div className="mb-3 flex flex-col gap-1 rounded-2xl border border-white/10 bg-[#181818] p-2">
        {PROVIDERS.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors duration-300",
              index === step ? "bg-white/10 text-white" : "text-white/45",
            )}
          >
            <item.Icon className={cn("size-4", item.iconClass)} />
            <span className="flex-1">{item.name}</span>
            <span className="text-xs text-white/40">{item.vendor}</span>
            {index === step ? (
              <motion.span layoutId="bento-provider-check">
                <Check className="size-4 text-[var(--primary)]" />
              </motion.span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#181818] p-3">
        <div className="text-sm text-white/40">Ask anything…</div>
        <div className="mt-6 flex items-center gap-2 text-xs">
          <span className="rounded-lg bg-white/[0.06] px-2 py-1">Build</span>
          <span className="flex items-center gap-1.5 overflow-hidden rounded-lg bg-white/[0.06] px-2 py-1">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={provider.id}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.35, ease }}
                className="flex items-center gap-1.5"
              >
                <provider.Icon className={cn("size-3", provider.iconClass)} />
                {provider.model}
              </motion.span>
            </AnimatePresence>
            <ChevronDown className="size-3 text-white/40" />
          </span>
          <span className="ml-auto flex size-6 items-center justify-center rounded-full bg-white text-black">
            <ArrowUp className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

const TAB_NAMES = [
  { name: "dream", color: "#bbf7d0" },
  { name: "website", color: "#7dd3fc" },
  { name: "api", color: "#a78bfa" },
];

function TabsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useCycle(ref, TAB_NAMES.length, 1600);

  return (
    <div ref={ref} className="flex w-full flex-col gap-4">
      <LayoutGroup id="bento-tabs">
        <div className="flex gap-1 rounded-xl bg-[#181818] p-1">
          {TAB_NAMES.map((tab, index) => (
            <div key={tab.name} className="relative flex-1 px-3 py-2 text-sm">
              {index === step ? (
                <motion.div
                  layoutId="bento-tab"
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  className="absolute inset-0 rounded-lg bg-[#2a2a2a]"
                />
              ) : null}
              <span
                className={cn(
                  "relative flex items-center gap-2 transition-colors",
                  index === step ? "text-white" : "text-white/40",
                )}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ background: tab.color }}
                />
                {tab.name}
              </span>
            </div>
          ))}
        </div>
      </LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-2"
        >
          {[80, 62, 90].map((width, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              key={index}
              className="h-2.5 rounded-full"
              style={{
                width: `${width - step * 9 * (index % 2 ? -1 : 1)}%`,
                background: `${TAB_NAMES[step].color}${index === 0 ? "55" : "22"}`,
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ChatsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useCycle(ref, 3, 1900);
  const count = step + 1;

  return (
    <div ref={ref} className="flex h-44 w-full gap-2">
      <AnimatePresence initial={false}>
        {Array.from({ length: count }, (_, index) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional
            key={index}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
            className="flex flex-1 flex-col gap-2 rounded-xl border border-white/10 bg-[#181818] p-3"
          >
            <div className="ml-auto h-5 w-2/3 rounded-lg bg-white/10" />
            <div className="h-2 w-full rounded-full bg-white/[0.07]" />
            <div className="h-2 w-5/6 rounded-full bg-white/[0.07]" />
            <div className="h-2 w-3/4 rounded-full bg-white/[0.07]" />
            <div className="mt-auto h-6 rounded-lg border border-white/10" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function TerminalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useCycle(ref, TERMINAL.length + 3, 650);
  const lines = TERMINAL.slice(0, Math.min(step + 1, TERMINAL.length));

  return (
    <div
      ref={ref}
      className="h-56 w-full overflow-hidden rounded-xl border border-white/10 bg-black p-4 font-mono text-[12px] leading-relaxed"
    >
      {lines.map((line, index) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional
          key={index}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "truncate",
            line.kind === "cmd" && "text-white",
            line.kind === "out" && line.tone === "muted" && "text-white/40",
            line.kind === "out" && line.tone === "ok" && "text-[#4ade80]",
            line.kind === "out" && line.tone === "accent" && "text-[#fbbf24]",
            line.kind === "out" && !line.tone && "text-white/70",
          )}
        >
          {line.kind === "cmd" ? (
            <span className="text-[var(--primary)]">❯ </span>
          ) : null}
          {line.text}
        </motion.div>
      ))}
      <span className="inline-block h-3.5 w-1.5 animate-pulse bg-white/70 align-middle" />
    </div>
  );
}

function BrowserDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useCycle(ref, 2, 2400);

  return (
    <div
      ref={ref}
      className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#181818]"
    >
      <div className="flex items-center gap-2 border-white/10 border-b px-3 py-2 text-xs text-white/50">
        <motion.span
          animate={{ rotate: step * 360 }}
          transition={{ duration: 0.8, ease }}
        >
          <RotateCw className="size-3.5" />
        </motion.span>
        <span className="flex flex-1 items-center gap-1.5 rounded-md bg-black/40 px-2 py-1">
          <Globe className="size-3" /> localhost:5173
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-2 p-4"
        >
          <div
            className="h-16 rounded-lg"
            style={{
              background:
                step === 0
                  ? "linear-gradient(120deg,#1e3a8a,#0e7490)"
                  : "linear-gradient(120deg,#14532d,#4d7c0f)",
            }}
          />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 rounded-md bg-white/[0.06]" />
            <div className="h-10 rounded-md bg-white/[0.06]" />
            <div className="h-10 rounded-md bg-white/[0.06]" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function GitDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useCycle(ref, 3, 1700);

  return (
    <div ref={ref} className="flex w-full flex-col gap-2">
      {COMMIT_FILES.map((file) => (
        <div
          key={file.path}
          className="flex items-center gap-2 rounded-lg bg-[#181818] px-3 py-2 font-mono text-[11px]"
        >
          <span className="min-w-0 flex-1 truncate text-white/70">
            {file.path.split("/").pop()}
          </span>
          <span className="text-[#4ade80]">+{file.added}</span>
        </div>
      ))}
      <motion.div
        animate={{ scale: step === 1 ? 0.96 : 1 }}
        className={cn(
          "mt-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors duration-300",
          step === 2 ? "bg-[#14532d] text-[#bbf7d0]" : "bg-white text-black",
        )}
      >
        {step === 2 ? (
          <>
            <Check className="size-4" /> Pushed to main
          </>
        ) : (
          "Commit & push"
        )}
      </motion.div>
    </div>
  );
}

function ModesDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useCycle(ref, 2, 2000);
  const modes = [
    {
      label: "Plan",
      icon: Lightbulb,
      text: "Investigate and agree on an approach.",
    },
    { label: "Build", icon: Wrench, text: "Carry out the implementation." },
  ];

  return (
    <div ref={ref} className="flex w-full flex-col items-center gap-5">
      <LayoutGroup id="bento-modes">
        <div className="flex rounded-full bg-[#181818] p-1">
          {modes.map((mode, index) => (
            <div key={mode.label} className="relative px-5 py-2 text-sm">
              {index === step ? (
                <motion.div
                  layoutId="bento-mode"
                  transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
                  className="absolute inset-0 rounded-full bg-[var(--primary)]"
                />
              ) : null}
              <span
                className={cn(
                  "relative flex items-center gap-2",
                  index === step ? "text-black" : "text-white/50",
                )}
              >
                <mode.icon className="size-4" />
                {mode.label}
              </span>
            </div>
          ))}
        </div>
      </LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-center text-sm text-white/60"
        >
          {modes[step].text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function WorktreeDemo() {
  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-md" aria-hidden="true">
      <motion.path
        d="M10 100 H390"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
      />
      {[
        {
          d: "M90 100 C130 100 130 40 170 40 H300",
          color: "#bbf7d0",
          delay: 0.6,
        },
        {
          d: "M150 100 C190 100 190 70 230 70 H360",
          color: "#7dd3fc",
          delay: 0.9,
        },
      ].map((branch) => (
        <motion.path
          key={branch.d}
          d={branch.d}
          stroke={branch.color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: branch.delay, ease }}
        />
      ))}
      {[
        [10, 100, "#fff"],
        [90, 100, "#fff"],
        [150, 100, "#fff"],
        [300, 40, "#bbf7d0"],
        [360, 70, "#7dd3fc"],
        [390, 100, "#fff"],
      ].map(([cx, cy, fill], index) => (
        <motion.circle
          // biome-ignore lint/suspicious/noArrayIndexKey: static points
          key={index}
          cx={cx}
          cy={cy}
          r="6"
          fill={fill as string}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.2, type: "spring" }}
        />
      ))}
      <text x="308" y="30" fill="#bbf7d0" fontSize="12">
        fix-settings
      </text>
      <text x="300" y="90" fill="#7dd3fc" fontSize="12">
        try-new-layout
      </text>
      <text x="10" y="128" fill="rgba(255,255,255,0.5)" fontSize="12">
        main
      </text>
    </svg>
  );
}

function PlatformsDemo() {
  return (
    <div className="flex items-center gap-8 text-white/80">
      {[AppleIcon, WindowsIcon, LinuxIcon].map((Icon, index) => (
        <motion.div
          key={Icon.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.15, duration: 0.6, ease }}
          whileHover={{ y: -6 }}
        >
          <Icon className="size-14" />
        </motion.div>
      ))}
    </div>
  );
}

function OpenSourceDemo() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
        transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
        className="absolute size-24 rounded-full border border-[var(--primary)]"
      />
      <motion.div
        animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
        transition={{
          duration: 2.4,
          delay: 1.2,
          repeat: Number.POSITIVE_INFINITY,
        }}
        className="absolute size-24 rounded-full border border-[var(--primary)]"
      />
      <div className="flex size-24 items-center justify-center rounded-full bg-white text-black">
        <GitHubIcon className="size-12" />
      </div>
    </div>
  );
}

export default function DesignBento() {
  return (
    <div className="flex flex-col">
      <section className="grid items-center gap-12 pt-20 pb-24 sm:pt-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground"
          >
            <GitBranch className="size-3.5 text-[var(--primary)]" /> Open source
            desktop IDE
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-semibold tracking-[-0.05em]"
          >
            Built for
            <br />
            <span className="bg-gradient-to-r from-[#bbf7d0] to-[#7dd3fc] bg-clip-text text-transparent">
              AI coding.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="max-w-md text-lg text-muted-foreground"
          >
            Dream puts your agents, projects and tools in one window. Use the
            Codex, Claude, OpenCode and Cursor CLIs you already pay for.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="flex flex-wrap gap-3"
          >
            <DownloadButton eventName="designs-bento-hero" />
            <GitHubButton eventName="designs-bento-github" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 60, rotateY: -18 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          style={{ transformPerspective: 1600 }}
          className="relative rounded-[14px]"
        >
          <div className="absolute -inset-8 rounded-full bg-[#4ade80]/15 blur-[80px]" />
          <ScaledWindow
            scene={scene({ tabsShown: true, columns: 2, chapter: 3 })}
            className="rounded-[14px]"
          />
        </motion.div>
      </section>

      <Reveal className="py-12 text-center">
        <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.04em]">
          Everything, in one window.
        </h2>
      </Reveal>

      <section className="grid auto-rows-[minmax(300px,auto)] gap-4 pb-24 md:grid-cols-6">
        <Card
          className="md:col-span-3 md:row-span-2"
          title="Bring your own provider"
          body="Pick Codex, Claude, OpenCode or Cursor per chat. Your subscriptions, your local CLIs."
        >
          <ProviderDemo />
        </Card>
        <Card
          className="md:col-span-3"
          title="Organize with tabs"
          body="Each project keeps its files, chats and terminals."
          delay={0.08}
        >
          <TabsDemo />
        </Card>
        <Card
          className="md:col-span-3"
          title="Multiple chats"
          body="Side by side, so you can compare and branch."
          delay={0.16}
        >
          <ChatsDemo />
        </Card>
        <Card
          className="md:col-span-4"
          title="Integrated terminal"
          body="Lint, test and check status right beside the agent."
        >
          <TerminalDemo />
        </Card>
        <Card
          className="md:col-span-2"
          title="Built-in browser"
          body="Preview your local app while it changes."
          delay={0.08}
        >
          <BrowserDemo />
        </Card>
        <Card
          className="md:col-span-2"
          title="Commit and push"
          body="Review diffs and ship without switching apps."
        >
          <GitDemo />
        </Card>
        <Card
          className="md:col-span-2"
          title="Plan, then build"
          body="Agree on an approach before any code changes."
          delay={0.08}
        >
          <ModesDemo />
        </Card>
        <Card
          className="md:col-span-2"
          title="Open source"
          body="Read, fork and contribute on GitHub."
          delay={0.16}
        >
          <OpenSourceDemo />
        </Card>
        <Card
          className="md:col-span-4"
          title="Git worktrees"
          body="Give parallel tasks their own checkout so agents never step on each other."
        >
          <WorktreeDemo />
        </Card>
        <Card
          className="md:col-span-2"
          title="Everywhere you code"
          body="macOS, Windows and Linux."
          delay={0.08}
        >
          <PlatformsDemo />
        </Card>
      </section>

      <section className="flex flex-col items-center gap-8 py-32 text-center sm:py-44">
        <Reveal>
          <h2 className="text-[clamp(3rem,9vw,7rem)] leading-none font-semibold tracking-[-0.05em]">
            Dream your dream.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <DownloadButton eventName="designs-bento-cta" />
        </Reveal>
      </section>
    </div>
  );
}

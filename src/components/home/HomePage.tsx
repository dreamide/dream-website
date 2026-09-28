"use client";

import { ArrowUpRight } from "lucide-react";
import { type ReactNode, useRef } from "react";
import { cn } from "../../lib/utils";
import Button from "../Button";
import DownloadButton from "../DownloadButton";
import ClaudeIcon from "../icons/ClaudeIcon";
import CursorIcon from "../icons/CursorIcon";
import GitHubIcon from "../icons/GitHubIcon";
import GrokIcon from "../icons/GrokIcon";
import OpenAIIcon from "../icons/OpenAIIcon";
import OpenCodeIcon from "../icons/OpenCodeIcon";
import { useCycle, useInView, useScrollProgress } from "./hooks";
import ShotStage, { ShotReel } from "./ShotStage";
import { type Frame, lerpRegion, R } from "./shots";

const GITHUB_URL = "https://github.com/dreamide/dream";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** Quiet fade-up on first view. */
function Fade({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({
    once: true,
    threshold: 0.15,
  });
  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "dh-mono text-[11px] uppercase tracking-[0.14em] text-[var(--dh-500)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Screenshot mounted on one of the mountain photos, like the original site. */
function MediaFrame({
  bg,
  children,
  className,
}: {
  bg: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-4 sm:p-8 lg:p-12",
        className,
      )}
      style={{ background: `url(${bg}) center/cover no-repeat` }}
    >
      <div className="overflow-hidden rounded-lg shadow-[0_30px_80px_-24px_rgb(0_0_0/0.75)] ring-1 ring-white/10">
        {children}
      </div>
    </div>
  );
}

function CTAs({ event }: { event: string }) {
  // Top margin leaves room for the download button's sparkles (~80px tall),
  // which rise above it and would otherwise overlap the text.
  return (
    <div className="mt-14 flex flex-wrap items-center gap-3">
      <DownloadButton eventName={`${event}-download`} />
      <Button
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event={`${event}-github`}
      >
        <GitHubIcon className="size-4" />
        Star on GitHub
        <ArrowUpRight className="size-4 text-muted-foreground" />
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(ref, "through");
  // Starts on the first two chats and settles on the whole window.
  const k = Math.min(1, Math.max(0, (p - 0.05) / 0.4));
  const eased = 1 - (1 - k) ** 3;
  const focus = lerpRegion({ x: 40, y: 55, w: 1220, h: 686 }, R.full, eased);

  return (
    <section className="flex flex-col gap-16 pt-16 sm:gap-24 sm:pt-24">
      <Fade>
        <h1 className="select-none text-[clamp(5rem,24.5vw,28rem)] font-bold leading-[0.8] tracking-[-0.04em]">
          DREAM
        </h1>
      </Fade>

      <Fade delay={150} className="grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-light tracking-tight sm:text-3xl">
              Open-source IDE built for AI coding.
            </p>
            <p className="max-w-md text-[var(--dh-400)] sm:text-lg">
              Our goal is to create the best experience for working with AI
              agents. All your agents in a single workspace, organized as tabs,
              under a clean, focused interface.
            </p>
          </div>
          <CTAs event="minimal-hero" />
        </div>
      </Fade>

      <div ref={ref}>
        <Fade delay={300}>
          <MediaFrame bg="/bg-07.jpg">
            <ShotStage
              shot="chats"
              focus={focus}
              duration={0}
              eager
              className="aspect-[16/9] w-full"
            />
          </MediaFrame>
        </Fade>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

type Item = { label: string; frame: Frame };

type Step = {
  id: string;
  title: string;
  body: string;
  items: Item[];
  bg: string;
  extra?: ReactNode;
};

type Group = {
  id: string;
  label: string;
  title: string;
  steps: Step[];
};

const PROVIDER_ICONS = (
  <div className="flex items-center gap-5 text-[var(--dh-400)]">
    <OpenAIIcon className="size-5" />
    <ClaudeIcon className="size-5" />
    <OpenCodeIcon className="size-5" />
    <CursorIcon className="size-5" />
    <GrokIcon className="size-5" />
  </div>
);

const GROUPS: Group[] = [
  {
    id: "1.0",
    label: "Agents",
    title: "Every agent, one workspace.",
    steps: [
      {
        id: "1.1",
        title: "Multiple chats",
        body: "Run several AI conversations side by side. Compare answers, branch off new ideas, and explore different approaches without losing your train of thought.",
        bg: "/bg-04.jpg",
        items: [
          {
            label: "Chats side by side",
            frame: { shot: "chats", focus: R.full },
          },
          {
            label: "Tool calls as they happen",
            frame: { shot: "chats", focus: R.chatChips },
          },
          {
            label: "Reasoning summaries",
            frame: { shot: "chats", focus: R.chatThoughts },
          },
          {
            label: "A model for every chat",
            frame: { shot: "chats", focus: R.chatFooters },
          },
        ],
      },
      {
        id: "1.2",
        title: "Bring your own provider",
        body: "Dream works with your existing subscriptions and local agent CLIs from OpenAI, Anthropic, OpenCode, Cursor, and Grok.",
        bg: "/bg-01.jpg",
        extra: PROVIDER_ICONS,
        items: [
          {
            label: "Codex CLI",
            frame: { shot: "providers", focus: R.providersCard, tint: true },
          },
          {
            label: "Claude Code CLI",
            frame: {
              shot: "providers",
              focus: R.providersAnthropic,
              tint: true,
            },
          },
          {
            label: "Skills for every agent",
            frame: { shot: "skills", focus: R.skillsPanel, tint: true },
          },
        ],
      },
      {
        id: "1.3",
        title: "Stash prompts for later",
        body: "Save a prompt together with its model and permissions, and send it when you're ready.",
        bg: "/bg-05.jpg",
        items: [
          {
            label: "Stashed prompts",
            frame: { shot: "stash", focus: R.stashList },
          },
          { label: "Ready to send", frame: { shot: "stash", focus: R.full } },
        ],
      },
    ],
  },
  {
    id: "2.0",
    label: "Workspace",
    title: "Everything in one window.",
    steps: [
      {
        id: "2.1",
        title: "Organize with tabs",
        body: "All your projects live in one window. Switch between them in a flash, and keep your context — open files, chats, and terminals — right where you left it.",
        bg: "/bg-06.jpg",
        items: [
          {
            label: "Project tabs",
            frame: { shot: "chats", focus: R.tabsZoom },
          },
          {
            label: "Context stays put",
            frame: { shot: "chats", focus: R.full },
          },
        ],
      },
      {
        id: "2.2",
        title: "Files and terminals",
        body: "A file explorer and integrated terminals are built in. Open what an agent just changed and run commands right next to the chat.",
        bg: "/bg-03.jpg",
        items: [
          {
            label: "File explorer",
            frame: { shot: "files", focus: R.filesTop },
          },
          {
            label: "Code editor",
            frame: { shot: "files", focus: R.filesCode },
          },
          {
            label: "Terminals",
            frame: { shot: "terminal", focus: R.terminalTop },
          },
          {
            label: "Dev servers",
            frame: { shot: "terminal", focus: R.terminalTail },
          },
        ],
      },
      {
        id: "2.3",
        title: "Built-in browser",
        body: "Preview your work without leaving Dream, and select an element on the page to send targeted feedback to a chat.",
        bg: "/bg-02.jpg",
        items: [
          {
            label: "Browser preview",
            frame: { shot: "browser", focus: R.browserTop },
          },
          {
            label: "Next to your chat",
            frame: { shot: "browser", focus: R.full },
          },
        ],
      },
    ],
  },
  {
    id: "3.0",
    label: "Git",
    title: "From first edit to merged PR.",
    steps: [
      {
        id: "3.1",
        title: "Review every change",
        body: "Every edit an agent makes shows up as a diff. Leave line-level feedback and send it straight back to the chat.",
        bg: "/bg-08.jpg",
        items: [
          {
            label: "Changes panel",
            frame: { shot: "diffs", focus: R.diffTop },
          },
          {
            label: "Line-level diffs",
            frame: { shot: "diffs", focus: R.diffMixed },
          },
        ],
      },
      {
        id: "3.2",
        title: "Commit and push",
        body: "Stage changes, let a model draft the commit message, and push — without leaving your editor.",
        bg: "/bg-07.jpg",
        items: [
          { label: "Commit", frame: { shot: "commit", focus: R.commitDialog } },
          { label: "Push", frame: { shot: "push", focus: R.pushDialog } },
        ],
      },
      {
        id: "3.3",
        title: "Pull requests",
        body: "Open a pull request with a generated title and description, then follow its checks and comments in the same window.",
        bg: "/bg-04.jpg",
        items: [
          {
            label: "Create a pull request",
            frame: { shot: "createPr", focus: R.prDialog },
          },
          {
            label: "Checks and comments",
            frame: { shot: "viewPr", focus: R.viewPrTop },
          },
        ],
      },
    ],
  },
];

const FRAME_MS = 4200;

function StepRow({ step }: { step: Step }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 });
  const [index, setIndex] = useCycle(step.items.length, FRAME_MS, inView);
  const frames = step.items.map((i) => i.frame);

  return (
    <div
      ref={ref}
      className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16"
    >
      <Fade className="flex flex-col gap-8 lg:col-span-4">
        <div className="flex flex-col gap-4">
          <Label>{step.id}</Label>
          <h3 className="text-2xl font-light tracking-tight sm:text-3xl">
            {step.title}
          </h3>
          <p className="leading-relaxed text-[var(--dh-400)]">{step.body}</p>
          {step.extra && <div className="pt-2">{step.extra}</div>}
        </div>

        <ul className="flex flex-col border-t border-[var(--dh-line)]">
          {step.items.map((item, i) => (
            <li key={item.label} className="border-b border-[var(--dh-line)]">
              <button
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "relative flex w-full cursor-pointer items-center justify-between py-3 text-left text-sm transition-colors duration-300",
                  i === index
                    ? "text-[#fafafa]"
                    : "text-[var(--dh-500)] hover:text-[var(--dh-400)]",
                )}
              >
                {item.label}
                <span className="dh-mono text-[10px] text-[var(--dh-500)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i === index && (
                  <span
                    key={index}
                    className={cn(
                      "absolute -bottom-px left-0 h-px bg-[var(--dh-400)]",
                      inView ? "dh-fill" : "w-full",
                    )}
                    style={
                      { "--dh-fill-ms": `${FRAME_MS}ms` } as React.CSSProperties
                    }
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </Fade>

      <Fade delay={120} className="lg:col-span-8">
        <MediaFrame bg={step.bg}>
          <ShotReel
            frames={frames}
            index={index}
            duration={1500}
            className="aspect-[16/9] w-full"
          />
        </MediaFrame>
      </Fade>
    </div>
  );
}

function GroupSection({ group }: { group: Group }) {
  return (
    <section className="flex flex-col gap-24 sm:gap-32">
      <Fade>
        <div className="flex flex-col gap-6 border-t border-[var(--dh-line)] pt-6 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="text-3xl font-light tracking-tight sm:text-4xl">
            {group.title}
          </h2>
          <div className="flex gap-16">
            <Label>{group.label}</Label>
            <Label>{group.id}</Label>
          </div>
        </div>
      </Fade>
      <div className="flex flex-col gap-32 sm:gap-48 lg:gap-60">
        {group.steps.map((s) => (
          <StepRow key={s.id} step={s} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Closing() {
  return (
    <section className="border-t border-[var(--dh-line)] pt-6">
      <div className="flex justify-end">
        <Label>Download</Label>
      </div>
      <Fade className="flex flex-col gap-10 py-24 sm:py-32">
        <h2 className="text-[clamp(2.75rem,8vw,6rem)] font-bold leading-[0.9] tracking-[-0.03em]">
          Dream your dream.
        </h2>
        <p className="max-w-md text-[var(--dh-400)] sm:text-lg">
          Available for macOS, Windows, and Linux.
        </p>
        <CTAs event="minimal-cta" />
      </Fade>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-40 pb-16 sm:gap-56">
      <Hero />
      {GROUPS.map((g) => (
        <GroupSection key={g.id} group={g} />
      ))}
      <Closing />
    </div>
  );
}

"use client";

import {
  AnimatePresence,
  type MotionValue,
  motion,
  useTransform,
} from "motion/react";
import { cn } from "../../lib/utils";
import DownloadButton from "../DownloadButton";
import {
  COMMIT_MESSAGE,
  PROVIDERS,
  type TabId,
  TERMINAL_UNITS,
} from "../showcase/data";
import type { PanelId } from "../showcase/scene";
import {
  Bleed,
  CHAPTER,
  Eyebrow,
  ease,
  GitHubButton,
  Pinned,
  Reveal,
  ScaledWindow,
  ScrollWords,
  scene,
  useStep,
} from "./shared";

function Wallpaper({
  src,
  progress,
  dim = 0.45,
}: {
  src: string;
  progress: MotionValue<number>;
  dim?: number;
}) {
  const scale = useTransform(progress, [0, 1], [1.15, 1]);
  return (
    <>
      <motion.div
        style={{ scale, backgroundImage: `url(${src})` }}
        className="absolute inset-0 bg-cover bg-center"
      />
      <div
        className="absolute inset-0"
        style={{ background: `rgba(0,0,0,${dim})` }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0a0a] to-transparent" />
    </>
  );
}

function Opening({ progress }: { progress: MotionValue<number> }) {
  const zoom = useTransform(progress, [0, 0.7], [2.6, 1]);
  const y = useTransform(progress, [0, 0.7], ["18%", "4%"]);
  const titleOpacity = useTransform(progress, [0, 0.25], [1, 0]);
  const titleScale = useTransform(progress, [0, 0.25], [1, 1.25]);
  const titleBlur = useTransform(
    progress,
    [0, 0.25],
    ["blur(0px)", "blur(20px)"],
  );
  const tagOpacity = useTransform(progress, [0.55, 0.8], [0, 1]);
  const tagY = useTransform(progress, [0.55, 0.8], [30, 0]);

  return (
    <>
      <Wallpaper src="/bg-07.jpg" progress={progress} dim={0.35} />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          style={{ scale: zoom, y }}
          className="w-[min(1100px,88vw)] rounded-[14px]"
        >
          <ScaledWindow scene={scene()} className="rounded-[14px]" />
        </motion.div>
      </div>
      <motion.div
        style={{ opacity: titleOpacity, scale: titleScale, filter: titleBlur }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center"
      >
        <div className="text-[clamp(5rem,22vw,20rem)] leading-none font-bold tracking-[-0.06em]">
          DREAM
        </div>
        <div className="mt-4 text-lg text-white/70">Scroll to step inside.</div>
      </motion.div>
      <motion.div
        style={{ opacity: tagOpacity, y: tagY }}
        className="absolute inset-x-0 top-[6%] flex flex-col items-center gap-4 px-4 text-center"
      >
        <h1 className="text-[clamp(2rem,5vw,4.5rem)] leading-none font-semibold tracking-[-0.04em]">
          Your agents. One window.
        </h1>
        <div className="flex flex-wrap justify-center gap-3">
          <DownloadButton eventName="designs-cinema-hero" />
          <GitHubButton eventName="designs-cinema-github" />
        </div>
      </motion.div>
    </>
  );
}

function ProvidersChapter({ progress }: { progress: MotionValue<number> }) {
  const step = useStep(progress, PROVIDERS.length);
  const provider = PROVIDERS[step];

  return (
    <>
      <Wallpaper src="/bg-01.jpg" progress={progress} dim={0.6} />
      <div className="relative mx-auto grid h-full max-w-7xl items-center gap-10 px-6 lg:px-16 lg:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Eyebrow className="mb-4">Bring your own provider</Eyebrow>
          {PROVIDERS.map((item, index) => (
            <motion.div
              key={item.id}
              animate={{
                opacity: index === step ? 1 : 0.18,
                x: index === step ? 0 : -12,
              }}
              transition={{ duration: 0.5, ease }}
              className="flex items-center gap-5 text-[clamp(3rem,8vw,7rem)] leading-[1] font-semibold tracking-[-0.05em]"
            >
              {item.name}.
            </motion.div>
          ))}
        </div>
        <div className="hidden flex-col items-center gap-8 lg:flex">
          <AnimatePresence mode="wait">
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
              transition={{ type: "spring", duration: 0.7, bounce: 0.3 }}
              className="flex size-56 items-center justify-center rounded-[3rem] border border-white/10 bg-black/50 backdrop-blur-xl"
            >
              <provider.Icon className={cn("size-28", provider.iconClass)} />
            </motion.div>
          </AnimatePresence>
          <p className="max-w-sm text-center text-lg text-white/70">
            Dream runs the {provider.vendor} agent CLI you already have, with
            your existing subscription. Model:{" "}
            <span className="text-white">{provider.model}</span>.
          </p>
        </div>
      </div>
    </>
  );
}

const TAB_ORDER: TabId[] = ["dream", "website", "api"];

function TabsChapter({ progress }: { progress: MotionValue<number> }) {
  const step = useStep(progress, 4);
  const headlineY = useTransform(progress, [0, 0.3], [60, 0]);
  const headlineOpacity = useTransform(progress, [0, 0.2], [0, 1]);

  return (
    <>
      <Wallpaper src="/bg-06.jpg" progress={progress} />
      <div className="relative flex h-full flex-col items-center justify-center gap-10 px-6">
        <motion.div
          style={{ y: headlineY, opacity: headlineOpacity }}
          className="text-center"
        >
          <h2 className="text-[clamp(3rem,9vw,8rem)] leading-[0.95] font-semibold tracking-[-0.05em]">
            One window.
            <br />
            <span className="text-white/45">Every project.</span>
          </h2>
        </motion.div>
        <div className="w-[min(1000px,92vw)] rounded-[14px]">
          <ScaledWindow
            className="rounded-[14px]"
            scene={scene({
              chapter: CHAPTER.tabs,
              tabsShown: step > 0,
              activeTab: TAB_ORDER[Math.max(0, step - 1)],
            })}
            zoom={1.5}
            originX={0}
            originY={0}
          />
        </div>
      </div>
    </>
  );
}

function ChatsChapter({ progress }: { progress: MotionValue<number> }) {
  const step = useStep(progress, 3);
  const columns = (step + 1) as 1 | 2 | 3;

  return (
    <>
      <Wallpaper src="/bg-04.jpg" progress={progress} />
      <div className="relative flex h-full flex-col justify-end gap-8 px-6 pb-10 sm:pb-16">
        <div className="mx-auto w-[min(1200px,94vw)] rounded-[14px]">
          <ScaledWindow
            className="rounded-[14px]"
            scene={scene({ chapter: CHAPTER.chats, tabsShown: true, columns })}
          />
        </div>
        <div className="mx-auto flex w-[min(1200px,94vw)] items-end justify-between gap-6">
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] leading-none font-semibold tracking-[-0.05em]">
            {["One chat.", "Two chats.", "Three chats."].map((label, index) => (
              <motion.span
                key={label}
                animate={{ opacity: index === step ? 1 : 0.15 }}
                className="mr-4 inline-block"
              >
                {label}
              </motion.span>
            ))}
          </h2>
          <p className="hidden max-w-xs text-white/70 md:block">
            Run conversations side by side. Compare answers, branch new ideas,
            and never lose your train of thought.
          </p>
        </div>
      </div>
    </>
  );
}

const TOOLS: { id: PanelId; word: string; body: string }[] = [
  {
    id: "files",
    word: "Files.",
    body: "Browse every file your agent touches.",
  },
  {
    id: "terminal",
    word: "Terminal.",
    body: "Run lint, tests and scripts in place.",
  },
  { id: "browser", word: "Browser.", body: "Preview your app as it changes." },
];

function ToolsChapter({ progress }: { progress: MotionValue<number> }) {
  const step = useStep(progress, TOOLS.length);
  const tool = TOOLS[step];

  return (
    <>
      <Wallpaper src="/bg-03.jpg" progress={progress} />
      <div className="relative mx-auto grid h-full max-w-[1500px] items-center gap-8 px-6 lg:px-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]">
        <div>
          <Eyebrow className="mb-6">Built-in tools</Eyebrow>
          <div className="relative h-[clamp(4.2rem,10.8vw,9.6rem)] overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={tool.id}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.6, ease }}
                className="absolute inset-0 text-[clamp(3.5rem,9vw,8rem)] leading-[1.2] font-semibold tracking-[-0.05em]"
              >
                {tool.word}
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-6 text-xl text-white/70">{tool.body}</p>
          <div className="mt-8 flex gap-2">
            {TOOLS.map((item, index) => (
              <span
                key={item.id}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  index === step ? "w-10 bg-white" : "w-4 bg-white/25",
                )}
              />
            ))}
          </div>
        </div>
        <div className="rounded-[14px]">
          <ScaledWindow
            className="rounded-[14px]"
            scene={scene({
              chapter: CHAPTER.tools,
              tabsShown: true,
              panel: tool.id,
              terminalUnits: TERMINAL_UNITS,
            })}
            zoom={1.25}
            originX={1}
            originY={0.5}
          />
        </div>
      </div>
    </>
  );
}

function GitChapter({ progress }: { progress: MotionValue<number> }) {
  // Fine-grained steps so the commit message types out as you scroll.
  const fine = useStep(progress, 100);
  const step = Math.min(3, Math.floor(fine / 25));
  const chars = Math.round(
    Math.min(1, Math.max(0, (fine - 25) / 18)) * COMMIT_MESSAGE.length,
  );

  return (
    <>
      <Wallpaper src="/bg-08.jpg" progress={progress} />
      <div className="relative flex h-full flex-col items-center justify-center gap-8 px-6">
        <h2 className="text-center text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] font-semibold tracking-[-0.05em]">
          <span
            className={cn(
              "transition-opacity duration-500",
              step === 0 ? "opacity-100" : "opacity-25",
            )}
          >
            Diff.{" "}
          </span>
          <span
            className={cn(
              "transition-opacity duration-500",
              step === 1 || step === 2 ? "opacity-100" : "opacity-25",
            )}
          >
            Commit.{" "}
          </span>
          <span
            className={cn(
              "transition-opacity duration-500",
              step === 3 ? "opacity-100" : "opacity-25",
            )}
          >
            Push.
          </span>
        </h2>
        <div className="w-[min(1000px,92vw)] rounded-[14px]">
          <ScaledWindow
            className="rounded-[14px]"
            scene={scene({
              chapter: CHAPTER.git,
              tabsShown: true,
              panel: "changes",
              commitOpen: step === 1 || step === 2,
              commitChars: step === 1 ? chars : COMMIT_MESSAGE.length,
              commitPressed: step === 2,
              committed: step === 3,
            })}
          />
        </div>
      </div>
    </>
  );
}

function Manifesto() {
  return (
    <section className="mx-auto max-w-5xl px-2 py-40 sm:py-60">
      <ScrollWords
        text="Dream is an open-source desktop IDE built for AI coding. It keeps your agents, projects, files, terminals and Git in one calm place, so you can think about the work instead of the windows."
        className="text-[clamp(2rem,4.6vw,4rem)] leading-[1.12] font-semibold tracking-[-0.035em]"
      />
    </section>
  );
}

function Finale() {
  return (
    <Bleed className="relative flex min-h-[90vh] flex-col items-center justify-center gap-10 overflow-hidden px-6 text-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/bg-05.jpg)" }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#0a0a0a] to-transparent" />
      <Reveal className="relative">
        <h2 className="text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] font-bold tracking-[-0.06em]">
          Dream your
          <br />
          dream.
        </h2>
      </Reveal>
      <Reveal
        delay={0.2}
        className="relative flex flex-wrap justify-center gap-3"
      >
        <DownloadButton eventName="designs-cinema-cta" />
        <GitHubButton eventName="designs-cinema-cta-github" />
      </Reveal>
    </Bleed>
  );
}

export default function DesignCinema() {
  return (
    <div className="flex flex-col">
      <Bleed>
        <Pinned height={260}>{(p) => <Opening progress={p} />}</Pinned>
      </Bleed>
      <Manifesto />
      <Bleed className="flex flex-col">
        <Pinned height={320}>{(p) => <ProvidersChapter progress={p} />}</Pinned>
        <Pinned height={300}>{(p) => <TabsChapter progress={p} />}</Pinned>
        <Pinned height={300}>{(p) => <ChatsChapter progress={p} />}</Pinned>
        <Pinned height={300}>{(p) => <ToolsChapter progress={p} />}</Pinned>
        <Pinned height={340}>{(p) => <GitChapter progress={p} />}</Pinned>
      </Bleed>
      <Finale />
    </div>
  );
}

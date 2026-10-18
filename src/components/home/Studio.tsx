"use client";

import {
  AnimatePresence,
  MotionConfig,
  type MotionValue,
  motion,
  useTransform,
} from "motion/react";
import { cn } from "../../lib/utils";
import DownloadButton from "../DownloadButton";
import Hero from "../Hero";
import { PROVIDERS } from "../showcase/data";
import { type PanelId, sceneAt } from "../showcase/scene";
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
  useStep,
} from "./shared";

type ChapterProps = {
  progress: MotionValue<number>;
};

// Drive the app interactions from each chapter’s scroll progress.
function useChapterScene(progress: MotionValue<number>, chapter: number) {
  const tick = useStep(progress, 1000);
  return sceneAt(chapter + tick / 1000);
}

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

function ProvidersChapter({ progress }: ChapterProps) {
  const current = useChapterScene(progress, CHAPTER.providers);
  const step = current.provider;
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
        <div className="flex min-w-0 flex-col items-center gap-8">
          <ScaledWindow
            scene={current}
            zoom={current.camera.zoom}
            originX={current.camera.x}
            originY={current.camera.y}
            className="rounded-[14px]"
          />
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

function TabsChapter({ progress }: ChapterProps) {
  const current = useChapterScene(progress, CHAPTER.tabs);
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
            scene={current}
            zoom={current.camera.zoom}
            originX={0}
            originY={0}
          />
        </div>
      </div>
    </>
  );
}

function ChatsChapter({ progress }: ChapterProps) {
  const current = useChapterScene(progress, CHAPTER.chats);
  const step = current.columns - 1;

  return (
    <>
      <Wallpaper src="/bg-04.jpg" progress={progress} />
      <div className="relative flex h-full flex-col justify-end gap-8 px-6 pb-10 sm:pb-16">
        <div className="mx-auto w-[min(1200px,94vw)] rounded-[14px]">
          <ScaledWindow className="rounded-[14px]" scene={current} />
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

function ToolsChapter({ progress }: ChapterProps) {
  const current = useChapterScene(progress, CHAPTER.tools);
  const step = TOOLS.findIndex((tool) => tool.id === current.panel);
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
            scene={current}
            zoom={current.camera.zoom}
            originX={1}
            originY={0.5}
          />
        </div>
      </div>
    </>
  );
}

function GitChapter({ progress }: ChapterProps) {
  const current = useChapterScene(progress, CHAPTER.git);
  const step = current.committed
    ? 3
    : current.commitPressed
      ? 2
      : current.commitOpen
        ? 1
        : 0;

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
          <ScaledWindow className="rounded-[14px]" scene={current} />
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
        <DownloadButton eventName="home-cta-download" />
        <GitHubButton eventName="home-cta-github" />
      </Reveal>
    </Bleed>
  );
}

export default function Studio() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="landing-page flex flex-col">
        <Hero />
        <Manifesto />
        <Bleed className="flex flex-col">
          <Pinned height={320}>
            {(p) => <ProvidersChapter progress={p} />}
          </Pinned>
          <Pinned height={300}>{(p) => <TabsChapter progress={p} />}</Pinned>
          <Pinned height={300}>{(p) => <ChatsChapter progress={p} />}</Pinned>
          <Pinned height={300}>{(p) => <ToolsChapter progress={p} />}</Pinned>
          <Pinned height={340}>{(p) => <GitChapter progress={p} />}</Pinned>
        </Bleed>
        <Finale />
      </div>
    </MotionConfig>
  );
}

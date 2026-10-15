"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Code,
  Columns2,
  Copy,
  File,
  FileImage,
  Files,
  ListTree,
  Lock,
  Plus,
  RotateCw,
  Rows2,
  Sparkles,
  SquareTerminal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import DreamLogo from "../icons/DreamLogo";
import {
  COMMIT_FILES,
  COMMIT_MESSAGE,
  TERMINAL,
  TERMINAL_OUT_UNITS,
} from "./data";
import {
  DIFF,
  FILE_TREE,
  MAIN_JS,
  MAIN_JS_PATH,
  type TreeKind,
  type TreeRow,
} from "./files";
import { highlight } from "./highlight";
import MiniApp from "./MiniApp";
import type { PanelId } from "./scene";

const ease = [0.22, 1, 0.36, 1] as const;

function Header({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[51px] shrink-0 items-center gap-2.5 border-white/[0.08] border-b px-3.5 text-[#e5e5e5]">
      {children}
    </div>
  );
}

function Title({
  icon: Icon,
  children,
}: {
  icon: typeof Files;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 text-[15px] font-semibold">
      <Icon className="size-4 text-[#a3a3a3]" />
      {children}
    </div>
  );
}

const mono = "font-mono text-[13px] leading-[18px]";

function FileIcon({ kind }: { kind: TreeKind }) {
  if (kind === "js") {
    return (
      <span className="flex size-3.5 shrink-0 items-end justify-end rounded-[2px] bg-[#f7df1e] pr-px pb-px font-sans text-[6.5px] leading-none font-bold text-black">
        JS
      </span>
    );
  }
  if (kind === "image") {
    return <FileImage className="size-3.5 shrink-0 text-[#2dd4bf]" />;
  }
  return <File className="size-3.5 shrink-0 text-[#a3a3a3]" />;
}

function TreeItem({ row, index }: { row: TreeRow; index: number }) {
  const Chevron = row.open ? ChevronDown : ChevronRight;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.1 + index * 0.012, ease }}
      className={cn(
        "flex h-6 items-center gap-2 rounded-md pr-2 font-mono text-[14px] whitespace-nowrap",
        row.selected ? "bg-white/[0.08] text-white" : "text-[#d4d4d4]",
      )}
      style={{ paddingLeft: 10 + row.depth * 19 }}
    >
      {row.kind === "folder" ? (
        <Chevron className="size-3.5 shrink-0 text-[#8b8b8b]" />
      ) : (
        <FileIcon kind={row.kind} />
      )}
      <span className="truncate">{row.name}</span>
    </motion.div>
  );
}

function CodeLine({ text }: { text: string }) {
  return (
    <>
      {highlight(text).map(([part, color], index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: tokens are positional
          key={index}
          style={color ? { color } : undefined}
        >
          {part}
        </span>
      ))}
    </>
  );
}

function FilesPanel() {
  return (
    <>
      <Header>
        <Title icon={Files}>Files</Title>
        <div className="flex-1 text-center text-[13px] text-[#a3a3a3]">
          ~/dev/dream
        </div>
        <RotateCw className="size-4 text-[#a3a3a3]" />
      </Header>
      <div className="flex min-h-0 flex-1">
        <div className="flex w-[302px] shrink-0 flex-col gap-1.5 overflow-hidden border-white/[0.08] border-r px-5 pt-2.5">
          <div className="mb-1.5 flex h-9 shrink-0 items-center rounded-lg border border-white/[0.1] bg-white/[0.03] px-3 text-[14px] text-[#8b8b8b]">
            Search…
          </div>
          <div className="flex flex-col">
            {FILE_TREE.map((row, index) => (
              <TreeItem
                key={`${row.depth}-${row.name}`}
                row={row}
                index={index}
              />
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-8 shrink-0 items-center gap-2 px-3.5 font-mono text-[13px] text-[#a3a3a3]">
            <File className="size-3.5" />
            {MAIN_JS_PATH}
            <Copy className="ml-auto size-3.5" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className={cn("min-h-0 flex-1 overflow-hidden pt-3", mono)}
          >
            {MAIN_JS.map((line, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional
                key={index}
                className="flex whitespace-pre"
              >
                <span className="w-[52px] shrink-0 pr-4 text-right text-[#6e7681]">
                  {index + 1}
                </span>
                <span className="text-[#e5e5e5]">
                  <CodeLine text={line} />
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}

function DiffView() {
  let row = 0;
  return (
    <div className={cn("min-h-0 flex-1 overflow-hidden", mono)}>
      {DIFF.map((file) => (
        <div key={file.path}>
          <div className="flex h-10 items-center gap-2.5 border-white/[0.1] border-b bg-[#0c0c0c] px-3.5 font-sans text-[14px]">
            <FileIcon kind="js" />
            <span className="font-mono font-semibold text-white">
              {file.path}
            </span>
            <span className="ml-auto font-mono text-[#3fb950]">
              +{file.added}
            </span>
            <span className="font-mono text-[#f85149]">-{file.removed}</span>
            <ChevronDown className="ml-1 size-4 text-[#a3a3a3]" />
          </div>
          {file.lines.map((line) => {
            const order = row++;
            if (line.kind === "skip") {
              return (
                <div
                  key={`${file.path}-skip-${order}`}
                  className="flex h-8 items-center bg-[#262626] px-2 font-mono text-[13px] text-[#a3a3a3]"
                >
                  {line.count} unmodified lines
                </div>
              );
            }
            return (
              <div
                key={`${file.path}-${line.number}`}
                className={cn(
                  "relative flex whitespace-pre",
                  line.added && "bg-[#3fb950]/[0.07]",
                )}
              >
                {line.added ? (
                  <motion.span
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.15 + order * 0.012,
                      ease,
                    }}
                    className="absolute inset-y-0 left-0 w-[3px] origin-top bg-[#3fb950]"
                  />
                ) : null}
                <span
                  className={cn(
                    "w-[44px] shrink-0 pr-3 text-right",
                    line.added ? "text-[#3fb950]" : "text-[#6e7681]",
                  )}
                >
                  {line.number}
                </span>
                <span className="text-[#e5e5e5]">
                  <CodeLine text={line.text} />
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Caret() {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 1.1,
        repeat: Number.POSITIVE_INFINITY,
        times: [0, 0.5, 0.5, 1],
      }}
      className="ml-px inline-block h-[18px] w-[9px] translate-y-[3px] bg-[#d4d4d4]"
    />
  );
}

function Prompt({
  command,
  caret,
  spaced,
}: {
  command: string;
  caret: boolean;
  spaced: boolean;
}) {
  return (
    <div className={spaced ? "mt-3" : undefined}>
      <span className="text-[#bbf7d0]">~/dev/dream</span>
      <span className="text-[#8b8b8b]"> on </span>
      <span className="text-[#c4b5fd]">main</span>
      <span className="text-[#8b8b8b]"> $ </span>
      <span className="text-white">{command}</span>
      {caret ? <Caret /> : null}
    </div>
  );
}

function TerminalPanel({ units }: { units: number }) {
  let remaining = units;
  let caretPlaced = false;
  const rows: ReactNode[] = [];

  for (const line of TERMINAL) {
    if (remaining <= 0) break;

    if (line.kind === "cmd") {
      const shown = line.text.slice(0, remaining);
      remaining -= line.text.length;
      // The caret follows the command being typed, or the last one typed
      // while its output has not arrived yet.
      caretPlaced = remaining <= 0;
      rows.push(
        <Prompt
          key={`cmd-${line.text}`}
          command={shown}
          caret={caretPlaced}
          spaced={rows.length > 0}
        />,
      );
    } else {
      remaining -= TERMINAL_OUT_UNITS;
      rows.push(
        <motion.div
          key={`out-${line.text}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "whitespace-pre",
            line.tone === "muted" && "text-[#737373]",
            line.tone === "ok" && "text-[#86efac]",
            line.tone === "accent" && "text-[#fcd34d]",
            !line.tone && "text-[#d4d4d4]",
          )}
        >
          {line.text}
        </motion.div>,
      );
    }
  }

  if (!caretPlaced) {
    rows.push(<Prompt key="idle" command="" caret spaced={rows.length > 0} />);
  }

  return (
    <>
      <Header>
        <Title icon={SquareTerminal}>Terminal</Title>
        <div className="ml-4 flex items-center gap-1.5">
          <div className="flex h-7 items-center gap-2 rounded-md bg-white/[0.08] px-2.5 text-[13px]">
            zsh
            <X className="size-3 text-[#8b8b8b]" />
          </div>
          <div className="flex h-7 items-center rounded-md px-2.5 text-[13px] text-[#8b8b8b]">
            pnpm
          </div>
          <Plus className="ml-1 size-4 text-[#8b8b8b]" />
        </div>
      </Header>
      <div className="min-h-0 flex-1 overflow-hidden p-5 font-mono text-[14px] leading-[1.7]">
        {rows}
      </div>
    </>
  );
}

/** A miniature of this very site, to give the browser something to preview. */
function BrowserPanel() {
  return (
    <>
      <Header>
        <ArrowLeft className="size-4 text-[#a3a3a3]" />
        <ArrowRight className="size-4 text-[#525252]" />
        <RotateCw className="size-4 text-[#a3a3a3]" />
        <div className="ml-2 flex h-8 flex-1 items-center gap-2 rounded-lg bg-white/[0.06] px-3 text-[13px] text-[#d4d4d4]">
          <Lock className="size-3.5 text-[#8b8b8b]" />
          localhost:5173
        </div>
      </Header>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#0a0a0a]">
        <div className="flex h-12 items-center justify-between border-white/[0.08] border-b px-6">
          <div className="flex items-center gap-2 text-[16px] font-bold tracking-tight text-white">
            <DreamLogo className="size-5 rounded-full" />
            Dream
          </div>
          <div className="flex items-center gap-4 text-[13px] text-[#d4d4d4]">
            Docs
            <span className="rounded-full bg-[var(--primary)] px-3 py-1 font-semibold text-black">
              Download
            </span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="flex flex-col items-center pt-14"
        >
          <div className="text-[150px] leading-none font-bold tracking-tight text-white">
            DREAM
          </div>
          <div className="mt-6 text-[16px] text-[#a3a3a3]">
            Open-source IDE built for AI coding.
          </div>
          <div className="mt-8 flex gap-3">
            <span className="rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-black">
              Download for macOS
            </span>
            <span className="rounded-lg border border-white/10 px-4 py-2 text-[13px] text-white">
              Star on GitHub
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="absolute inset-x-10 top-[430px] rounded-xl p-6"
          style={{ background: "url(/bg-07.jpg) center/cover no-repeat" }}
        >
          <MiniApp />
        </motion.div>
      </div>
    </>
  );
}

function ChangesPanel({ committed }: { committed: boolean }) {
  return (
    <>
      <Header>
        <Title icon={Code}>Changes</Title>
        <div className="ml-auto flex items-center gap-1 rounded-lg bg-white/[0.06] p-0.5">
          <div className="rounded-md bg-white/[0.1] p-1.5">
            <Rows2 className="size-3.5" />
          </div>
          <div className="p-1.5 text-[#8b8b8b]">
            <Columns2 className="size-3.5" />
          </div>
        </div>
        <ListTree className="ml-2 size-4 text-[#a3a3a3]" />
        <RotateCw className="ml-2 size-4 text-[#a3a3a3]" />
      </Header>
      <AnimatePresence mode="wait" initial={false}>
        {committed ? (
          <motion.div
            key="clean"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-1 flex-col items-center justify-center gap-3 text-center"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <Check className="size-6 text-[var(--primary)]" />
            </div>
            <div className="text-[16px] font-semibold text-white">
              No changes
            </div>
            <div className="text-[13px] text-[#8b8b8b]">
              Working tree is clean.
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="diff"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <DiffView />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export const Panel = memo(function Panel({
  panel,
  terminalUnits,
  committed,
}: {
  panel: PanelId;
  terminalUnits: number;
  committed: boolean;
}) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={panel}
        initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: -24, filter: "blur(6px)" }}
        transition={{ duration: 0.5, ease }}
        className="absolute inset-0 flex flex-col"
      >
        {panel === "files" ? <FilesPanel /> : null}
        {panel === "terminal" ? <TerminalPanel units={terminalUnits} /> : null}
        {panel === "browser" ? <BrowserPanel /> : null}
        {panel === "changes" ? <ChangesPanel committed={committed} /> : null}
      </motion.div>
    </AnimatePresence>
  );
});

export const CommitDialog = memo(function CommitDialog({
  chars,
  pressed,
}: {
  chars: number;
  pressed: boolean;
}) {
  const typing = chars > 0 && chars < COMMIT_MESSAGE.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.18 }}
        className="w-[560px] rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center justify-between">
          <div className="text-[18px] font-semibold text-white">Commit</div>
          <X className="size-4 text-[#8b8b8b]" />
        </div>
        <div className="mt-1 text-[13px] text-[#8b8b8b]">
          3 files changed on <span className="text-[#d4d4d4]">main</span>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.08]">
          {COMMIT_FILES.map((file) => (
            <div
              key={file.path}
              className="flex h-10 items-center justify-between border-white/[0.06] border-b px-3.5 font-mono text-[13px] text-[#d4d4d4] last:border-b-0"
            >
              <span className="truncate">{file.path}</span>
              <span className="shrink-0 pl-4">
                <span className="text-[#4ade80]">+{file.added}</span>{" "}
                <span className="text-[#f87171]">-{file.removed}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2.5 text-[14px] text-[#d4d4d4]">
          <div className="flex size-[18px] items-center justify-center rounded-[5px] bg-[var(--primary)]">
            <Check className="size-3 text-black" strokeWidth={3} />
          </div>
          Include unstaged
        </div>

        <div className="mt-5 flex items-center justify-between text-[13px]">
          <span className="font-medium text-[#d4d4d4]">Message</span>
          <span
            className={cn(
              "flex items-center gap-1.5 transition-colors duration-300",
              typing ? "text-[var(--primary)]" : "text-[#8b8b8b]",
            )}
          >
            <Sparkles className="size-3.5" />
            Auto generate message
          </span>
        </div>
        <div className="mt-2 h-[118px] rounded-xl border border-white/10 bg-[#0e0e0e] px-3.5 py-3 text-[14px] leading-[1.55] whitespace-pre-wrap text-[#e5e5e5]">
          {COMMIT_MESSAGE.slice(0, chars)}
          {chars < COMMIT_MESSAGE.length ? (
            <span className="ml-px inline-block h-[17px] w-[2px] translate-y-[3px] animate-pulse bg-[var(--primary)]" />
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <span className="rounded-lg px-4 py-2 text-[14px] text-[#a3a3a3]">
            Cancel
          </span>
          <span className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-[14px] text-white">
            Commit
          </span>
          <motion.span
            animate={
              pressed
                ? { scale: [1, 0.94, 1], backgroundColor: "#bbf7d0" }
                : { scale: 1, backgroundColor: "#ffffff" }
            }
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-medium text-black"
          >
            {pressed ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="size-3.5 rounded-full border-2 border-black/25 border-t-black"
              />
            ) : null}
            Commit &amp; push
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
});

export function PushToast() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
      className="absolute right-[64px] bottom-[28px] z-30 flex items-center gap-3 rounded-xl border border-white/10 bg-[#1c1c1c] py-3 pr-5 pl-4 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
    >
      <CircleCheck className="size-5 text-[#4ade80]" />
      <div className="flex flex-col">
        <span className="text-[14px] font-medium text-white">
          Pushed to origin/main
        </span>
        <span className="font-mono text-[12px] text-[#8b8b8b]">
          a1f3c9e Add Cursor provider support
        </span>
      </div>
    </motion.div>
  );
}

"use client";

import {
  ArrowUp,
  Brain,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  Copy,
  Ellipsis,
  Eye,
  Gauge,
  GitBranch,
  Hammer,
  Pencil,
  Plus,
  Search,
  SquareTerminal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, type ReactNode, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { type Block, type Chat, PROVIDERS, type ToolCall } from "./data";

const ease = [0.22, 1, 0.36, 1] as const;

/** Render `**bold**` and `code` spans in a line of chat copy. */
function Inline({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let offset = 0;

  for (const part of text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)) {
    if (part.startsWith("**")) {
      nodes.push(
        <strong key={offset} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>,
      );
    } else if (part.startsWith("`")) {
      nodes.push(
        <code
          key={offset}
          className="rounded-[5px] bg-white/[0.08] px-1.5 py-0.5 font-mono text-[12.5px] text-[#e5e5e5]"
        >
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part) {
      nodes.push(part);
    }
    offset += part.length;
  }

  return <>{nodes}</>;
}

const toolStyles: Record<
  ToolCall["kind"],
  { icon: typeof Search; className: string }
> = {
  search: {
    icon: Search,
    className: "border-[#1d4ed8]/60 bg-[#172554]/70 text-[#bfdbfe]",
  },
  read: {
    icon: Eye,
    className: "border-[#15803d]/60 bg-[#052e16]/80 text-[#bbf7d0]",
  },
  edit: {
    icon: Pencil,
    className: "border-[#7c3aed]/60 bg-[#2e1065]/70 text-[#ddd6fe]",
  },
  run: {
    icon: SquareTerminal,
    className: "border-[#4d7c0f]/70 bg-[#1a2e05]/80 text-[#d9f99d]",
  },
};

function ToolChip({ tool, index }: { tool: ToolCall; index: number }) {
  const { icon: Icon, className } = toolStyles[tool.kind];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease }}
      className={cn(
        "flex h-[30px] max-w-full items-center gap-2 rounded-full border px-3 text-[13px]",
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{tool.label}</span>
      {tool.meta ? (
        <span className="shrink-0 opacity-60">{tool.meta}</span>
      ) : null}
    </motion.div>
  );
}

function MessageBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "user":
      return (
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#262626] px-4 py-2.5 text-[15px] leading-[1.55] text-[#f0f0f0]">
          {block.text}
        </div>
      );
    case "thought":
      return (
        <div className="flex h-8 w-fit items-center gap-2 rounded-full border border-white/10 px-3 text-[13px] text-[#a3a3a3]">
          <Brain className="size-3.5" />
          {block.text}
          <ChevronUp className="size-3.5" />
        </div>
      );
    case "tools":
      return (
        <div className="flex flex-wrap gap-2">
          {block.items.map((tool, index) => (
            <ToolChip
              key={`${tool.kind}-${tool.label}`}
              tool={tool}
              index={index}
            />
          ))}
        </div>
      );
    case "p":
      return (
        <p className="text-[15px] leading-[1.6] text-[#e5e5e5]">
          <Inline text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="flex list-disc flex-col gap-1.5 pl-6 text-[15px] leading-[1.6] text-[#e5e5e5] marker:text-[#737373]">
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b]">
          <div className="flex items-center justify-between px-4 pt-3 text-[12px] text-[#8b8b8b]">
            {block.lang}
            <Copy className="size-3.5" />
          </div>
          <div className="px-4 py-3 font-mono text-[13px] leading-[1.75]">
            {block.lines.map((line, row) => {
              const id = line.map(([text]) => text).join("");
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: static lines, never reordered
                <div key={`${row + 1}:${id}`} className="flex gap-4">
                  <span className="w-4 shrink-0 text-right text-[#525252]">
                    {row + 1}
                  </span>
                  <span className="whitespace-pre text-[#e5e5e5]">
                    {line.map(([text, color], col) => (
                      <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: static tokens, never reordered
                        key={`${col}:${text}`}
                        style={color ? { color } : undefined}
                      >
                        {text}
                      </span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    case "meta":
      return (
        <div className="flex items-center gap-2 text-[12.5px] text-[#8b8b8b]">
          {block.text}
          <Copy className="size-3.5" />
        </div>
      );
  }
}

/**
 * Messages stick to the bottom like a real chat: when they outgrow the pane,
 * the oldest scroll out of view at the top.
 */
function Messages({ blocks }: { blocks: Block[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outer.current;
    const content = inner.current;
    if (!el || !content) return;

    let first = true;
    const stick = () => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: first ? "instant" : "smooth",
      });
      first = false;
    };
    const observer = new ResizeObserver(stick);
    observer.observe(content);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={outer}
      className="min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-24px),transparent)]"
    >
      <div ref={inner} className="flex flex-col gap-4 pt-4 pb-6">
        {blocks.map((block, index) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: blocks are only ever revealed in order
            key={`${block.kind}-${index}`}
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease }}
          >
            <MessageBlock block={block} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Pill({
  children,
  className,
  active,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-[34px] min-w-0 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[13px] text-[#d4d4d4] transition-colors duration-300",
        active ? "bg-white/[0.12] text-white" : "bg-white/[0.04]",
        className,
      )}
    >
      {children}
      <ChevronDown className="size-3.5 shrink-0 text-[#8b8b8b]" />
    </div>
  );
}

function ModelMenu({ provider }: { provider: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.3, ease }}
      style={{ transformOrigin: "20% 100%" }}
      className="absolute bottom-[calc(100%+10px)] left-[92px] z-20 w-[340px] rounded-xl border border-white/10 bg-[#1c1c1c]/95 p-1.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] backdrop-blur"
    >
      <div className="px-3 pt-2 pb-1.5 text-[12px] font-medium text-[#8b8b8b]">
        Models
      </div>
      {PROVIDERS.map((item, index) => {
        const selected = index === provider;
        return (
          <div
            key={item.id}
            className="relative flex h-12 items-center gap-3 rounded-lg px-3"
          >
            {selected ? (
              <motion.div
                layoutId="model-menu-highlight"
                transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                className="absolute inset-0 rounded-lg bg-white/[0.08]"
              />
            ) : null}
            <div className="relative flex size-7 items-center justify-center rounded-md bg-white/[0.06]">
              <item.Icon className={cn("size-4", item.iconClass)} />
            </div>
            <div className="relative flex min-w-0 flex-1 flex-col">
              <span
                className={cn(
                  "truncate text-[14px] transition-colors",
                  selected ? "text-white" : "text-[#d4d4d4]",
                )}
              >
                {item.model}
              </span>
              <span className="text-[12px] text-[#8b8b8b]">{item.vendor}</span>
            </div>
            {selected ? (
              <Check className="relative size-4 text-[var(--primary)]" />
            ) : null}
          </div>
        );
      })}
    </motion.div>
  );
}

function Composer({
  provider,
  menuOpen,
  compact,
}: {
  provider: number;
  menuOpen: boolean;
  compact: boolean;
}) {
  const current = PROVIDERS[provider];

  return (
    <div className="shrink-0">
      <div className="relative rounded-[14px] border border-white/10 bg-[#0e0e0e]">
        <AnimatePresence>
          {menuOpen ? <ModelMenu provider={provider} /> : null}
        </AnimatePresence>
        <div className="px-3.5 pt-3 text-[14px] text-[#8b8b8b]">
          Ask anything...
        </div>
        <div className="flex items-center justify-between px-3 pt-4 pb-3">
          <Plus className="size-4 text-[#a3a3a3]" />
          <div className="flex size-[30px] items-center justify-center rounded-lg bg-[#3a3a3a]">
            <ArrowUp className="size-4 text-[#d4d4d4]" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 overflow-hidden border-white/[0.06] border-t p-2">
          <Pill>
            <Hammer className="size-3.5" />
            Build
          </Pill>
          <Pill active={menuOpen} className="shrink">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease }}
                className="flex min-w-0 items-center gap-1.5"
              >
                <current.Icon className={cn("size-3.5", current.iconClass)} />
                <span className="truncate">{current.model}</span>
              </motion.span>
            </AnimatePresence>
          </Pill>
          {current.effort && !compact ? <Pill>{current.effort}</Pill> : null}
          {current.speed && !compact ? <Pill>{current.speed}</Pill> : null}
          <div className="ml-auto flex shrink-0 items-center gap-3 pr-2 text-[#8b8b8b]">
            <Gauge className="size-4" />
            <Circle className="size-4" />
          </div>
        </div>
      </div>
      <div className="flex h-11 items-center justify-end gap-1.5 pr-2 text-[13px] text-[#a3a3a3]">
        <GitBranch className="size-3.5" />
        main
        <ChevronDown className="size-3.5" />
      </div>
    </div>
  );
}

export type ChatPaneProps = {
  chat: Chat;
  /** Number of messages after the prompt to show; defaults to all. */
  visible?: number;
  provider?: number;
  menuOpen?: boolean;
  closable?: boolean;
  /** Narrow panes hide the effort and speed pills. */
  compact?: boolean;
};

export const ChatPane = memo(function ChatPane({
  chat,
  visible,
  provider,
  menuOpen = false,
  closable = false,
  compact = false,
}: ChatPaneProps) {
  const count = visible === undefined ? chat.blocks.length : visible + 1;

  return (
    <div className="flex h-full flex-col px-2">
      <div className="mx-auto flex h-full w-full max-w-[716px] flex-col">
        <div className="flex h-12 shrink-0 items-center gap-3 pt-1">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={chat.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
              className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[#f0f0f0]"
            >
              {chat.title}
            </motion.div>
          </AnimatePresence>
          <Ellipsis className="size-4 shrink-0 text-[#a3a3a3]" />
          {closable ? <X className="size-4 shrink-0 text-[#a3a3a3]" /> : null}
        </div>
        <Messages key={chat.id} blocks={chat.blocks.slice(0, count)} />
        <Composer
          provider={provider ?? chat.provider}
          menuOpen={menuOpen}
          compact={compact}
        />
      </div>
    </div>
  );
});

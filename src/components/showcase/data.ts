import type { ComponentType, SVGProps } from "react";
import ClaudeIcon from "../icons/ClaudeIcon";
import CursorIcon from "../icons/CursorIcon";
import GrokIcon from "../icons/GrokIcon";
import OpenAIIcon from "../icons/OpenAIIcon";
import OpenCodeIcon from "../icons/OpenCodeIcon";

/**
 * Native size of the app mock. It matches the screenshots the panel crops in
 * /public/showcase were taken from, so they drop in at 1:1. The whole canvas
 * is scaled to fit the viewport.
 */
export const CANVAS = { width: 1548, height: 904, titlebar: 48, rail: 48 };

/** Right-hand panel frame, in canvas pixels. */
export const PANEL = { left: 508, top: 57, right: 1498, bottom: 895 };

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type Provider = {
  id: "codex" | "claude" | "opencode" | "cursor" | "grok";
  name: string;
  vendor: string;
  model: string;
  Icon: IconComponent;
  iconClass?: string;
  effort?: string;
  speed?: string;
};

export const PROVIDERS: Provider[] = [
  {
    id: "codex",
    name: "Codex",
    vendor: "OpenAI",
    model: "GPT-5.5",
    Icon: OpenAIIcon,
    effort: "High",
    speed: "Standard",
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    model: "Claude Opus 4.7",
    Icon: ClaudeIcon,
    iconClass: "text-[#d97757]",
    effort: "Medium",
  },
  {
    id: "opencode",
    name: "OpenCode",
    vendor: "OpenCode",
    model: "Opencode GO / kimi-k2.6",
    Icon: OpenCodeIcon,
  },
  {
    id: "cursor",
    name: "Cursor",
    vendor: "Cursor",
    model: "Cursor / Auto",
    Icon: CursorIcon,
  },
  {
    id: "grok",
    name: "Grok",
    vendor: "xAI",
    model: "Grok 4.5",
    Icon: GrokIcon,
  },
];

export type Token = [text: string, color?: string];

export type ToolCall = {
  kind: "search" | "read" | "edit" | "run";
  label: string;
  meta?: string;
};

export type Block =
  | { kind: "user"; text: string }
  | { kind: "thought"; text: string }
  | { kind: "tools"; items: ToolCall[] }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "code"; lang: string; lines: Token[][] }
  | { kind: "meta"; text: string };

export type Chat = {
  id: string;
  title: string;
  provider: number;
  blocks: Block[];
};

const kw = "#f47067";
const fn = "#dcbdfb";
const str = "#96d0ff";
const num = "#6cb6ff";

export const CHATS = {
  cursor: {
    id: "cursor",
    title: "Add Cursor provider support",
    provider: 1,
    blocks: [
      {
        kind: "user",
        text: "Add Cursor as a provider. Reuse the launch flow we already use for Codex.",
      },
      { kind: "thought", text: "Thought for a few seconds" },
      {
        kind: "tools",
        items: [
          { kind: "search", label: "resolveCodexCliLaunch", meta: "6 results" },
          { kind: "read", label: "codex-cli-launch.js", meta: "Lines 1-212" },
          { kind: "read", label: "provider-models.js", meta: "Lines 1-148" },
          { kind: "edit", label: "cursor-cli.js", meta: "+84" },
          { kind: "edit", label: "title.js", meta: "+158" },
        ],
      },
      {
        kind: "p",
        text: "Cursor now launches through the same flow as Codex:",
      },
      {
        kind: "ul",
        items: [
          "**cursor-cli.js** resolves the `cursor-agent` binary and spawns it in the project folder",
          "**provider-models.js** registers Cursor models and a low-cost title model",
          "**title.js** generates chat titles with Cursor when it's the active provider",
        ],
      },
      {
        kind: "p",
        text: "Open **Changes** to review the diff before committing.",
      },
      {
        kind: "meta",
        text: "Claude Opus 4.7 · Medium · 1:57 PM · Ran for 27s",
      },
    ],
  },
  website: {
    id: "website",
    title: "Detect OS for downloads",
    provider: 0,
    blocks: [
      {
        kind: "user",
        text: "Make the download button pick the right build for the visitor's OS.",
      },
      {
        kind: "tools",
        items: [
          { kind: "read", label: "DownloadButton.tsx", meta: "Lines 1-65" },
          { kind: "edit", label: "downloads.ts", meta: "+103" },
        ],
      },
      {
        kind: "p",
        text: "Added `detectOS()` and `detectArch()` and wired them into `DownloadButton`:",
      },
      {
        kind: "ul",
        items: [
          "**macOS** picks the Apple Silicon or Intel `.dmg`",
          "**Windows** links the x64 `.exe`",
          "**Linux** recommends the `.deb`, with `.rpm` and `.AppImage` on the download page",
        ],
      },
      { kind: "meta", text: "GPT-5.5 · High · 10:12 AM · Ran for 48s" },
    ],
  },
  api: {
    id: "api",
    title: "Rate limit the public API",
    provider: 2,
    blocks: [
      { kind: "user", text: "Add rate limiting to the /v1 routes." },
      {
        kind: "tools",
        items: [
          { kind: "read", label: "routes/v1.ts", meta: "Lines 1-140" },
          { kind: "edit", label: "middleware/rate-limit.ts", meta: "+46" },
        ],
      },
      {
        kind: "p",
        text: "Added a sliding-window limiter as Hono middleware and applied it to every `/v1` route:",
      },
      {
        kind: "code",
        lang: "typescript",
        lines: [
          [
            ["app", fn],
            ["."],
            ["use", fn],
            ["("],
            ['"/v1/*"', str],
            [", "],
            ["rateLimit", fn],
            ["({"],
          ],
          [["  window: "], ['"1m"', str], [","]],
          [["  limit: "], ["120", num], [","]],
          [["}));"]],
        ],
      },
      {
        kind: "p",
        text: "Requests over the limit get a `429` with a `Retry-After` header.",
      },
      {
        kind: "meta",
        text: "Opencode GO / kimi-k2.6 · 4:31 PM · Ran for 52s",
      },
    ],
  },
  tabMenu: {
    id: "tabMenu",
    title: "Tab menu button styling",
    provider: 0,
    blocks: [
      {
        kind: "user",
        text: "The tab menu button shows a hover background. Remove it.",
      },
      { kind: "thought", text: "Thought for a few seconds" },
      {
        kind: "tools",
        items: [
          { kind: "edit", label: "project-actions-menu.tsx", meta: "+1 -1" },
        ],
      },
      {
        kind: "code",
        lang: "tsx",
        lines: [
          [["<"], ["Button", kw]],
          [["  className="], ['"h-8 w-8 p-0', str]],
          [['    hover:!bg-transparent"', str]],
          [["  onClick", fn], ["={"], ["toggleMenu", fn], ["}"]],
          [["/>"]],
        ],
      },
      {
        kind: "p",
        text: "The ghost variant now stays transparent on hover and while the menu is open.",
      },
      { kind: "meta", text: "GPT-5.5 · Medium · 10:54 PM · Ran for 2m 22s" },
    ],
  },
  tabText: {
    id: "tabText",
    title: "Smaller tab labels",
    provider: 3,
    blocks: [
      { kind: "user", text: "Make the tab text a little smaller." },
      {
        kind: "tools",
        items: [
          { kind: "edit", label: "tabs.tsx", meta: "+2 -2" },
          {
            kind: "run",
            label: "pnpm exec biome check src/components/ui",
            meta: "exit 0",
          },
        ],
      },
      {
        kind: "p",
        text: "Tab labels now use `text-[13px]`, and the focused Biome check passes on every touched file.",
      },
      { kind: "meta", text: "Cursor / Auto · 10:58 PM · Ran for 31s" },
    ],
  },
} satisfies Record<string, Chat>;

export type TabId = "dream" | "website" | "api";

export const TABS: { id: TabId; label: string; chat: Chat }[] = [
  { id: "dream", label: "dream", chat: CHATS.cursor },
  { id: "website", label: "website", chat: CHATS.website },
  { id: "api", label: "api", chat: CHATS.api },
];

export type TerminalLine =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string; tone?: "muted" | "ok" | "accent" };

export const TERMINAL: TerminalLine[] = [
  { kind: "cmd", text: "pnpm lint" },
  { kind: "out", text: "> biome check .", tone: "muted" },
  { kind: "out", text: "Checked 214 files in 48ms. No fixes applied." },
  { kind: "cmd", text: "pnpm typecheck" },
  { kind: "out", text: "> tsc --noEmit", tone: "muted" },
  { kind: "out", text: "✓ No type errors", tone: "ok" },
  { kind: "cmd", text: "git status --short" },
  { kind: "out", text: " M electron/api/chat/title.js", tone: "accent" },
  {
    kind: "out",
    text: " M electron/api/project-git/actions.js",
    tone: "accent",
  },
  { kind: "out", text: "?? electron/providers/cursor-cli.js", tone: "ok" },
];

/** How many reveal "units" an output line costs, so output lands in beats. */
export const TERMINAL_OUT_UNITS = 5;

export const TERMINAL_UNITS = TERMINAL.reduce(
  (sum, line) =>
    sum + (line.kind === "cmd" ? line.text.length : TERMINAL_OUT_UNITS),
  0,
);

export const COMMIT_MESSAGE =
  "Add Cursor provider support\n\nLaunch Cursor Agent through the shared CLI flow and use it to generate chat titles.";

export const COMMIT_FILES = [
  { path: "electron/api/chat/title.js", added: 158, removed: 0 },
  { path: "electron/api/project-git/actions.js", added: 162, removed: 0 },
  { path: "electron/providers/cursor-cli.js", added: 84, removed: 0 },
];

/** Content for the Files and Changes panels, taken from the Dream repo. */

export type TreeKind = "folder" | "js" | "image" | "file";

export type TreeRow = {
  name: string;
  depth: number;
  kind: TreeKind;
  open?: boolean;
  selected?: boolean;
};

export const FILE_TREE: TreeRow[] = [
  { name: "electron", depth: 0, kind: "folder", open: true },
  { name: "api", depth: 1, kind: "folder" },
  { name: "db", depth: 1, kind: "folder" },
  { name: "drizzle", depth: 1, kind: "folder" },
  { name: "api-server.js", depth: 1, kind: "js" },
  { name: "app-menu.js", depth: 1, kind: "js" },
  { name: "browser-sessions.js", depth: 1, kind: "js" },
  { name: "editors.js", depth: 1, kind: "js" },
  { name: "main.js", depth: 1, kind: "js", selected: true },
  { name: "persisted-state.js", depth: 1, kind: "js" },
  { name: "preload.js", depth: 1, kind: "js" },
  { name: "process-sessions.js", depth: 1, kind: "js" },
  { name: "renderer-server.js", depth: 1, kind: "js" },
  { name: "public", depth: 0, kind: "folder", open: true },
  { name: "icon.png", depth: 1, kind: "image" },
  { name: "release", depth: 0, kind: "folder", open: true },
  { name: "win-unpacked", depth: 1, kind: "folder" },
  { name: "builder-debug.yml", depth: 1, kind: "file" },
  { name: "builder-effective-config.yaml", depth: 1, kind: "file" },
  { name: "scripts", depth: 0, kind: "folder", open: true },
  { name: "fix-node-pty-permissions.mjs", depth: 1, kind: "js" },
  { name: "import-codex-chats.mjs", depth: 1, kind: "js" },
  { name: "prepare-electron-dev-app.mjs", depth: 1, kind: "js" },
  { name: "src", depth: 0, kind: "folder", open: true },
  { name: "app", depth: 1, kind: "folder" },
  { name: "assets", depth: 1, kind: "folder" },
  { name: "components", depth: 1, kind: "folder" },
  { name: "hooks", depth: 1, kind: "folder" },
  { name: "lib", depth: 1, kind: "folder" },
  { name: "types", depth: 1, kind: "folder" },
];

export const MAIN_JS_PATH = "electron/main.js";

export const MAIN_JS =
  `import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  app,
  BrowserWindow,
  clipboard,
  dialog,
  ipcMain,
  nativeTheme,
  shell,
} from "electron";
import getPort from "get-port";

import { configureApplicationMenu } from "./app-menu.js";
import { createBrowserSessionManager } from "./browser-sessions.js";
import { detectAvailableEditors, openProjectInEditor } from "./editors.js";
import {
  closePersistedStateDatabase,
  loadPersistedState,
  savePersistedState,
} from "./persisted-state.js";
import { createProcessSessionManager } from "./process-sessions.js";
import { createRendererServerManager } from "./renderer-server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appIconPath = path.join(__dirname, "..", "public", "icon.png");

const isDevelopment = process.env.NODE_ENV === "development";
const rendererUrlFromEnv = process.env.ELECTRON_RENDERER_URL?.trim();
const rendererStartupTimeoutMs = Number(
  process.env.VITE_READY_TIMEOUT_MS ?? 45000,
);
const rendererProbeIntervalMs = 300;
const APP_NAME = "Dream";
const APP_USER_DATA_DIR_NAME = "dreamide";
const APP_USER_DATA_PATH = path.join(
  app.getPath("appData"),
  APP_USER_DATA_DIR_NAME,
);
`.split("\n");

export type DiffLine =
  | { kind: "line"; number: number; text: string; added?: boolean }
  | { kind: "skip"; count: number };

export type DiffFile = {
  path: string;
  added: number;
  removed: number;
  lines: DiffLine[];
};

/** Mark lines `from`..`to` (inclusive) as additions. */
function hunk(
  start: number,
  text: string,
  added: [number, number][] = [],
): DiffLine[] {
  return text.split("\n").map((line, index) => {
    const number = start + index;
    return {
      kind: "line",
      number,
      text: line,
      added: added.some(([from, to]) => number >= from && number <= to),
    };
  });
}

export const DIFF: DiffFile[] = [
  {
    path: "electron/api/chat/title.js",
    added: 158,
    removed: 0,
    lines: [
      ...hunk(
        435,
        `      );
    });
  });

export const generateChatTitle = async ({
  fallbackModel,
  projectPath,`,
        [[435, 438]],
      ),
      { kind: "skip", count: 21 },
      ...hunk(
        463,
        `    return generateOpenCodeChatTitle({ model, projectPath, promptText });
  }

  if (provider === "cursor") {
    const model =
      (await fetchCursorLowCostModel(fallbackModel)) || fallbackModel?.trim();
    if (!model) {
      throw new Error("No Cursor title model is available.");
    }
    return generateCursorChatTitle({ model, projectPath, promptText });
  }

  const model = (await fetchOpenAiLowCostModel()) || fallbackModel?.trim();
  if (!model) {
    throw new Error("No OpenAI title model is available.");`,
        [[466, 474]],
      ),
    ],
  },
  {
    path: "electron/api/project-git/actions.js",
    added: 162,
    removed: 0,
    lines: [
      { kind: "skip", count: 6 },
      ...hunk(
        7,
        `  resolveCodexCliLaunch,
} from "../chat/codex-cli-launch.js";
import { getCodexErrorDetail } from "../chat/codex-prompt.js";
import {
  getCursorCliSpawnErrorMessage,
  normalizeCursorCliModel,
  resolveCursorCliLaunch,
} from "../providers/cursor-cli.js";
import { normalizeClaudeCodeModel } from "../providers/model-options.js";
import {
  fetchAnthropicLowCostModel,
  fetchCursorLowCostModel,
  fetchOpenAiLowCostModel,`,
        [
          [10, 14],
          [18, 18],
        ],
      ),
    ],
  },
];

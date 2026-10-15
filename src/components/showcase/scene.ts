import {
  CHATS,
  COMMIT_MESSAGE,
  PROVIDERS,
  type TabId,
  TERMINAL_UNITS,
} from "./data";

export type PanelId = "files" | "terminal" | "browser" | "changes";

/** A span of caption copy. Spans with a `focus` light up when the scene matches. */
export type CopySpan = string | { text: string; focus: string };

export type Camera = {
  /** Focus point, as a fraction of the window. */
  x: number;
  y: number;
  zoom: number;
  /** Zoom used on narrow screens, where the window is tiny. */
  mobileZoom?: number;
};

export type Chapter = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: CopySpan[];
  wallpaper: string;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "overview",
    label: "Overview",
    eyebrow: "Meet Dream",
    title: "Your agents. One window.",
    body: [
      "Dream brings your AI agents, projects, and tools together in a single desktop app. Open source, and built for AI coding.",
    ],
    wallpaper: "/bg-07.jpg",
  },
  {
    id: "providers",
    label: "Providers",
    eyebrow: "Providers",
    title: "Bring your own provider.",
    body: [
      "Dream works with your existing subscriptions and local agent CLIs from ",
      { text: "OpenAI", focus: "codex" },
      ", ",
      { text: "Anthropic", focus: "claude" },
      ", ",
      { text: "OpenCode", focus: "opencode" },
      ", and ",
      { text: "Cursor", focus: "cursor" },
      ".",
    ],
    wallpaper: "/bg-01.jpg",
  },
  {
    id: "tabs",
    label: "Tabs",
    eyebrow: "Projects",
    title: "Organize with tabs.",
    body: [
      "All your projects live in one window. ",
      { text: "Switch between them in a flash", focus: "switch" },
      ", and keep your context — open files, chats, and terminals — right where you left it.",
    ],
    wallpaper: "/bg-06.jpg",
  },
  {
    id: "chats",
    label: "Chats",
    eyebrow: "Chats",
    title: "Multiple chats.",
    body: [
      { text: "Run several AI conversations side by side.", focus: "split" },
      " Compare answers, branch off new ideas, and explore different approaches without losing your train of thought.",
    ],
    wallpaper: "/bg-04.jpg",
  },
  {
    id: "tools",
    label: "Tools",
    eyebrow: "Built-in tools",
    title: "Everything in one place.",
    body: [
      "A ",
      { text: "file explorer", focus: "files" },
      ", ",
      { text: "integrated terminals", focus: "terminal" },
      ", and a ",
      { text: "browser", focus: "browser" },
      " are included. View files, run commands, and preview your work without switching apps.",
    ],
    wallpaper: "/bg-03.jpg",
  },
  {
    id: "git",
    label: "Git",
    eyebrow: "Git",
    title: "Faster Git workflow.",
    body: [
      { text: "Review diffs", focus: "diffs" },
      ", ",
      { text: "write commit messages", focus: "commit" },
      ", and ",
      { text: "push", focus: "push" },
      " without leaving Dream. Stay in flow from first edit to final commit.",
    ],
    wallpaper: "/bg-08.jpg",
  },
];

/**
 * Everything the app mock needs to render one moment of the story. Every field
 * is a primitive and changes in discrete steps, so the showcase only
 * re-renders when something visible actually changes.
 */
export type Scene = {
  chapter: number;
  tabsShown: boolean;
  activeTab: TabId;
  columns: 1 | 2 | 3;
  panel: PanelId | null;
  menuOpen: boolean;
  provider: number;
  /** Assistant blocks revealed in the opening chat. */
  introBlocks: number;
  terminalUnits: number;
  commitOpen: boolean;
  commitChars: number;
  commitPressed: boolean;
  committed: boolean;
  /** Caption span to highlight. */
  focus: string | null;
  camera: Camera;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** 0 before `start`, 1 after `end`, linear in between. */
const ramp = (t: number, start: number, end: number) =>
  clamp((t - start) / (end - start), 0, 1);

const INTRO_STEPS = CHATS.cursor.blocks.length - 1;

/** Map a position along the story (0 to CHAPTERS.length) to a scene. */
export function sceneAt(position: number): Scene {
  const chapter = clamp(Math.floor(position), 0, CHAPTERS.length - 1);
  const t = clamp(position - chapter, 0, 1);

  const scene: Scene = {
    chapter,
    tabsShown: chapter > 2,
    activeTab: "dream",
    columns: 1,
    panel: null,
    menuOpen: false,
    provider: 1,
    introBlocks: INTRO_STEPS,
    terminalUnits: TERMINAL_UNITS,
    commitOpen: false,
    commitChars: 0,
    commitPressed: false,
    committed: false,
    focus: null,
    camera: { x: 0.5, y: 0.5, zoom: 1 },
  };

  switch (CHAPTERS[chapter].id) {
    case "overview": {
      scene.introBlocks = Math.round(ramp(t, 0.05, 0.8) * INTRO_STEPS);
      scene.camera = { x: 0.5, y: 0.5, zoom: 1, mobileZoom: 1.5 };
      break;
    }
    case "providers": {
      const index = Math.min(
        PROVIDERS.length - 1,
        Math.floor(ramp(t, 0.1, 0.9) * PROVIDERS.length),
      );
      scene.menuOpen = t > 0.04 && t < 0.96;
      scene.provider = index;
      scene.focus = PROVIDERS[index].id;
      scene.camera = { x: 0.5, y: 0.82, zoom: 1.22, mobileZoom: 2.2 };
      break;
    }
    case "tabs": {
      scene.tabsShown = t > 0.08;
      scene.activeTab = t < 0.4 ? "dream" : t < 0.7 ? "website" : "api";
      scene.focus = t > 0.35 ? "switch" : null;
      scene.camera = { x: 0.15, y: 0.04, zoom: 1.18, mobileZoom: 2 };
      break;
    }
    case "chats": {
      scene.columns = t < 0.18 ? 1 : t < 0.5 ? 2 : 3;
      scene.focus = scene.columns > 1 ? "split" : null;
      scene.camera = { x: 0.5, y: 0.5, zoom: 1, mobileZoom: 1.2 };
      break;
    }
    case "tools": {
      scene.panel = t < 0.36 ? "files" : t < 0.7 ? "terminal" : "browser";
      scene.terminalUnits = Math.round(ramp(t, 0.4, 0.66) * TERMINAL_UNITS);
      scene.focus = scene.panel;
      scene.camera = { x: 0.66, y: 0.5, zoom: 1.06, mobileZoom: 1.7 };
      break;
    }
    case "git": {
      scene.panel = "changes";
      scene.commitOpen = t > 0.28 && t < 0.78;
      scene.commitChars = Math.round(
        ramp(t, 0.34, 0.6) * COMMIT_MESSAGE.length,
      );
      scene.commitPressed = t > 0.68;
      scene.committed = t >= 0.78;
      scene.focus = t < 0.28 ? "diffs" : t < 0.78 ? "commit" : "push";
      scene.camera = scene.commitOpen
        ? { x: 0.5, y: 0.5, zoom: 1.14, mobileZoom: 1.8 }
        : { x: 0.66, y: 0.5, zoom: 1.06, mobileZoom: 1.7 };
      break;
    }
  }

  return scene;
}

export function sameScene(a: Scene, b: Scene): boolean {
  for (const key of Object.keys(a) as (keyof Scene)[]) {
    if (key === "camera") {
      if (
        a.camera.x !== b.camera.x ||
        a.camera.y !== b.camera.y ||
        a.camera.zoom !== b.camera.zoom
      ) {
        return false;
      }
    } else if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

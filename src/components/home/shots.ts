/*
  Screenshot registry. Every screenshot is 1920×1080; regions are expressed in
  that pixel space so a camera can crop, zoom and pan to them.
*/

export type Region = { x: number; y: number; w: number; h: number };

export const SHOT_W = 1920;
export const SHOT_H = 1080;

export const SHOTS = {
  chats: {
    src: "/images/screen-multiple-chats.png",
    alt: "Three AI chats running side by side in Dream",
  },
  terminal: {
    src: "/images/screen-terminal.png",
    alt: "A chat next to an integrated terminal running dev servers",
  },
  diffs: {
    src: "/images/screen-changes-diffs.png",
    alt: "The Changes panel showing file diffs",
  },
  files: {
    src: "/images/screen-file-explorer.png",
    alt: "The file explorer and code editor",
  },
  browser: {
    src: "/images/screen-browser.png",
    alt: "The built-in browser previewing a site",
  },
  commit: {
    src: "/images/screen-git-commit.png",
    alt: "The commit dialog with an auto-generated message",
  },
  push: {
    src: "/images/screen-git-push.png",
    alt: "The push dialog listing commits ahead of origin",
  },
  createPr: {
    src: "/images/screen-create-pr.png",
    alt: "The create pull request dialog",
  },
  viewPr: {
    src: "/images/screen-view-pr.png",
    alt: "A merged pull request with checks and comments",
  },
  providers: {
    src: "/images/screen-providers.png",
    alt: "Provider settings listing Codex and Claude Code models",
  },
  skills: {
    src: "/images/screen-skills.png",
    alt: "The skills manager",
  },
  stash: {
    src: "/images/screen-stashed-chats.png",
    alt: "Stashed prompts ready to run later",
  },
} as const;

export type ShotName = keyof typeof SHOTS;

export const R = {
  full: { x: 0, y: 0, w: 1920, h: 1080 },

  // Multiple chats
  tabsZoom: { x: 0, y: 0, w: 720, h: 260 },
  chatChips: { x: 50, y: 130, w: 580, h: 160 },
  chatThoughts: { x: 1262, y: 140, w: 610, h: 470 },
  chatFooters: { x: 40, y: 925, w: 1840, h: 120 },

  // Terminal
  terminalTop: { x: 1018, y: 56, w: 855, h: 480 },
  terminalTail: { x: 1018, y: 590, w: 855, h: 480 },

  // Diffs
  diffTop: { x: 922, y: 56, w: 950, h: 560 },
  diffMixed: { x: 922, y: 390, w: 950, h: 340 },

  // Files
  filesTop: { x: 922, y: 56, w: 950, h: 560 },
  filesCode: { x: 1175, y: 150, w: 690, h: 560 },

  // Browser
  browserTop: { x: 774, y: 56, w: 1098, h: 480 },

  // Git dialogs
  commitDialog: { x: 625, y: 322, w: 671, h: 437 },
  pushDialog: { x: 625, y: 358, w: 671, h: 364 },
  prDialog: { x: 625, y: 200, w: 671, h: 680 },
  viewPrTop: { x: 997, y: 56, w: 875, h: 560 },

  // Providers / skills / stash
  providersCard: { x: 583, y: 70, w: 1000, h: 430 },
  providersAnthropic: { x: 583, y: 510, w: 1000, h: 445 },
  skillsPanel: { x: 583, y: 70, w: 1000, h: 720 },
  stashList: { x: 1046, y: 112, w: 702, h: 325 },
} satisfies Record<string, Region>;

export type Frame = {
  shot: ShotName;
  focus?: Region;
  label?: string;
  /** Re-tint this frame to the active accent (screens that are mostly accent). */
  tint?: boolean;
  fit?: "cover" | "contain" | "smart";
};

export function lerpRegion(a: Region, b: Region, t: number): Region {
  const k = Math.min(1, Math.max(0, t));
  return {
    x: a.x + (b.x - a.x) * k,
    y: a.y + (b.y - a.y) * k,
    w: a.w + (b.w - a.w) * k,
    h: a.h + (b.h - a.h) * k,
  };
}

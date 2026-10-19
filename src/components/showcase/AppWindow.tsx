"use client";

import {
  Code,
  Files,
  GitFork,
  Globe,
  Hexagon,
  History,
  MessageSquarePlus,
  MessagesSquare,
  Minus,
  Plus,
  Settings,
  Square,
  SquareTerminal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../lib/utils";
import DreamLogo from "../icons/DreamLogo";
import { ChatPane } from "./Chat";
import { CANVAS, CHATS, type Chat, PANEL, TABS, type TabId } from "./data";
import { CommitDialog, Panel, PushToast } from "./Panels";
import type { PanelId, Scene } from "./scene";

const spring = { type: "spring", duration: 0.8, bounce: 0.12 } as const;
const ease = [0.22, 1, 0.36, 1] as const;

function TabIcon({ id }: { id: TabId }) {
  if (id === "dream") {
    return <DreamLogo className="size-4 rounded-full" />;
  }
  if (id === "website") {
    return <Globe className="size-4 text-[#7dd3fc]" />;
  }
  return <Hexagon className="size-4 fill-[#8b5cf6]/30 text-[#a78bfa]" />;
}

function TitleBar({ scene }: { scene: Scene }) {
  const tabs = scene.tabsShown ? TABS : TABS.slice(0, 1);

  return (
    <div className="absolute inset-x-0 top-0 flex h-12 items-center px-2">
      <div className="flex items-center">
        <AnimatePresence initial={false}>
          {tabs.map((tab, index) => {
            const active = tab.id === scene.activeTab;
            return (
              <motion.div
                key={tab.id}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 228, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease }}
                className="relative h-8 shrink-0 overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-[220px]">
                  {active ? (
                    <motion.div
                      layoutId="active-tab"
                      transition={spring}
                      className="absolute inset-0 rounded-lg bg-[#262626]"
                    />
                  ) : null}
                  <div
                    className={cn(
                      "relative flex h-full items-center gap-2.5 px-3 text-[15px] transition-colors duration-300",
                      active ? "text-white" : "text-[#a3a3a3]",
                    )}
                  >
                    <TabIcon id={tab.id} />
                    {tab.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <Plus className="ml-3 size-4 text-[#a3a3a3]" />
      </div>
      <div className="ml-auto flex items-center gap-7 pr-3 text-[#a3a3a3]">
        <Minus className="size-4" />
        <Square className="size-3.5" />
        <X className="size-4" />
      </div>
    </div>
  );
}

function RailIcon({
  icon: Icon,
  active,
  tint,
}: {
  icon: typeof Files;
  active?: boolean;
  tint?: string;
}) {
  return (
    <div className="relative flex size-9 items-center justify-center">
      {active ? (
        <motion.div
          layoutId="rail-active"
          transition={spring}
          className="absolute inset-0 rounded-lg bg-white/[0.1]"
        />
      ) : null}
      <Icon
        className={cn(
          "relative size-[18px] transition-colors duration-300",
          active ? "text-white" : (tint ?? "text-[#a3a3a3]"),
        )}
      />
    </div>
  );
}

const panelIcons: { id: PanelId; icon: typeof Files }[] = [
  { id: "changes", icon: Code },
  { id: "files", icon: Files },
  { id: "browser", icon: Globe },
  { id: "terminal", icon: SquareTerminal },
];

function Rails({ scene }: { scene: Scene }) {
  return (
    <>
      <div className="absolute top-[54px] bottom-0 left-[6px] flex flex-col items-center">
        <RailIcon icon={History} />
        <RailIcon icon={MessageSquarePlus} />
        <RailIcon
          icon={MessagesSquare}
          tint={scene.columns > 1 ? "text-[#4ade80]" : undefined}
        />
        <div className="mt-auto mb-3">
          <RailIcon icon={Settings} />
        </div>
      </div>
      <div className="absolute top-[54px] right-[6px] flex flex-col items-center">
        {panelIcons.map(({ id, icon }) => (
          <RailIcon key={id} icon={icon} active={scene.panel === id} />
        ))}
        <RailIcon icon={GitFork} tint="text-[#4ade80]" />
      </div>
    </>
  );
}

type Column = { chat: Chat; left: number; width: number };

/** Lay the chats out across whatever space the panel leaves free. */
function columnsFor(scene: Scene): Column[] {
  const left = CANVAS.rail;
  const right = scene.panel ? PANEL.left - 2 : CANVAS.width - CANVAS.rail;
  const width = right - left;

  const primary = scene.tabsShown
    ? (TABS.find((tab) => tab.id === scene.activeTab)?.chat ?? CHATS.cursor)
    : CHATS.cursor;

  const chats =
    scene.columns === 1
      ? [primary]
      : scene.columns === 2
        ? [primary, CHATS.tabMenu]
        : [primary, CHATS.tabMenu, CHATS.tabText];

  const each = width / chats.length;
  return chats.map((chat, index) => ({
    chat,
    left: left + each * index,
    width: each,
  }));
}

export default function AppWindow({ scene }: { scene: Scene }) {
  const columns = columnsFor(scene);
  const multi = columns.length > 1;

  return (
    <div
      className="relative overflow-hidden rounded-[14px] border border-white/[0.12] bg-[#161616] text-left font-sans text-[#e5e5e5] antialiased shadow-[0_60px_140px_-30px_rgba(0,0,0,0.95)] select-none"
      style={{ width: CANVAS.width, height: CANVAS.height }}
    >
      <TitleBar scene={scene} />
      <Rails scene={scene} />

      <AnimatePresence initial={false}>
        {columns.map((column, index) => {
          const isPrimary = index === 0;
          return (
            <motion.div
              key={isPrimary ? "primary" : column.chat.id}
              initial={{
                opacity: 0,
                left: column.left + 60,
                width: column.width,
              }}
              animate={{ opacity: 1, left: column.left, width: column.width }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={spring}
              className={cn(
                "absolute top-12 bottom-0",
                index > 0 && "border-white/[0.08] border-l",
              )}
            >
              <ChatPane
                chat={column.chat}
                visible={
                  isPrimary && column.chat.id === CHATS.cursor.id
                    ? scene.introBlocks
                    : undefined
                }
                provider={
                  isPrimary && scene.chapter === 1 ? scene.provider : undefined
                }
                menuOpen={isPrimary && scene.menuOpen}
                closable={multi}
                compact={multi || scene.panel !== null}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {scene.panel ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 120 }}
            transition={spring}
            className="absolute overflow-hidden rounded-[10px] border border-white/[0.1] bg-[#0c0c0c]"
            style={{
              left: PANEL.left,
              top: PANEL.top,
              width: PANEL.right - PANEL.left,
              height: PANEL.bottom - PANEL.top,
            }}
          >
            <Panel
              panel={scene.panel}
              terminalUnits={scene.terminalUnits}
              committed={scene.committed}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {scene.commitOpen ? (
          <CommitDialog
            key="commit"
            chars={scene.commitChars}
            pressed={scene.commitPressed}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {scene.committed && scene.chapter === 5 ? (
          <PushToast key="toast" />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

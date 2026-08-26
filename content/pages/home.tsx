import Block from "../../src/components/Block";
import CallToAction from "../../src/components/CallToAction";
import Hero from "../../src/components/Hero";
import ClaudeIcon from "../../src/components/icons/ClaudeIcon";
import CursorIcon from "../../src/components/icons/CursorIcon";
import OpenAIIcon from "../../src/components/icons/OpenAIIcon";
import OpenCodeIcon from "../../src/components/icons/OpenCodeIcon";
import Provider from "../../src/components/Provider";

export const frontmatter = {
  title: "Dream — the IDE for AI coding",
  description:
    "Dream is an open-source desktop IDE for working with multiple AI coding agents.",
  search: false
};

export default function HomePage() {
  return (
    <div className="landing-page flex flex-col gap-24 sm:gap-40 lg:gap-60">
      <Hero />

      <section className="flex flex-col gap-16">
        <Block title="Bring Your Own Provider" className="w-full lg:w-4xl">
          Dream works with your existing subscriptions and local agent CLIs from
          OpenAI, Anthropic, OpenCode, and Cursor.
        </Block>
        <div
          className="flex grow flex-wrap items-center justify-center gap-4 rounded-lg p-6 sm:gap-8 sm:p-10 lg:p-16"
          style={{ background: "url(/bg-01.jpg) center/cover no-repeat" }}
        >
          <Provider icon={<OpenAIIcon className="size-8" />} label="Codex" />
          <Provider
            icon={<ClaudeIcon className="size-8 text-[#d97757]" />}
            label="Claude"
          />
          <Provider
            icon={<OpenCodeIcon className="size-8" />}
            label="OpenCode"
          />
          <Provider icon={<CursorIcon className="size-8" />} label="Cursor" />
        </div>
      </section>

      <section className="flex flex-col items-center gap-8 lg:flex-row lg:gap-32">
        <Block title="Organize with tabs." className="w-full lg:w-2xl">
          All your projects live in one window. Switch between them in a flash,
          and keep your context — open files, chats, and terminals — right where
          you left it.
        </Block>
        <div
          className="dream-media-frame flex items-center rounded-lg p-4 sm:p-8 lg:p-16"
          style={{ background: "url(/bg-06.jpg) center/cover no-repeat" }}
        >
          <img
            src="/projects.png"
            alt="Screenshot of Dream's tabbed project interface"
            className="rounded-lg"
          />
        </div>
      </section>

      <section className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-32">
        <div
          className="dream-media-frame flex items-center rounded-lg p-4 sm:p-8 lg:p-16"
          style={{ background: "url(/bg-04.jpg) center/cover no-repeat" }}
        >
          <img
            src="/multi-chats.png"
            alt="Screenshot of Dream's multi-chat interface"
            className="rounded-lg"
          />
        </div>
        <Block title="Multiple chats." className="w-full lg:w-2xl">
          Run several AI conversations side by side. Compare answers, branch off
          new ideas, and explore different approaches without losing your train
          of thought.
        </Block>
      </section>

      <section className="flex flex-col items-center gap-8 lg:flex-row lg:gap-32">
        <Block title="Built-in tools." className="w-full lg:w-2xl">
          A file explorer, integrated terminals, and a browser are included.
          View files, run commands, and preview your work all in one place.
        </Block>
        <div
          className="dream-media-frame flex items-center rounded-lg p-4 sm:p-8 lg:p-16"
          style={{ background: "url(/bg-03.jpg) center/cover no-repeat" }}
        >
          <img
            src="/files.png"
            alt="Screenshot of Dream's files, terminal, and browser tools"
            className="rounded-lg"
          />
        </div>
      </section>

      <section className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-32">
        <div
          className="dream-media-frame flex items-center rounded-lg p-4 sm:p-8 lg:p-16"
          style={{ background: "url(/bg-08.jpg) center/cover no-repeat" }}
        >
          <img
            src="/changes.png"
            alt="Screenshot of Dream's Git workflow interface"
            className="rounded-lg"
          />
        </div>
        <Block title="Faster Git workflow." className="w-full lg:w-2xl">
          Review diffs, stage changes, and write commit messages without leaving
          your editor. Stay in flow from first edit to final commit.
        </Block>
      </section>
    </div>
  );
}

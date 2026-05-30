import Block from "@/components/Block";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ClaudeIcon from "@/components/icons/ClaudeIcon";
import OpenAIIcon from "@/components/icons/OpenAIIcon";
import OpenCodeIcon from "@/components/icons/OpenCodeIcon";
import Provider from "@/components/Provider";
import Screenshot from "@/components/Screenshot";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 max-w-[1400px] w-full mx-auto px-8 gap-36">
      <Hero />
      <Screenshot />
      <div>
        <Block title="Bring Your Own Provider" className="w-3xl">
          Dream works with your existing subscription from OpenAI, Anthropic or
          OpenCode.
        </Block>
        <div
          className="flex items-center justify-center rounded-lg p-16 gap-8"
          style={{
            background: "url(/bg-01.jpg) center/cover no-repeat",
          }}
        >
          <Provider icon={<OpenAIIcon className="size-8" />} label="Codex" />
          <Provider icon={<ClaudeIcon className="size-8" />} label="Claude" />
          <Provider
            icon={<OpenCodeIcon className="size-8" />}
            label="OpenCode"
          />
        </div>
      </div>
      <div className="flex gap-32 items-center">
        <Block title="Organize with tabs." className="w-2xl">
          All your projects live in one window. Switch between them in a flash,
          and keep your context &mdash; open files, chats, and terminals &mdash;
          right where you left it.
        </Block>
        <div
          style={{
            background: "url(/bg-06.jpg) center/cover no-repeat",
          }}
          className="flex items-center rounded-lg p-16"
        >
          <img
            src="/tabs.png"
            alt="Screenshot of Dream's tabbed interface"
            className="rounded-lg mt-8 shadow-xl"
          />
        </div>
      </div>
      <div className="flex gap-32 items-center">
        <div
          style={{
            background: "url(/bg-03.jpg) center/cover no-repeat",
          }}
          className="flex items-center rounded-lg p-16"
        >
          <img
            src="/multi-chats.png"
            alt="Screenshot of Dream's multi-chat interface"
            className="rounded-lg mt-8"
          />
        </div>
        <Block title="Multiple chats. All at once." className="w-2xl">
          Run several AI conversations side by side. Compare answers, branch off
          new ideas, and explore different approaches without losing your train
          of thought.
        </Block>
      </div>
      <div className="flex gap-32 items-center">
        <Block title="A faster Git workflow." className="w-2xl">
          Review diffs, stage changes, and write commit messages without leaving
          your editor. Everything you reach for most, built right in.
        </Block>
        <div
          style={{
            background: "url(/bg-04.jpg) center/cover no-repeat",
          }}
          className="flex items-center rounded-lg p-16"
        >
          <img
            src="/tabs.png"
            alt="Screenshot of Dream's tabbed interface"
            className="rounded-lg mt-8"
          />
        </div>
      </div>
      <div className="flex gap-32 items-center">
        <div
          style={{
            background: "url(/bg-02.jpg) center/cover no-repeat",
          }}
          className="flex items-center rounded-lg p-16"
        >
          <img
            src="/tabs.png"
            alt="Screenshot of Dream's tabbed interface"
            className="rounded-lg mt-8"
          />
        </div>
        <Block title="A faster Git workflow." className="w-2xl">
          Review diffs, stage changes, and write commit messages without leaving
          your editor. Everything you reach for most, built right in.
        </Block>
      </div>
      <CallToAction />
      <Footer />
    </div>
  );
}

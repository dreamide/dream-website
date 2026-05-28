import Block from "@/components/Block";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ClaudeIcon from "@/components/icons/ClaudeIcon";
import OpenAIIcon from "@/components/icons/OpenAIIcon";
import OpenCodeIcon from "@/components/icons/OpenCodeIcon";
import Provider from "@/components/Provider";
import Screenshot from "@/components/Screenshot";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 max-w-[1400px] w-full mx-auto px-8 gap-32">
      <Hero />
      <Screenshot />
      <Block title="Bring Your Own Provider" className="w-3xl">
        Dream works with your existing subscription from OpenAI, Anthropic or
        OpenCode.
        <div className="grid grid-cols-3 gap-8">
          <Provider icon={<OpenAIIcon className="size-8" />} label="Codex" />
          <Provider icon={<ClaudeIcon className="size-8" />} label="Claude" />
          <Provider
            icon={<OpenCodeIcon className="size-8" />}
            label="OpenCode"
          />
        </div>
      </Block>
      <Block title="Organize with tabs." className="w-3xl">
        All your projects live in one window. Switch between them in a flash,
        and keep your context &mdash; open files, chats, and terminals &mdash;
        right where you left it.
      </Block>
      <Block title="Multiple chats. All at once." className="w-3xl">
        Run several AI conversations side by side. Compare answers, branch off
        new ideas, and explore different approaches without losing your train of
        thought.
      </Block>
      <Block title="A faster Git workflow." className="w-3xl">
        Review diffs, stage changes, and write commit messages without leaving
        your editor. The common operations are always a keystroke away.
      </Block>
      <Block title="Tune your model." className="w-3xl">
        Dial reasoning effort from Low all the way to Max, and switch between
        Standard and Fast on the fly. You decide when to think harder &mdash;
        and when to just ship.
      </Block>
      <Block title="Talk to your code." className="w-3xl">
        Speak your prompt instead of typing it. Built-in speech input with live
        transcription keeps your hands on the keyboard and your flow intact.
      </Block>
      <Block title="You&apos;re always in control." className="w-3xl">
        Every file write, command, and web fetch is surfaced before it runs.
        Approve once, approve for the session, or let trusted actions through
        automatically.
      </Block>
      <Block title="Errors you can actually read." className="w-3xl">
        Stack traces are parsed into clickable frames. Test results show what
        passed, what failed, and how long it took &mdash; right in the chat.
      </Block>
      <Footer />
    </div>
  );
}

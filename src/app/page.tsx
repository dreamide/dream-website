import Hero from "@/components/Hero";
import AnthropicIcon from "@/components/icons/AnthropicIcon";
import OpenAIIcon from "@/components/icons/OpenAIIcon";
import OpenCodeIcon from "@/components/icons/OpenCodeIcon";
import Screenshot from "@/components/Screenshot";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 max-w-[1400px] w-full mx-auto px-8 gap-32">
      <Hero />
      <Screenshot />
      <Block title="Bring Your Own Provider">
        Dream works with your existing subscription from OpenAI, Anthropic or
        OpenCode.
        <div className="flex justify-center gap-8 mt-6">
          <Provider icon={<OpenAIIcon className="size-8" />} label="Codex" />
          <Provider
            icon={<AnthropicIcon className="size-8" />}
            label="Claude"
          />
          <Provider
            icon={<OpenCodeIcon className="size-8" />}
            label="OpenCode"
          />
        </div>
      </Block>
      <footer className="text-center text-sm text-muted py-8">
        Copyright &copy; {new Date().getFullYear()} The Dream IDE Company. All
        rights reserved.
      </footer>
    </div>
  );
}

const Block = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-4 py-8 w-auto mx-auto", className)}>
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="text-md text-muted">{children}</div>
  </div>
);

const Provider = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex flex-col items-center gap-2 border border-muted/20 rounded-lg p-16 my-16">
    {icon}
    <span className="text-sm text-muted">{label}</span>
  </div>
);

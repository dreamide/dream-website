import Hero from "@/components/Hero";
import Screenshot from "@/components/Screenshot";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 max-w-[1400px] w-full mx-auto px-8 gap-32">
      <Hero />
      <Screenshot />
      <Block title="Bring Your Own Provider">
        Dream integrates with the AI services you already use, like OpenAI and
        Anthropic, so you can keep your existing accounts and credits.
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
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-4 py-8">
    <h2 className="text-4xl font-bold">{title}</h2>
    <div className="text-lg text-muted">{children}</div>
  </div>
);

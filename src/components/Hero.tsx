import { ArrowUpRight } from "lucide-react";
import Button from "./Button";
import DownloadButton from "./DownloadButton";
import GitHubIcon from "./icons/GitHubIcon";
import Screenshot from "./Screenshot";

export default function Hero() {
  return (
    <div className="text-center">
      <div className="pointer-events-none select-none flex items-center justify-center text-[clamp(5rem,25vw,28rem)] font-bold leading-none my-18">
        DREAM
      </div>
      <div className="my-8 text-base text-muted-foreground sm:my-16 sm:text-lg">
        Open-source IDE built for AI coding.
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 my-32">
        <DownloadButton sparkle eventName="hero-download" />
        <Button
          href="https://github.com/umami-software/dream"
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="hero-github"
        >
          <GitHubIcon className="size-4" />
          Star on GitHub
          <ArrowUpRight className="size-4 text-muted-foreground" />
        </Button>
      </div>
      <Screenshot />
    </div>
  );
}

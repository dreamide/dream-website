import { ArrowUpRight } from "lucide-react";
import Button from "@/components/Button";
import DownloadButton from "@/components/DownloadButton";
import GitHubIcon from "@/components/icons/GitHubIcon";
import Screenshot from "@/components/Screenshot";

export default function Hero() {
  return (
    <div className="text-center">
      <div className="pointer-events-none select-none flex items-center justify-center text-[clamp(5rem,25vw,28rem)] font-bold leading-none">
        DREAM
      </div>
      <div className="text-base sm:text-lg my-8 sm:my-16 text-muted">
        Open-source IDE built for AI coding.
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 my-32">
        <DownloadButton sparkle />
        <Button
          href="https://github.com/dreamide/dream"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon className="size-4" />
          Star on GitHub
          <ArrowUpRight className="size-4 text-muted" />
        </Button>
      </div>
      <Screenshot />
    </div>
  );
}

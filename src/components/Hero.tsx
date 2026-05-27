import { ArrowUpRight } from "lucide-react";
import Button from "@/components/Button";
import DownloadButton from "@/components/DownloadButton";
import GitHubIcon from "@/components/icons/GitHubIcon";
import SparkleTitle from "@/components/SparkleTitle";

export default function Hero() {
  return (
    <div className="text-center">
      <SparkleTitle />
      <div className="text-lg mb-16 text-muted">
        Dream is an IDE built for AI coding.
      </div>
      <div className="flex justify-center gap-3">
        <DownloadButton />
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
    </div>
  );
}

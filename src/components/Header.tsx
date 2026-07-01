import GitHubIcon from "@/components/icons/GitHubIcon";
import Button from "./Button";

export default function Header() {
  return (
    <header className="relative z-50 flex justify-between items-center py-4 font-bold">
      <a href="/" className="flex items-center justify-center gap-4">
        <img src="/dream.png" alt="Dream IDE logo" className="w-8" />
        Dream
      </a>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/dreamide/dream"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub repository"
          data-umami-event="Header GitHub"
          className="hover:opacity-70 transition-opacity"
        >
          <GitHubIcon className="size-5" />
        </a>
        <Button href="/download" data-umami-event="Header download">
          Download
        </Button>
      </div>
    </header>
  );
}

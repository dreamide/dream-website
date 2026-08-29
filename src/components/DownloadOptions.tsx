import { Download } from "lucide-react";
import type { ComponentType } from "react";
import { umamiEventName } from "../lib/analytics";
import { DOWNLOADS, downloadUrl, type OS } from "../lib/downloads";
import AppleIcon from "./icons/AppleIcon";
import LinuxIcon from "./icons/LinuxIcon";
import WindowsIcon from "./icons/WindowsIcon";

const platforms: { os: OS; Icon: ComponentType<{ className?: string }> }[] = [
  { os: "macOS", Icon: AppleIcon },
  { os: "Windows", Icon: WindowsIcon },
  { os: "Linux", Icon: LinuxIcon },
];

export default function DownloadOptions() {
  return (
    <div className="grid items-stretch gap-6 md:grid-cols-3">
      {platforms.map(({ os, Icon }) => (
        <section key={os} className="rounded-lg bg-white/[0.04] p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Icon className="size-4" />
            {os}
          </h2>
          <ul className="mt-4 divide-y divide-white/10">
            {DOWNLOADS[os].map((item) => (
              <li key={item.label}>
                <a
                  href={downloadUrl(item.file)}
                  download
                  data-umami-event={umamiEventName(
                    "download",
                    os,
                    item.label,
                  )}
                  className="flex items-center justify-between gap-4 py-4 text-sm text-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                  <Download className="size-4 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

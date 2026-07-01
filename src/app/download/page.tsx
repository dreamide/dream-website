import { Download } from "lucide-react";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import Block from "@/components/Block";
import DownloadButton from "@/components/DownloadButton";
import AppleIcon from "@/components/icons/AppleIcon";
import LinuxIcon from "@/components/icons/LinuxIcon";
import WindowsIcon from "@/components/icons/WindowsIcon";
import { DOWNLOADS, downloadUrl, type OS } from "@/lib/downloads";

const platforms: { os: OS; Icon: ComponentType<{ className?: string }> }[] = [
  { os: "macOS", Icon: AppleIcon },
  { os: "Windows", Icon: WindowsIcon },
  { os: "Linux", Icon: LinuxIcon },
];

export const metadata: Metadata = {
  title: "Download Dream",
  description: "Download Dream for macOS, Windows, and Linux.",
};

export default function DownloadPage() {
  return (
    <div className="flex flex-col flex-1 py-12">
      <Block title="Download Dream" className="mb-12">
        Available for macOS, Windows, and Linux.
      </Block>
      <div className="flex items-center justify-center mb-24">
        <DownloadButton eventName="Download page recommended download" />
      </div>
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        {platforms.map(({ os, Icon }) => (
          <div key={os} className="rounded-lg bg-white/[0.04] p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <Icon className="size-4" />
              {os}
            </h3>
            <ul className="mt-4 divide-y divide-white/10">
              {DOWNLOADS[os].map((item) => (
                <li key={item.label}>
                  <a
                    href={downloadUrl(item.file)}
                    download
                    data-umami-event={`Manual download ${os} ${item.label}`}
                    className="flex items-center justify-between gap-4 py-4 text-sm transition-colors hover:text-foreground/70"
                  >
                    {item.label}
                    <Download className="size-4 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

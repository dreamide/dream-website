import { Download } from "lucide-react";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import Block from "@/components/Block";
import DownloadButton from "@/components/DownloadButton";
import AppleIcon from "@/components/icons/AppleIcon";
import LinuxIcon from "@/components/icons/LinuxIcon";
import WindowsIcon from "@/components/icons/WindowsIcon";

const releaseBase = "https://files.dreamide.app/latest";

type Platform = {
  heading: string;
  Icon: ComponentType<{ className?: string }>;
  items: { label: string; href: string }[];
};

const platforms: Platform[] = [
  {
    heading: "macOS",
    Icon: AppleIcon,
    items: [
      { label: "Mac (ARM64)", href: `${releaseBase}/Dream-mac-arm64.dmg` },
      { label: "Mac (x64)", href: `${releaseBase}/Dream-mac-x64.dmg` },
    ],
  },
  {
    heading: "Windows",
    Icon: WindowsIcon,
    items: [
      {
        label: "Windows (x64)",
        href: `${releaseBase}/Dream-windows-x64.exe`,
      },
    ],
  },
  {
    heading: "Linux",
    Icon: LinuxIcon,
    items: [
      { label: "Linux .deb (x64)", href: `${releaseBase}/Dream-linux-x64.deb` },
      { label: "Linux RPM (x64)", href: `${releaseBase}/Dream-linux-x64.rpm` },
      {
        label: "Linux AppImage (x64)",
        href: `${releaseBase}/Dream-linux-x64.AppImage`,
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "Download Dream",
  description: "Download Dream for macOS, Windows, and Linux.",
};

export default function DownloadPage() {
  return (
    <div className="flex flex-col flex-1 py-12 gap-12">
      <Block title="Download Dream">
        Available for macOS, Windows, and Linux.
      </Block>
      <div className="flex items-center justify-center">
        <DownloadButton />
      </div>
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        {platforms.map(({ heading, Icon, items }) => (
          <div key={heading} className="rounded-lg bg-white/[0.04] p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <Icon className="size-4" />
              {heading}
            </h3>
            <ul className="mt-4 divide-y divide-white/10">
              {items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
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

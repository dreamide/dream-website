"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import {
  detectArch,
  detectOS,
  downloadUrl,
  type OS,
  recommendedDownload,
} from "../lib/downloads";
import Button from "./Button";
import SparkleButton from "./SparkleButton";

export default function DownloadButton({
  sparkle = true,
  eventName = "Download",
}: {
  sparkle?: boolean;
  eventName?: string;
}) {
  const [os, setOs] = useState<OS | null>(null);
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    const detected = detectOS();
    setOs(detected);

    if (detected) {
      detectArch().then((arch) => {
        setHref(downloadUrl(recommendedDownload(detected, arch).file));
      });
    }
  }, []);

  const Component = sparkle ? SparkleButton : Button;

  // Until we've detected the OS (or if detection failed), send users to the
  // download page so they can pick the right build themselves.
  if (!os || !href) {
    return (
      <Component
        variant="primary"
        href="/download"
        data-umami-event={`${eventName} page`}
      >
        <Download className="size-4" />
        Download
      </Component>
    );
  }

  return (
    <Component
      variant="primary"
      href={href}
      download
      data-umami-event={`${eventName} ${os}`}
    >
      <Download className="size-4" />
      Download for {os}
    </Component>
  );
}

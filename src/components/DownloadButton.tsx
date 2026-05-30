"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "./Button";
import SparkleButton from "./SparkleButton";

function detectOS(): string {
  if (typeof navigator === "undefined") return "your OS";

  const platform = navigator.platform?.toLowerCase() ?? "";
  const ua = navigator.userAgent.toLowerCase();

  if (platform.startsWith("mac") || ua.includes("mac os")) return "macOS";
  if (platform.startsWith("win") || ua.includes("windows")) return "Windows";
  if (platform.includes("linux") || ua.includes("linux")) return "Linux";

  return "your OS";
}

export default function DownloadButton({
  sparkle = true,
}: {
  sparkle?: boolean;
}) {
  const [os, setOs] = useState("your OS");

  useEffect(() => {
    setOs(detectOS());
  }, []);

  const Component = sparkle ? SparkleButton : Button;

  return (
    <Component variant="primary" href="/download">
      <Download className="size-4" />
      Download for {os}
    </Component>
  );
}

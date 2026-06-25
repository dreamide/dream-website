export const DOWNLOAD_BASE = "https://files.dreamide.app/latest";

export type OS = "macOS" | "Windows" | "Linux";
export type Arch = "arm64" | "x64";

export type DownloadFile = {
  label: string;
  file: string;
  arch: Arch;
};

export const DOWNLOADS: Record<OS, DownloadFile[]> = {
  macOS: [
    { label: "Mac (ARM64)", file: "Dream-mac-arm64.dmg", arch: "arm64" },
    { label: "Mac (x64)", file: "Dream-mac-x64.dmg", arch: "x64" },
  ],
  Windows: [
    { label: "Windows (x64)", file: "Dream-windows-x64.exe", arch: "x64" },
  ],
  Linux: [
    { label: "Linux .deb (x64)", file: "Dream-linux-x64.deb", arch: "x64" },
    { label: "Linux RPM (x64)", file: "Dream-linux-x64.rpm", arch: "x64" },
    {
      label: "Linux AppImage (x64)",
      file: "Dream-linux-x64.AppImage",
      arch: "x64",
    },
  ],
};

/** Build a full download URL for a given asset filename. */
export function downloadUrl(file: string): string {
  return `${DOWNLOAD_BASE}/${file}`;
}

/** Detect the visitor's operating system, or null if unknown. */
export function detectOS(): OS | null {
  if (typeof navigator === "undefined") return null;

  const platform = navigator.platform?.toLowerCase() ?? "";
  const ua = navigator.userAgent.toLowerCase();

  if (platform.startsWith("mac") || ua.includes("mac os")) return "macOS";
  if (platform.startsWith("win") || ua.includes("windows")) return "Windows";
  if (platform.includes("linux") || ua.includes("linux")) return "Linux";

  return null;
}

/**
 * Best-effort CPU architecture detection. Uses the User-Agent Client Hints
 * high-entropy values where available (Chromium), otherwise falls back to
 * scanning the UA string, then defaults to x64.
 */
export async function detectArch(): Promise<Arch> {
  if (typeof navigator === "undefined") return "x64";

  const uaData = (
    navigator as Navigator & {
      userAgentData?: {
        getHighEntropyValues?: (
          hints: string[],
        ) => Promise<{ architecture?: string }>;
      };
    }
  ).userAgentData;

  if (uaData?.getHighEntropyValues) {
    try {
      const { architecture } = await uaData.getHighEntropyValues([
        "architecture",
      ]);
      if (architecture) {
        return /arm/i.test(architecture) ? "arm64" : "x64";
      }
    } catch {
      // ignore and fall through to UA sniffing
    }
  }

  if (/arm|aarch64/i.test(navigator.userAgent)) return "arm64";

  return "x64";
}

/** Pick the recommended asset for an OS + architecture, with a sane fallback. */
export function recommendedDownload(os: OS, arch: Arch): DownloadFile {
  const list = DOWNLOADS[os];
  return list.find((d) => d.arch === arch) ?? list[0];
}

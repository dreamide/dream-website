"use client";

import { useRef, useState } from "react";
import Sparkles, { type SparklesHandle } from "@/components/ui/sparkles";

const PALETTES = [
  "mono",
  "arctic",
  "gold",
  "magenta",
  "emerald",
  "ember",
  "rainbow",
] as const;

export default function SparkleTitle() {
  const [index, setIndex] = useState(0);
  const burstRef = useRef<SparklesHandle>(null);

  function cyclePalette() {
    setIndex((i) => (i + 1) % PALETTES.length);
    burstRef.current?.cast();
  }

  return (
    <Sparkles
      ref={burstRef}
      className="inline-block cursor-pointer select-none w-[300px] h-[600px] mx-auto"
      position="bottom"
      height={300}
      density={100}
      palette={PALETTES[index]}
      onClick={cyclePalette}
    >
      <div className="absolute inset-0 flex items-center justify-center text-[28rem] z-10 font-bold">
        DREAM
      </div>
    </Sparkles>
  );
}

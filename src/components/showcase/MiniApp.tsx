"use client";

import { LayoutGroup } from "motion/react";
import { useEffect, useRef, useState } from "react";
import AppWindow from "./AppWindow";
import { CANVAS } from "./data";
import { sceneAt } from "./scene";

/** The finished opening scene, with no panel open (so it never nests again). */
const MINI_SCENE = {
  ...sceneAt(0.999),
  tabsShown: true,
  focus: null,
  camera: { x: 0.5, y: 0.5, zoom: 1 },
};

/**
 * A live, scaled-down copy of the app, shown as the page inside the browser
 * panel's preview of this website.
 */
export default function MiniApp() {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setWidth(el.offsetWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = width / CANVAS.width;

  return (
    <div
      ref={box}
      className="relative w-full overflow-hidden rounded-md shadow-2xl"
      style={{ aspectRatio: `${CANVAS.width} / ${CANVAS.height}` }}
    >
      {scale ? (
        <div
          className="pointer-events-none absolute top-0 left-0 origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          <LayoutGroup id="mini-app">
            <AppWindow scene={MINI_SCENE} />
          </LayoutGroup>
        </div>
      ) : null}
    </div>
  );
}

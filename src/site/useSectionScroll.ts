import { useEffect } from "react";
import { useLocation } from "react-router";

export function useSectionScroll() {
  const { pathname, hash } = useLocation();
  // React Router changes the hash without native anchor navigation. Scroll
  // after the translated heading is mounted, accounting for the mobile header.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname also changes the mounted document.
  useEffect(() => {
    if (!hash) return;
    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const frame = requestAnimationFrame(() => {
      const heading = document.getElementById(id);
      if (!heading) return;
      const headerHeight =
        document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      window.scrollTo({
        top:
          window.scrollY +
          heading.getBoundingClientRect().top -
          headerHeight -
          16,
        left: 0,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
}

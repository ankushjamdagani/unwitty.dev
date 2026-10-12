import { useEffect, useState, type RefObject } from "react";

export type DrawInPhase = "idle" | "armed" | "played";

/**
 * One-time entrance. "armed" (hide) only when JS runs, motion is allowed and
 * the element starts below the fold; "played" once it scrolls into view.
 * The server HTML and the no-JS page always show the final state.
 */
export function useDrawIn(ref: RefObject<HTMLElement | null>, threshold = 0.25): DrawInPhase {
  const [phase, setPhase] = useState<DrawInPhase>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * (1 - threshold)) return;

    setPhase("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setPhase("played");
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return phase;
}

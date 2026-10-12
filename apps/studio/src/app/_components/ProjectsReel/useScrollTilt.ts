import { useEffect, type RefObject } from "react";

type Options = { maxDeg?: number; minScale?: number };

/**
 * Tilts the element back as it enters the viewport and settles it flat once it
 * has travelled 60% of the viewport height. Writes the transform directly to the
 * DOM, only while the element is near the viewport. Does nothing under reduced motion.
 */
export function useScrollTilt(ref: RefObject<HTMLElement | null>, { maxDeg = 14, minScale = 0.94 }: Options = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const top = el.getBoundingClientRect().top;
      const t = Math.min(1, Math.max(0, (window.innerHeight - top) / (window.innerHeight * 0.6)));
      el.style.transform = t >= 1 ? "" : `rotateX(${maxDeg * (1 - t)}deg) scale(${minScale + (1 - minScale) * t})`;
      el.style.willChange = t >= 1 ? "" : "transform";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const listen = (on: boolean) => {
      if (on) {
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
      } else {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        listen(Boolean(entry?.isIntersecting));
        if (entry?.isIntersecting) schedule();
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(el);
    apply();

    return () => {
      observer.disconnect();
      listen(false);
      cancelAnimationFrame(frame);
      el.style.transform = "";
      el.style.willChange = "";
    };
  }, [ref, maxDeg, minScale]);
}

"use client";

import React, { useEffect, useRef, useState } from "react";

export interface RailAnchor {
  id: string;
  label: string;
}

export function SectionRail({ anchors }: { anchors: RailAnchor[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      rafRef.current = null;
      const vh = window.innerHeight;
      setVisible(window.scrollY > vh * 0.6);

      let bestId: string | null = null;
      let bestOverlap = 0;
      for (const a of anchors) {
        const el = document.getElementById(a.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const top = Math.max(0, r.top);
        const bottom = Math.min(vh, r.bottom);
        const overlap = Math.max(0, bottom - top);
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestId = a.id;
        }
      }
      setActiveId(bestId);
    };

    const schedule = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [anchors]);

  return (
    <nav
      aria-label="Section navigation"
      aria-hidden={!visible}
      className={`fixed right-4 top-1/2 z-nav hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-300 md:flex ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {anchors.map((a) => {
        const isActive = activeId === a.id;
        return (
          <a
            key={a.id}
            href={`#${a.id}`}
            aria-label={a.label}
            aria-current={isActive ? "true" : undefined}
            tabIndex={visible ? 0 : -1}
            className="group relative flex items-center justify-end"
          >
            <span
              className={`mr-2 hidden font-mono text-[10px] uppercase tracking-[0.25em] transition-opacity md:inline ${
                isActive
                  ? "text-fg-contrast opacity-100"
                  : "text-fg-muted opacity-0 group-hover:opacity-100"
              }`}
            >
              {a.label}
            </span>
            <span
              className={`block h-1.5 w-1.5 rounded-full border border-fg-muted/50 transition-all duration-200 ${
                isActive
                  ? "scale-125 border-fg-contrast bg-fg-contrast"
                  : "bg-transparent"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}

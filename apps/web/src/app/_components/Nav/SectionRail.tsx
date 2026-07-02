"use client";

import React, { useEffect, useState } from "react";

export interface RailAnchor {
  id: string;
  label: string;
}

export function SectionRail({ anchors }: { anchors: RailAnchor[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        // Show rail if any target section is entering the view
        const hasVisible = visibleSections.size > 0;
        setVisible(hasVisible);

        if (hasVisible) {
          // Match the section with the highest intersection ratio
          let active: string | null = null;
          let maxRatio = -1;
          visibleSections.forEach((ratio, id) => {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              active = id;
            }
          });
          if (active) {
            setActiveId(active);
          }
        }
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0, 0.1, 0.2, 0.5, 0.8]
      }
    );

    anchors.forEach((a) => {
      const el = document.getElementById(a.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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
              className={`mr-2 hidden font-technical text-[10px] uppercase tracking-[0.25em] transition-opacity md:inline ${
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

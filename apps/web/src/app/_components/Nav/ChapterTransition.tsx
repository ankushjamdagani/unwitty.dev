"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ChapterTransitionContextType {
  triggerTransition: (
    href: string,
    targetType: "work" | "life",
    e?: React.MouseEvent | MouseEvent | { x: number; y: number }
  ) => void;
  isActive: boolean;
  transitioningTo: "work" | "life" | null;
  clickCoord: { x: number; y: number } | null;
}

const ChapterTransitionContext = createContext<ChapterTransitionContextType | null>(null);

export function useChapterTransition() {
  const ctx = useContext(ChapterTransitionContext);
  if (!ctx) {
    throw new Error("useChapterTransition must be used within a ChapterTransitionProvider");
  }
  return ctx;
}

export function ChapterTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [transitioningTo, setTransitioningTo] = useState<"work" | "life" | null>(null);
  const [clickCoord, setClickCoord] = useState<{ x: number; y: number } | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Automatically close transition when pathname shifts
  useEffect(() => {
    setIsActive(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [pathname]);

  const triggerTransition = (
    href: string,
    targetType: "work" | "life",
    e?: React.MouseEvent | MouseEvent | { x: number; y: number }
  ) => {
    if (isActive) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (e) {
      if ("clientX" in e && "clientY" in e) {
        x = e.clientX;
        y = e.clientY;
      } else if ("x" in e && "y" in e) {
        x = (e as any).x;
        y = (e as any).y;
      }
    }

    setClickCoord({ x, y });
    setIsActive(true);
    setTransitioningTo(targetType);

    timeoutRef.current = setTimeout(() => {
      router.push(href);
    }, 1000); // Allow time for transitions to cover screen
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <ChapterTransitionContext.Provider value={{ triggerTransition, isActive, transitioningTo, clickCoord }}>
      {children}
      <ChapterTransitionOverlay active={isActive} targetType={transitioningTo} clickCoord={clickCoord} />
    </ChapterTransitionContext.Provider>
  );
}

function ChapterTransitionOverlay({
  active,
  targetType,
  clickCoord,
}: {
  active: boolean;
  targetType: "work" | "life" | null;
  clickCoord: { x: number; y: number } | null;
}) {
  const [seed, setSeed] = useState(0);
  const isWork = targetType === "work";

  // Morph the seed dynamically to animate the wave displacement filter
  useEffect(() => {
    if (!active || isWork) return;

    let rafId: number;
    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime > 60) {
        setSeed((s) => (s + 1) % 100);
        lastTime = time;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [active, isWork]);

  return (
    <div
      className={`fixed inset-0 z-overlay flex items-center justify-center pointer-events-none transition-colors duration-[1000ms] ${
        active ? "bg-black/10 pointer-events-auto" : "bg-transparent pointer-events-none"
      }`}
    >
      <div
        className="absolute pointer-events-none origin-center"
        style={{
          left: `${clickCoord?.x ?? 0}px`,
          top: `${clickCoord?.y ?? 0}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          className={`origin-center transition-transform duration-[950ms] ease-[cubic-bezier(0.86,0,0.07,1)] ${
            active ? "scale-[28]" : "scale-0"
          }`}
        >
          <defs>
            <filter id="transition-wave-filter" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.016"
                numOctaves={3}
                seed={seed}
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="42"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          {isWork ? (
            // Simple perfect circle with outer dashed border
            <g>
              <circle cx="110" cy="110" r="94" fill="rgb(var(--canvas))" />
              <circle
                cx="110"
                cy="110"
                r="102"
                fill="none"
                stroke="rgb(var(--accent) / 0.3)"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
            </g>
          ) : (
            // Personal / Organic Morphed Wave Blob
            <g>
              <circle
                cx="110"
                cy="110"
                r="94"
                fill="rgb(var(--canvas))"
                filter="url(#transition-wave-filter)"
              />
              <circle
                cx="110"
                cy="110"
                r="92"
                fill="none"
                stroke="rgb(var(--accent) / 0.2)"
                strokeWidth="1.5"
                filter="url(#transition-wave-filter)"
              />
            </g>
          )}
        </svg>
      </div>
      <TransitionText active={active} isWork={isWork} />
    </div>
  );
}

// Reusable text readout overlay
function TransitionText({ active, isWork }: { active: boolean; isWork: boolean }) {
  return (
    <div
      className={`absolute pointer-events-none font-technical text-center transition-opacity duration-300 ${
        active ? "opacity-100 delay-300" : "opacity-0"
      }`}
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-accent animate-pulse block mb-2">
        ▲ REDIRECTING LAYOUT
      </span>
      <span className={`block font-semibold ${
        isWork
          ? "font-display text-2xl text-fg-contrast"
          : "font-expressive text-4xl text-fg-contrast italic"
      }`}>
        {isWork ? "Professional Work" : "Personal Life"}
      </span>
    </div>
  );
}

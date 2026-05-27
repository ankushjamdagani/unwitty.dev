"use client";

import React, { useEffect, useRef } from "react";

export const LedgerShell = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = -((e.clientX - w / 2) / (w / 2)) * 15;
      const y = -((e.clientY - h / 2) / (h / 2)) * 15;

      if (containerRef.current) {
        containerRef.current.style.setProperty("--shadow-x", `${x.toFixed(2)}px`);
        containerRef.current.style.setProperty("--shadow-y", `${y.toFixed(2)}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="selection:bg-fg-contrast selection:text-canvas overflow-x-hidden min-h-screen flex flex-col"
    >
      {/* Rough SVG Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter id="ledger-rough" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.028"
              numOctaves={2}
              seed={9}
            />
            <feDisplacementMap in="SourceGraphic" scale={5} />
          </filter>
        </defs>
      </svg>

      <div className="scanline" />
      
      <main className="relative flex-grow w-full flex flex-col items-center">
        {children}
      </main>
    </div>
  );
};

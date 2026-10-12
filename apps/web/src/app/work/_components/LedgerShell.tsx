"use client";

import React, { useRef } from "react";

export const LedgerShell = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="selection:bg-fg-contrast selection:text-canvas overflow-x-hidden min-h-screen flex flex-col"
    >
      {/* Rough SVG Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter
            id="ledger-rough"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
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

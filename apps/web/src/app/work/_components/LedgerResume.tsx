"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const LedgerBracket = ({ isFloating = false }: { isFloating?: boolean }) => {
  if (isFloating) {
    return (
      <Link
        href="/resume.pdf"
        target="_blank"
        className="group inline-flex flex-col items-center py-2 px-4 rounded border border-dashed border-ledger-outline/20 hover:border-accent/40 transition-all duration-500 hover:-translate-y-0.5 cursor-pointer"
      >
        <span className="text-[7px] font-technical text-fg-muted uppercase tracking-[0.25em] mb-0.5 transition-colors duration-500 group-hover:text-accent">
          CLASS: DOCUMENTS // DOCKET_04
        </span>
        <div className="relative flex items-center py-0.5">
          <span className="text-sm text-ledger-outline/30 group-hover:text-accent group-hover:-translate-x-1.5 transition-all duration-500 font-technical font-light">
            [
          </span>
          <span className="font-technical text-fg-muted italic mr-1.5 text-[10px] transition-transform duration-500 group-hover:-translate-x-0.5">
            04 /
          </span>
          <span className="font-display text-xs font-medium tracking-[0.25em] group-hover:tracking-[0.35em] text-fg-contrast group-hover:text-accent transition-all duration-700 uppercase">
            RESUME
          </span>
          <span className="text-sm text-ledger-outline/30 group-hover:text-accent group-hover:translate-x-1.5 transition-all duration-500 font-technical font-light">
            ]
          </span>
        </div>
        <span className="text-[7px] font-technical text-fg-muted uppercase tracking-[0.2em] mt-0.5 transition-colors duration-500 group-hover:text-accent">
          ACCESS · IN_ENG ↗
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/resume.pdf"
      target="_blank"
      className="group inline-flex flex-col items-center p-6 cursor-pointer"
    >
      <span className="text-[8px] font-technical text-fg-muted uppercase tracking-[0.25em] mb-2 transition-colors duration-500 group-hover:text-accent">
        CLASS: DOCUMENTS // DOCKET_04
      </span>
      <div className="relative flex items-center py-3">
        <span className="text-xl text-ledger-outline/30 group-hover:text-accent group-hover:-translate-x-3 transition-all duration-500 font-technical font-light">
          [
        </span>
        <span className="font-technical text-fg-muted italic mr-3 text-sm transition-transform duration-500 group-hover:-translate-x-1">
          04 /
        </span>
        <span className="font-display text-xl font-medium tracking-[0.25em] group-hover:tracking-[0.45em] text-fg-contrast group-hover:text-accent transition-all duration-700 uppercase">
          RESUME
        </span>
        <span className="text-xl text-ledger-outline/30 group-hover:text-accent group-hover:translate-x-3 transition-all duration-500 font-technical font-light">
          ]
        </span>
      </div>
      <span className="text-[8px] font-technical text-fg-muted uppercase tracking-[0.2em] mt-2 transition-colors duration-500 group-hover:text-accent">
        ACCESS_SPECIFICATION · IN_ENG ↗
      </span>
    </Link>
  );
};

export const LedgerResume = () => {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 450);

      if (sentinelRef.current) {
        const rect = sentinelRef.current.getBoundingClientRect();
        setIsDocked(rect.top <= window.innerHeight - 60);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full flex flex-col items-center mb-8">
      <div className="flex items-center gap-4 w-full mb-8 relative z-base justify-center select-none">
        <div className="flex-grow h-px bg-ledger-outline opacity-20 [filter:url(#ledger-rough)]"></div>
        <span className="text-[10px] font-technical text-fg-muted uppercase tracking-[0.3em]">
          *** SEC_04_EOF // RESUME ***
        </span>
        <div className="flex-grow h-px bg-ledger-outline opacity-20 [filter:url(#ledger-rough)]"></div>
      </div>

      <div
        ref={sentinelRef}
        className="w-full flex items-center justify-center min-h-[160px] relative py-8 z-base"
      >
        <div
          className="absolute inset-0 opacity-[0.005] pointer-events-none select-none"
          style={{
            backgroundImage:
              "radial-gradient(rgb(var(--fg-contrast)) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div
          className={`transition-all duration-700 transform ${
            isDocked
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
        >
          <LedgerBracket isFloating={false} />
        </div>
      </div>

      <div
        className={`fixed bottom-8 right-8 z-overlay transition-all duration-500 transform ${
          isScrolledPastHero && !isDocked
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-8 pointer-events-none"
        }`}
      >
        <LedgerBracket isFloating={true} />
      </div>
    </div>
  );
};

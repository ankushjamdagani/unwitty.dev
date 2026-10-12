"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setScrolled(!entry.isIntersecting);
        }
      },
      { threshold: 0 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="absolute top-0 left-0 right-0 h-px pointer-events-none z-below-all" />
      <header
        className={`sticky top-0 z-nav border-b border-dashed border-fg-muted/30 transition-colors duration-300 font-technical ${
          scrolled ? "bg-canvas-raised/75 backdrop-blur-md" : ""
        }`}
      >
        <div className="mx-auto flex h-nav max-w-content items-center justify-between px-4">
          <Link
            href="/"
            aria-label="Unwitty.dev home"
            className="inline-flex items-center text-sm"
          >
            <span className="rounded-sm bg-fg-contrast px-1.5 py-0.5 font-bold text-canvas-contrast">
              Unwitty
            </span>
            <span className="ml-0.5 text-fg-muted">.dev</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}

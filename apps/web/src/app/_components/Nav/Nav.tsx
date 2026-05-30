"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-nav border-b border-dashed border-fg-muted/30 transition-colors duration-300 font-technical ${
        scrolled ? "bg-canvas/60 backdrop-blur-md" : ""
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
  );
}

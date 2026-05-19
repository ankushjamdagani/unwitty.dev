"use client";

import React from "react";

import { THEMES, Theme, useTheme } from "./useTheme";

const DIAL: { theme: Theme; angle: number; label: string }[] = [
  { theme: "warm", angle: -60, label: "Warm" },
  { theme: "light", angle: 0, label: "Light" },
  { theme: "dark", angle: 60, label: "Dark" },
];

export function RotaryDial() {
  const { theme, setTheme, cycleTheme } = useTheme();
  const active = DIAL.find((d) => d.theme === theme) ?? DIAL[1]!;

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={cycleTheme}
        aria-label={`Theme: ${active.label}. Click to cycle.`}
        className="border-thin border-ink-2 relative h-10 w-10 rounded-full border-dashed bg-[rgba(var(--paper-rgb),0.6)] focus-visible:outline-[var(--focus-outline)]"
      >
        {DIAL.map((d) => (
          <span
            key={d.theme}
            aria-hidden="true"
            className="bg-ink-3 absolute left-1/2 top-1/2 h-[2px] w-[5px]"
            style={{
              transform: `translate(-50%, -50%) rotate(${d.angle}deg) translateY(-14px)`,
              opacity: d.theme === active.theme ? 0 : 0.6,
            }}
          />
        ))}
        <span
          aria-hidden="true"
          className="bg-foreground absolute left-1/2 top-1/2 h-[12px] w-[3px] rounded-full"
          style={{
            transform: `translate(-50%, -100%) rotate(${active.angle}deg)`,
            transformOrigin: "50% 100%",
            transition: "transform 360ms cubic-bezier(0.3, 1.4, 0.4, 1)",
          }}
        />
        <span
          aria-hidden="true"
          className="bg-foreground absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
      </button>
      <div
        role="radiogroup"
        aria-label="Theme"
        className="ml-2 hidden flex-col gap-[2px] text-[10px] uppercase tracking-wider sm:flex"
      >
        {DIAL.map((d) => (
          <button
            key={d.theme}
            type="button"
            role="radio"
            aria-checked={d.theme === active.theme}
            onClick={() => setTheme(d.theme)}
            className={`text-left transition-opacity ${
              d.theme === active.theme
                ? "font-bold opacity-100"
                : "opacity-50 hover:opacity-80"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}

RotaryDial.themes = THEMES;

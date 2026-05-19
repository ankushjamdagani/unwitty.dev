"use client";

import React from "react";
import { FaMoon } from "react-icons/fa6";
import { LuFlame, LuSun } from "react-icons/lu";

import { THEMES, Theme, useTheme } from "./useTheme";

const OPTIONS: { theme: Theme; label: string; Icon: React.ElementType }[] = [
  { theme: "warm", label: "Warm", Icon: LuFlame },
  { theme: "light", label: "Light", Icon: LuSun },
  { theme: "dark", label: "Dark", Icon: FaMoon },
];

export function SegmentedPill() {
  const { theme, setTheme } = useTheme();
  const activeIndex = Math.max(
    0,
    OPTIONS.findIndex((o) => o.theme === theme)
  );

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="border-thin border-fg-muted relative inline-flex items-center rounded-full border-dashed bg-canvas/60 p-[2px]"
    >
      <span
        aria-hidden="true"
        className="bg-fg-contrast absolute top-[2px] bottom-[2px] rounded-full"
        style={{
          width: "calc((100% - 4px) / 3)",
          left: `calc(2px + ${activeIndex} * ((100% - 4px) / 3))`,
          transition: "left 280ms cubic-bezier(0.4, 0.0, 0.2, 1)",
        }}
      />
      {OPTIONS.map((opt) => {
        const active = opt.theme === theme;
        const Icon = opt.Icon;
        return (
          <button
            key={opt.theme}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${opt.label} theme`}
            onClick={() => setTheme(opt.theme)}
            className="relative z-base flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors duration-200"
            style={{
              color: active ? "rgb(var(--canvas-contrast))" : undefined,
            }}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}

SegmentedPill.themes = THEMES;

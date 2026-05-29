"use client";

import React from "react";
import { useLedgerTheme, LedgerTheme } from "../_context/LedgerThemeContext";

export function DraftController() {
  const { theme, setTheme } = useLedgerTheme();

  const schemas: { value: LedgerTheme; label: string; num: string }[] = [
    { value: "blueprint", label: "Blueprint", num: "01" },
    { value: "editorial", label: "Editorial", num: "02" },
    { value: "structural", label: "Grid", num: "03" },
    { value: "hybrid", label: "Hybrid", num: "04" },
  ];

  return (
    <div className="flex items-center gap-1 bg-canvas border border-ledger-outline/20 p-[2px] rounded-[4px] text-[10px] font-mono select-none">
      {schemas.map((s) => {
        const isActive = theme === s.value;
        return (
          <button
            key={s.value}
            onClick={() => setTheme(s.value)}
            className={`px-2.5 py-1 rounded-[2px] flex items-center gap-1 uppercase tracking-wider transition-all duration-300 ${
              isActive
                ? "bg-fg-contrast text-canvas-contrast font-bold shadow-sm"
                : "text-fg-muted hover:text-fg-contrast hover:bg-canvas-raised"
            }`}
            title={`Switch layout schema to ${s.label}`}
          >
            <span className={isActive ? "text-accent" : "opacity-45"}>
              {s.num}
            </span>
            <span className="hidden md:inline">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

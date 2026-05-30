"use client";

import type { Choice } from "./Composition";

type TransitionProps = { selected: Choice | null };

export function Transition({ selected }: TransitionProps) {
  const isWork = selected === "work";
  const on = !!selected;
  return (
    <>
      <div
        className={`fixed top-0 inset-0 z-overlay bg-canvas pointer-events-none transition-opacity duration-[550ms] ease-in-out ${on ? "opacity-100" : "opacity-0"}`}
      />
      {/* Background Dots on Transition Screen */}
      <div
        className={`fixed inset-0 z-overlay pointer-events-none transition-opacity duration-[550ms] ease-in-out ${on ? "opacity-100" : "opacity-0"}`}
        style={{
          background: `radial-gradient(var(--dot) var(--dot-size), transparent calc(var(--dot-size) + 0.4px)) 0 0 / var(--grid-size) var(--grid-size)`,
        }}
      />
      <div
        className={`fixed inset-0 z-overlay flex items-center justify-center pointer-events-none text-center font-technical text-xs font-medium leading-[1.6] tracking-[0.18em] text-fg [transition:opacity_0.35s_ease_0.25s] ${on ? "opacity-100" : "opacity-0"}`}
      >
        <div>
          <span className="block tracking-[0.22em] text-fg-muted">
            REDIRECTING →
          </span>
          <span
            className={`mt-[14px] block leading-none ${isWork ? "font-display text-[40px] font-medium not-italic  tracking-[0.04em]" : "font-expressive text-[56px] font-light italic leading-none tracking-[-0.01em]"} `}
          >
            {isWork ? "Work" : "Life"}
          </span>
          <span className="mt-[10px] block tracking-[0.22em] text-fg-muted">
            {isWork ? "unwitty.dev / work" : "unwitty.dev / personal"}
          </span>
        </div>
      </div>
    </>
  );
}

"use client";

import type { Choice } from "./Composition";

type TransitionProps = { selected: Choice | null };

export function Transition({ selected }: TransitionProps) {
  const isWork = selected === "work";
  const on = !!selected;
  return (
    <>
      <div
        className={`fixed inset-0 z-[50] bg-paper pointer-events-none transition-opacity duration-[550ms] ease-in-out ${on ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center pointer-events-none text-center font-mono-display text-[12px] font-medium leading-[1.6] tracking-[0.18em] text-ink [transition:opacity_0.35s_ease_0.25s] ${on ? "opacity-100" : "opacity-0"}`}
      >
        <div>
          <span className="block tracking-[0.22em] text-ink-2">
            REDIRECTING →
          </span>
          <span
            className={
              isWork
                ? "mt-[14px] block font-mono-display text-[40px] font-medium not-italic leading-none tracking-[0.04em]"
                : "mt-[14px] block font-serif-display text-[56px] font-light italic leading-none tracking-[-0.01em]"
            }
          >
            {isWork ? "work" : "life"}
          </span>
          <span className="mt-[10px] block tracking-[0.22em] text-ink-2">
            {isWork ? "unwitty.dev / work" : "unwitty.dev / personal"}
          </span>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { TaglineCanvas } from "@/config/types";

import { useDrawIn, type DrawInPhase } from "../Activity/useDrawIn";

const TYPE_START_MS = 350;
const TYPE_STEP_MS = 34;

const MUTED = {
  color: "color-mix(in srgb, var(--product-fg) 45%, transparent)",
} as CSSProperties;

/**
 * Types `text` once the intro plays. Idle (server render, reduced motion,
 * already on screen, or a later product swap) shows the whole line.
 * Progress is derived from elapsed time, not tick count, so it stays in step
 * with the CSS timeline even when a background tab throttles timers.
 */
function useTyped(text: string, phase: DrawInPhase) {
  const [count, setCount] = useState(text.length);

  useEffect(() => {
    if (phase === "idle") return;
    setCount(0);
    if (phase !== "played") return;
    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      const typed = Math.floor(
        (performance.now() - startedAt - TYPE_START_MS) / TYPE_STEP_MS,
      );
      const next = Math.max(0, Math.min(typed, text.length));
      setCount(next);
      if (next === text.length) window.clearInterval(interval);
    }, TYPE_STEP_MS / 2);
    return () => window.clearInterval(interval);
  }, [phase, text]);

  return text.slice(0, count);
}

function PromptInput({
  prompt,
  phase,
}: {
  prompt: string;
  phase: DrawInPhase;
}) {
  const typed = useTyped(prompt, phase);
  return (
    <span
      aria-hidden
      className="ct-input inline-flex w-fit items-center gap-2 rounded-full bg-white/60 py-1 pl-3 pr-1 font-sans text-[13px] font-normal not-italic leading-none tracking-normal shadow-[0_0_0_1px_rgb(0_0_0/0.06)]"
    >
      {/* The invisible full prompt reserves the final width, so the pill never grows while typing. */}
      <span className="grid">
        <span className="invisible whitespace-nowrap pr-[3px] [grid-area:1/1]">
          {prompt}
        </span>
        <span className="whitespace-nowrap [grid-area:1/1]">
          {typed || <span style={MUTED}>Ask anything…</span>}
          <span className="ct-caret ml-px inline-block h-[14px] w-[1.5px] translate-y-[2px] bg-product-accent" />
        </span>
      </span>
      <span className="ct-send inline-flex h-5 w-5 items-center justify-center rounded-full bg-product-accent text-product-ink">
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
          <path
            d="M6 10V2M2.5 5.5 6 2l3.5 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}

const HANDLE = "absolute h-[7px] w-[7px] border border-product-accent bg-white";

/** The highlighted word, framed like a selected canvas object that Claude keeps resizing. */
function SelectedWord({ word }: { word: string }) {
  return (
    <span className="relative mx-[0.1em] inline-block italic text-product-accent">
      <span
        aria-hidden
        className="ct-select pointer-events-none absolute inset-0"
      >
        <span className="ct-frame absolute -bottom-px -left-[5px] -right-[5px] -top-px border border-product-accent">
          <span className={`${HANDLE} -left-[4px] -top-[4px]`} />
          <span className={`${HANDLE} -right-[4px] -top-[4px]`} />
          <span className={`${HANDLE} -bottom-[4px] -left-[4px]`} />
          <span className={`${HANDLE} -bottom-[4px] -right-[4px]`} />
          {/* Cursor tip sits on the bottom-right handle, so it rides along as the frame grows. */}
          <span className="absolute left-[calc(100%-1px)] top-[calc(100%-1px)]">
            <span className="ct-fly block">
              <span className="ct-grab flex origin-top-left items-start">
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  className="drop-shadow-[0_1px_1px_rgb(0_0_0/0.2)]"
                >
                  <path
                    d="M1 1 L1 15 L5 11.5 L8 17 L10.5 15.8 L7.6 10.4 L13 10.4 Z"
                    fill="var(--product-accent)"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="-ml-[3px] mt-[11px] rounded-full bg-product-accent px-1.5 font-sans text-[10px] font-medium not-italic leading-[15px] tracking-normal text-product-ink shadow-[0_1px_2px_rgb(0_0_0/0.15)]">
                  claude
                </span>
              </span>
            </span>
          </span>
        </span>
      </span>
      {word}
    </span>
  );
}

type Props = {
  canvas: TaglineCanvas;
  /** Full sentence, read by assistive tech in place of the decoration. */
  text: string;
  headingClassName: string;
  style: CSSProperties;
  /** Play the typed intro when scrolled into view; false for later product swaps. */
  intro: boolean;
  /** The outgoing copy during a swap: decorative only, no heading. */
  decorative?: boolean;
  className?: string;
};

/**
 * "Prompt → canvas" tagline: the prompt is typed into a chat input and sent,
 * the input recedes, the headline rises and Claude's cursor selects the
 * highlighted word, then keeps nudging its resize handle.
 */
export function CanvasTagline({
  canvas,
  text,
  headingClassName,
  style,
  intro,
  decorative,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Wait until the whole tagline is on screen, so the typing is actually seen.
  const drawIn = useDrawIn(ref, 1);
  const phase = intro ? drawIn : "idle";
  const Heading = decorative ? "p" : "h3";

  return (
    <div
      ref={ref}
      aria-hidden={decorative || undefined}
      data-intro={phase === "idle" ? undefined : phase}
      className={`ct flex flex-col gap-3 ${className}`}
    >
      <PromptInput prompt={canvas.prompt} phase={phase} />
      <Heading
        className={`ct-headline mb-6 [text-wrap:balance] ${headingClassName}`}
        style={style}
      >
        <span className="sr-only">{text}</span>
        <span aria-hidden>
          {canvas.before} <SelectedWord word={canvas.highlight} />{" "}
          {canvas.after}
        </span>
      </Heading>
    </div>
  );
}

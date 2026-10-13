"use client";

import { useEffect, useState, type CSSProperties } from "react";

import type { TaglineCanvas } from "@/config/types";

import type { DrawInPhase } from "../Activity/useDrawIn";

// Typing starts once the headline has landed (see the .ct timeline in globals.css).
const TYPE_START_MS = 1100;
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

type PromptBarProps = {
  prompt: string;
  phase: DrawInPhase;
  href: string;
  label: string;
};

/**
 * The card's call to action, dressed as a chat input: the prompt types itself
 * in during the intro and the send button is the "Open" link.
 */
export function PromptBar({ prompt, phase, href, label }: PromptBarProps) {
  const typed = useTyped(prompt, phase);
  return (
    <div className="ct-bar flex w-full max-w-[400px] items-center gap-2 rounded-full bg-white/80 py-1.5 pl-4 pr-1.5 font-sans text-[14px] leading-none shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_rgb(0_0_0/0.04)]">
      {/* The invisible full prompt reserves the final width, so nothing shifts while typing. */}
      <span aria-hidden className="grid min-w-0 flex-1">
        <span className="invisible truncate pr-[3px] [grid-area:1/1]">
          {prompt}
        </span>
        <span className="truncate [grid-area:1/1]" style={MUTED}>
          {typed || "Ask anything…"}
          <span className="ct-caret ml-px inline-block h-[14px] w-[1.5px] translate-y-[2px] bg-product-accent" />
        </span>
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="ct-send btn !h-8 shrink-0 !gap-1.5 !px-3 !text-[13px] bg-product-accent text-product-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_1px_2px_rgb(0_0_0/0.15)] hover:opacity-90"
      >
        {label} <span aria-hidden>↗</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
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
  className: string;
  style: CSSProperties;
  /** The outgoing copy during a swap: decorative only, no heading. */
  decorative?: boolean;
};

/**
 * "Prompt → canvas" headline: `highlight` sits in a selection frame that
 * Claude's cursor keeps resizing. The intro is driven by an ancestor's
 * `data-intro` (see ProjectsReel); without one it shows the settled loop.
 */
export function CanvasHeadline({
  canvas,
  text,
  className,
  style,
  decorative,
}: Props) {
  const Heading = decorative ? "p" : "h3";
  return (
    <Heading
      aria-hidden={decorative || undefined}
      className={`ct-headline mb-6 [text-wrap:balance] ${className}`}
      style={style}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {canvas.before} <SelectedWord word={canvas.highlight} /> {canvas.after}
      </span>
    </Heading>
  );
}

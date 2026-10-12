"use client";

import { useEffect, useRef, useState } from "react";

type State = "idle" | "copied" | "manual";

const LABEL: Record<State, string> = { idle: "Copy", copied: "Copied ✓", manual: "Press ⌘C" };

/** Email chip with a copy button. Falls back to selecting the text when the clipboard is blocked. */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<State>("idle");
  const linkRef = useRef<HTMLAnchorElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const settle = (next: State) => {
    setState(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1400);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      settle("copied");
    } catch {
      const link = linkRef.current;
      if (link) {
        const range = document.createRange();
        range.selectNodeContents(link);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      settle("manual");
    }
  };

  return (
    <span className="inline-flex items-center gap-2.5 rounded-[10px] bg-canvas py-1.5 pl-3.5 pr-1.5 font-mono text-[13px] shadow-hairline">
      <a ref={linkRef} href={`mailto:${email}`} className="hover:underline">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="min-w-[76px] rounded-md bg-fg px-2 py-1 text-[11px] text-white transition-colors hover:bg-fg/85"
      >
        {LABEL[state]}
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Email copied" : ""}
      </span>
    </span>
  );
}

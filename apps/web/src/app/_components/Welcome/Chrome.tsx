"use client";

import { AnimatedWordList } from "@/components/AnimatedWordList/AnimatedWordList";

export function Topbar() {
  return (
    <header className="flex items-center justify-between px-9 pt-7 tracking-[0.02em] text-fg max-[680px]:px-[18px] max-[680px]:pt-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-icon-md w-icon-md items-center justify-center border-[1.2px] border-fg font-mono-display text-xs font-semibold leading-none">
          U
        </span>
        <b className="font-semibold tracking-[0.04em]">Unwitty</b>
        <span className="font-normal text-fg-subtle">.dev</span>
      </div>
      <div
        className="flex items-center gap-2 text-fg-muted"
        title="Open to collaborate"
      >
        <span className="h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_0_3px_rgb(var(--accent)_/_0.18)]"></span>
        <span>Status&nbsp;→&nbsp;Open to collaborate</span>
      </div>
    </header>
  );
}

const Status = [
  {
    label: "OPEN_TO_WORK",
  },
  {
    label: "OPEN_TO_COLLABORATE",
  },
  {
    label: "OPEN_TO_INNOVATE",
  },
];

export function Botbar() {
  return (
    <footer className="flex items-end justify-between pb-6 text-[11px] text-fg-muted px-[var(--horizontal-gap)]">
      <em>
        Status →{" "}
        <AnimatedWordList transitionTime={3000}>
          {Status.map((st) => (
            <strong key={st.label}>{st.label}</strong>
          ))}
        </AnimatedWordList>
      </em>
      {/* <div className="tracking-[0.04em]">
        v2026.05 &nbsp;·&nbsp; LAZY_BRILLIANCE
      </div> */}
      <div className="flex items-center gap-[14px]">
        <span className="mr-2 tracking-[0.04em] text-fg-subtle">SELECT</span>
        <Key>↑</Key>
        <Key>↓</Key>
        <span className="ml-2 tracking-[0.04em] text-fg-subtle">ENTER</span>
        <Key>↵</Key>
      </div>
    </footer>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-icon-md min-w-[var(--icon-md)] items-center justify-center rounded-[2px] border-thin border-fg bg-transparent px-[6px] font-mono-display text-[11px] font-medium leading-none text-fg">
      {children}
    </span>
  );
}

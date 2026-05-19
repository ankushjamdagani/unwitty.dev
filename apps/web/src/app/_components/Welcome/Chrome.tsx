"use client";

import { AnimatedWordList } from "@/components/AnimatedWordList/AnimatedWordList";
import { STATUS } from "@/configs/constants";

export function Botbar() {
  return (
    <footer className="flex items-end justify-between pb-6 text-[11px] text-fg-muted px-[var(--horizontal-gap)]">
      <em>
        Status →{" "}
        <AnimatedWordList transitionTime={3000}>
          {STATUS.map((st) => (
            <strong key={st.label}>{st.label.replace(/_/g, " ")}</strong>
          ))}
        </AnimatedWordList>
      </em>
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

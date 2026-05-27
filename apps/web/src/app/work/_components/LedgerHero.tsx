import React from "react";
import { RoughUnderline } from "./RoughUnderline";

export const LedgerHero = () => {
  return (
    <section className="mt-48 mb-20 relative min-h-[500px] flex flex-col justify-center">
      <div className="absolute -top-40 -right-40 opacity-5 pointer-events-none select-none">
        <span className="text-[20rem] font-serif leading-none italic">UW</span>
      </div>

      <h1 className="text-4xl md:text-8xl text-fg-contrast max-w-4xl mb-6 leading-tight font-work-heading relative z-base">
        A ledger of things{" "}
        <RoughUnderline className="italic font-ledger-serif">
          made
        </RoughUnderline>
        ,{" "}
        <RoughUnderline className="italic font-ledger-serif">
          deployed
        </RoughUnderline>
        , and occasionally{" "}
        <RoughUnderline className="italic font-ledger-serif">
          regretted.
        </RoughUnderline>
      </h1>

      <div className="flex flex-wrap gap-x-4 gap-y-4 text-[11px] font-medium text-fg-muted tracking-widest relative z-base">
        <span>2016 — 2026</span>
        <span className="opacity-30">/</span>
        <span>@unwitty</span>
      </div>

      <div className="mt-auto flex justify-between items-end w-full text-[10px] font-medium text-fg-muted uppercase tracking-widest opacity-60">
        <span className="flex items-center gap-2">LOC: India</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          STATUS: AVAILABLE_FOR_HIRE
        </span>
      </div>
    </section>
  );
};

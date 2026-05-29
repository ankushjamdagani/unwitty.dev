"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLedgerTheme } from "../_context/LedgerThemeContext";
import Link from "next/link";


const RESUME_VARIANTS = [
  "ledger-bracket",
  "margin-note",
  "stamp-imprint",
  "index-card",
  "ticket-stub",
] as const;
type ResumeVariant = (typeof RESUME_VARIANTS)[number];

export const LedgerResume = () => {
  const { theme } = useLedgerTheme();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const activeVariant: ResumeVariant =
    theme === "blueprint"
      ? "ticket-stub"
      : theme === "editorial" || theme === "hybrid"
        ? "ledger-bracket"
        : "index-card";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 450);

      if (sentinelRef.current) {
        const rect = sentinelRef.current.getBoundingClientRect();
        setIsDocked(rect.top <= window.innerHeight - 60);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ========================================================================== */
  /*            1. LEDGER BRACKET (Typographic Classic)                         */
  /* ========================================================================== */
  const LedgerBracket = ({ isFloating = false }: { isFloating?: boolean }) => {
    if (isFloating) {
      return (
        <Link
          href="/resume.pdf"
          target="_blank"
          className="group inline-flex flex-col items-center py-2 px-4 rounded bg-canvas-raised/90 backdrop-blur-md border border-ledger-outline/20 hover:border-accent/40 shadow-2xl transition-all duration-500 hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="text-[7px] font-mono text-fg-muted uppercase tracking-[0.25em] mb-0.5 transition-colors duration-500 group-hover:text-accent">
            CLASS: DOCUMENTS // DOCKET_04
          </span>
          <div className="relative flex items-center py-0.5">
            <span className="text-sm text-ledger-outline/30 group-hover:text-accent group-hover:-translate-x-1.5 transition-all duration-500 font-mono font-light">
              [
            </span>
            <span className="font-work-body text-fg-muted italic mr-1.5 text-[10px] transition-transform duration-500 group-hover:-translate-x-0.5">
              04 /
            </span>
            <span className="font-work-heading text-xs font-medium tracking-[0.25em] group-hover:tracking-[0.35em] text-fg-contrast group-hover:text-accent transition-all duration-700 uppercase">
              RESUME
            </span>
            <span className="text-sm text-ledger-outline/30 group-hover:text-accent group-hover:translate-x-1.5 transition-all duration-500 font-mono font-light">
              ]
            </span>
          </div>
          <span className="text-[7px] font-mono text-fg-muted uppercase tracking-[0.2em] mt-0.5 transition-colors duration-500 group-hover:text-accent">
            ACCESS · IN_ENG ↗
          </span>
        </Link>
      );
    }

    return (
      <Link
        href="/resume.pdf"
        target="_blank"
        className="group inline-flex flex-col items-center p-6 cursor-pointer"
      >
        <span className="text-[8px] font-mono text-fg-muted uppercase tracking-[0.25em] mb-2 transition-colors duration-500 group-hover:text-accent">
          CLASS: DOCUMENTS // DOCKET_04
        </span>
        <div className="relative flex items-center py-3">
          <span className="text-xl text-ledger-outline/30 group-hover:text-accent group-hover:-translate-x-3 transition-all duration-500 font-mono font-light">
            [
          </span>
          <span className="font-work-body text-fg-muted italic mr-3 text-sm transition-transform duration-500 group-hover:-translate-x-1">
            04 /
          </span>
          <span className="font-work-heading text-xl font-medium tracking-[0.25em] group-hover:tracking-[0.45em] text-fg-contrast group-hover:text-accent transition-all duration-700 uppercase">
            RESUME
          </span>
          <span className="text-xl text-ledger-outline/30 group-hover:text-accent group-hover:translate-x-3 transition-all duration-500 font-mono font-light">
            ]
          </span>
        </div>
        <span className="text-[8px] font-mono text-fg-muted uppercase tracking-[0.2em] mt-2 transition-colors duration-500 group-hover:text-accent">
          ACCESS_SPECIFICATION · IN_ENG ↗
        </span>
      </Link>
    );
  };

  /* ========================================================================== */
  /*            2. MARGIN NOTE (Handwritten annotation)                         */
  /* ========================================================================== */
  const MarginNote = ({ isFloating = false }: { isFloating?: boolean }) => {
    if (isFloating) {
      return (
        <Link
          href="/resume.pdf"
          target="_blank"
          className="group inline-flex items-center gap-2.5 py-2.5 px-4 rounded bg-canvas-raised/90 backdrop-blur-md border-l-2 border-l-accent border-y border-r border-ledger-outline/15 hover:border-l-accent hover:border-y-accent/30 hover:border-r-accent/30 shadow-2xl transition-all duration-500 hover:-translate-y-0.5"
        >
          <span className="font-work-body italic text-[11px] text-fg-muted group-hover:text-fg-contrast transition-colors">
            see also:
          </span>
          <span className="font-work-heading text-[11px] font-medium tracking-[0.15em] text-fg-contrast group-hover:text-accent transition-colors uppercase">
            resume ↗
          </span>
        </Link>
      );
    }

    return (
      <Link
        href="/resume.pdf"
        target="_blank"
        className="group inline-flex flex-col items-start p-6 border-l-2 border-l-ledger-outline/20 hover:border-l-accent transition-colors duration-500 cursor-pointer max-w-md"
      >
        <span className="text-[8px] font-mono text-fg-muted uppercase tracking-[0.25em] mb-3 group-hover:text-accent transition-colors duration-500">
          MARGINALIA · FOLIO_04
        </span>
        <div className="font-work-body italic text-xl md:text-2xl leading-relaxed text-fg group-hover:text-fg-contrast transition-colors duration-500">
          <span className="font-work-heading not-italic text-fg-muted mr-2 text-base align-middle">
            ※
          </span>
          a fuller{" "}
          <span className="relative inline-block font-work-heading not-italic font-medium text-fg-contrast group-hover:text-accent transition-colors duration-500">
            account
            <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-accent/40 group-hover:bg-accent transition-colors" />
          </span>{" "}
          of work, tools, and time
          <span className="text-accent ml-2 inline-block group-hover:translate-x-1 transition-transform duration-500">
            ↗
          </span>
        </div>
        <span className="text-[8px] font-mono text-fg-muted uppercase tracking-[0.2em] mt-4 group-hover:text-accent transition-colors duration-500">
          OPEN RESUME · PDF
        </span>
      </Link>
    );
  };

  /* ========================================================================== */
  /*            3. STAMP IMPRINT (Approval mark)                                */
  /* ========================================================================== */
  const StampImprint = ({ isFloating = false }: { isFloating?: boolean }) => {
    if (isFloating) {
      return (
        <Link
          href="/resume.pdf"
          target="_blank"
          className="group inline-flex items-center gap-2.5 py-2 px-3.5 rounded-full bg-canvas-raised/90 backdrop-blur-md border-2 border-double border-ledger-outline/30 hover:border-accent shadow-2xl transition-all duration-500 hover:-translate-y-0.5"
        >
          <span className="relative flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-ledger-outline/40 group-hover:border-accent/60 group-hover:rotate-[-6deg] transition-all duration-500">
            <span className="font-work-heading text-[9px] font-bold text-fg-contrast group-hover:text-accent transition-colors">
              R
            </span>
          </span>
          <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-fg-contrast group-hover:text-accent transition-colors uppercase">
            Resume ↗
          </span>
        </Link>
      );
    }

    return (
      <Link
        href="/resume.pdf"
        target="_blank"
        className="group inline-flex flex-col items-center p-6 cursor-pointer"
      >
        <span className="text-[8px] font-mono text-fg-muted uppercase tracking-[0.25em] mb-4 group-hover:text-accent transition-colors duration-500">
          OFFICE OF RECORD · CERTIFIED
        </span>
        <div className="relative w-36 h-36 flex items-center justify-center group-hover:rotate-[-4deg] transition-transform duration-700">
          <span className="absolute inset-0 rounded-full border-2 border-double border-ledger-outline/35 group-hover:border-accent/70 transition-colors duration-500" />
          <span className="absolute inset-2.5 rounded-full border border-dashed border-ledger-outline/20 group-hover:border-accent/40 transition-colors duration-500" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="font-work-heading text-[8px] font-bold tracking-[0.4em] text-fg-muted group-hover:text-accent transition-colors uppercase rotate-[-90deg] origin-center translate-x-[-58px]">
              ANKUSH
            </span>
            <span className="font-work-heading text-[8px] font-bold tracking-[0.4em] text-fg-muted group-hover:text-accent transition-colors uppercase rotate-[90deg] origin-center translate-x-[58px]">
              JAMDAGANI
            </span>
          </span>
          <div className="flex flex-col items-center">
            <span className="text-[7px] font-mono text-fg-muted group-hover:text-accent transition-colors tracking-[0.2em] mb-0.5">
              ★ ★ ★
            </span>
            <span className="font-work-heading text-base font-bold tracking-[0.3em] text-fg-contrast group-hover:text-accent transition-colors uppercase">
              Resume
            </span>
            <span className="text-[7px] font-mono text-fg-muted group-hover:text-accent transition-colors tracking-[0.25em] mt-0.5">
              · 2026 ·
            </span>
          </div>
        </div>
        <span className="text-[8px] font-mono text-fg-muted uppercase tracking-[0.2em] mt-4 group-hover:text-accent transition-colors duration-500">
          DOWNLOAD PDF ↗
        </span>
      </Link>
    );
  };

  /* ========================================================================== */
  /*            4. INDEX CARD (Library catalog)                                 */
  /* ========================================================================== */
  const IndexCard = ({ isFloating = false }: { isFloating?: boolean }) => {
    if (isFloating) {
      return (
        <Link
          href="/resume.pdf"
          target="_blank"
          className="group inline-flex items-center gap-3 py-2.5 px-4 bg-canvas-raised/90 backdrop-blur-md border border-ledger-outline/25 hover:border-accent/50 shadow-2xl transition-all duration-500 hover:-translate-y-0.5"
          style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
        >
          <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-accent uppercase">
            R · 04
          </span>
          <span className="w-px h-3.5 bg-ledger-outline/30" />
          <span className="font-work-heading text-[11px] font-medium tracking-[0.15em] text-fg-contrast group-hover:text-accent transition-colors uppercase">
            Resume ↗
          </span>
        </Link>
      );
    }

    return (
      <Link
        href="/resume.pdf"
        target="_blank"
        className="group relative flex flex-col w-full max-w-md p-6 bg-canvas-raised/40 hover:bg-canvas-raised/60 border border-ledger-outline/20 hover:border-accent/40 transition-all duration-500 cursor-pointer"
        style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)" }}
      >
        <div className="absolute top-0 right-0 w-[18px] h-[18px] border-b border-l border-ledger-outline/20 group-hover:border-accent/40 transition-colors" />
        <div className="flex items-center justify-between border-b border-dashed border-ledger-outline/20 pb-2 mb-4">
          <span className="font-mono text-[8px] font-bold tracking-[0.3em] text-fg-muted uppercase">
            CARD · NO 04
          </span>
          <span className="font-mono text-[8px] tracking-[0.25em] text-accent font-bold uppercase">
            R · jamdagani
          </span>
        </div>
        <div className="space-y-2 mb-5">
          <div className="h-px bg-ledger-outline/15" />
          <div className="h-px bg-ledger-outline/15" />
          <div className="h-px bg-ledger-outline/15" />
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-work-body italic text-fg-muted text-sm">
            04 /
          </span>
          <span className="font-work-heading text-2xl md:text-3xl font-medium tracking-[0.05em] text-fg-contrast group-hover:text-accent transition-colors uppercase">
            Resume
          </span>
        </div>
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-dashed border-ledger-outline/20">
          <span className="font-mono text-[8px] text-fg-muted tracking-[0.25em] uppercase">
            CALL: UNW.RES.2026
          </span>
          <span className="font-mono text-[8px] text-accent font-bold tracking-[0.25em] uppercase group-hover:translate-x-1 transition-transform duration-500">
            ACCESS ↗
          </span>
        </div>
      </Link>
    );
  };

  /* ========================================================================== */
  /*            5. TICKET STUB (Perforated paper)                               */
  /* ========================================================================== */
  const TicketStub = ({ isFloating = false }: { isFloating?: boolean }) => {
    if (isFloating) {
      return (
        <Link
          href="/resume.pdf"
          target="_blank"
          className="group relative inline-flex items-stretch bg-canvas-raised/90 backdrop-blur-md border border-ledger-outline/25 hover:border-accent/50 shadow-2xl transition-all duration-500 hover:-translate-y-0.5 rounded"
        >
          <span className="flex items-center pl-3 pr-2.5 py-2 font-mono text-[9px] font-bold tracking-[0.25em] text-fg-muted group-hover:text-accent transition-colors uppercase">
            04
          </span>
          <span
            className="w-px self-stretch my-1 bg-ledger-outline/30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, currentColor 0 2px, transparent 2px 5px)",
              color: "rgb(var(--ledger-outline) / 0.4)",
              backgroundColor: "transparent",
            }}
          />
          <span className="flex items-center px-3 py-2 font-work-heading text-[11px] font-medium tracking-[0.18em] text-fg-contrast group-hover:text-accent transition-colors uppercase">
            Admit · Resume ↗
          </span>
        </Link>
      );
    }

    return (
      <Link
        href="/resume.pdf"
        target="_blank"
        className="group relative flex w-full max-w-xl bg-canvas-raised/40 hover:bg-canvas-raised/60 border border-ledger-outline/25 hover:border-accent/40 rounded transition-all duration-500 cursor-pointer overflow-hidden"
      >
        <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-canvas border border-ledger-outline/25 group-hover:border-accent/40 transition-colors" />
        <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-canvas border border-ledger-outline/25 group-hover:border-accent/40 transition-colors" />

        <div className="flex flex-col items-center justify-center w-24 py-6 px-3 border-r border-dashed border-ledger-outline/25 group-hover:border-accent/40 transition-colors">
          <span className="font-mono text-[8px] font-bold tracking-[0.3em] text-fg-muted uppercase mb-1">
            ADMIT
          </span>
          <span className="font-work-heading text-3xl font-medium text-fg-contrast group-hover:text-accent transition-colors">
            04
          </span>
          <span className="font-mono text-[8px] tracking-[0.25em] text-fg-muted uppercase mt-1">
            ONE
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-between py-5 px-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] font-bold tracking-[0.3em] text-fg-muted uppercase">
              UNWITTY · GENERAL ADMISSION
            </span>
            <span className="font-mono text-[8px] tracking-[0.25em] text-accent font-bold uppercase">
              NO. 942
            </span>
          </div>
          <div className="flex items-baseline gap-3 my-2">
            <span className="font-work-body italic text-sm text-fg-muted">
              entry to
            </span>
            <span className="font-work-heading text-2xl md:text-3xl font-medium tracking-[0.05em] text-fg-contrast group-hover:text-accent transition-colors uppercase">
              Resume
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] tracking-[0.25em] text-fg-muted uppercase">
              VALID · 2026
            </span>
            <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-accent uppercase group-hover:translate-x-1 transition-transform duration-500">
              TEAR HERE ↗
            </span>
          </div>
        </div>
      </Link>
    );
  };

  const renderButton = (variant: ResumeVariant, isFloating: boolean) => {
    switch (variant) {
      case "ledger-bracket":
        return <LedgerBracket isFloating={isFloating} />;
      case "margin-note":
        return <MarginNote isFloating={isFloating} />;
      case "stamp-imprint":
        return <StampImprint isFloating={isFloating} />;
      case "index-card":
        return <IndexCard isFloating={isFloating} />;
      case "ticket-stub":
        return <TicketStub isFloating={isFloating} />;
    }
  };



  return (
    <div className="w-full flex flex-col items-center">
      {/* Separator */}
      <div className="flex items-center gap-4 w-full mb-16 relative z-base justify-center select-none">
        <div className="flex-grow h-px bg-ledger-outline opacity-20 [filter:url(#ledger-rough)]"></div>
        <span className="text-[10px] font-mono text-fg-muted uppercase tracking-[0.3em]">
          *** SEC_04_EOF // RESUME ***
        </span>
        <div className="flex-grow h-px bg-ledger-outline opacity-20 [filter:url(#ledger-rough)]"></div>
      </div>



      {/* Inline dock sentinel */}
      <div
        ref={sentinelRef}
        className="w-full flex items-center justify-center min-h-[160px] relative py-8 z-base"
      >
        <div
          className="absolute inset-0 opacity-[0.005] pointer-events-none select-none"
          style={{
            backgroundImage:
              "radial-gradient(rgb(var(--fg-contrast)) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div
          className={`transition-all duration-700 transform ${
            isDocked
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
        >
          {renderButton(activeVariant, false)}
        </div>
      </div>

      {/* Floating FAB */}
      <div
        className={`fixed bottom-8 right-8 z-overlay transition-all duration-500 transform ${
          isScrolledPastHero && !isDocked
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-8 pointer-events-none"
        }`}
      >
        {renderButton(activeVariant, true)}
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RoughUnderline } from "./RoughUnderline";

const CHOSEN_TEXT = (
  <>
    I spend my days writing code, and even more time{" "}
    <RoughUnderline className="italic font-ledger-serif">
      deleting it.
    </RoughUnderline>{" "}
    Building robust software by aggressively{" "}
    <RoughUnderline className="italic font-ledger-serif">
      eliminating the unnecessary.
    </RoughUnderline>
  </>
);

const LAYOUTS = ["overlap", "bleed", "half", "standing", "lying"] as const;
type LayoutStyle = (typeof LAYOUTS)[number];

const UniversalMetadata = ({ className = "" }: { className?: string }) => (
  <div
    className={`flex items-center gap-8 text-[9px] font-medium text-fg-muted uppercase tracking-[0.3em] ${className}`}
  >
    <div className="flex items-center gap-2">
      <span className="opacity-40">LOC:</span>
      <span className="text-fg-contrast">India</span>
    </div>
    <div className="w-px h-3 bg-ledger-outline/20" />
    <div className="flex items-center gap-2">
      <span className="opacity-40">Status:</span>
      <span className="flex items-center gap-2 text-accent font-bold">
        <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
        Available_for_work
      </span>
    </div>
  </div>
);

// Unified container for viewport constraint
const HeroContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`relative h-[calc(100vh-140px)] min-h-[500px] flex items-center justify-center overflow-hidden px-4 md:px-0 ${className}`}
  >
    {children}
  </section>
);

export const LedgerHero = () => {
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>("bleed");

  const renderLayout = () => {
    switch (layoutStyle) {
      case "overlap":
        return <OverlapHero text={CHOSEN_TEXT} />;
      case "bleed":
        return <BleedOverlapHero text={CHOSEN_TEXT} />;
      case "half":
        return <HalfFaceHero text={CHOSEN_TEXT} />;
      case "standing":
        return <StandingHero text={CHOSEN_TEXT} />;
      case "lying":
        return <LyingHero text={CHOSEN_TEXT} />;
      default:
        return <BleedOverlapHero text={CHOSEN_TEXT} />;
    }
  };

  return (
    <div className="relative group/hero">
      {renderLayout()}

      {/* Experiment Switcher */}
      <div className="absolute -bottom-8 right-0 flex items-center gap-4 bg-canvas/80 backdrop-blur-sm border border-ledger-outline/20 p-2 rounded-lg opacity-0 group-hover/hero:opacity-100 transition-opacity z-overlay">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-tighter text-fg-muted font-bold px-1">
            Layout Experiments
          </span>
          <div className="flex flex-wrap gap-1 max-w-[400px]">
            {LAYOUTS.map((l) => (
              <button
                key={l}
                onClick={() => setLayoutStyle(l)}
                className={`px-3 h-6 rounded flex items-center justify-center text-[10px] border transition-colors uppercase tracking-widest ${
                  layoutStyle === l
                    ? "bg-fg-contrast text-canvas border-fg-contrast"
                    : "border-ledger-outline/30 hover:bg-ledger-outline/10"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Overlap Variants                             */
/* -------------------------------------------------------------------------- */

const OverlapHero = ({ text }: { text: React.ReactNode }) => (
  <HeroContainer>
    <div className="flex flex-col md:flex-row items-center gap-20 w-full max-w-6xl">
      <div className="w-full md:w-1/2 relative group/img">
        <div className="relative w-full aspect-[4/5] md:w-[120%] md:-ml-[10%] grayscale contrast-125 opacity-70 group-hover/img:opacity-100 transition-all duration-700">
          <Image
            src="/images/profile.png"
            alt="Cutout"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
      <div className="flex-1 relative z-base md:-ml-24">
        <h1
          className="text-3xl md:text-6xl text-fg-contrast leading-[1.1] font-work-heading tracking-tight mb-16"
          style={{
            filter:
              "drop-shadow(var(--shadow-x, 0px) var(--shadow-y, 0px) 0px rgb(var(--ledger-outline) / 0.3))",
          }}
        >
          {text}
        </h1>
        <UniversalMetadata />
      </div>
    </div>
  </HeroContainer>
);

const BleedOverlapHero = ({ text }: { text: React.ReactNode }) => (
  <HeroContainer className="w-screen max-w-[100vw] relative left-1/2 -translate-x-1/2 !px-0 -mb-6">
    {/* Background image expanding to the complete left of the viewport and taking full height */}
    <div className="absolute left-0 top-0 bottom-0 w-[50vw] md:w-[45vw] grayscale opacity-20 contrast-150 mix-blend-multiply">
      <Image
        src="/images/profile.png"
        alt="Bleed"
        fill
        className="object-cover object-top"
        priority
      />
    </div>

    <div className="flex w-full h-full max-w-6xl items-center relative px-4 md:px-0">
      <div className="ml-[35%] flex-1 relative z-base bg-canvas/80 backdrop-blur-md p-12 border-l border-ledger-outline/10">
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-ledger-outline/40 to-transparent" />

        <div className="mb-8 text-[8px] font-bold tracking-[1em] text-fg-muted uppercase opacity-40">
          OVERLAP_MODE: BLEED
        </div>
        <h1 className="text-3xl md:text-5xl text-fg-contrast leading-[1.2] font-work-heading mb-16 tracking-tight">
          {text}
        </h1>
        <UniversalMetadata />
      </div>
    </div>
  </HeroContainer>
);

const HalfFaceHero = ({ text }: { text: React.ReactNode }) => (
  <HeroContainer>
    <div className="flex w-full h-full max-w-7xl items-stretch">
      <div className="w-1/2 relative group/face">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[120%] h-[80%] grayscale opacity-80 group-hover/face:opacity-100 transition-opacity duration-700">
          <Image
            src="/images/profile.png"
            alt="Half Face"
            fill
            className="object-cover object-[70%_center]"
          />
          <div className="absolute right-0 top-0 w-px h-full bg-accent opacity-40 shadow-[0_0_15px_rgba(var(--accent),0.5)]" />
        </div>
      </div>
      <div className="w-1/2 flex flex-col justify-center pl-16">
        <h1
          className="text-3xl md:text-6xl text-fg-contrast leading-[1] font-work-heading tracking-tighter mb-16"
          style={{
            filter:
              "drop-shadow(var(--shadow-x, 0px) var(--shadow-y, 0px) 0px rgb(var(--ledger-outline) / 0.3))",
          }}
        >
          {text}
        </h1>
        <UniversalMetadata />
      </div>
    </div>
  </HeroContainer>
);

const StandingHero = ({ text }: { text: React.ReactNode }) => (
  <HeroContainer>
    <div className="flex flex-col md:flex-row items-end w-full max-w-6xl h-full py-12">
      <div className="w-full md:w-1/3 relative h-full grayscale opacity-60 pointer-events-none shrink-0">
        <Image
          src="/images/profile.png"
          alt="Standing"
          fill
          className="object-contain object-bottom"
        />
        <div className="absolute top-1/4 right-0 w-px h-1/2 bg-ledger-outline/10 hidden md:block" />
      </div>
      <div className="flex-1 pb-16 pl-0 md:pl-24">
        <h1
          className="text-2xl md:text-5xl text-fg-contrast leading-[1.2] font-work-heading mb-16"
          style={{
            filter:
              "drop-shadow(var(--shadow-x, 0px) var(--shadow-y, 0px) 0px rgb(var(--ledger-outline) / 0.3))",
          }}
        >
          {text}
        </h1>
        <UniversalMetadata />
      </div>
    </div>
  </HeroContainer>
);

const LyingHero = ({ text }: { text: React.ReactNode }) => (
  <HeroContainer>
    <div className="w-full h-full flex flex-col items-center justify-between py-20">
      <div className="max-w-4xl text-center relative z-base">
        <h1
          className="text-3xl md:text-7xl text-fg-contrast leading-[1] font-work-heading tracking-tight mb-12"
          style={{
            filter:
              "drop-shadow(var(--shadow-x, 0px) var(--shadow-y, 0px) 0px rgb(var(--ledger-outline) / 0.4))",
          }}
        >
          {text}
        </h1>
        <UniversalMetadata className="justify-center" />
      </div>
      <div className="relative w-full h-[40%] grayscale opacity-40 hover:opacity-80 transition-opacity duration-700">
        <Image
          src="/images/profile.png"
          alt="Lying"
          fill
          className="object-contain object-bottom"
        />
        <div className="absolute bottom-0 left-0 w-full h-px bg-ledger-outline/10" />
      </div>
    </div>
  </HeroContainer>
);

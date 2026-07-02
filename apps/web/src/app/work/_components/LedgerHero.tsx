"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { RoughUnderline } from "./RoughUnderline";

/* Shared Components & Data */

const BLUEPRINT_TEXT = (
  <>
    I spend my days <br />
    <span className="opacity-30">writing code,</span> <br />
    & even more time <br />
    <span className="italic font-editorial text-accent">
      <RoughUnderline>deleting it.</RoughUnderline>
    </span>
  </>
);

const RoughDivider = () => (
  <span
    aria-hidden
    className="pointer-events-none hidden md:block absolute top-0 bottom-0 left-0 w-px bg-ledger-outline/30 [filter:url(#ledger-rough)]"
  />
);

const STATUSES = ["open to work", "open to collaborate", "open to innovate"];

const MinimalistCoverHero = () => {
  const [istTime, setIstTime] = useState("");
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setIstTime(new Date().toLocaleTimeString("en-GB", options));
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % STATUSES.length);
    }, 2000);
    return () => clearInterval(statusInterval);
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-strike-through {
          position: relative;
          display: inline-block;
        }
        .custom-strike-through::after {
          content: "";
          position: absolute;
          left: -0.05em;
          right: -0.05em;
          top: 50%;
          height: 1px;
          background: currentColor;
          transform: translateY(-50%);
        }
      `,
        }}
      />
      <div className="w-full flex flex-col gap-16 lg:gap-24 animate-in fade-in duration-700">
        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-x-6 w-full items-center">
          {/* Left Column - The Manifesto Text & Context Meta */}
          <div className="md:col-span-7 flex flex-col justify-center gap-12 md:gap-16">
            <div>
              <h1 className="text-4xl md:text-7xl text-fg-contrast font-display leading-[1.1] tracking-tight">
                {BLUEPRINT_TEXT}
              </h1>
            </div>

            {/* Horizontal Status & Location Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-technical text-[10px] tracking-wider text-fg-muted uppercase select-none">
              <div className="flex items-center gap-2">
                <span className="opacity-50">STATUS:</span>
                <span className="flex items-center gap-2 text-accent font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {(STATUSES[statusIdx] || "").toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="opacity-50">LOCATION:</span>
                <span className="text-fg-contrast font-bold">
                  Based in India → {istTime || "00:00:00"} IST
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Image & Context Metadata */}
          <div className="md:col-span-3 md:pl-6 relative flex flex-col gap-8">
            <RoughDivider />
            {/* Technical Blueprint Image */}
            <div className="space-y-4 w-full">
              <div className="aspect-[4/5] relative w-full overflow-hidden grayscale brightness-95 contrast-105 border border-ledger-outline/20 bg-canvas/50">
                <Image
                  alt="Technical Blueprint"
                  src="/images/blueprint.jpg"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-technical text-[9px] text-fg-muted/60 italic uppercase tracking-tighter">
                FIG 01. SYSTEM ARCHITECTURE / DELETION AS CONSTRUCTION
              </p>
            </div>

            {/* Connect & Contact Social Links */}
            <div className="space-y-3 w-full border-t border-ledger-outline/10 pt-6">
              <span className="text-[9px] font-technical text-fg-muted/60 uppercase tracking-widest block mb-2">
                CONNECT // CONTACT
              </span>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  {
                    label: "GitHub",
                    url: "https://github.com/ankushjamdagani",
                  },
                  {
                    label: "LinkedIn",
                    url: "https://www.linkedin.com/in/ankushjamdagani/",
                  },
                  { label: "Twitter", url: "https://x.com/unwitty_dev" },
                  { label: "Email", url: "mailto:hello@unwitty.dev" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group hover:text-accent transition-colors duration-200 py-1 border-b border-dashed border-ledger-outline/10"
                  >
                    <span className="font-technical text-[10px] text-fg-muted group-hover:text-accent">
                      {link.label}
                    </span>
                    <span className="text-[8px] font-technical opacity-40 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const LedgerHero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center py-24 md:py-32 w-full">
      {/* Render the 12th Variant (Minimalist Cover) directly */}
      <div className="w-full">
        <MinimalistCoverHero />
      </div>
    </section>
  );
};

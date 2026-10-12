"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useChapterTransition } from "./ChapterTransition";
import { useControls } from "leva";

export function ChapterRail() {
  const pathname = usePathname();
  const { triggerTransition } = useChapterTransition();
  const [hovered, setHovered] = useState(false);
  const [seed, setSeed] = useState(0);

  const isWork = pathname.startsWith("/work");
  const nextType = isWork ? "life" : "work";
  const targetHref = isWork ? "/life" : "/work";
  const labelText = isWork ? "PERSONAL_LIFE" : "PROFESSIONAL_WORK";

  // Query switcher styles from Leva control panel (visible in local development)
  const { ChapterRail: railStyle } = useControls({
    ChapterRail: {
      value: "floating-badge",
      options: ["floating-badge", "corner-peel", "page-tear"],
      label: "Corner Switcher Style",
    },
  });

  // Morph the seed dynamically to animate the wave displacement filter inside the badge/peel dials
  useEffect(() => {
    if (!hovered || isWork) return;

    let rafId: number;
    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime > 80) {
        setSeed((s) => (s + 1) % 100);
        lastTime = time;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [hovered, isWork]);

  const handleClick = (e: React.MouseEvent) => {
    triggerTransition(targetHref, nextType, e);
  };

  return (
    <>
      {/* Dynamic organic wave filter for badge/peel dial */}
      <svg className="hidden">
        <defs>
          <filter id="badge-wave-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves={1} seed={seed} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blueprint-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-blueprint-rotate {
          animation: blueprint-rotate 24s linear infinite;
        }
        .peel-transition {
          transition: d 400ms cubic-bezier(0.16, 1, 0.3, 1), fill 300ms, stroke 300ms;
        }
      `}} />

      {/* STYLE 1: Floating Top-Left Corner Space Switcher Badge (Default) */}
      {railStyle === "floating-badge" && (
        <div
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="fixed top-6 left-6 md:top-8 md:left-8 z-nav flex items-center gap-3 border border-dashed border-fg-contrast/15 bg-canvas/30 backdrop-blur-[6px] p-2 pr-4 rounded-[20px] transition-all duration-300 hover:border-accent hover:bg-canvas-raised/85 hover:scale-[1.02] shadow-sm select-none cursor-pointer group animate-fade-in"
          aria-label={`Switch to ${labelText}`}
        >
          {/* Left Side: Technical Dial Indicator */}
          <div className="w-8 h-8 rounded-full border border-dashed border-accent/40 flex items-center justify-center relative overflow-hidden bg-canvas/20 flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" className="overflow-visible pointer-events-none">
              {nextType === "work" ? (
                // Mini Concentric Dotted blueprint circle
                <g className="origin-center animate-blueprint-rotate">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="rgb(var(--accent) / 0.4)" strokeWidth="0.8" strokeDasharray="2 2" />
                  <circle cx="12" cy="12" r="7" fill="none" stroke="rgb(var(--fg-contrast) / 0.2)" strokeWidth="0.6" />
                  <line x1="12" y1="0" x2="12" y2="24" stroke="rgb(var(--accent) / 0.15)" strokeWidth="0.4" />
                  <line x1="0" y1="12" x2="24" y2="12" stroke="rgb(var(--accent) / 0.15)" strokeWidth="0.4" />
                </g>
              ) : (
                // Mini Organic morphed wave blob
                <g>
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    fill="none"
                    stroke="rgb(var(--accent) / 0.5)"
                    strokeWidth="1.2"
                    filter="url(#badge-wave-filter)"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="8"
                    fill="none"
                    stroke="rgb(var(--fg-contrast) / 0.15)"
                    strokeWidth="0.8"
                    filter="url(#badge-wave-filter)"
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Right Side: Monospace Metadata Labels */}
          <div className="flex flex-col justify-center font-technical">
            <span className="text-[7px] text-fg-muted/60 tracking-[0.2em] uppercase leading-none mb-1">
              [ SWITCH_TO ]
            </span>
            <span className="text-[9px] font-semibold text-fg-muted group-hover:text-accent transition-colors duration-200 tracking-[0.12em] leading-none">
              {labelText}
            </span>
          </div>

          {/* Dynamic sliding pointer marker inside the badge */}
          <span className="text-[8px] text-accent/60 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300 font-bold ml-1">
            →
          </span>
        </div>
      )}

      {/* STYLE 2: Wabi-Sabi Architectural Corner Peel (Top-Left Fold) */}
      {railStyle === "corner-peel" && (
        <div
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="fixed top-0 left-0 w-40 h-40 z-nav cursor-pointer select-none group"
          aria-label={`Switch to ${labelText}`}
        >
          {/* Main SVG Container */}
          <svg width="160" height="160" viewBox="0 0 160 160" className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
            {/* 1. UNDERLAYER CANVAS: Revealed when page curls. Colors/styles are matched to nextType */}
            {nextType === "work" ? (
              // Work space underlayer: deep blueprint blue grid
              <g>
                {/* Backing Blueprint triangle */}
                <path d="M 0,0 L 160,0 L 0,160 Z" fill="#0b1a30" />
                {/* Grid guidelines */}
                <line x1="0" y1="40" x2="160" y2="40" stroke="#00d0ff" strokeWidth="0.4" opacity="0.15" />
                <line x1="0" y1="80" x2="160" y2="80" stroke="#00d0ff" strokeWidth="0.4" opacity="0.15" />
                <line x1="0" y1="120" x2="160" y2="120" stroke="#00d0ff" strokeWidth="0.4" opacity="0.15" />
                <line x1="40" y1="0" x2="40" y2="160" stroke="#00d0ff" strokeWidth="0.4" opacity="0.15" />
                <line x1="80" y1="0" x2="80" y2="160" stroke="#00d0ff" strokeWidth="0.4" opacity="0.15" />
                <line x1="120" y1="0" x2="120" y2="160" stroke="#00d0ff" strokeWidth="0.4" opacity="0.15" />
                
                {/* Technical circular reticle center target */}
                <circle cx="40" cy="40" r="20" fill="none" stroke="#00d0ff" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5" />
                <circle cx="40" cy="40" r="10" fill="none" stroke="#00d0ff" strokeWidth="0.5" opacity="0.3" />
              </g>
            ) : (
              // Life space underlayer: warm textured sand cardstock with wavy scribbles
              <g>
                {/* Backing handmade paper cardstock triangle */}
                <path d="M 0,0 L 160,0 L 0,160 Z" fill="#faf6f0" />
                {/* Organic wavy separators */}
                <path d="M 0,30 Q 40,24 80,32 T 160,28" fill="none" stroke="#5a5046" strokeWidth="0.6" opacity="0.12" />
                <path d="M 0,75 Q 35,80 75,70 T 160,76" fill="none" stroke="#5a5046" strokeWidth="0.6" opacity="0.12" />
                
                {/* Wobbly organic blob center target */}
                <circle
                  cx="40"
                  cy="40"
                  r="18"
                  fill="none"
                  stroke="#dc6e50"
                  strokeWidth="1.2"
                  filter="url(#badge-wave-filter)"
                  opacity="0.65"
                />
              </g>
            )}

            {/* 2. PAGE FOLD FLAP: Reflected triangle peeling down. 
                Normal diagonal fold: (0, 80) to (80, 0) with corner flap (80, 80)
                Hovered diagonal fold: (0, 120) to (120, 0) with corner flap (120, 120) */}
            <path
              d={hovered ? "M 0,120 L 120,0 L 120,120 Z" : "M 0,80 L 80,0 L 80,80 Z"}
              fill="rgb(var(--canvas-raised))"
              stroke="rgb(var(--accent) / 0.25)"
              strokeWidth="1"
              className="peel-transition"
              style={{ filter: "drop-shadow(2px 2px 3px rgb(0 0 0 / 0.12))" }}
            />
          </svg>

          {/* 3. FLOATING TEXT LABELS */}
          <div className="absolute top-3 left-3 font-technical text-left z-20 pointer-events-none select-none">
            <span className="block text-[6.5px] text-fg-subtle/40 tracking-[0.15em] uppercase mb-0.5 leading-none">
              [ PEEL_SHIFT ]
            </span>
            <span className="block text-[8.5px] font-semibold text-fg-muted group-hover:text-accent transition-colors duration-300 tracking-[0.15em] leading-none uppercase">
              {nextType}
            </span>
          </div>
        </div>
      )}

      {/* STYLE 3: Wabi-Sabi Deformed Page Tear (Top-Left Torn Flap) */}
      {railStyle === "page-tear" && (
        <div
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="fixed top-0 left-0 w-40 h-40 z-nav cursor-pointer select-none group"
          aria-label={`Switch to ${labelText}`}
        >
          {/* Main SVG Container */}
          <svg width="160" height="160" viewBox="0 0 160 160" className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
            {/* 1. UNDERLAYER CANVAS: Revealed when page tears. Colors/styles are matched to nextType */}
            {nextType === "work" ? (
              <path d="M 0,0 L 160,0 L 0,160 Z" fill="#0b1a30" />
            ) : (
              <path d="M 0,0 L 160,0 L 0,160 Z" fill="#faf6f0" />
            )}

            {/* 2. TEAR FLAP CANVAS COVER: Masking cover representing the rest of the page canvas.
                It has a jagged/torn diagonal edge that pulls back on hover. */}
            <path
              d={hovered
                ? "M 0,130 Q 30,116 52,98 T 88,88 T 98,52 T 130,0 L 160,0 L 160,160 L 0,160 Z"
                : "M 0,75 Q 15,70 28,62 T 50,50 T 62,28 T 75,0 L 160,0 L 160,160 L 0,160 Z"
              }
              fill="rgb(var(--canvas))"
              className="peel-transition"
            />

            {/* 3. TORN FIBERS STRIP: Jagged shadow highlight representing the torn white fibers of cardstock paper */}
            <path
              d={hovered
                ? "M 0,130 Q 30,116 52,98 T 88,88 T 98,52 T 130,0"
                : "M 0,75 Q 15,70 28,62 T 50,50 T 62,28 T 75,0"
              }
              fill="none"
              stroke="rgb(var(--accent) / 0.45)"
              strokeWidth="3"
              filter="url(#badge-wave-filter)"
              className="peel-transition"
            />

            {/* Frayed tear border edge line */}
            <path
              d={hovered
                ? "M 0,130 Q 30,116 52,98 T 88,88 T 98,52 T 130,0"
                : "M 0,75 Q 15,70 28,62 T 50,50 T 62,28 T 75,0"
              }
              fill="none"
              stroke="rgb(var(--canvas-raised))"
              strokeWidth="1.2"
              filter="url(#badge-wave-filter)"
              className="peel-transition"
            />
          </svg>

          {/* 4. SPACE-SPECIFIC STYLED TEXT: Exposed cleanly inside the torn corner */}
          {nextType === "work" ? (
            <div
              className="absolute top-8 left-8 font-technical text-[13px] font-bold text-[#00d0ff] tracking-[0.2em] pointer-events-none select-none z-10 leading-none transition-transform duration-300 group-hover:scale-105"
            >
              WORK
            </div>
          ) : (
            <div
              className="absolute top-7 left-7 font-expressive text-lg font-semibold text-[#dc6e50] italic pointer-events-none select-none z-10 leading-none transition-transform duration-300 group-hover:scale-105"
            >
              Life
            </div>
          )}
        </div>
      )}
    </>
  );
}

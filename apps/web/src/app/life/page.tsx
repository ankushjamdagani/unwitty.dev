"use client";

import React from "react";

// Hand-drawn wavy visual divider line
function OrganicSeparator() {
  return (
    <div className="w-full py-12 flex justify-center">
      <svg width="320" height="24" viewBox="0 0 320 24" fill="none" className="stroke-accent/30 stroke-2">
        <path d="M 0,12 Q 40,2 80,12 T 160,12 T 240,12 T 320,12" style={{ filter: "url(#organic-rough)" }} />
      </svg>
    </div>
  );
}

// Scrapbook details card with SVG displaced border + sharp text container
interface OrganicCardProps {
  title: string;
  subtitle?: string;
  number?: string;
  children: React.ReactNode;
  tiltClass?: string;
}

function OrganicCard({ title, subtitle, number, children, tiltClass = "hover:rotate-1" }: OrganicCardProps) {
  return (
    <div className="relative group p-1">
      {/* Dynamic displaced background card (hand-drawn paper effect) */}
      <div
        className={`absolute inset-0 bg-canvas border border-fg-contrast/10 rounded-[32px] shadow-sm transition-all duration-500 ease-out group-hover:scale-[1.015] group-hover:shadow-md ${tiltClass}`}
        style={{ filter: "url(#organic-rough)" }}
      />
      {/* Content container (remains sharp and readable) */}
      <div className="relative p-8 md:p-10 font-editorial">
        {number && (
          <span className="block font-technical text-[10px] text-accent tracking-[0.25em] mb-2 uppercase">
            {number}
          </span>
        )}
        <h3 className="text-3xl font-expressive italic text-fg-contrast mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[10px] font-technical text-fg-muted uppercase tracking-[0.18em] mb-6">
            {subtitle}
          </p>
        )}
        <div className="text-fg-muted font-display text-sm leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function LifeHome() {
  return (
    <main className="w-full max-w-content mx-auto px-4 mt-8 pb-24 relative select-none">
      {/* Define the SVG organic hand-drawn line filter */}
      <svg className="hidden">
        <defs>
          <filter id="organic-rough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.007"
              numOctaves={3}
              seed={5}
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Scrapbook Header Area */}
      <header className="py-20 text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-technical tracking-[0.35em] text-accent uppercase block mb-3">
          / 02 // PERSONAL_LIFE
        </span>
        <h1 className="text-6xl md:text-8xl font-expressive text-fg-contrast italic mb-4">
          Life Logs
        </h1>
        <p className="font-editorial text-lg text-fg-muted italic leading-relaxed max-w-md mx-auto">
          A visual archive of analog rituals, coffee extractions, offline exploration, and slow days.
        </p>
      </header>

      {/* Main Two-Column Scrapbook Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
        
        {/* Left Column: Scrapbook Introduction & Log Stream */}
        <div className="lg:col-span-5 space-y-8">
          
          <OrganicCard title="A Case for Slowness" subtitle="Philosophy / Manifesto" number="LOG_000">
            <p>
              In a world optimized for throughput, metrics, and hyper-efficiency, we run the risk of mistaking activity for progress.
            </p>
            <p className="italic">
              Slowness is not laziness; it is an active boundary. It is the decision to craft rather than scale, to write in ink rather than characters, and to brew by hand rather than button.
            </p>
            <p>
              This scrapbook acts as a visual bookmark of offline hours. Unconnected, static, and intentionally slow.
            </p>
          </OrganicCard>

          <div className="p-8 border border-fg-contrast/5 rounded-[32px] bg-canvas/30 relative">
            <h4 className="text-xs font-technical uppercase tracking-widest text-accent mb-4">
              ▲ CURRENTLY_READING
            </h4>
            <ul className="space-y-4 font-editorial">
              <li className="flex justify-between items-baseline gap-4">
                <span className="text-fg-contrast italic text-base">The Wabi-Sabi House</span>
                <span className="h-px bg-fg-contrast/5 flex-grow" />
                <span className="font-technical text-[10px] text-fg-muted">Robyn Griggs Lawrence</span>
              </li>
              <li className="flex justify-between items-baseline gap-4">
                <span className="text-fg-contrast italic text-base">Digital Minimalism</span>
                <span className="h-px bg-fg-contrast/5 flex-grow" />
                <span className="font-technical text-[10px] text-fg-muted">Cal Newport</span>
              </li>
              <li className="flex justify-between items-baseline gap-4">
                <span className="text-fg-contrast italic text-base">Designing Design</span>
                <span className="h-px bg-fg-contrast/5 flex-grow" />
                <span className="font-technical text-[10px] text-fg-muted">Kenya Hara</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Right Column: Slow Mornings & Hakuna Matata Details */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 01: Slow Mornings */}
          <OrganicCard
            title="Slow Mornings"
            subtitle="Rituals & Analog Setup"
            number="SEC_01 // COFFEE & INK"
            tiltClass="hover:-rotate-1"
          >
            <p>
              Before the screen is activated or the notifications sync, the day is anchored in physical tactile rituals:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-fg-contrast/5 rounded-2xl bg-canvas-raised/40">
                <span className="block text-[10px] font-technical text-accent mb-1">01 / BREW FORMULA</span>
                <p className="text-xs text-fg-muted">
                  V60 pour-over: 18g light-roast Ethiopian coffee, 300g water at 93°C, 3-minute slow draw.
                </p>
              </div>
              <div className="p-4 border border-fg-contrast/5 rounded-2xl bg-canvas-raised/40">
                <span className="block text-[10px] font-technical text-accent mb-1">02 / JOURNALING</span>
                <p className="text-xs text-fg-muted">
                  Three pages in a grid notebook with a pilot brass fountain pen. Pure, unfiltered stream of thought.
                </p>
              </div>
            </div>
            <p className="text-xs italic pt-2">
              By delaying digital intake for 90 minutes after waking, focus is reclaimed.
            </p>
          </OrganicCard>

          <OrganicSeparator />

          {/* Section 02: Hakuna Matata */}
          <OrganicCard
            title="Hakuna Matata"
            subtitle="Off-grid & Pursuits"
            number="SEC_02 // OFFLINE PURSUITS"
            tiltClass="hover:rotate-1"
          >
            <p>
              Offline hours are spent chasing natural trails and analog frequencies. Taking steps to disconnect entirely:
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 font-technical text-xs text-accent">
                  ▲
                </div>
                <div>
                  <h5 className="font-editorial italic text-fg-contrast text-base">Off-Grid Cabins</h5>
                  <p className="text-xs text-fg-muted">Seeking remote wooden setups with wood fires and zero cell service.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 font-technical text-xs text-accent">
                  ~
                </div>
                <div>
                  <h5 className="font-editorial italic text-fg-contrast text-base">Analog Synthesis</h5>
                  <p className="text-xs text-fg-muted">Patching ambient soundscapes on a modular synthesizer. Transient waves.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 font-technical text-xs text-accent">
                  ▼
                </div>
                <div>
                  <h5 className="font-editorial italic text-fg-contrast text-base">Coastal Hikes</h5>
                  <p className="text-xs text-fg-muted">Walking mountain trails adjacent to cold water surf lines. Coastal fog.</p>
                </div>
              </div>
            </div>
          </OrganicCard>

        </div>

      </div>
    </main>
  );
}

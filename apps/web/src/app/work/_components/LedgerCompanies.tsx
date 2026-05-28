"use client";

import React, { useState } from "react";

const companies = [
  {
    name: "Atlassian",
    role: "Senior Software Engineer",
    type: "fullstack",
    period: "2026 — Now",
  },
  {
    name: "Uber",
    role: "Software Engineer 2",
    type: "fullstack",
    period: "2024 — 2026",
  },
  {
    name: "Rippling",
    role: "Senior Software Engineer",
    type: "frontend",
    period: "2022 — 2023",
  },
  {
    name: "Lambdatest",
    role: "Senior Software Engineer",
    type: "frontend",
    period: "2021 — 2022",
  },
  {
    name: "Synaptic",
    role: "Senior Software Engineer",
    type: "frontend",
    period: "2019 — 2021",
  },
  {
    name: "Caroobi",
    role: "Software Engineer",
    type: "frontend",
    period: "2017 — 2019",
  },
  {
    name: "Adurcup",
    role: "Software Engineer",
    type: "frontend",
    period: "2016 — 2017",
  },
];

const LAYOUTS = ["timeline", "grid", "classic"] as const;
type LayoutStyle = (typeof LAYOUTS)[number];

/* -------------------------------------------------------------------------- */
/*                               Layout Variants                              */
/* -------------------------------------------------------------------------- */

// 1. Timeline Layout (Thread)
const TimelineCompanies = ({
  fullstackCompanies,
  frontendCompanies,
  renderCompany,
}: {
  fullstackCompanies: typeof companies;
  frontendCompanies: typeof companies;
  renderCompany: (c: typeof companies[0]) => React.ReactNode;
}) => (
  <div className="relative z-base space-y-8">
    {/* Continuous Timeline Thread */}
    <div className="absolute left-[120px] md:left-[200px] top-3 bottom-3 w-px bg-ledger-outline/20 [filter:url(#ledger-rough)]" />

    {/* Section 01: Fullstack */}
    <div className="relative pl-[155px] md:pl-[260px]">
      {/* Timeline Node */}
      <div className="absolute left-[120px] md:left-[200px] -translate-x-1/2 top-2.5 w-[9px] h-[9px] rounded-full border-2 border-accent bg-canvas z-10 transition-transform duration-300 hover:scale-125" />
      
      {/* Group Heading on the Left of the line */}
      <div className="absolute left-0 w-[100px] md:w-[170px] text-right top-0.5 select-none flex flex-col items-end">
        <span className="text-[9px] md:text-[10px] font-mono text-accent font-bold tracking-widest block mb-1">SEC_01</span>
        <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-fg-contrast leading-tight">Fullstack</h3>
        <span className="text-[8px] md:text-[9px] text-fg-muted tracking-wider hidden md:block uppercase mt-2 opacity-60">System core & architecture</span>
      </div>

      <div className="space-y-4">
        {fullstackCompanies.map(renderCompany)}
      </div>
    </div>

    {/* Wellness Gap Section */}
    <div className="relative pl-[155px] md:pl-[260px] flex justify-start items-center select-none overflow-visible">
      {/* Active Ping Node Container (ensures perfect centering of pulsing animation) */}
      <div className="absolute left-[120px] md:left-[200px] -translate-x-1/2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center overflow-visible z-10">
        <div className="absolute w-5 h-5 rounded-full bg-accent/30 animate-ping" />
        <div className="absolute w-3 h-3 rounded-full bg-accent border-2 border-canvas" />
      </div>

      {/* Central Stamp (Borderless, slightly rotated, transparent) */}
      <div className="relative z-10 cursor-default rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
        <div className="relative flex flex-col items-start">
          <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-accent mb-1">
            Life Chapter
          </span>
          <span className="text-xl font-work-heading uppercase text-fg-contrast/90 tracking-tighter">
            🍁 Wellness Year 🍀
          </span>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-px w-3 bg-ledger-outline/20" />
            <span className="text-[9px] font-mono opacity-50 uppercase tracking-widest">
              2023 — 2024
            </span>
            <div className="h-px w-3 bg-ledger-outline/20" />
          </div>
        </div>
      </div>
    </div>

    {/* Section 02: Frontend */}
    <div className="relative pl-[155px] md:pl-[260px]">
      {/* Timeline Node */}
      <div className="absolute left-[120px] md:left-[200px] -translate-x-1/2 top-2.5 w-[9px] h-[9px] rounded-full border-2 border-accent bg-canvas z-10 transition-transform duration-300 hover:scale-125" />
      
      {/* Group Heading on the Left of the line */}
      <div className="absolute left-0 w-[100px] md:w-[170px] text-right top-0.5 select-none flex flex-col items-end">
        <span className="text-[9px] md:text-[10px] font-mono text-accent font-bold tracking-widest block mb-1">SEC_02</span>
        <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-fg-contrast leading-tight">Frontend</h3>
        <span className="text-[8px] md:text-[9px] text-fg-muted tracking-wider hidden md:block uppercase mt-2 opacity-60">User interfaces & craft</span>
      </div>

      <div className="space-y-4">
        {frontendCompanies.map(renderCompany)}
      </div>
    </div>
  </div>
);

// 2. Grid Layout (Open, non-boxed architectural grid)
const GridCompanies = ({
  fullstackCompanies,
  frontendCompanies,
  renderCompany,
}: {
  fullstackCompanies: typeof companies;
  frontendCompanies: typeof companies;
  renderCompany: (c: typeof companies[0]) => React.ReactNode;
}) => (
  <div className="relative z-base space-y-12">
    {/* Fullstack Row */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Left Column (Header) */}
      <div className="md:col-span-1 py-3 flex flex-col justify-start border-b md:border-b-0 md:border-r border-ledger-outline/20 select-none">
        <span className="text-[10px] font-mono text-accent font-bold tracking-widest block mb-1">SEC_01</span>
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-fg-contrast leading-tight">Fullstack</h3>
        <span className="text-[9px] text-fg-muted tracking-wider hidden md:block uppercase mt-3 opacity-60">System core & architecture</span>
      </div>
      {/* Right Column (Company rows) */}
      <div className="md:col-span-3 space-y-4">
        {fullstackCompanies.map(renderCompany)}
      </div>
    </div>

    {/* Wellness Year Row - Clean Separator banner */}
    <div className="py-8 relative overflow-hidden border-y border-ledger-outline/10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-2xl opacity-60">🍁</span>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-extrabold text-fg-contrast">Wellness Year</h4>
            <p className="text-[9px] text-fg-muted uppercase tracking-widest mt-0.5">Life Chapter & Recalibration</p>
          </div>
        </div>
        <span className="text-xs font-mono text-accent border border-accent/20 bg-accent/[0.03] px-4 py-1.5 rounded-lg font-bold">
          2023 — 2024
        </span>
      </div>
    </div>

    {/* Frontend Row */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Left Column (Header) */}
      <div className="md:col-span-1 py-3 flex flex-col justify-start border-b md:border-b-0 md:border-r border-ledger-outline/20 select-none">
        <span className="text-[10px] font-mono text-accent font-bold tracking-widest block mb-1">SEC_02</span>
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-fg-contrast leading-tight">Frontend</h3>
        <span className="text-[9px] text-fg-muted tracking-wider hidden md:block uppercase mt-3 opacity-60">User interfaces & craft</span>
      </div>
      {/* Right Column (Company rows) */}
      <div className="md:col-span-3 space-y-4">
        {frontendCompanies.map(renderCompany)}
      </div>
    </div>
  </div>
);

// 3. Classic Layout (Original Rotated Side Bracket)
const ClassicCompanies = ({
  fullstackCompanies,
  frontendCompanies,
  renderCompany,
}: {
  fullstackCompanies: typeof companies;
  frontendCompanies: typeof companies;
  renderCompany: (c: typeof companies[0]) => React.ReactNode;
}) => (
  <div className="space-y-8 relative z-base">
    <div className="relative">
      <div className="absolute -right-8 top-0 bottom-0 w-4 border-r border-t border-b border-ledger-outline/30" />
      <div className="absolute -right-14 top-1/2 -translate-y-1/2 rotate-90">
        <span className="text-xxs uppercase tracking-[0.4em] opacity-40 font-bold whitespace-nowrap">
          Fullstack
        </span>
      </div>
      <div className="space-y-2">
        {fullstackCompanies.map(renderCompany)}
      </div>
    </div>

    {/* Wellness Gap Section */}
    <div className="relative flex justify-center items-center select-none overflow-visible py-12">
      {/* Central Stamp (Borderless, slightly rotated, transparent) */}
      <div className="relative z-10 cursor-default rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
        <div className="relative px-10 py-6 flex flex-col items-center bg-canvas/40 shadow-xl backdrop-blur-[2px]">
          <span className="text-[9px] uppercase tracking-[0.4em] font-black opacity-50 mb-1">
            Life Event
          </span>
          <span className="text-2xl font-work-heading uppercase text-fg-contrast/80 tracking-tighter">
            🍁 Wellness Year 🍀
          </span>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-px w-4 bg-ledger-outline/30" />
            <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
              2023 — 2024
            </span>
            <div className="h-px w-4 bg-ledger-outline/30" />
          </div>
        </div>
      </div>
    </div>

    <div className="relative">
      <div className="absolute -right-8 top-0 bottom-0 w-4 border-r border-t border-b border-ledger-outline/30" />
      <div className="absolute -right-14 top-1/2 -translate-y-1/2 rotate-90">
        <span className="text-xxs uppercase tracking-[0.4em] opacity-40 font-bold whitespace-nowrap">
          Frontend
        </span>
      </div>
      <div className="space-y-2">
        {frontendCompanies.map(renderCompany)}
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

export const LedgerCompanies = () => {
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>("timeline");

  const fullstackCompanies = companies.filter((c) => c.type === "fullstack");
  const frontendCompanies = companies.filter((c) => c.type === "frontend");

  const renderCompany = (company: (typeof companies)[0]) => (
    <div
      key={`${company.name}-${company.period}`}
      className="group flex flex-col md:flex-row md:items-center py-3 px-4 -mx-4 cursor-default justify-between rounded transition-all duration-300"
    >
      <h3 className="text-2xl font-work-heading text-fg-contrast transition-colors">
        {company.name}
      </h3>
      <div className="hidden md:inline-block flex-1 h-px mx-6 bg-ledger-outline/20 transition-colors" />
      <div className="flex items-center gap-4 mt-4 md:mt-0 text-[11px] tracking-widest justify-between">
        <p className="text-sm text-fg-muted">{company.role}</p>
        <span className="text-xl opacity-30 transition-all">⧼</span>
        <span className="w-24 font-bold text-fg-contrast transition-colors">
          {company.period}
        </span>
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (layoutStyle) {
      case "timeline":
        return (
          <TimelineCompanies
            fullstackCompanies={fullstackCompanies}
            frontendCompanies={frontendCompanies}
            renderCompany={renderCompany}
          />
        );
      case "grid":
        return (
          <GridCompanies
            fullstackCompanies={fullstackCompanies}
            frontendCompanies={frontendCompanies}
            renderCompany={renderCompany}
          />
        );
      case "classic":
        return (
          <ClassicCompanies
            fullstackCompanies={fullstackCompanies}
            frontendCompanies={frontendCompanies}
            renderCompany={renderCompany}
          />
        );
      default:
        return (
          <TimelineCompanies
            fullstackCompanies={fullstackCompanies}
            frontendCompanies={frontendCompanies}
            renderCompany={renderCompany}
          />
        );
    }
  };

  return (
    <section className="mb-24 scroll-mt-32 relative group/companies" id="companies">
      <div className="absolute -left-64 opacity-[0.03] pointer-events-none select-none">
        <span className="text-[14rem] font-serif leading-none italic">01</span>
      </div>

      <div className="flex items-center gap-4 mb-10 relative z-base">
        <span className="text-[11px] font-medium text-fg-muted opacity-40">
          /
        </span>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.4em] text-fg-contrast">
          Experience
        </h2>
      </div>

      {renderLayout()}

      {/* Experiment Switcher */}
      <div className="absolute -bottom-10 right-0 flex items-center gap-4 bg-canvas/80 backdrop-blur-sm border border-ledger-outline/20 p-2 rounded-lg opacity-0 group-hover/companies:opacity-100 transition-opacity z-overlay">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-tighter text-fg-muted font-bold px-1">
            Ledger Experiments
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
    </section>
  );
};

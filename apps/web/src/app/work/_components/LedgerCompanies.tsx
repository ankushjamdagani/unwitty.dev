import React from "react";

const companies = [
  {
    name: "Atlassian",
    role: "Senior Software Engineer",
    type: "fullstack",
    period: "2026 — Now",
    initial: "A",
  },
  {
    name: "Uber",
    role: "Software Engineer 2",
    type: "fullstack",
    period: "2024 — 2026",
    initial: "U",
  },
  {
    name: "Rippling",
    role: "Senior Software Engineer",
    type: "frontend",
    period: "2022 — 2023",
    initial: "R",
  },
  {
    name: "Lambdatest",
    role: "Senior Software Engineer",
    type: "frontend",
    period: "2021 — 2022",
    initial: "L",
  },
  {
    name: "Synaptic",
    role: "Senior Software Engineer",
    type: "frontend",
    period: "2019 — 2021",
    initial: "S",
  },
  {
    name: "Caroobi",
    role: "Software Engineer",
    type: "frontend",
    period: "2017 — 2019",
    initial: "C",
  },
  {
    name: "Adurcup",
    role: "Software Engineer",
    type: "frontend",
    period: "2016 — 2017",
    initial: "A",
  },
];

export const LedgerCompanies = () => {
  const fullstackCompanies = companies.filter((c) => c.type === "fullstack");
  const frontendCompanies = companies.filter((c) => c.type === "frontend");

  const renderCompany = (company: (typeof companies)[0]) => (
    <div
      key={`${company.name}-${company.period}`}
      className={`group flex flex-col md:flex-row md:items-center py-2 px-4 -mx-4 cursor-default justify-between`}
    >
      <h3 className="text-2xl font-work-heading">{company.name}</h3>
      <div className="hidden md:inline-block flex-1 h-px mx-6 bg-ledger-outline/20 [filter:url(#ledger-rough)]"></div>
      <div className="flex items-center gap-4 mt-4 md:mt-0 text-[11px] tracking-widest justify-between">
        <p className="text-sm text-fg-muted">{company.role}</p>
        <span className="text-xl">⧼</span>
        <span className="w-24 font-bold text-fg-contrast">
          {company.period}
        </span>
      </div>
    </div>
  );

  return (
    <section className="mb-24 scroll-mt-32 relative" id="companies">
      <div className="absolute -left-64 opacity-[0.03] pointer-events-none select-none">
        <span className="text-[14rem] font-serif leading-none italic">01</span>
      </div>

      <div className="flex items-center gap-4 mb-6 relative z-base">
        <span className="text-[11px] font-medium text-fg-muted opacity-40">
          /
        </span>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.4em] text-fg-contrast">
          Companies
        </h2>
      </div>

      <div className="space-y-8 relative z-base">
        <div className="relative">
          <div className="absolute -right-8 top-0 bottom-0 w-4 border-r border-t border-b border-ledger-outline/30 [filter:url(#ledger-rough)]" />
          <div className="absolute -right-14 top-1/2 -translate-y-1/2 rotate-90">
            <span className="text-xxs uppercase tracking-[0.4em] opacity-40 font-bold whitespace-nowrap">
              Fullstack
            </span>
          </div>
          <div className="space-y-2">
            {fullstackCompanies.map(renderCompany)}
          </div>
        </div>

        {/* Wellness Gap Section: Subtle Neutral Flare */}
        <div className="relative flex justify-center items-center select-none overflow-visible">
          {/* Spreading Sunlight Flare - Neutral & Subdued */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
            {/* Core Glow (Centered) - Using neutral contrast color with very low opacity */}
            <div className="w-[600px] h-[400px] bg-[radial-gradient(circle_at_center,_rgb(var(--fg-contrast)/0.1)_0%,_transparent_70%)] blur-[100px]" />

            {/* Ambient Base - Softening the transition further out */}
            <div className="absolute inset-0 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_rgb(var(--fg-contrast)/0.02)_0%,_transparent_80%)] blur-[120px]" />
          </div>

          {/* Central Stamp */}
          <div className="relative z-10 rotate-[-6deg] hover:rotate-0 transition-transform duration-500 scale-110 md:scale-125 cursor-default group/stamp">
            <div className="absolute inset-0 bg-fg-muted/5 rounded-xl blur-2xl group-hover/stamp:bg-fg-muted/10 transition-colors" />
            <div className="relative px-10 py-6 rounded-xl flex flex-col items-center">
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
          <div className="absolute -right-8 top-0 bottom-0 w-4 border-r border-t border-b border-ledger-outline/30 [filter:url(#ledger-rough)]" />
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
    </section>
  );
};

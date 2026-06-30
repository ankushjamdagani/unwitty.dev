import React from "react";

const RoughDivider = () => (
  <span
    aria-hidden
    className="pointer-events-none hidden md:block absolute top-0 bottom-0 left-0 w-px bg-ledger-outline/30 [filter:url(#ledger-rough)]"
  />
);

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

const renderCompany = (company: (typeof companies)[0]) => (
  <div
    key={`${company.name}-${company.period}`}
    className="group flex flex-col md:flex-row md:items-center py-2 px-4 -mx-4 cursor-default justify-between rounded transition-all duration-300"
  >
    <h3 className="text-2xl font-display text-fg-contrast transition-colors">
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

export const LedgerCompanies = () => {
  const fullstackCompanies = companies.filter((c) => c.type === "fullstack");
  const frontendCompanies = companies.filter((c) => c.type === "frontend");

  return (
    <section
      className="mb-24 scroll-mt-32 relative group/companies"
      id="companies"
    >
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

      <div className="relative z-base grid grid-cols-1 md:grid-cols-10 gap-x-6">
        <div className="md:col-span-7 space-y-2 pb-12">
          {fullstackCompanies.map(renderCompany)}
        </div>
        <aside className="md:col-span-3 md:pl-6 pt-3 md:pt-0 pb-12 select-none relative flex flex-col items-start">
          <RoughDivider />
          <span className="text-[9px] md:text-[10px] font-technical text-accent font-bold tracking-widest block mb-1">
            SEC_01
          </span>
          <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-fg-contrast leading-tight">
            Fullstack
          </h3>
          <span className="text-[8px] md:text-[9px] text-fg-muted tracking-wider hidden md:block uppercase mt-2 opacity-60">
            System core & architecture
          </span>
        </aside>

        <div className="md:col-span-7 flex justify-end items-center pb-12 select-none overflow-visible">
          <div className="relative z-10 cursor-default rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
            <div className="relative flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-accent mb-1">
                Life Chapter
              </span>
              <span className="text-xl font-display uppercase text-fg-contrast/90 tracking-tighter">
                🍁 Wellness Year 🍀
              </span>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-px w-3 bg-ledger-outline/20" />
                <span className="text-[9px] font-technical opacity-50 uppercase tracking-widest">
                  2023 — 2024
                </span>
                <div className="h-px w-3 bg-ledger-outline/20" />
              </div>
            </div>
          </div>
        </div>
        <aside className="md:col-span-3 md:pl-6 pb-12 relative" aria-hidden>
          <RoughDivider />
        </aside>

        <div className="md:col-span-7 space-y-2">
          {frontendCompanies.map(renderCompany)}
        </div>
        <aside className="md:col-span-3 md:pl-6 pt-3 md:pt-0 select-none relative flex flex-col items-start">
          <RoughDivider />
          <span className="text-[9px] md:text-[10px] font-technical text-accent font-bold tracking-widest block mb-1">
            SEC_02
          </span>
          <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-fg-contrast leading-tight">
            Frontend
          </h3>
          <span className="text-[8px] md:text-[9px] text-fg-muted tracking-wider hidden md:block uppercase mt-2 opacity-60">
            User interfaces & craft
          </span>
        </aside>
      </div>
    </section>
  );
};

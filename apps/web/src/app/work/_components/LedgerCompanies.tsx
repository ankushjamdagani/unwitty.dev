import React from "react";

const companies = [
  {
    name: "Atlassian",
    role: "Senior Software Engineer - Fullstack",
    period: "2026 — Now",
    initial: "A",
  },
  {
    name: "Uber",
    role: "Software Engineer 2 - Fullstack",
    period: "2024 — 2026",
    initial: "U",
  },
  {
    name: "Rippling",
    role: "Senior Frontend Engineer",
    period: "2022 — 2023",
    initial: "R",
  },
  {
    name: "Lambdatest",
    role: "Senior Frontend Engineer",
    period: "2021 — 2022",
    initial: "L",
  },
  {
    name: "Synaptic",
    role: "Senior Frontend Engineer",
    period: "2019 — 2021",
    initial: "S",
  },
  {
    name: "Caroobi",
    role: "Software Engineer - Frontend",
    period: "2017 — 2019",
    initial: "C",
  },
  {
    name: "Adurcup",
    role: "Software Engineer - Frontend",
    period: "2016 — 2017",
    initial: "A",
  },
];

export const LedgerCompanies = () => {
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
        {/* <div className="flex-grow h-px bg-ledger-outline opacity-30 [filter:url(#ledger-rough)]"></div> */}
      </div>
      <div className="space-y-0 relative z-base">
        {companies.map((company, index) => (
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
        ))}
      </div>
    </section>
  );
};

"use client";

import React, { useEffect, useState } from "react";

const articles = [
  {
    id: "001",
    title: "This is the title for blog 1",
    date: "Apr 2026",
    duration: "9 min",
    excerpt:
      "On the small choices that compound — naming, defaults, and the shape of an interface before code is written.",
  },
  {
    id: "002",
    title: "This is the title for blog 2",
    date: "Feb 2026",
    duration: "6 min",
    excerpt:
      "A short note on deleting more than you ship — and why aggressive subtraction is the cheapest review you own.",
  },
  {
    id: "003",
    title: "This is the title for blog 3 and this can be long too",
    date: "Nov 2025",
    duration: "14 min",
    excerpt:
      "Long-form: how a routing rewrite turned into a study of latency, fanout, and the cost of one extra hop.",
  },
  {
    id: "004",
    title: "This is the title for blog 4 and this can be long too",
    date: "Aug 2025",
    duration: "5 min",
    excerpt:
      "Tiny lessons from a year of shipping interactive demos in the browser — Three, Rapier, and a 60fps budget.",
  },
  {
    id: "005",
    title: "This is the title for blog 5 and this can be long too",
    date: "May 2025",
    duration: "8 min",
    excerpt:
      "Notes on building a portfolio that doubles as a workbench — every page a project, every project a draft.",
  },
  {
    id: "006",
    title: "This is the title for blog 6",
    date: "Mar 2025",
    duration: "7 min",
    excerpt:
      "On craft, taste, and the difference between knowing what is correct and knowing what is good.",
  },
];

type Article = (typeof articles)[number];

const CYCLE_MS = 4000;

const usePreviewCycle = (items: Article[]) => {
  const [index, setIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isPaused = hoveredId !== null;

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, [isPaused, items.length]);

  const fallback = items[index] ?? items[0]!;
  const active = hoveredId
    ? (items.find((a) => a.id === hoveredId) ?? fallback)
    : fallback;

  return { active, index, isPaused, setHoveredId };
};

type CycleState = ReturnType<typeof usePreviewCycle>;
type PanelProps = { items: Article[]; state: CycleState };

const ASIDE_BASE = "md:col-span-3 md:order-2 pt-3 md:pt-0 select-none";

const ProgressBar = ({ state }: { state: CycleState }) => (
  <div className="h-px bg-ledger-outline/15 overflow-hidden">
    <div
      key={`${state.index}-${state.isPaused}-${state.active.id}`}
      className="h-full bg-accent"
      style={{
        animation: state.isPaused
          ? "none"
          : `lw-preview-progress ${CYCLE_MS}ms linear forwards`,
        width: state.isPaused ? "0%" : undefined,
      }}
    />
  </div>
);

const DotsIndicator = ({ items, state }: PanelProps) => {
  const activeIdx = items.findIndex((a) => a.id === state.active.id);
  return (
    <div className="flex items-center gap-1.5">
      {items.map((a, i) => (
        <span
          key={a.id}
          className={`h-1 rounded-full transition-all duration-300 ${
            i === activeIdx ? "bg-accent w-4" : "bg-ledger-outline/30 w-1"
          }`}
        />
      ))}
    </div>
  );
};

const StatusPill = ({ state }: { state: CycleState }) => (
  <span className="text-[9px] font-technical uppercase tracking-[0.25em] text-fg-muted opacity-60 flex items-center gap-1.5">
    <span
      className={`w-1 h-1 rounded-full ${
        state.isPaused ? "bg-fg-muted" : "bg-accent animate-pulse"
      }`}
    />
    {state.isPaused ? "Paused · hover" : "Auto · rotating"}
  </span>
);

const RoughDivider = () => (
  <span
    aria-hidden
    className="pointer-events-none hidden md:block absolute top-0 bottom-0 left-0 w-px bg-ledger-outline/30 [filter:url(#ledger-rough)]"
  />
);

const StandardPanel = ({ items, state }: PanelProps) => {
  const activeIdx = items.findIndex((a) => a.id === state.active.id);
  const { active } = state;
  return (
    <aside
      className={`${ASIDE_BASE} relative flex flex-col gap-4 border-t md:border-t-0 border-ledger-outline/20 md:pl-6`}
    >
      <RoughDivider />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-technical text-accent font-bold tracking-[0.25em] uppercase">
            Preview
          </span>
          <span className="text-[9px] font-technical text-fg-muted tracking-[0.2em] uppercase">
            {String(activeIdx + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
        </div>
        <DotsIndicator items={items} state={state} />
        <ProgressBar state={state} />
      </div>
      <a href={`/work/articles/${active.id}`} className="group block">
        <span className="text-[9px] font-technical text-fg-muted tracking-[0.2em] uppercase block">
          {active.date}
          <span className="opacity-30 mx-1.5">·</span>
          {active.duration}
          <span className="opacity-30 mx-1.5">·</span>
          <span className="text-accent font-bold">{active.id}</span>
        </span>
        <h4 className="text-sm font-display italic text-fg-contrast group-hover:text-accent transition-colors leading-snug mt-1">
          {active.title} sdfsdf
        </h4>
        <p className="text-[11px] text-fg-muted leading-snug mt-1.5 font-technical">
          {active.excerpt}
        </p>
        <span className="text-[9px] font-technical text-fg-muted group-hover:text-accent tracking-[0.2em] uppercase mt-2 inline-block transition-colors">
          Read entry ↗
        </span>
      </a>
      <StatusPill state={state} />
    </aside>
  );
};

const HoverRow = ({
  article,
  state,
  isActive,
  className,
  children,
}: {
  article: Article;
  state: CycleState;
  isActive: boolean;
  className: string;
  children: React.ReactNode;
}) => (
  <a
    href={`/work/articles/${article.id}`}
    onMouseEnter={() => state.setHoveredId(article.id)}
    onMouseLeave={() => state.setHoveredId(null)}
    data-active={isActive ? "true" : undefined}
    className={className}
  >
    {children}
  </a>
);

export const LedgerWriting = () => {
  const state = usePreviewCycle(articles);

  return (
    <section className="mb-24 scroll-mt-32 relative group/writing" id="writing">
      <style>{`@keyframes lw-preview-progress { from { width: 0%; } to { width: 100%; } }`}</style>
      <div className="absolute -left-72 opacity-[0.03] pointer-events-none select-none">
        <span className="text-[14rem] font-serif leading-none italic">02</span>
      </div>

      <div className="flex items-center gap-4 mb-6 relative z-base">
        <span className="text-[11px] font-medium text-fg-muted opacity-40">
          /
        </span>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.4em] text-fg-contrast">
          Writing
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-6 relative z-base">
        <div className="md:col-span-7 md:order-1 space-y-0">
          {articles.map((article) => (
            <HoverRow
              key={article.id}
              article={article}
              state={state}
              isActive={article.id === state.active.id}
              className="group flex justify-between items-center gap-6 py-4 dot-line hover:translate-x-2 data-[active=true]:translate-x-1 transition-transform duration-300"
            >
              <span className="flex-1 text-xl md:text-xl text-fg-contrast italic font-display group-hover:text-accent group-data-[active=true]:text-accent transition-colors leading-snug">
                {article.title}
              </span>
              <span className="text-fg-muted text-base group-hover:text-accent group-hover:translate-x-1 group-data-[active=true]:text-accent transition-all">
                ↗
              </span>
            </HoverRow>
          ))}
        </div>
        <StandardPanel items={articles} state={state} />
      </div>
    </section>
  );
};

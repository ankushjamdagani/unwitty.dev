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

const LAYOUTS = [
  "dot-line",
  "indexed-panel",
  "stacked-panel",
  "ruled-panel",
  "filmstrip-roll",
  "postage-stack",
  "typewriter",
  "timeline-vert",
  "boarding-pass",
  "morse-feed",
] as const;
type LayoutStyle = (typeof LAYOUTS)[number];

const CYCLE_MS = 4000;

/* -------------------------------------------------------------------------- */
/*               Preview cycle hook (auto-rotate + hover-pause)               */
/* -------------------------------------------------------------------------- */
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
    ? items.find((a) => a.id === hoveredId) ?? fallback
    : fallback;

  return { active, index, isPaused, setHoveredId };
};

type CycleState = ReturnType<typeof usePreviewCycle>;

/* -------------------------------------------------------------------------- */
/*       Right Panel variants — preview, indicator, hover-driven              */
/* -------------------------------------------------------------------------- */
const PANELS = [
  "standard",
  "compact",
  "polaroid",
  "sticky-note",
  "receipt",
] as const;
type PanelVariant = (typeof PANELS)[number];

type PanelProps = { items: Article[]; state: CycleState };

const ASIDE_BASE = "md:col-span-1 md:order-2 pt-3 md:pt-0 select-none";

const ProgressBar = ({
  state,
}: {
  state: CycleState;
}) => (
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
  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-fg-muted opacity-60 flex items-center gap-1.5">
    <span
      className={`w-1 h-1 rounded-full ${
        state.isPaused ? "bg-fg-muted" : "bg-accent animate-pulse"
      }`}
    />
    {state.isPaused ? "Paused · hover" : "Auto · rotating"}
  </span>
);

/* ----- A. STANDARD -------------------------------------------------------- */
const StandardPanel = ({ items, state }: PanelProps) => {
  const activeIdx = items.findIndex((a) => a.id === state.active.id);
  const { active } = state;
  return (
    <aside
      className={`${ASIDE_BASE} flex flex-col gap-4 border-t md:border-t-0 md:border-l border-ledger-outline/20 md:pl-6`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-accent font-bold tracking-[0.25em] uppercase">
            Preview
          </span>
          <span className="text-[9px] font-mono text-fg-muted tracking-[0.2em] uppercase">
            {String(activeIdx + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
        </div>
        <DotsIndicator items={items} state={state} />
        <ProgressBar state={state} />
      </div>
      <a href={`/work/articles/${active.id}`} className="group block">
        <span className="text-[9px] font-mono text-fg-muted tracking-[0.2em] uppercase block">
          {active.date}
          <span className="opacity-30 mx-1.5">·</span>
          {active.duration}
          <span className="opacity-30 mx-1.5">·</span>
          <span className="text-accent font-bold">{active.id}</span>
        </span>
        <h4 className="text-sm font-ledger-serif italic text-fg-contrast group-hover:text-accent transition-colors leading-snug mt-1">
          {active.title}
        </h4>
        <p className="text-[11px] text-fg-muted leading-snug mt-1.5 font-work-body">
          {active.excerpt}
        </p>
        <span className="text-[9px] font-mono text-fg-muted group-hover:text-accent tracking-[0.2em] uppercase mt-2 inline-block transition-colors">
          Read entry ↗
        </span>
      </a>
      <StatusPill state={state} />
    </aside>
  );
};

/* ----- B. COMPACT --------------------------------------------------------- */
const CompactPanel = ({ items, state }: PanelProps) => {
  const activeIdx = items.findIndex((a) => a.id === state.active.id);
  const { active } = state;
  return (
    <aside
      className={`${ASIDE_BASE} flex flex-col gap-2.5 border-t md:border-t-0 md:border-l border-ledger-outline/20 md:pl-5`}
    >
      <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.2em] uppercase">
        <span className="text-accent font-bold">{active.id}</span>
        <span className="text-fg-muted">
          {activeIdx + 1}/{items.length}
        </span>
      </div>
      <ProgressBar state={state} />
      <a href={`/work/articles/${active.id}`} className="group block">
        <span className="text-[9px] font-mono text-fg-muted tracking-[0.2em] uppercase block">
          {active.date} · {active.duration}
        </span>
        <h4 className="text-sm font-ledger-serif italic text-fg-contrast group-hover:text-accent transition-colors leading-snug mt-0.5">
          {active.title} <span className="text-fg-muted not-italic">↗</span>
        </h4>
      </a>
    </aside>
  );
};

/* ----- C. POLAROID -------------------------------------------------------- */
const PolaroidPanel = ({ items, state }: PanelProps) => {
  const { active } = state;
  return (
    <aside
      className={`${ASIDE_BASE} flex flex-col items-center md:items-start gap-2`}
    >
      <a
        href={`/work/articles/${active.id}`}
        className="group relative flex flex-col bg-canvas-contrast/80 dark:bg-canvas-raised border border-ledger-outline/20 shadow-[6px_8px_18px_-6px_rgba(0,0,0,0.25)] p-2.5 pb-4 rotate-[-2deg] hover:rotate-0 transition-transform duration-500 max-w-[220px]"
      >
        <div className="aspect-[4/3] w-full bg-canvas relative overflow-hidden border border-ledger-outline/15">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(rgb(var(--fg-contrast)) 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center font-work-heading text-4xl text-fg-contrast/30 italic">
            № {active.id}
          </span>
          <span className="absolute bottom-1 right-1.5 font-mono text-[7px] tracking-[0.3em] text-fg-muted uppercase">
            {active.date}
          </span>
        </div>
        <h4 className="text-xs font-ledger-serif italic text-fg-contrast group-hover:text-accent transition-colors leading-snug mt-2.5 px-1">
          {active.title}
        </h4>
        <span className="text-[8px] font-mono text-fg-muted tracking-[0.25em] uppercase mt-1 px-1">
          {active.duration} · read ↗
        </span>
      </a>
      <DotsIndicator items={items} state={state} />
      <StatusPill state={state} />
    </aside>
  );
};

/* ----- D. STICKY NOTE ----------------------------------------------------- */
const StickyNotePanel = ({ items, state }: PanelProps) => {
  const activeIdx = items.findIndex((a) => a.id === state.active.id);
  const { active } = state;
  return (
    <aside className={`${ASIDE_BASE} flex flex-col gap-2`}>
      <a
        href={`/work/articles/${active.id}`}
        className="group relative block p-4 pb-5 bg-[#f4e9b8] dark:bg-[#c9b86a] text-[#3a2f12] shadow-[3px_5px_14px_-4px_rgba(0,0,0,0.35)] rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 92%, rgba(0,0,0,0.18) 92%)",
        }}
      >
        <span className="text-[8px] font-mono tracking-[0.3em] uppercase font-bold opacity-70">
          NOTE · {active.id} · {String(activeIdx + 1).padStart(2, "0")}/
          {items.length}
        </span>
        <h4 className="font-ledger-serif italic text-base leading-snug mt-1 group-hover:text-accent transition-colors">
          {active.title}
        </h4>
        <p className="text-[10px] leading-snug mt-2 font-work-body italic opacity-80">
          “{active.excerpt}”
        </p>
        <span className="text-[8px] font-mono tracking-[0.25em] uppercase font-bold mt-3 inline-block opacity-70">
          — {active.date} · {active.duration} ↗
        </span>
      </a>
      <ProgressBar state={state} />
      <StatusPill state={state} />
    </aside>
  );
};

/* ----- E. RECEIPT --------------------------------------------------------- */
const ReceiptPanel = ({ items, state }: PanelProps) => {
  const activeIdx = items.findIndex((a) => a.id === state.active.id);
  const { active } = state;
  const blocks = Math.max(1, Math.round(((activeIdx + 1) / items.length) * 14));
  return (
    <aside className={`${ASIDE_BASE} flex flex-col gap-2 font-mono`}>
      <div
        className="relative bg-canvas-contrast/90 dark:bg-canvas-raised text-fg-contrast p-3 shadow-md"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgb(var(--canvas)) 3px, transparent 3.5px), radial-gradient(circle at bottom, rgb(var(--canvas)) 3px, transparent 3.5px)",
          backgroundSize: "8px 5px, 8px 5px",
          backgroundPosition: "top, bottom",
          backgroundRepeat: "repeat-x, repeat-x",
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
      >
        <div className="text-center text-[9px] tracking-[0.35em] uppercase font-bold border-b border-dashed border-fg-contrast/30 pb-1.5 mb-2">
          *** UNW · RECEIPT ***
        </div>
        <div className="text-[9px] tracking-[0.15em] uppercase space-y-0.5">
          <div className="flex justify-between">
            <span className="opacity-60">REF</span>
            <span className="font-bold text-accent">{active.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">DATED</span>
            <span>{active.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">QTY</span>
            <span>{active.duration}</span>
          </div>
        </div>
        <div className="border-t border-dashed border-fg-contrast/30 my-2" />
        <a
          href={`/work/articles/${active.id}`}
          className="group block"
        >
          <span className="text-[8px] tracking-[0.3em] uppercase opacity-60 block">
            ITEM
          </span>
          <h4 className="font-ledger-serif italic text-sm leading-snug mt-0.5 group-hover:text-accent transition-colors">
            {active.title}
          </h4>
        </a>
        <div className="border-t border-dashed border-fg-contrast/30 my-2" />
        <div className="text-[9px] tracking-[0.15em] uppercase flex justify-between">
          <span className="opacity-60">PROGRESS</span>
          <span>
            {activeIdx + 1}/{items.length}
          </span>
        </div>
        <div className="text-[10px] tracking-widest mt-0.5">
          [
          <span className="text-accent">
            {"█".repeat(blocks)}
          </span>
          <span className="opacity-30">
            {"░".repeat(14 - blocks)}
          </span>
          ]
        </div>
        <div className="text-center text-[8px] tracking-[0.3em] uppercase opacity-60 mt-2 pt-2 border-t border-dashed border-fg-contrast/30">
          THANK YOU · READ ↗
        </div>
      </div>
      <StatusPill state={state} />
    </aside>
  );
};

const RightPanel = ({
  items,
  state,
  variant,
}: {
  items: Article[];
  state: CycleState;
  variant: PanelVariant;
}) => {
  switch (variant) {
    case "standard":
      return <StandardPanel items={items} state={state} />;
    case "compact":
      return <CompactPanel items={items} state={state} />;
    case "polaroid":
      return <PolaroidPanel items={items} state={state} />;
    case "sticky-note":
      return <StickyNotePanel items={items} state={state} />;
    case "receipt":
      return <ReceiptPanel items={items} state={state} />;
  }
};

/* -------------------------------------------------------------------------- */
/*                          1. DOT-LINE (Current)                             */
/* -------------------------------------------------------------------------- */
const DotLineLayout = ({
  items,
  state,
  variant,
}: {
  items: Article[];
  state: CycleState;
  variant: PanelVariant;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-base">
    <div className="md:col-span-3 md:order-1 space-y-0">
      {items.map((article) => (
        <HoverRow
          key={article.id}
          article={article}
          state={state}
          isActive={article.id === state.active.id}
          className="group flex justify-between items-center gap-6 py-4 dot-line hover:translate-x-2 data-[active=true]:translate-x-1 transition-transform duration-300"
        >
          <span className="flex-1 text-xl md:text-2xl text-fg-contrast italic font-ledger-serif group-hover:text-accent group-data-[active=true]:text-accent transition-colors leading-snug">
            {article.title}
          </span>
          <span className="text-fg-muted text-base group-hover:text-accent group-hover:translate-x-1 group-data-[active=true]:text-accent transition-all">
            ↗
          </span>
        </HoverRow>
      ))}
    </div>
    <RightPanel items={items} state={state} variant={variant} />
  </div>
);

/* -------------------------------------------------------------------------- */
/*               Row hover wrapper — drives preview state                     */
/* -------------------------------------------------------------------------- */
const HoverRow = ({
  article,
  state,
  isActive,
  className,
  style,
  children,
}: {
  article: Article;
  state: CycleState;
  isActive: boolean;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) => (
  <a
    href={`/work/articles/${article.id}`}
    onMouseEnter={() => state.setHoveredId(article.id)}
    onMouseLeave={() => state.setHoveredId(null)}
    data-active={isActive ? "true" : undefined}
    className={className}
    style={style}
  >
    {children}
  </a>
);

/* -------------------------------------------------------------------------- */
/*               2. INDEXED PANEL — vertical rows + side panel                */
/* -------------------------------------------------------------------------- */
const IndexedPanelLayout = ({
  items,
  state,
  variant,
}: {
  items: Article[];
  state: CycleState;
  variant: PanelVariant;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-base">
    <div className="md:col-span-3 md:order-1 divide-y divide-ledger-outline/15 border-y border-ledger-outline/20">
      {items.map((article) => (
        <HoverRow
          key={article.id}
          article={article}
          state={state}
          isActive={article.id === state.active.id}
          className="group flex items-center justify-between gap-4 py-3 px-2 -mx-2 hover:bg-canvas-raised/30 data-[active=true]:bg-canvas-raised/20 transition-colors"
        >
          <h3 className="flex-1 text-lg md:text-xl text-fg-contrast italic font-ledger-serif group-hover:text-accent group-data-[active=true]:text-accent transition-colors leading-snug">
            {article.title}
          </h3>
          <span className="text-fg-muted text-sm group-hover:text-accent group-hover:translate-x-1 group-data-[active=true]:text-accent transition-all">
            ↗
          </span>
        </HoverRow>
      ))}
    </div>
    <RightPanel items={items} state={state} variant={variant} />
  </div>
);

/* -------------------------------------------------------------------------- */
/*           3. STACKED PANEL — date-led vertical entries + panel             */
/* -------------------------------------------------------------------------- */
const StackedPanelLayout = ({
  items,
  state,
  variant,
}: {
  items: Article[];
  state: CycleState;
  variant: PanelVariant;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-base">
    <div className="md:col-span-3 md:order-1 space-y-2">
      {items.map((article) => (
        <HoverRow
          key={article.id}
          article={article}
          state={state}
          isActive={article.id === state.active.id}
          className="group flex items-center justify-between gap-4 py-2.5 px-3 -mx-3 border-l-2 border-l-ledger-outline/20 hover:border-l-accent data-[active=true]:border-l-accent hover:bg-canvas-raised/30 data-[active=true]:bg-canvas-raised/20 transition-all"
        >
          <h3 className="flex-1 text-lg text-fg-contrast italic font-ledger-serif group-hover:text-accent group-data-[active=true]:text-accent transition-colors leading-snug">
            {article.title}
          </h3>
          <span className="text-fg-muted text-sm group-hover:text-accent group-hover:translate-x-1 group-data-[active=true]:text-accent transition-all">
            ↗
          </span>
        </HoverRow>
      ))}
    </div>
    <RightPanel items={items} state={state} variant={variant} />
  </div>
);

/* -------------------------------------------------------------------------- */
/*              4. RULED PANEL — vertical ledger rows + panel                 */
/* -------------------------------------------------------------------------- */
const RuledPanelLayout = ({
  items,
  state,
  variant,
}: {
  items: Article[];
  state: CycleState;
  variant: PanelVariant;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-base">
    <div className="md:col-span-3 md:order-1 border-t border-ledger-outline/30">
      {items.map((article) => (
        <HoverRow
          key={article.id}
          article={article}
          state={state}
          isActive={article.id === state.active.id}
          className="group flex items-center justify-between gap-4 py-3 border-b border-ledger-outline/15 hover:bg-canvas-raised/30 data-[active=true]:bg-canvas-raised/20 -mx-2 px-2 transition-colors"
        >
          <h3 className="flex-1 text-base md:text-lg text-fg-contrast italic font-ledger-serif group-hover:text-accent group-data-[active=true]:text-accent transition-colors leading-snug">
            {article.title}
          </h3>
          <span className="text-fg-muted text-sm group-hover:text-accent group-hover:translate-x-1 group-data-[active=true]:text-accent transition-all">
            ↗
          </span>
        </HoverRow>
      ))}
    </div>
    <RightPanel items={items} state={state} variant={variant} />
  </div>
);

/* -------------------------------------------------------------------------- */
/*           5. FILMSTRIP ROLL — sprocket-perforated reel                     */
/* -------------------------------------------------------------------------- */
const FilmstripRollLayout = ({
  items,
  state,
  variant,
}: {
  items: Article[];
  state: CycleState;
  variant: PanelVariant;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-base">
    <div className="md:col-span-3 md:order-1 bg-[#0c0c0a]/95 dark:bg-black/60 p-3 rounded">
      <div className="space-y-2">
        {items.map((article) => (
          <HoverRow
            key={article.id}
            article={article}
            state={state}
            isActive={article.id === state.active.id}
            className="group relative flex items-stretch overflow-hidden rounded-sm bg-canvas-raised/95 hover:bg-canvas-raised data-[active=true]:bg-canvas-raised data-[active=true]:ring-1 data-[active=true]:ring-accent/60 transition-all"
          >
            <span
              className="w-7 shrink-0 bg-black"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0 4px, rgba(255,255,255,0.85) 4px 12px, transparent 12px 16px)",
              }}
            />
            <span className="flex-1 flex items-center justify-between gap-3 py-3 px-3.5 border-x border-dashed border-fg-contrast/10">
              <span className="text-base md:text-lg text-fg-contrast italic font-ledger-serif group-hover:text-accent group-data-[active=true]:text-accent transition-colors leading-snug">
                {article.title}
              </span>
              <span className="text-fg-muted text-sm group-hover:text-accent group-hover:translate-x-1 group-data-[active=true]:text-accent transition-all shrink-0">
                ↗
              </span>
            </span>
            <span
              className="w-7 shrink-0 bg-black"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0 4px, rgba(255,255,255,0.85) 4px 12px, transparent 12px 16px)",
              }}
            />
          </HoverRow>
        ))}
      </div>
    </div>
    <RightPanel items={items} state={state} variant={variant} />
  </div>
);

/* -------------------------------------------------------------------------- */
/*           6. POSTAGE STACK — perforated stamp slips                        */
/* -------------------------------------------------------------------------- */
const PostageStackLayout = ({
  items,
  state,
  variant,
}: {
  items: Article[];
  state: CycleState;
  variant: PanelVariant;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-base">
    <div className="md:col-span-3 md:order-1 space-y-3">
      {items.map((article) => (
        <HoverRow
          key={article.id}
          article={article}
          state={state}
          isActive={article.id === state.active.id}
          className="group relative flex items-center justify-between gap-4 bg-canvas-raised/40 hover:bg-canvas-raised/70 data-[active=true]:bg-canvas-raised/70 transition-colors py-3.5 px-4 pr-24"
          style={{
            backgroundImage:
              "radial-gradient(circle at top, rgb(var(--canvas)) 3px, transparent 3.5px), radial-gradient(circle at bottom, rgb(var(--canvas)) 3px, transparent 3.5px)",
            backgroundSize: "10px 6px, 10px 6px",
            backgroundPosition: "top, bottom",
            backgroundRepeat: "repeat-x, repeat-x",
            borderTop: "1px dashed rgb(var(--ledger-outline) / 0.4)",
            borderBottom: "1px dashed rgb(var(--ledger-outline) / 0.4)",
          }}
        >
          <h3 className="flex-1 text-lg text-fg-contrast italic font-ledger-serif group-hover:text-accent group-data-[active=true]:text-accent transition-colors leading-snug">
            {article.title}
          </h3>
          <span className="text-fg-muted text-sm group-hover:text-accent group-hover:translate-x-1 group-data-[active=true]:text-accent transition-all shrink-0">
            ↗
          </span>
          <span className="absolute top-1/2 -translate-y-1/2 right-3 rotate-[-8deg] text-[7px] font-mono font-bold tracking-[0.3em] text-accent/40 group-hover:text-accent/80 group-data-[active=true]:text-accent/80 uppercase transition-colors pointer-events-none">
            ★ POSTED ★
          </span>
        </HoverRow>
      ))}
    </div>
    <RightPanel items={items} state={state} variant={variant} />
  </div>
);

/* -------------------------------------------------------------------------- */
/*           7. TYPEWRITER — monospace draft w/ blinking caret                */
/* -------------------------------------------------------------------------- */
const TypewriterLayout = ({
  items,
  state,
  variant,
}: {
  items: Article[];
  state: CycleState;
  variant: PanelVariant;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-base">
    <div className="md:col-span-3 md:order-1 font-mono">
      {items.map((article) => {
        const isActive = article.id === state.active.id;
        return (
          <HoverRow
            key={article.id}
            article={article}
            state={state}
            isActive={isActive}
            className="group flex items-center gap-3 py-2.5 hover:bg-canvas-raised/30 data-[active=true]:bg-canvas-raised/30 -mx-2 px-2 transition-colors border-b border-dotted border-ledger-outline/25"
          >
            <span className="text-accent text-sm shrink-0">{">"}</span>
            <span className="flex-1 text-sm md:text-base text-fg-contrast group-hover:text-accent group-data-[active=true]:text-accent transition-colors uppercase tracking-[0.05em] leading-snug">
              {article.title}
              {isActive && (
                <span className="inline-block w-1.5 h-3.5 ml-1 align-[-2px] bg-accent animate-[blink-animation_900ms_steps(2)_infinite]" />
              )}
            </span>
            <span className="text-fg-muted text-sm group-hover:text-accent group-hover:translate-x-1 group-data-[active=true]:text-accent transition-all shrink-0">
              ↗
            </span>
          </HoverRow>
        );
      })}
    </div>
    <RightPanel items={items} state={state} variant={variant} />
  </div>
);

/* -------------------------------------------------------------------------- */
/*           8. TIMELINE VERT — year markers + node thread                    */
/* -------------------------------------------------------------------------- */
const TimelineVertLayout = ({
  items,
  state,
  variant,
}: {
  items: Article[];
  state: CycleState;
  variant: PanelVariant;
}) => {
  // Build flat list with year markers inserted on year change
  let lastYear = "";
  const rows: Array<
    { kind: "year"; year: string } | { kind: "entry"; article: Article }
  > = [];
  items.forEach((article) => {
    const year = article.date.slice(-4);
    if (year !== lastYear) {
      rows.push({ kind: "year", year });
      lastYear = year;
    }
    rows.push({ kind: "entry", article });
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-base">
      <div className="md:col-span-3 md:order-1 relative pl-[68px]">
        <div className="absolute left-[60px] top-1 bottom-1 w-px bg-ledger-outline/25 [filter:url(#ledger-rough)]" />
        <div className="space-y-1">
          {rows.map((row, i) =>
            row.kind === "year" ? (
              <div
                key={`y-${row.year}-${i}`}
                className="relative flex items-center py-3"
              >
                <span className="absolute -left-[68px] w-14 text-right text-[10px] font-mono font-bold tracking-[0.25em] text-accent uppercase">
                  {row.year}
                </span>
                <span className="absolute left-[-9px] w-[7px] h-[7px] rotate-45 bg-accent" />
                <span className="text-[9px] font-mono tracking-[0.3em] text-fg-muted uppercase opacity-60">
                  — chapter —
                </span>
              </div>
            ) : (
              <HoverRow
                key={row.article.id}
                article={row.article}
                state={state}
                isActive={row.article.id === state.active.id}
                className="group relative flex items-center justify-between gap-4 py-3 hover:bg-canvas-raised/30 data-[active=true]:bg-canvas-raised/30 -mx-2 pl-2 pr-2 transition-colors"
              >
                <span className="absolute -left-[12px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full border-2 border-accent bg-canvas group-hover:scale-125 group-data-[active=true]:bg-accent transition-all" />
                <h3 className="flex-1 text-base md:text-lg text-fg-contrast italic font-ledger-serif group-hover:text-accent group-data-[active=true]:text-accent transition-colors leading-snug">
                  {row.article.title}
                </h3>
                <span className="text-fg-muted text-sm group-hover:text-accent group-hover:translate-x-1 group-data-[active=true]:text-accent transition-all shrink-0">
                  ↗
                </span>
              </HoverRow>
            ),
          )}
        </div>
      </div>
      <RightPanel items={items} state={state} variant={variant} />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*           9. BOARDING PASS — gate-stub strip rows                          */
/* -------------------------------------------------------------------------- */
const BoardingPassLayout = ({
  items,
  state,
  variant,
}: {
  items: Article[];
  state: CycleState;
  variant: PanelVariant;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-base">
    <div className="md:col-span-3 md:order-1 space-y-2.5">
      {items.map((article) => (
        <HoverRow
          key={article.id}
          article={article}
          state={state}
          isActive={article.id === state.active.id}
          className="group relative flex bg-canvas-raised/40 hover:bg-canvas-raised/70 data-[active=true]:bg-canvas-raised/70 border border-ledger-outline/25 hover:border-accent/50 data-[active=true]:border-accent/50 rounded transition-all overflow-hidden"
        >
          <span className="absolute -left-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-canvas border border-ledger-outline/25 group-hover:border-accent/50 group-data-[active=true]:border-accent/50 transition-colors" />
          <span className="absolute -right-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-canvas border border-ledger-outline/25 group-hover:border-accent/50 group-data-[active=true]:border-accent/50 transition-colors" />

          <div className="flex items-center justify-center w-10 shrink-0 py-3 border-r border-dashed border-ledger-outline/30 group-hover:border-accent/40 group-data-[active=true]:border-accent/40 transition-colors">
            <span className="text-accent/60 text-sm">✦</span>
          </div>
          <div className="flex-1 flex items-center justify-between gap-3 py-3 px-4">
            <h3 className="flex-1 text-base md:text-lg text-fg-contrast italic font-ledger-serif group-hover:text-accent group-data-[active=true]:text-accent transition-colors leading-snug">
              {article.title}
            </h3>
            <span className="text-fg-muted text-sm group-hover:text-accent group-hover:translate-x-1 group-data-[active=true]:text-accent transition-all shrink-0">
              ↗
            </span>
          </div>
        </HoverRow>
      ))}
    </div>
    <RightPanel items={items} state={state} variant={variant} />
  </div>
);

/* -------------------------------------------------------------------------- */
/*           10. MORSE FEED — dash patterns left of titles                    */
/* -------------------------------------------------------------------------- */
const MorseFeedLayout = ({
  items,
  state,
  variant,
}: {
  items: Article[];
  state: CycleState;
  variant: PanelVariant;
}) => {
  const morseFor = (id: string) => {
    // Map last digit to a 5-symbol morse pattern
    const patterns = [
      "·····",
      "·····",
      "·−·−·",
      "·−··−",
      "−··−·",
      "−·−·−",
      "−−−··",
      "·−−·−",
      "··−·−",
      "−·−··",
    ];
    const last = parseInt(id.slice(-1), 10) || 0;
    return patterns[last] ?? "·−·−·";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-base">
      <div className="md:col-span-3 md:order-1 space-y-0">
        {items.map((article) => (
          <HoverRow
            key={article.id}
            article={article}
            state={state}
            isActive={article.id === state.active.id}
            className="group flex items-center gap-4 py-3 border-b border-dotted border-ledger-outline/25 hover:bg-canvas-raised/30 data-[active=true]:bg-canvas-raised/30 -mx-2 px-2 transition-colors"
          >
            <span className="font-mono text-base tracking-[0.25em] text-accent/70 group-hover:text-accent group-data-[active=true]:text-accent transition-colors shrink-0 w-20 text-center select-none">
              {morseFor(article.id)}
            </span>
            <span className="w-px self-stretch bg-ledger-outline/20" />
            <h3 className="flex-1 text-base md:text-lg text-fg-contrast italic font-ledger-serif group-hover:text-accent group-data-[active=true]:text-accent transition-colors leading-snug">
              {article.title}
            </h3>
            <span className="text-fg-muted text-sm group-hover:text-accent group-hover:translate-x-1 group-data-[active=true]:text-accent transition-all shrink-0">
              ↗
            </span>
          </HoverRow>
        ))}
      </div>
      <RightPanel items={items} state={state} variant={variant} />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

export const LedgerWriting = () => {
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>("dot-line");
  const [panelVariant, setPanelVariant] =
    useState<PanelVariant>("standard");
  const state = usePreviewCycle(articles);

  const renderLayout = () => {
    const props = { items: articles, state, variant: panelVariant };
    switch (layoutStyle) {
      case "dot-line":
        return <DotLineLayout {...props} />;
      case "indexed-panel":
        return <IndexedPanelLayout {...props} />;
      case "stacked-panel":
        return <StackedPanelLayout {...props} />;
      case "ruled-panel":
        return <RuledPanelLayout {...props} />;
      case "filmstrip-roll":
        return <FilmstripRollLayout {...props} />;
      case "postage-stack":
        return <PostageStackLayout {...props} />;
      case "typewriter":
        return <TypewriterLayout {...props} />;
      case "timeline-vert":
        return <TimelineVertLayout {...props} />;
      case "boarding-pass":
        return <BoardingPassLayout {...props} />;
      case "morse-feed":
        return <MorseFeedLayout {...props} />;
    }
  };

  return (
    <section
      className="mb-24 scroll-mt-32 relative group/writing"
      id="writing"
    >
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

      {renderLayout()}

      {/* Experiment Switcher */}
      <div className="absolute -bottom-10 right-0 flex flex-col gap-3 bg-canvas/80 backdrop-blur-sm border border-ledger-outline/20 p-2 rounded-lg opacity-0 group-hover/writing:opacity-100 transition-opacity z-overlay">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-tighter text-fg-muted font-bold px-1">
            Writing Experiments
          </span>
          <div className="flex flex-wrap gap-1 max-w-[560px]">
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
        <div className="flex flex-col gap-1 border-t border-ledger-outline/20 pt-2">
          <span className="text-[9px] uppercase tracking-tighter text-fg-muted font-bold px-1">
            Preview Panel
          </span>
          <div className="flex flex-wrap gap-1 max-w-[560px]">
            {PANELS.map((p) => (
              <button
                key={p}
                onClick={() => setPanelVariant(p)}
                className={`px-3 h-6 rounded flex items-center justify-center text-[10px] border transition-colors uppercase tracking-widest ${
                  panelVariant === p
                    ? "bg-accent text-canvas border-accent"
                    : "border-ledger-outline/30 hover:bg-ledger-outline/10"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

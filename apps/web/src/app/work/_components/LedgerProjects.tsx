"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProjectsMeta, ProjectState, ProjectType } from "@/configs/projects";
import { FiLayout, FiSliders, FiList, FiTrendingUp, FiFolder } from "react-icons/fi";

const List = [
  ProjectType.GameboyTetris,
  ProjectType.SvgEditor,
  ProjectType.XREditor,
  ProjectType.SongGenerator,
];

const StatusLabel: Record<ProjectState, string> = {
  [ProjectState.ToBeStarted]: "To Be Started",
  [ProjectState.InProgress]: "Under Development",
  [ProjectState.Completed]: "Completed",
};

const LAYOUTS = ["editorial-grid", "editorial-interlocking", "editorial-masonry", "editorial-staircase", "editorial-overlap"] as const;
type LayoutStyle = (typeof LAYOUTS)[number];

/* -------------------------------------------------------------------------- */
/*         1. Editorial Grid: The Staggered Asymmetric Slate                  */
/* -------------------------------------------------------------------------- */
const EditorialGridVariant = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 relative z-base">
      {List.map((project, idx) => {
        const config = ProjectsMeta[project];
        const isStaggered = idx % 2 !== 0;
        return (
          <div
            key={project}
            className={`group flex gap-6 items-start transition-all duration-500 ${
              isStaggered ? "md:mt-12" : ""
            }`}
          >
            <span className="text-[12px] font-mono text-fg-contrast/30 select-none pt-1">
              /00{idx + 1}
            </span>
            <div className="flex-1">
              <Link
                href={`/work/projects/${project}`}
                className="hover:text-accent inline-block"
              >
                <h3 className="text-3xl font-work-heading font-medium tracking-tight text-fg-contrast hover:text-accent transition-colors flex items-center gap-2">
                  {config.title}
                  <span className="opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-sm">
                    ↗
                  </span>
                </h3>
              </Link>
              
              <p className="text-sm text-fg-muted mt-2 leading-relaxed group-hover:text-fg-contrast transition-colors duration-300">
                {config.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 select-none">
                {config.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[9px] font-mono tracking-widest text-fg-subtle uppercase border-b border-ledger-outline/25"
                  >
                    #{tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*         2. Editorial Interlocking: The Interlocking Grid Matrix            */
/* -------------------------------------------------------------------------- */
const EditorialInterlockingVariant = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 relative z-base">
      {List.map((project, idx) => {
        const config = ProjectsMeta[project];
        return (
          <div
            key={project}
            className="group relative flex flex-col justify-between min-h-[220px]"
          >
            {/* Overlapping background layout tag */}
            <div className="absolute -left-4 -top-8 text-[7.5rem] font-serif leading-none italic text-fg-contrast/5 pointer-events-none select-none z-below-all group-hover:text-accent/5 group-hover:scale-105 transition-all duration-700">
              0{idx + 1}
            </div>

            <div className="relative z-base pl-6">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-accent font-bold block mb-2">
                {StatusLabel[config.status]}
              </span>

              <Link
                href={`/work/projects/${project}`}
                className="hover:text-accent inline-block"
              >
                <h3 className="text-2xl font-work-heading font-medium tracking-tight text-fg-contrast hover:text-accent transition-colors">
                  {config.title}
                </h3>
              </Link>

              <p className="text-sm text-fg-muted mt-2 leading-relaxed group-hover:text-fg-contrast transition-colors duration-300 max-w-md">
                {config.description}
              </p>
            </div>

            <div className="relative z-base pl-6 mt-6 select-none border-l border-ledger-outline/20 flex flex-wrap gap-2 items-center">
              {config.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-[9px] font-mono tracking-widest text-fg-subtle uppercase border-b border-ledger-outline/25"
                >
                  #{tag.label}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*         3. Editorial Masonry: The Variable Span Masonry                    */
/* -------------------------------------------------------------------------- */
const EditorialMasonryVariant = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-base">
      {List.map((project, idx) => {
        const config = ProjectsMeta[project];
        // Index 0 and 3 span full 2 columns, 1 and 2 occupy single columns
        const spanClass = idx === 0 || idx === 3 ? "md:col-span-2" : "md:col-span-1";

        return (
          <div
            key={project}
            className={`group flex flex-col justify-between transition-all duration-500 ${spanClass}`}
          >
            <div>
              <div className="flex justify-between items-baseline mb-6 select-none">
                <span className="text-sm font-serif italic text-fg-contrast/30">
                  {"// docket.0"}{idx + 1}
                </span>
                <span className="text-[9px] font-mono tracking-widest text-accent uppercase font-bold">
                  {StatusLabel[config.status]}
                </span>
              </div>

              <Link href={`/work/projects/${project}`}>
                <h3 className="text-3xl font-work-heading font-medium text-fg-contrast hover:text-accent transition-colors mb-3">
                  {config.title}
                </h3>
              </Link>

              <p className="text-sm text-fg-muted leading-relaxed max-w-2xl">
                {config.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-ledger-outline/10 flex flex-wrap gap-2 justify-between items-center select-none">
              <div className="flex flex-wrap gap-1.5">
                {config.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[9px] font-mono bg-canvas border border-ledger-outline/20 px-2 py-0.5 rounded text-fg-muted uppercase tracking-widest"
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <Link
                href={`/work/projects/${project}`}
                className="text-xs font-mono font-bold text-accent hover:underline uppercase tracking-wider"
              >
                LAUNCH ↗
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*         4. Editorial Staircase: The Alternating Staircase Grid             */
/* -------------------------------------------------------------------------- */
const EditorialStaircaseVariant = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-20 relative z-base">
      {List.map((project, idx) => {
        const config = ProjectsMeta[project];
        // Staircase pattern:
        // Item 0: Spans 8, Item 1: Spans 4
        // Item 2: Spans 4, Item 3: Spans 8
        const spanClass = idx === 0 || idx === 3 ? "md:col-span-8" : "md:col-span-4";

        return (
          <div
            key={project}
            className={`group flex flex-col justify-between transition-all duration-500 ${spanClass}`}
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest text-fg-contrast/30 select-none block mb-3 uppercase">
                {"/00"}{idx + 1}{" // "}{StatusLabel[config.status]}
              </span>
              <Link
                href={`/work/projects/${project}`}
                className="hover:text-accent inline-block"
              >
                <h3 className="text-3xl font-work-heading font-medium tracking-tight text-fg-contrast hover:text-accent transition-colors">
                  {config.title}
                </h3>
              </Link>
              <p className="text-sm text-fg-muted mt-3 leading-relaxed group-hover:text-fg-contrast transition-colors duration-300">
                {config.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 select-none border-t border-dashed border-ledger-outline/10 pt-4">
              {config.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-[9px] font-mono tracking-widest text-fg-subtle uppercase border-b border-ledger-outline/25"
                >
                  #{tag.label}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*         5. Editorial Overlap: The Layered Typographic Collage              */
/* -------------------------------------------------------------------------- */
const EditorialOverlapVariant = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 relative z-base">
      {List.map((project, idx) => {
        const config = ProjectsMeta[project];
        // Shift placements for overlapping grid boundaries
        const gridClasses = [
          "md:col-start-1 md:col-span-7",
          "md:col-start-6 md:col-span-7 md:-mt-8",
          "md:col-start-2 md:col-span-6",
          "md:col-start-5 md:col-span-8 md:-mt-8",
        ];
        const layoutClass = gridClasses[idx % gridClasses.length];

        return (
          <div
            key={project}
            className={`group relative flex flex-col justify-between transition-all duration-500 ${layoutClass}`}
          >
            {/* Overlapping big index tag behind */}
            <div className="absolute -left-10 -top-12 text-[8rem] font-serif leading-none italic text-fg-contrast/5 pointer-events-none select-none z-below-all group-hover:text-accent/5 group-hover:scale-105 transition-all duration-700">
              0{idx + 1}
            </div>

            <div className="pl-6 relative z-base">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-accent font-bold block mb-2">
                {StatusLabel[config.status]}
              </span>

              <Link href={`/work/projects/${project}`}>
                <h3 className="text-4xl font-work-heading font-medium tracking-tight text-fg-contrast hover:text-accent transition-colors flex items-center gap-3">
                  {config.title}
                  <span className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-accent font-light text-2xl">
                    →
                  </span>
                </h3>
              </Link>

              <p className="text-sm text-fg-muted mt-3 leading-relaxed group-hover:text-fg-contrast transition-colors duration-300 max-w-xl">
                {config.description}
              </p>
            </div>

            <div className="pl-6 mt-6 select-none flex flex-wrap gap-3 items-center">
              {config.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-[9px] font-mono tracking-widest text-fg-subtle uppercase border-b border-ledger-outline/20 hover:border-fg-contrast transition-colors"
                >
                  #{tag.label}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */
export const LedgerProjects = () => {
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>("editorial-grid");

  const renderLayout = () => {
    switch (layoutStyle) {
      case "editorial-grid":
        return <EditorialGridVariant />;
      case "editorial-interlocking":
        return <EditorialInterlockingVariant />;
      case "editorial-masonry":
        return <EditorialMasonryVariant />;
      case "editorial-staircase":
        return <EditorialStaircaseVariant />;
      case "editorial-overlap":
        return <EditorialOverlapVariant />;
      default:
        return <EditorialGridVariant />;
    }
  };

  const getLayoutIcon = (style: LayoutStyle) => {
    switch (style) {
      case "editorial-grid":
        return <FiSliders className="w-3.5 h-3.5" />;
      case "editorial-interlocking":
        return <FiTrendingUp className="w-3.5 h-3.5" />;
      case "editorial-masonry":
        return <FiLayout className="w-3.5 h-3.5" />;
      case "editorial-staircase":
        return <FiList className="w-3.5 h-3.5" />;
      case "editorial-overlap":
        return <FiFolder className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section className="mb-24 scroll-mt-32 relative group/projects" id="projects">
      {/* Decorative absolute background number */}
      <div className="absolute -left-72 opacity-[0.03] pointer-events-none select-none">
        <span className="text-[14rem] font-serif leading-none italic">03</span>
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-base">
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-medium text-fg-muted opacity-40">
            /
          </span>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.4em] text-fg-contrast">
            Experiments
          </h2>
        </div>

        {/* Minimal Layout Selector Pill */}
        <div className="flex items-center gap-1.5 bg-canvas-raised border border-ledger-outline/20 p-1 rounded-lg">
          {LAYOUTS.map((style) => (
            <button
              key={style}
              onClick={() => setLayoutStyle(style)}
              className={`px-3 h-7 rounded flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest border transition-all duration-300 ${
                layoutStyle === style
                  ? "bg-fg-contrast text-canvas border-fg-contrast shadow-sm"
                  : "border-transparent hover:bg-ledger-outline/10 text-fg-muted hover:text-fg-contrast"
              }`}
              title={`Switch to ${style} layout`}
            >
              {getLayoutIcon(style)}
              <span className="hidden md:inline">{style.replace("editorial-", "").replace("-", " ")}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Render selected high-fidelity variant */}
      <div className="transition-opacity duration-300 font-work-body">
        {renderLayout()}
      </div>
    </section>
  );
};

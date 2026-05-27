"use client";

import React from "react";
import { ProjectsMeta, ProjectState, ProjectType } from "@/configs/projects";

const List = [
  ProjectType.GameboyTetris,
  ProjectType.SvgEditor,
  ProjectType.XREditor,
  ProjectType.SongGenerator,
];

const StatusLabel = {
  [ProjectState.ToBeStarted]: "To Be Started",
  [ProjectState.InProgress]: "Under Development",
  [ProjectState.Completed]: "Completed",
};

export const LedgerProjects = () => {
  return (
    <section className="mb-24 scroll-mt-32 relative" id="projects">
      <div className="absolute -left-72 opacity-[0.03] pointer-events-none select-none">
        <span className="text-[14rem] font-serif leading-none italic">03</span>
      </div>

      <div className="flex items-center gap-4 mb-6 relative z-base">
        <span className="text-[11px] font-medium text-fg-muted opacity-40">
          /
        </span>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.4em] text-fg-contrast">
          Experiments
        </h2>
        {/* <div className="flex-grow h-px bg-ledger-outline opacity-30 [filter:url(#ledger-rough)]"></div> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-base">
        {List.map((project) => {
          const config = ProjectsMeta[project];
          return (
            <div
              key={project}
              className="group flex flex-col p-6 bg-canvas-raised border border-ledger-outline/30 hover:border-fg-contrast/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[11px] font-medium text-fg-muted uppercase tracking-widest opacity-60">
                  {StatusLabel[config.status]}
                </span>
                <span className="text-[11px] font-medium text-fg-muted opacity-30">
                  /00{List.indexOf(project) + 1}
                </span>
              </div>
              <h3 className="text-2xl font-medium text-fg-contrast mb-2 font-work-heading">
                {config.title}
              </h3>
              <p className="text-sm text-fg-muted mb-6 flex-grow">
                {config.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {config.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-canvas border border-ledger-outline px-2 py-0.5 text-[9px] font-medium text-fg-muted uppercase tracking-widest"
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

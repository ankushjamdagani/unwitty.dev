"use client";

import React from "react";
import Link from "next/link";
import { ProjectsMeta, ProjectState, ProjectType } from "@/configs/projects";

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

export const LedgerProjects = () => {
  return (
    <section
      className="mb-24 scroll-mt-32 relative group/projects"
      id="projects"
    >
      <div className="absolute -left-72 opacity-[0.03] pointer-events-none select-none">
        <span className="text-[14rem] font-serif leading-none italic">03</span>
      </div>

      <div className="flex items-center gap-4 mb-12 relative z-base">
        <span className="text-[11px] font-medium text-fg-muted opacity-40">
          /
        </span>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.4em] text-fg-contrast">
          Experiments
        </h2>
      </div>

      <div className="font-technical grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-20 relative z-base">
        {List.map((project, idx) => {
          const config = ProjectsMeta[project];
          const spanClass =
            idx === 0 || idx === 3 ? "md:col-span-8" : "md:col-span-4";

          return (
            <div
              key={project}
              className={`group flex flex-col justify-between transition-all duration-500 ${spanClass}`}
            >
              <div>
                <span className="text-[10px] font-technical tracking-widest text-fg-contrast/30 select-none block mb-3 uppercase">
                  {"/00"}
                  {idx + 1}
                  {" // "}
                  {StatusLabel[config.status]}
                </span>
                <Link
                  href={`/work/projects/${project}`}
                  className="hover:text-accent inline-block"
                >
                  <h3 className="text-3xl font-display font-medium tracking-tight text-fg-contrast hover:text-accent transition-colors">
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
                    className="text-[9px] font-technical tracking-widest text-fg-subtle uppercase border-b border-ledger-outline/25"
                  >
                    #{tag.label}
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

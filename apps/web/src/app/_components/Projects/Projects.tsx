"use client";

import Link from "next/link";
import Image from "next/image";

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

export function Projects() {
  const gridClasses = [
    "col-span-2 row-span-2",
    "col-span-3 row-span-2",
    "col-span-3 row-span-2",
    "col-span-2 row-span-2",
  ];

  return (
    <section id="projects" className="container">
      <h2>Experiments</h2>
      <ul className="grid grid-cols-5 auto-rows-[minmax(200px,auto)]">
        {List.map((project, index) => {
          const projectConfig = ProjectsMeta[project];
          return (
            <li
              key={project}
              className={`relative flex w-full items-stretch justify-stretch transition-all duration-300 ${gridClasses[index] || ""}`}
            >
              {projectConfig.status !== ProjectState.Completed && (
                <div
                  className="absolute -left-1 -right-1 -top-1 z-[1] flex h-[60px] items-center justify-center overflow-hidden"
                  style={{
                    background:
                      "repeating-linear-gradient(45deg, rgb(var(--foreground-rgb)) 4px, rgb(var(--foreground-rgb)) 6px, transparent 7px, transparent 10px)",
                    backgroundAttachment: "fixed",
                    animation: "bg-move 0.35s linear infinite",
                  }}
                >
                  <span className="bg-background px-4 py-[2px]">
                    {StatusLabel[projectConfig.status]}
                  </span>
                </div>
              )}
              <Link
                href={`/projects/${project}`}
                className="project-item shadow-box group flex flex-1 items-center justify-center overflow-hidden pl-10"
              >
                {projectConfig.thumbnail.type == "image" && (
                  <Image
                    src={projectConfig.thumbnail.src}
                    alt={projectConfig.title}
                    width={200}
                    height={200}
                    className="preview-thumb dark-invert transition-transform duration-500 group-hover:-translate-y-4"
                  />
                )}
                <div className="details border-foreground border-t-[length:var(--border-width-extra-thick)] p-4 w-full">
                  <h3 className="title text-lg pb-2">{projectConfig.title}</h3>
                  <p className="description text-xs">
                    {projectConfig.description}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

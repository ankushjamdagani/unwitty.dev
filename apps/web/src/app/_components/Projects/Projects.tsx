"use client";

import Link from "next/link";
import Image from "next/image";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import "./Projects.styles.css";

import { ProjectsMeta, ProjectState, ProjectType } from "@/configs/projects";

const List = [ProjectType.GameboyTetris, ProjectType.SvgEditor];

export function Projects() {
  return (
    <section id="projects" className="container">
      <h2>Experiments</h2>
      <ul>
        {List.map((project) => {
          const projectConfig = ProjectsMeta[project];
          return (
            <li key={project} className={`project-item-wrapper ${project}`}>
              {projectConfig.status === ProjectState.InProgress && (
                <div className="project-in-progress-indicator">
                  <span>Under Development</span>
                </div>
              )}
              <Link
                href={`/projects/${project}`}
                className="project-item shadow-box"
              >
                {projectConfig.thumbnail.type == "image" && (
                  <Image
                    src={projectConfig.thumbnail.src}
                    alt={projectConfig.title}
                    width={200}
                    height={200}
                    className="preview-thumb dark-invert"
                  />
                )}
                <div className="details">
                  <h3 className="title">{projectConfig.title}</h3>
                  <p className="description">{projectConfig.description}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <footer>
        <button className="project-prev" aria-label="Previous projects">
          <FaAngleLeft />
        </button>
        <div className="seperator-rect"></div>
        <button className="project-next" aria-label="Next projects">
          <FaAngleRight />
        </button>
      </footer>
    </section>
  );
}

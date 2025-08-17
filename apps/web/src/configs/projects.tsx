import React from "react";
import dynamic from "next/dynamic";

export enum ProjectType {
  GameboyTetris = "gameboy_tetris",
  SvgEditor = "svg_editor",
}

export enum ProjectState {
  InProgress,
  Completed,
}

export const ProjectsMeta = {
  [ProjectType.GameboyTetris]: {
    title: "Gameboy Shell",
    description: "Gameboy like mobile experience for Tetris in retro style",
    status: ProjectState.InProgress,
    thumbnail: {
      src: "/images/projects/gameboy-tetris.svg",
      type: "image",
    },
    tags: [
      {
        id: "1",
        label: "Typescript",
      },
      {
        id: "2",
        label: "Web Security",
      },
      {
        id: "3",
        label: "DDOS attack",
      },
      {
        id: "4",
        label: "CSRF Attacks",
      },
      {
        id: "5",
        label: "Content Security Policies",
      },
    ],
  },
  [ProjectType.SvgEditor]: {
    title: "SVG Editor",
    description: "SVG extraction from image and points editor",
    status: ProjectState.InProgress,
    thumbnail: {
      src: "/images/projects/svg-editor.svg",
      type: "image",
    },
    tags: [
      {
        id: "1",
        label: "Typescript",
      },
      {
        id: "2",
        label: "Web Security",
      },
      {
        id: "3",
        label: "DDOS attack",
      },
      {
        id: "4",
        label: "CSRF Attacks",
      },
      {
        id: "5",
        label: "Content Security Policies",
      },
    ],
  },
};

export const ProjectsConfig = {
  [ProjectType.GameboyTetris]: {
    learnings: [
      {
        id: "1",
        label: "How to be lazy?",
        link: "#",
      },
      {
        id: "2",
        label: "Art of doing nothing",
        link: "#",
      },
      {
        id: "3",
        label: "Fuck all this",
        link: "#",
      },
    ],
    postedDate: new Date("2024-12-25T10:00:00").toDateString(),
    project: {
      githubLink: "",
      previewLink: "",
      previewElement: () => {
        const GameboyShell = dynamic(
          () =>
            import("@project/gameboy-shell").then((module) => ({
              default: module.GameboyShell,
            })),
          { ssr: true, loading: () => <p>Loading...</p> }
        );

        return (
          <GameboyShell>
            <div>Hello</div>
          </GameboyShell>
        );
      },
    },
  },
  [ProjectType.SvgEditor]: {
    learnings: [
      {
        id: "1",
        label: "How to be lazy?",
        link: "#",
      },
      {
        id: "2",
        label: "Art of doing nothing",
        link: "#",
      },
      {
        id: "3",
        label: "Fuck all this",
        link: "#",
      },
    ],
    postedDate: new Date("2025-08-15T10:00:00").toDateString(),
    project: {
      githubLink: "",
      previewLink: "",
      previewElement: () => {
        const SvgEditor = dynamic(
          () =>
            import("@project/svg-editor").then((module) => ({
              default: module.SvgEditor,
            })),
          { ssr: true, loading: () => <p>Loading...</p> }
        );

        return <SvgEditor />;
      },
    },
  },
};

export function getProjectConfig(project: ProjectType) {
  if (!ProjectsMeta[project]) return;
  return {
    id: ProjectType.GameboyTetris,
    ...ProjectsMeta[project],
    ...ProjectsConfig[project],
  };
}

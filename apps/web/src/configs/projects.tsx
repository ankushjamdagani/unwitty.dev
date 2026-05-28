import React from "react";
import dynamic from "next/dynamic";

export enum ProjectType {
  GameboyTetris = "gameboy_tetris",
  SvgEditor = "svg_editor",
  XREditor = "xr_editor",
  SongGenerator = "song_generator",
}

export enum ProjectState {
  ToBeStarted,
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
  [ProjectType.XREditor]: {
    title: "XR Editor",
    description: "Editor for augmented reality experiences",
    status: ProjectState.ToBeStarted,
    thumbnail: {
      src: "/images/projects/xr-editor.svg",
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
  [ProjectType.SongGenerator]: {
    title: "Song Generator",
    description: "Prompt based song generator",
    status: ProjectState.ToBeStarted,
    thumbnail: {
      src: "/images/projects/song-generator.svg",
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
          { ssr: true, loading: () => <p>Loading...</p> },
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
          { ssr: true, loading: () => <p>Loading...</p> },
        );

        return <SvgEditor />;
      },
    },
  },
  [ProjectType.XREditor]: {
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
    postedDate: new Date("2025-11-20T10:00:00").toDateString(),
    project: {
      githubLink: "",
      previewLink: "",
      previewElement: () => {
        return <div>XR Editor</div>;
      },
    },
  },
  [ProjectType.SongGenerator]: {
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
    postedDate: new Date("2025-11-29T10:00:00").toDateString(),
    project: {
      githubLink: "",
      previewLink: "",
      previewElement: () => {
        const SongGenerator = dynamic(
          () =>
            import("@project/song-generator").then((module) => ({
              default: module.SongGenerator,
            })),
          { ssr: true, loading: () => <p>Loading...</p> },
        );

        return <SongGenerator />;
      },
    },
  },
};

export function getProjectConfig(project: ProjectType) {
  if (!ProjectsMeta[project]) return;
  return {
    id: project,
    ...ProjectsMeta[project],
    ...ProjectsConfig[project],
  };
}

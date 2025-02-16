"use client";

import React from "react";

import { BsCalendar2Date } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

import "./Project.styles.css";

import { BreadCrumb } from "@/app/_components/Breadcrumb";
import { ProjectPreview } from "./_components/ProjectPreview";
// import { Tetris } from '@/app/_components/Tetris';

const AuthorConfig = {
  name: "Ankush Jamdagani",
  image: "/images/projects/gameboy_tetris.jpeg",
};

const ProjectConfig = {
  id: "",
  title: "Gameboy Shell",
  description: "Some info for app info",
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
  postedDate: new Date().toDateString(),
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
  project: {
    githubLink: "",
    previewLink: "",
    previewElement: () => {
      const GameboyShell = React.lazy(() =>
        import("@/gameboy-shell").then((module) => ({
          default: module.GameboyShell,
        }))
      );

      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <GameboyShell>
            <div>Hello</div>
          </GameboyShell>
        </React.Suspense>
      );
    },
  },
};

export default function Project({ params }) {
  console.log("params", params);
  return (
    <main className="project-wrapper">
      <header className="project-header">
        <BreadCrumb
          options={[
            { path: "/", label: "Home" },
            { path: "/#projects", label: "Projects" },
            { label: ProjectConfig.title },
          ]}
        />

        <h1>{ProjectConfig.title}</h1>

        <ul className="project-meta">
          <li className="project-author">
            <Image
              src={AuthorConfig.image}
              alt={`Author Image - ${AuthorConfig.name}`}
              width="32"
              height="32"
            />
            <a href="/about">{AuthorConfig.name}</a>
          </li>

          <li className="project-date">
            <BsCalendar2Date /> <time>{ProjectConfig.postedDate}</time>
          </li>
        </ul>
      </header>

      <blockquote cite="https://www.huxley.net/bnw/four.html">
        <h3>Info;</h3>
        <p>{ProjectConfig.description}</p>
      </blockquote>

      <ProjectPreview {...ProjectConfig.project} />

      <footer className="project-footer">
        <ul className="tags-wrapper">
          {ProjectConfig.tags.map((tag) => (
            <li key={tag.id} className="tag">
              {tag.label}
            </li>
          ))}
        </ul>

        <section className="project-learnings">
          <h2>Learnings</h2>
          <ul>
            {ProjectConfig.learnings.map((post) => (
              <li key={post.id}>
                <Link href={post.link}>{post.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </footer>
    </main>
  );
}

"use client";

import React from "react";

import { BsCalendar2Date } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProjectConfig, ProjectType } from "@/configs/projects";
import { AuthorConfig } from "@/configs/author";
import { BreadCrumb } from "@/app/_components/Breadcrumb";

import { ProjectPreview } from "./_components/ProjectPreview";
import "./Project.styles.css";

export default function Project({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = React.use(params);

  const projectConfig = getProjectConfig(project as ProjectType);
  if (!projectConfig) {
    notFound();
  }

  return (
    <main className="project-wrapper">
      <header className="project-header wrap-content">
        <BreadCrumb
          options={[
            { path: "/", label: "Home" },
            { path: "/#projects", label: "Projects" },
            { label: projectConfig.title },
          ]}
        />

        <h1>{projectConfig.title}</h1>

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
            <BsCalendar2Date /> <time>{projectConfig.postedDate}</time>
          </li>
        </ul>
      </header>

      <blockquote
        className="wrap-content"
        cite="https://www.huxley.net/bnw/four.html"
      >
        <h3>Info;</h3>
        <p>{projectConfig.description}</p>
      </blockquote>

      <ProjectPreview {...projectConfig.project} />

      <footer className="project-footer wrap-content">
        <ul className="tags-wrapper">
          {projectConfig.tags.map((tag) => (
            <li key={tag.id} className="tag">
              {tag.label}
            </li>
          ))}
        </ul>

        <section className="project-learnings">
          <h2>Learnings</h2>
          <ul>
            {projectConfig.learnings.map((post) => (
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

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
    <main className="p-4">
      <header className="mx-[var(--horizontal-gap)] mb-[2em]">
        <BreadCrumb
          options={[
            { path: "/", label: "Home" },
            { path: "/#projects", label: "Projects" },
            { label: projectConfig.title },
          ]}
        />

        <h1 className="my-8 text-[3rem] font-bold">{projectConfig.title}</h1>

        <ul className="flex items-center gap-8">
          <li className="flex items-center gap-2">
            <Image
              src={AuthorConfig.image}
              alt={`Author Image - ${AuthorConfig.name}`}
              width="32"
              height="32"
              className="h-8 w-8 rounded-full"
            />
            <a href="/about" className="hover:underline">
              {AuthorConfig.name}
            </a>
          </li>

          <li className="flex items-center gap-2">
            <BsCalendar2Date /> <time>{projectConfig.postedDate}</time>
          </li>
        </ul>
      </header>

      <blockquote
        className={`mx-[var(--horizontal-gap)] relative mb-[1.4em] italic px-[3em] py-[2em] text-left text-[1.2em] before:absolute before:left-0 before:top-0 before:text-[4em] before:content-['"']`}
        cite="https://www.huxley.net/bnw/four.html"
      >
        <h3 className="mb-2 mt-4 text-[2em]">Info;</h3>
        <p>{projectConfig.description}</p>
      </blockquote>

      <ProjectPreview {...projectConfig.project} />

      <footer className="mx-[var(--horizontal-gap)]">
        <ul className="mb-8 flex gap-2">
          {projectConfig.tags.map((tag) => (
            <li
              key={tag.id}
              className="text-xs border-fg-contrast rounded-[2px] border-thin border-solid p-1 font-bold"
            >
              {tag.label}
            </li>
          ))}
        </ul>

        <section className="mb-8">
          <h2 className="mb-2 mt-4 text-[3em]">Learnings</h2>
          <ul className="mb-[2em] flex flex-wrap gap-4">
            {projectConfig.learnings.map((post) => (
              <li key={post.id} className="w-[calc((100%-32px)/3)]">
                <Link
                  href={post.link}
                  className="hover:bg-fg-contrast hover:text-canvas-contrast border-fg-contrast flex h-[200px] w-full items-start rounded-[2px] border-thin border-solid p-4 text-[1.5rem] transition-colors"
                >
                  {post.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </footer>
    </main>
  );
}

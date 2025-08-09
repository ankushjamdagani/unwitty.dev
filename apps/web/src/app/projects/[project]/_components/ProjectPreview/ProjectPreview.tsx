"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { GoArrowUpRight } from "react-icons/go";
import { MdFullscreen } from "react-icons/md";

import "./ProjectPreview.styles.css";

export function ProjectPreview({
  githubLink,
  previewElement: PreviewElement,
}: {
  githubLink: string;
  previewElement: React.ComponentType;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setFullscreen] = useState(false);

  function openFullscreen() {
    setFullscreen((isFullscreen) => !isFullscreen);
    // const elem = wrapperRef.current;

    // if (elem.requestFullscreen) {
    //   elem.requestFullscreen();
    // }
  }

  return (
    <section
      className={`project-preview ${isFullscreen ? "fullscreen" : ""}`}
      ref={wrapperRef}
    >
      <header className="project-preview-header">
        <p>Preview</p>
        <div className="preview-controls">
          <Link href={githubLink} target="_blank">
            Github <GoArrowUpRight />
          </Link>
          |
          <button onClick={openFullscreen}>
            Fullscreen <MdFullscreen />
          </button>
        </div>
      </header>
      <div className="project-preview-content">
        <PreviewElement />
      </div>
      <footer className="project-preview-footer">
        <ul>
          <li className="badge">100 FCP</li>
          <li className="badge">89 FID</li>
          <li className="badge">99 CLS</li>
        </ul>
      </footer>
    </section>
  );
}

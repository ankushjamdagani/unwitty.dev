"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { GoArrowUpRight } from "react-icons/go";
import { MdFullscreen } from "react-icons/md";

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
      className={`bg-canvas-contrast rounded border-fg-contrast mb-[2em] flex min-h-[80vh] w-full flex-col items-start overflow-auto scroll-smooth border-solid border-[length:var(--border-width-md)] ${
        isFullscreen ? "z-overlay fixed inset-0 h-screen" : "relative"
      }`}
      ref={wrapperRef}
    >
      <header className="bg-fg-contrast text-canvas-contrast text-xs z-[1] flex h-10 w-full items-center justify-between px-2 border-canvas-contrast border-b border-dashed">
        <p>Preview</p>
        <div className="flex items-center gap-4">
          <Link
            href={githubLink}
            target="_blank"
            className="flex items-center gap-1"
          >
            Github <GoArrowUpRight className="text-base" />
          </Link>
          |
          <button onClick={openFullscreen} className="flex items-center gap-1">
            Fullscreen <MdFullscreen className="text-base" />
          </button>
        </div>
      </header>
      <div className="flex h-[calc(100%-80px)] max-h-screen w-full justify-center overflow-auto">
        <PreviewElement />
      </div>
      <footer className="bg-fg-contrast text-canvas-contrast text-xs z-[1] flex h-10 w-full items-center justify-between px-2 border-canvas-contrast border-t border-dashed">
        <ul className="flex gap-2 p-2">
          <li className="badge">100 FCP</li>
          <li className="badge">89 FID</li>
          <li className="badge">99 CLS</li>
        </ul>
      </footer>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function mouseHandler(evt: MouseEvent) {
      if (!cursorRef.current) return;

      cursorRef.current.style.left = `${evt.clientX}px`;
      cursorRef.current.style.top = `${evt.clientY}px`;
      cursorRef.current.style.height = "20px";
      cursorRef.current.style.width = "20px";

      const target = evt.target;
      if (!target) return;

      const interactingTarget = (target as HTMLElement).closest("a,button");
      if (interactingTarget) {
        cursorRef.current.style.height = "80px";
        cursorRef.current.style.width = "80px";
        document.body.style.setProperty("--cursor-x", `${evt.clientX}px`);
        document.body.style.setProperty("--cursor-y", `${evt.clientY}px`);
      }
    }

    window.addEventListener("mousemove", mouseHandler);
    return () => {
      window.removeEventListener("mousemove", mouseHandler);
    };
  }, []);

  return (
    <div
      id="cursor"
      ref={cursorRef}
      className="z-overlay pointer-events-none fixed h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full backdrop-invert backdrop-grayscale transition-[width,height] duration-200"
    ></div>
  );
}

"use client";

import { useEffect, useRef } from "react";

import "./Cursor.styles.css";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Just for practicing ---
    // - remove cursor
    // - later it will be handled by `is-cursor-interactive` class in css
    document.body.style.cursor = "none";
    document
      .querySelectorAll("a, button")
      .forEach((el) => ((el as HTMLElement).style.cursor = "none"));

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

  return <div id="cursor" ref={cursorRef}></div>;
}

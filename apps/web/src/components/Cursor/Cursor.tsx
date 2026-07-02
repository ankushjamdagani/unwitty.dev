"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId: number;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function mouseHandler(evt: MouseEvent) {
      targetX = evt.clientX;
      targetY = evt.clientY;

      if (!cursorRef.current) return;

      const target = evt.target;
      if (!target) return;

      const interactingTarget = (target as HTMLElement).closest("a,button");
      if (interactingTarget) {
        cursorRef.current.style.height = "76px";
        cursorRef.current.style.width = "76px";
        document.body.style.setProperty("--cursor-x", `${evt.clientX}px`);
        document.body.style.setProperty("--cursor-y", `${evt.clientY}px`);
      } else {
        cursorRef.current.style.height = "20px";
        cursorRef.current.style.width = "20px";
      }
    }

    const animateCursor = () => {
      if (prefersReducedMotion) {
        currentX = targetX;
        currentY = targetY;
      } else {
        currentX += (targetX - currentX) * 0.16;
        currentY += (targetY - currentY) * 0.16;
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animateCursor);
    };

    window.addEventListener("mousemove", mouseHandler);
    rafId = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener("mousemove", mouseHandler);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      id="cursor"
      ref={cursorRef}
      className="z-overlay pointer-events-none fixed left-0 top-0 h-5 w-5 rounded-full backdrop-invert backdrop-grayscale transition-[width,height] duration-200"
    ></div>
  );
}

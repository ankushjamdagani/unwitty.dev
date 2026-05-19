"use client";

import { useMouse } from "@uidotdev/usehooks";

import { useEffect } from "react";

export function CursorInverted() {
  const [mouse, ref] = useMouse();

  useEffect(() => {
    ref.current = document.body;
  }, [ref]);

  return (
    <>
      <div
        id="cursor-inverted"
        className="z-overlay pointer-events-none absolute h-[100px] w-[100px] rounded-full backdrop-invert"
        style={{
          left: `${mouse.elementX - 50}px`,
          top: `${mouse.elementY - 50}px`,
        }}
      ></div>
    </>
  );
}

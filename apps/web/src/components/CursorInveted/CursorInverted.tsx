"use client";

import { useMouse } from "@uidotdev/usehooks";

import "./CursorInverted.styles.css";
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
        style={{
          left: `${mouse.elementX - 50}px`,
          top: `${mouse.elementY - 50}px`,
        }}
      ></div>
    </>
  );
}

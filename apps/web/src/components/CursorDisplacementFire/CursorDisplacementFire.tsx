"use client";

import { useMouse } from "@uidotdev/usehooks";

import "./CursorDisplacementFire.styles.css";
import { useEffect } from "react";

let baseFrequency = 0.05;

export function CursorDisplacementFire() {
  const [mouse, ref] = useMouse();

  useEffect(() => {
    ref.current = document.body;
  }, [ref]);

  baseFrequency = baseFrequency <= 0.1 ? baseFrequency + 0.001 : 0.05;

  return (
    <>
      <div
        id="cursor-displacement-fire"
        style={{
          left: `${mouse.elementX - 50}px`,
          top: `${mouse.elementY - 50}px`,
        }}
      ></div>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <filter id="displacementFilter">
          <feTurbulence
            type="turbulence"
            baseFrequency={baseFrequency}
            numOctaves="3"
            result="turbulence"
          />
          <feDisplacementMap
            in2="turbulence"
            in="SourceGraphic"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </>
  );
}

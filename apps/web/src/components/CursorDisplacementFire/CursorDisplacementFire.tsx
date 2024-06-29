"use client";

import { useMouse } from "@uidotdev/usehooks";

import "./CursorDisplacementFire.styles.css";
import { useEffect } from "react";

export function CursorDisplacementFire() {
  const [mouse, ref] = useMouse();

  useEffect(() => {
    ref.current = document.body;
  }, [ref]);

  return (
    <>
      <div
        id="cursor-displacement-fire"
        style={{
          left: `${mouse.elementX - 50}px`,
          top: `${mouse.elementY - 50}px`,
        }}
      ></div>
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter id="displacementFilter">
          <feTurbulence
            id="turbulence"
            type="turbulence"
            numOctaves="1"
            result="NOISE"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="NOISE"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <animate
            href="#turbulence"
            attributeName="baseFrequency"
            dur="10s"
            keyTimes="0;0.5;1"
            values="0.01 0.02;0.02 0.04;0.01 0.02"
            repeatCount="indefinite"
          ></animate>
        </filter>
      </svg>
    </>
  );
}

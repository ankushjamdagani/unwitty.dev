"use client";

import { useMouse } from "@uidotdev/usehooks";

import "./CursorWind.styles.css";
import { useEffect } from "react";

let baseFrequency = 0.05;

export function CursorWind() {
  const [mouse, ref] = useMouse();

  useEffect(() => {
    ref.current = document.body;
  }, [ref]);

  baseFrequency = baseFrequency <= 0.1 ? baseFrequency + 0.001 : 0.05;

  return (
    <>
      <div
        id="cursor-wind"
        style={{
          left: `${mouse.elementX - 50}px`,
          top: `${mouse.elementY - 50}px`,
        }}
      ></div>
      <svg
        width="200"
        height="200"
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          // position: "absolute",
          left: `${mouse.elementX - 50}px`,
          top: `${mouse.elementY - 50}px`,
        }}
      >
        <filter id="displacementFilter">
          <feTurbulence
            type="turbulence"
            baseFrequency={baseFrequency}
            numOctaves="2"
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
        <circle
          cx="100"
          cy="100"
          r="100"
          style={{
            filter: "url(#displacementFilter)",
          }}
          // style={{"filter: url(#displacementFilter)"}}
        />
      </svg>
    </>
  );
}

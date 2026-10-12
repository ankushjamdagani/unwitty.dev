"use client";

import { useControls } from "leva";

export function SceneNightLighthouse() {
  const { sunFeDisplacementMap, cloudsFeDisplacementMap } = useControls({
    sunFeDisplacementMap: 10,
    cloudsFeDisplacementMap: 30,
  });

  return (
    <div
      id="SceneNightLighthouse"
      className="z-below-all absolute bottom-0 left-0 right-0 top-[var(--nav-height)] opacity-75"
      style={{
        background:
          "linear-gradient(to top, transparent 50%, rgb(var(--fg-contrast) / 0.2) 100%), rgb(var(--canvas-contrast)) repeating-linear-gradient(0deg, transparent, rgb(var(--fg-contrast) / 0) 5px, rgb(var(--fg-contrast) / 0) 5px, rgb(var(--fg-contrast) / 0.1) 7px)",
      }}
    >
      <div
        id="sun"
        className="bg-fg-contrast absolute left-[100px] top-[100px] h-[100px] w-[100px] rounded-full [filter:url(#sun-decompose)]"
      ></div>
      <div
        id="clouds"
        className="absolute left-[50px] top-[150px] h-[100px] w-[200px] rounded-full [filter:url(#wavy-clouds)_invert(1)] [background:radial-gradient(rgb(var(--fg-contrast)),transparent_40%)] after:absolute after:left-[-150px] after:top-[-40px] after:h-[140px] after:w-[530px] after:rounded-full after:opacity-50 after:content-[''] after:[background:radial-gradient(rgb(var(--fg-contrast)),transparent_40%)] after:[filter:url(#wavy-clouds)_invert(1)]"
      ></div>
      <div
        id="sea"
        className="absolute bottom-0 left-[-20px] right-[var(--horizontal-gap)] h-[140px] [filter:url(#nightSea)]"
        style={{
          background:
            "linear-gradient(to top, transparent 50%, rgb(var(--fg-contrast) / 0.2) 100%), rgb(var(--canvas-contrast)) repeating-linear-gradient(0deg, transparent, rgb(var(--fg-contrast) / 0) 5px, rgb(var(--fg-contrast) / 0) 5px, rgb(var(--fg-contrast) / 0.1) 7px)",
        }}
      ></div>

      <svg className="hidden">
        <defs>
          <filter id="sun-decompose">
            <feTurbulence
              id="decompose-turbulence"
              type="turbulence"
              baseFrequency="0.05"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap
              in2="turbulence"
              in="SourceGraphic"
              scale={sunFeDisplacementMap}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <animate
              href="#decompose-turbulence"
              attributeName="baseFrequency"
              dur="10s"
              keyTimes="0;0.5;1"
              values="0.05 0.06;0.07 0.08;0.03 0.02"
              repeatCount="indefinite"
            ></animate>
          </filter>
          <filter id="wavy-clouds">
            <feTurbulence
              id="wavy-clouds-turbulence"
              type="turbulence"
              numOctaves="100"
              result="NOISE"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="NOISE"
              scale={cloudsFeDisplacementMap}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <animate
              href="#wavy-clouds-turbulence"
              attributeName="baseFrequency"
              dur="30s"
              keyTimes="0;0.5;1"
              values="0.01 0.02;0.02 0.04;0.01 0.02"
              repeatCount="indefinite"
            />
          </filter>
          <filter id="nightSea">
            <feTurbulence
              id="nightSea-turbulence"
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="3"
              result="turbulence"
            />
            <feDisplacementMap
              id="nightSea-displacement"
              in="SourceGraphic"
              in2="turbulence"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <animate
              href="#nightSea-displacement"
              attributeName="scale"
              dur="1s"
              // from="20"
              // to="30"
              values="20;30;20"
              keyTimes="0;.5;1"
              repeatCount="indefinite"
            ></animate>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

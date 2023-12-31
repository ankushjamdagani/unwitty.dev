"use client";

import { useControls } from "leva";

import "./SceneNightLighthouse.styles.css";

export function SceneNightLighthouse() {
  const { sunFeDisplacementMap, cloudsFeDisplacementMap } = useControls({
    sunFeDisplacementMap: 10,
    cloudsFeDisplacementMap: 30,
  });

  return (
    <div id="SceneNightLighthouse">
      <div id="sun"></div>
      <div id="clouds"></div>
      <div id="sea"></div>

      <svg>
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

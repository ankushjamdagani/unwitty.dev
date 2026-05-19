"use client";

import styles from "./Welcome.module.css";

const ARC_BOTTOM = "M 80 300 A 220 220 0 0 0 520 300";

type RingProps = {
  wavePath: string | null;
  waveEchoPath: string | null;
  workActive: boolean;
  lifeActive: boolean;
};

export function Ring({
  wavePath,
  waveEchoPath,
  workActive,
  lifeActive,
}: RingProps) {
  return (
    <svg
      className="absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.028"
            numOctaves={2}
            seed={3}
          />
          <feDisplacementMap in="SourceGraphic" scale={5} />
        </filter>
      </defs>

      <g
        style={{
          filter:
            "drop-shadow(var(--shadow-x, 0px) var(--shadow-y, 0px) 0 rgb(var(--fg)))",
        }}
      >
        <g filter="url(#rough)" stroke="none">
          <path
            d="M 80 300 A 220 220 0 0 1 520 300 Z"
            fill="rgb(var(--canvas))"
          />
          <path
            d="M 80 300 A 220 220 0 0 0 520 300 Z"
            fill="rgb(var(--canvas-raised))"
          />
        </g>
      </g>

      <g
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        filter="url(#rough)"
      >
        <path
          className={`${styles.topArcBold} ${workActive ? styles.on : ""}`}
          d="M 80 300 A 220 220 0 0 1 520 300"
        />
        <path
          className={`transition-opacity duration-300 ${lifeActive ? "opacity-0" : "opacity-[0.55]"}`}
          d="M 80 300 A 220 220 0 0 0 520 300"
          strokeWidth={1.3}
        />
      </g>

      <g
        className={`transition-opacity duration-[250ms] ${workActive ? "opacity-100" : "opacity-0"}`}
      >
        <DashRings />
      </g>

      <g
        className={`transition-opacity duration-[250ms] ${lifeActive ? "opacity-100" : "opacity-0"}`}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
      >
        <path
          className={`transition-opacity duration-[250ms] ${lifeActive ? "opacity-100" : "opacity-0"}`}
          strokeWidth={2.2}
          filter="url(#rough)"
          d={wavePath || ARC_BOTTOM}
        />
        <path
          className={`transition-opacity duration-[250ms] ${lifeActive ? "opacity-[0.35]" : "opacity-0"}`}
          strokeWidth={1}
          d={waveEchoPath || ARC_BOTTOM}
        />
      </g>

      <g
        stroke="currentColor"
        strokeWidth={1}
        fill="none"
        opacity={0.35}
        strokeLinecap="round"
      >
        <path d="M 102 132 L 168 188" />
        <path d="M 500 110 L 432 168" />
        <path d="M 510 460 L 444 412" />
        <path d="M 110 478 L 168 428" />
      </g>

      <g stroke="currentColor" strokeWidth={1} opacity={0.4}>
        <line x1={300} y1={74} x2={300} y2={84} />
        <line x1={300} y1={516} x2={300} y2={526} />
        <line x1={74} y1={300} x2={84} y2={300} />
        <line x1={516} y1={300} x2={526} y2={300} />
      </g>
    </svg>
  );
}

function DashRings() {
  return (
    <g
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      filter="url(#rough)"
    >
      <path
        className={styles.dashFlowCW}
        d="M 92 300 A 208 208 0 0 1 508 300"
        strokeWidth={1.1}
        strokeDasharray="6 8"
        opacity={0.5}
      />
      <path
        className={styles.dashFlowCCW}
        d="M 66 300 A 234 234 0 0 1 534 300"
        strokeWidth={1}
        strokeDasharray="5 9"
        opacity={0.45}
      />
    </g>
  );
}

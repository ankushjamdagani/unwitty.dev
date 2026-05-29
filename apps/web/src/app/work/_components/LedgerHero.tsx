"use client";

import React, { useState, useEffect } from "react";
import { RoughUnderline } from "./RoughUnderline";
import { useLedgerTheme } from "../_context/LedgerThemeContext";

const CHOSEN_TEXT = (
  <>
    I spend my days writing code, and even more time{" "}
    <RoughUnderline className="italic font-ledger-serif">
      deleting it.
    </RoughUnderline>{" "}
    Building robust software by aggressively{" "}
    <RoughUnderline className="italic font-ledger-serif">
      eliminating the unnecessary.
    </RoughUnderline>
  </>
);

const UniversalMetadata = ({ className = "" }: { className?: string }) => (
  <div
    className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-[9px] font-medium text-fg-muted uppercase tracking-[0.3em] ${className}`}
  >
    <div className="flex items-center gap-2">
      <span className="opacity-40">LOC:</span>
      <span className="text-fg-contrast font-mono">28.5N 77.2E // IN</span>
    </div>
    <div className="hidden sm:block w-px h-3 bg-ledger-outline/20" />
    <div className="flex items-center gap-2">
      <span className="opacity-40">Status:</span>
      <span className="flex items-center gap-2 text-accent font-bold font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Available_for_work
      </span>
    </div>
  </div>
);

// Container for consistent spacing and sizing matching welcome screen height limits
const HeroContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`relative h-[calc(100vh-140px)] min-h-[550px] flex items-center justify-center overflow-hidden py-12 ${className}`}
  >
    {children}
  </section>
);

export const LedgerHero = () => {
  const { theme } = useLedgerTheme();

  switch (theme) {
    case "blueprint":
    case "hybrid":
      return <BlueprintHero text={CHOSEN_TEXT} />;
    case "editorial":
      return <EditorialHero text={CHOSEN_TEXT} />;
    case "structural":
      return <StructuralHero text={CHOSEN_TEXT} />;
    default:
      return <BlueprintHero text={CHOSEN_TEXT} />;
  }
};

/* -------------------------------------------------------------------------- */
/*             1. Blueprint Hero Components                                  */
/* -------------------------------------------------------------------------- */

const CenterpieceFrame = ({
  title,
  subtitle,
  hudInfo,
  collapsed = false,
  children,
}: {
  title: string;
  subtitle: string;
  hudInfo: React.ReactNode;
  collapsed?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`relative w-full aspect-square max-w-[320px] flex items-center justify-center bg-canvas-contrast/5 select-none overflow-hidden transition-all duration-700 ease-in-out ${
        collapsed
          ? "border-0 shadow-none rounded-none"
          : "border border-ledger-outline/20 rounded-lg"
      }`}
    >
      {/* Matrix dots grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(var(--ledger-outline),0.08)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none opacity-80" />

      {/* Real-time HUD overlays */}
      <div
        className={`absolute top-3 left-4 font-mono text-[6.5px] uppercase tracking-[0.25em] text-fg-muted select-none flex flex-col gap-0.5 transition-all duration-500 ${
          collapsed
            ? "opacity-0 translate-y-[-10px] pointer-events-none"
            : "opacity-100"
        }`}
      >
        <span className="font-bold text-accent">{title}</span>
        {hudInfo}
      </div>

      <div
        className={`absolute bottom-3 right-4 font-mono text-[5.5px] tracking-widest text-fg-muted opacity-50 uppercase transition-all duration-500 ${
          collapsed
            ? "opacity-0 translate-y-[10px] pointer-events-none"
            : "opacity-100"
        }`}
      >
        {subtitle}
      </div>

      {/* Outer framing corner brackets */}
      <div
        className={`absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-ledger-outline/30 transition-all duration-500 ${
          collapsed ? "opacity-0 scale-75 pointer-events-none" : "opacity-100"
        }`}
      />
      <div
        className={`absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-ledger-outline/30 transition-all duration-500 ${
          collapsed ? "opacity-0 scale-75 pointer-events-none" : "opacity-100"
        }`}
      />
      <div
        className={`absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-ledger-outline/30 transition-all duration-500 ${
          collapsed ? "opacity-0 scale-75 pointer-events-none" : "opacity-100"
        }`}
      />
      <div
        className={`absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-ledger-outline/30 transition-all duration-500 ${
          collapsed ? "opacity-0 scale-75 pointer-events-none" : "opacity-100"
        }`}
      />

      {/* Content wrapper */}
      <div
        className={`w-full h-full flex items-center justify-center transition-all duration-500 ${
          collapsed ? "p-0" : "p-6"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const GenerativeGrid = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 150, y: 150 });
  const [isInside, setIsInside] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: Math.max(
        0,
        Math.min(300, (e.clientX - rect.left) * (300 / rect.width)),
      ),
      y: Math.max(
        0,
        Math.min(300, (e.clientY - rect.top) * (300 / rect.height)),
      ),
    });
  };

  const points = [];
  const spacing = 35;
  const startOffset = 27.5;
  let idCounter = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      points.push({
        x: startOffset + c * spacing,
        y: startOffset + r * spacing,
        id: idCounter++,
      });
    }
  }

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  };

  const activeNodes = points.filter(
    (p) => isInside && getDistance(p.x, p.y, mousePos.x, mousePos.y) < 65,
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
    >
      <CenterpieceFrame
        title="// GENERATIVE_GRID_MATRIX"
        subtitle="ALGORITHM: DISTANCE_VECTOR_NET"
        hudInfo={
          <>
            <span>TOTAL_NODES: 64 // 8x8</span>
            <span>ACTIVE_LINKS: {activeNodes.length}</span>
            <span>CELL_SPACING: 35.00px</span>
          </>
        }
      >
        <svg
          className="w-full h-full overflow-visible text-fg"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            stroke="currentColor"
            strokeWidth="0.3"
            className="text-ledger-outline/10"
          >
            {Array.from({ length: 8 }).map((_, i) => {
              const pos = startOffset + i * spacing;
              return (
                <g key={i}>
                  <line
                    x1={pos}
                    y1={startOffset}
                    x2={pos}
                    y2={300 - startOffset}
                  />
                  <line
                    x1={startOffset}
                    y1={pos}
                    x2={300 - startOffset}
                    y2={pos}
                  />
                </g>
              );
            })}
          </g>

          {isInside && (
            <g
              stroke="currentColor"
              strokeWidth="0.8"
              className="text-accent/60"
            >
              {activeNodes.map((node) => (
                <line
                  key={node.id}
                  x1={node.x}
                  y1={node.y}
                  x2={mousePos.x}
                  y2={mousePos.y}
                  className="transition-all duration-150 ease-out"
                />
              ))}
            </g>
          )}

          <g fill="currentColor">
            {points.map((p) => {
              const dist = isInside
                ? getDistance(p.x, p.y, mousePos.x, mousePos.y)
                : 999;
              const isLinked = isInside && dist < 65;
              const radius = isLinked ? 3.5 : 1.5;
              const nodeClass = isLinked
                ? "text-accent transition-all duration-200"
                : "text-ledger-outline/40 transition-all duration-200";

              return (
                <circle
                  key={p.id}
                  cx={p.x}
                  cy={p.y}
                  r={radius}
                  className={nodeClass}
                />
              );
            })}
          </g>

          {isInside && (
            <g className="transition-all duration-75 ease-out">
              <circle
                cx={mousePos.x}
                cy={mousePos.y}
                r="6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-accent"
              />
              <circle
                cx={mousePos.x}
                cy={mousePos.y}
                r="2"
                fill="currentColor"
                className="text-accent"
              />
            </g>
          )}
        </svg>
      </CenterpieceFrame>
    </div>
  );
};

const ArchitecturalProjection = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 150, y: 150 });
  const [isInside, setIsInside] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: Math.max(
        0,
        Math.min(300, (e.clientX - rect.left) * (300 / rect.width)),
      ),
      y: Math.max(
        0,
        Math.min(300, (e.clientY - rect.top) * (300 / rect.height)),
      ),
    });
  };

  const gridSize = 4;
  const cellSize = 30;

  const cellX = Math.max(
    0,
    Math.min(gridSize - 1, Math.floor((mousePos.x - 60) / 45)),
  );
  const cellY = Math.max(
    0,
    Math.min(gridSize - 1, Math.floor((mousePos.y - 120) / 30)),
  );

  const projHeight = isInside
    ? Math.max(10, Math.min(100, 120 - mousePos.y * 0.4))
    : 45;

  const getIsoCoords = (gx: number, gy: number) => {
    const startX = 150;
    const startY = 140;
    const px = startX + (gx - gy) * cellSize * 1.0;
    const py = startY + (gx + gy) * cellSize * 0.5;
    return { x: px, y: py };
  };

  const activeOrigin = getIsoCoords(cellX, cellY);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
    >
      <CenterpieceFrame
        title="// ISOMETRIC_FLOOR_PLANNER"
        subtitle="PROJECTION: AXONOMETRIC_CAD"
        hudInfo={
          <>
            <span>
              GRID_NODE: [{cellX}, {cellY}]
            </span>
            <span>PROJ_HEIGHT: {projHeight.toFixed(0)}px</span>
            <span>SPACE_GRID: 4x4_ISOMETRIC</span>
          </>
        }
      >
        <svg
          className="w-full h-full overflow-visible text-fg"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-ledger-outline/20"
          >
            {Array.from({ length: gridSize + 1 }).map((_, i) => {
              const start = getIsoCoords(i, 0);
              const end = getIsoCoords(i, gridSize);
              const start2 = getIsoCoords(0, i);
              const end2 = getIsoCoords(gridSize, i);
              return (
                <g key={i}>
                  <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} />
                  <line x1={start2.x} y1={start2.y} x2={end2.x} y2={end2.y} />
                </g>
              );
            })}
          </g>

          {isInside && (
            <polygon
              points={`
                ${activeOrigin.x},${activeOrigin.y}
                ${getIsoCoords(cellX + 1, cellY).x},${getIsoCoords(cellX + 1, cellY).y}
                ${getIsoCoords(cellX + 1, cellY + 1).x},${getIsoCoords(cellX + 1, cellY + 1).y}
                ${getIsoCoords(cellX, cellY + 1).x},${getIsoCoords(cellX, cellY + 1).y}
              `}
              fill="currentColor"
              className="text-accent/10 stroke-accent/40"
              strokeWidth="0.8"
            />
          )}

          {isInside && (
            <g className="transition-all duration-100 ease-out">
              {(() => {
                const pt1 = getIsoCoords(cellX, cellY);
                const pt2 = getIsoCoords(cellX + 1, cellY);
                const pt3 = getIsoCoords(cellX + 1, cellY + 1);
                const pt4 = getIsoCoords(cellX, cellY + 1);

                const top1 = { x: pt1.x, y: pt1.y - projHeight };
                const top2 = { x: pt2.x, y: pt2.y - projHeight };
                const top3 = { x: pt3.x, y: pt3.y - projHeight };
                const top4 = { x: pt4.x, y: pt4.y - projHeight };

                return (
                  <>
                    <polygon
                      points={`${pt1.x},${pt1.y} ${pt4.x},${pt4.y} ${top4.x},${top4.y} ${top1.x},${top1.y}`}
                      fill="rgb(var(--canvas-contrast))"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      className="text-ledger-outline/60"
                    />

                    <polygon
                      points={`${pt4.x},${pt4.y} ${pt3.x},${pt3.y} ${top3.x},${top3.y} ${top4.x},${top4.y}`}
                      fill="rgb(var(--canvas-raised))"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      className="text-ledger-outline/80"
                    />

                    <polygon
                      points={`${top1.x},${top1.y} ${top2.x},${top2.y} ${top3.x},${top3.y} ${top4.x},${top4.y}`}
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      className="text-accent/20 stroke-accent"
                    />

                    <line
                      x1={pt1.x}
                      y1={pt1.y}
                      x2={top1.x}
                      y2={top1.y}
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-ledger-outline/40 border-dashed"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1={pt2.x}
                      y1={pt2.y}
                      x2={top2.x}
                      y2={top2.y}
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-ledger-outline/40 border-dashed"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1={pt3.x}
                      y1={pt3.y}
                      x2={top3.x}
                      y2={top3.y}
                      stroke="currentColor"
                      strokeWidth="0.8"
                      className="text-ledger-outline"
                    />
                    <line
                      x1={pt4.x}
                      y1={pt4.y}
                      x2={top4.x}
                      y2={top4.y}
                      stroke="currentColor"
                      strokeWidth="0.8"
                      className="text-accent"
                    />

                    <g
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-accent/60"
                    >
                      <line
                        x1={pt3.x + 10}
                        y1={pt3.y}
                        x2={pt3.x + 15}
                        y2={pt3.y}
                      />
                      <line
                        x1={top3.x + 10}
                        y1={top3.y}
                        x2={top3.x + 15}
                        y2={top3.y}
                      />
                      <line
                        x1={pt3.x + 13}
                        y1={pt3.y}
                        x2={top3.x + 13}
                        y2={top3.y}
                      />
                    </g>
                    <text
                      x={pt3.x + 20}
                      y={pt3.y - projHeight / 2 + 2}
                      className="font-mono text-[5px] fill-accent font-bold tracking-wider"
                    >
                      H:{projHeight.toFixed(0)}px
                    </text>
                  </>
                );
              })()}
            </g>
          )}
        </svg>
      </CenterpieceFrame>
    </div>
  );
};

const TopographicWireframe = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 150, y: 150 });
  const [isInside, setIsInside] = React.useState(false);
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      setTime((t) => (t + 0.05) % (Math.PI * 2));
      requestAnimationFrame(tick);
    };
    tick();
    return () => {
      active = false;
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: Math.max(
        0,
        Math.min(300, (e.clientX - rect.left) * (300 / rect.width)),
      ),
      y: Math.max(
        0,
        Math.min(300, (e.clientY - rect.top) * (300 / rect.height)),
      ),
    });
  };

  const gridSize = 8;
  const spacing = 18;
  const startX = 150;
  const startY = 100;

  const getIsoCoords = (gx: number, gy: number, gz: number) => {
    const px = startX + (gx - gy) * spacing;
    const py = startY + (gx + gy) * spacing * 0.5 - gz;
    return { x: px, y: py };
  };

  const mGridX = (mousePos.x - startX) / spacing;
  const mGridY = (mousePos.y - startY) / (spacing * 0.5);

  const getVertexHeight = (gx: number, gy: number) => {
    if (!isInside) {
      const dist = Math.sqrt((gx - 3.5) ** 2 + (gy - 3.5) ** 2);
      return Math.sin(dist * 0.8 - time) * 12;
    }
    const dist = Math.sqrt(
      (gx - (mGridX + mGridY) / 2) ** 2 + (gy - (mGridY - mGridX) / 2) ** 2,
    );
    return Math.sin(dist * 0.8 - time * 1.5) * 16 * Math.max(0, 1 - dist / 6);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
    >
      <CenterpieceFrame
        title="// TOPOGRAPHIC_MESH_WAVE"
        subtitle="TELEMETRY: SINE_MESH_RIPPLE"
        hudInfo={
          <>
            <span>MESH_NODES: 64 // 8x8</span>
            <span>
              EPICENTER: [{mousePos.x.toFixed(0)}, {mousePos.y.toFixed(0)}]
            </span>
            <span>TERRAIN: {isInside ? "DYNAMIC_PROBE" : "RESTING_WAVE"}</span>
          </>
        }
      >
        <svg
          className="w-full h-full overflow-visible text-fg"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <g stroke="currentColor" strokeWidth="0.5" fill="none">
            {Array.from({ length: gridSize }).map((_, r) => {
              const points = Array.from({ length: gridSize }).map((_, c) => {
                const z = getVertexHeight(c, r);
                const pt = getIsoCoords(c, r, z);
                return `${pt.x},${pt.y}`;
              });
              return (
                <polyline
                  key={`r-${r}`}
                  points={points.join(" ")}
                  className="text-ledger-outline/25"
                />
              );
            })}

            {Array.from({ length: gridSize }).map((_, c) => {
              const points = Array.from({ length: gridSize }).map((_, r) => {
                const z = getVertexHeight(c, r);
                const pt = getIsoCoords(c, r, z);
                return `${pt.x},${pt.y}`;
              });
              return (
                <polyline
                  key={`c-${c}`}
                  points={points.join(" ")}
                  className="text-ledger-outline/25"
                />
              );
            })}

            {isInside && (
              <g
                stroke="currentColor"
                strokeWidth="1"
                className="text-accent/60"
              >
                {Array.from({ length: gridSize }).map((_, r) => {
                  const points = Array.from({ length: gridSize }).map(
                    (_, c) => {
                      const z = getVertexHeight(c, r);
                      const pt = getIsoCoords(c, r, z);
                      return `${pt.x},${pt.y}`;
                    },
                  );
                  return (
                    <polyline
                      key={`ar-${r}`}
                      points={points.join(" ")}
                      strokeDasharray="2 3"
                    />
                  );
                })}
              </g>
            )}
          </g>
        </svg>
      </CenterpieceFrame>
    </div>
  );
};

const OrbitalOrrery = () => {
  const [rot, setRot] = useState(0);
  useEffect(() => {
    let anim = requestAnimationFrame(function tick(t) {
      setRot(t * 0.05);
      anim = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(anim);
  }, []);

  return (
    <CenterpieceFrame
      title="// ORBITAL_ORRERY"
      subtitle="CELESTIAL: KINETIC_MODEL"
      hudInfo={
        <>
          <span>EPOCH: J2000.0</span>
          <span>PRECISION: 1.2e-9</span>
          <span>BODIES: 03_STABLE</span>
        </>
      }
    >
      <svg
        className="w-full h-full text-ledger-outline/30"
        viewBox="0 0 300 300"
      >
        <circle cx="150" cy="150" r="4" fill="var(--accent)" />
        {[60, 90, 120].map((r, i) => (
          <g
            key={r}
            style={{
              transform: `rotate(${rot * (1 / (i + 1))}deg)`,
              transformOrigin: "150px 150px",
            }}
          >
            <circle
              cx="150"
              cy="150"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              strokeDasharray="4 4"
            />
            <circle
              cx={150 + r}
              cy="150"
              r={3 + i}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <circle cx={150 + r} cy="150" r="1.5" fill="var(--accent)" />
          </g>
        ))}
      </svg>
    </CenterpieceFrame>
  );
};

/* -------------------------------------------------------------------------- */
/*             11. Blueprint Hero (Main Entry)                               */
/* -------------------------------------------------------------------------- */

const BlueprintHero = ({ text }: { text: React.ReactNode }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  type Variant = "network" | "projection" | "terrain" | "orrery";

  const [rightVariant, setRightVariant] = useState<Variant>("projection");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setMousePos({
        x: -((e.clientX - w / 2) / (w / 2)) * 25,
        y: -((e.clientY - h / 2) / (h / 2)) * 25,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      setCurrentPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.08,
        y: prev.y + (mousePos.y - prev.y) * 0.08,
      }));
      requestAnimationFrame(tick);
    };
    tick();
    return () => {
      active = false;
    };
  }, [mousePos]);

  const variants: Variant[] = ["network", "projection", "terrain", "orrery"];

  return (
    <HeroContainer className="w-full">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-ledger-outline/10 pointer-events-none select-none z-0" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full relative z-base">
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="mb-6 text-[8px] font-mono tracking-[0.5em] text-accent uppercase font-bold">
            {"// SCHEMA_01 : TECHNICAL_BLUEPRINT"}
          </div>
          <h1
            className="text-3xl md:text-5xl text-fg-contrast leading-[1.25] font-work-heading tracking-tight mb-10 transition-transform duration-300"
            style={{
              transform: `translate3d(${(currentPos.x * 0.15).toFixed(2)}px, ${(currentPos.y * 0.15).toFixed(2)}px, 0)`,
            }}
          >
            {text}
          </h1>
          <UniversalMetadata />
        </div>

        <div className="lg:col-span-5 flex flex-col items-center justify-center relative max-w-[380px] mx-auto w-full">
          <div className="w-full aspect-square flex items-center justify-center">
            <div className="w-full h-full relative flex items-center justify-center">
              {rightVariant === "network" && <GenerativeGrid />}
              {rightVariant === "projection" && <ArchitecturalProjection />}
              {rightVariant === "terrain" && <TopographicWireframe />}
              {rightVariant === "orrery" && <OrbitalOrrery />}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1 bg-canvas border border-ledger-outline/15 p-1 rounded-xl shadow-sm">
            {variants.map((v) => (
              <button
                key={v}
                onClick={() => setRightVariant(v)}
                className={`px-3 py-1 rounded-lg text-[7px] font-mono uppercase tracking-[0.1em] transition-all duration-200 font-bold ${
                  rightVariant === v
                    ? "bg-accent text-canvas scale-[1.05]"
                    : "text-fg-muted hover:text-fg-contrast hover:bg-canvas-raised"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </HeroContainer>
  );
};
/* -------------------------------------------------------------------------- */
/*             2. Editorial Hero (Typographic Serif Overlay)                 */
/* -------------------------------------------------------------------------- */

const EditorialHero = ({ text }: { text: React.ReactNode }) => {
  return (
    <HeroContainer className="w-full">
      {/* Editorial side margins */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-ledger-outline/20" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-ledger-outline/20" />

      {/* Decorative vertical background index */}
      <div className="absolute left-6 top-12 opacity-5 font-work-heading text-[8rem] font-bold italic select-none pointer-events-none">
        01
      </div>

      <div className="flex flex-col items-center justify-center max-w-4xl text-center px-4 relative z-base">
        <div className="mb-6 text-[8px] font-mono tracking-[0.4em] text-accent uppercase font-bold">
          * FOLIO_01 // EDITORIAL_CLASSIC
        </div>

        <h1 className="text-3xl md:text-5xl text-fg-contrast leading-[1.3] font-work-heading tracking-tight mb-12 max-w-3xl">
          {text}
        </h1>

        <div className="flex flex-col items-center gap-6">
          <UniversalMetadata className="justify-center" />

          {/* Double-bordered certified stamp seal */}
          <div
            className="relative flex flex-col items-center p-4 bg-canvas/40 backdrop-blur-[2px] border-2 border-double border-ledger-outline/30 rounded-lg rotate-[-2deg] select-none hover:rotate-0 transition-transform duration-500 max-w-xs"
            style={{ filter: "url(#ledger-rough)" }}
          >
            <div className="text-[7px] font-mono tracking-[0.25em] text-fg-muted uppercase mb-1">
              OFFICE OF RECORD · CERTIFIED
            </div>
            <div className="font-work-heading text-sm font-bold tracking-[0.2em] text-fg-contrast uppercase">
              ANKUSH JAMDAGANI
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[8px] font-mono tracking-widest text-accent uppercase">
              <span>★ APPROVED ★</span>
              <span className="opacity-30">·</span>
              <span>2026</span>
            </div>
          </div>
        </div>
      </div>
    </HeroContainer>
  );
};

/* -------------------------------------------------------------------------- */
/*             3. Structural Hero (Asymmetric Open Grid)                     */
/* -------------------------------------------------------------------------- */

const StructuralHero = ({ text }: { text: React.ReactNode }) => {
  return (
    <HeroContainer className="w-full !px-0">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 border border-ledger-outline/25 relative z-base bg-canvas-contrast/30">
        {/* Left Grid Block: Hero Title */}
        <div className="lg:col-span-8 p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-ledger-outline/25">
          <div className="flex items-center justify-between select-none">
            <span className="text-[9px] font-mono tracking-[0.3em] text-accent font-bold uppercase">
              SEC_001 // STRUCTURAL_GRID
            </span>
            <span className="text-[9px] font-mono tracking-[0.25em] text-fg-muted uppercase opacity-55">
              PAGE.REF / 001
            </span>
          </div>

          <div className="my-10 lg:my-0">
            <h1 className="text-3xl md:text-[2.75rem] text-fg-contrast leading-[1.25] font-work-heading tracking-tight">
              {text}
            </h1>
          </div>

          <UniversalMetadata />
        </div>

        {/* Right Grid Block: Engineering Specs Table */}
        <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-canvas-raised/40 select-none">
          <div className="font-mono text-[9px] font-bold text-fg-muted uppercase tracking-[0.35em] border-b border-ledger-outline/25 pb-2 mb-6">
            {"// SPECIFICATION_SHEET"}
          </div>

          <div className="flex-1 space-y-4 font-mono text-[10px] uppercase tracking-wider text-fg-muted">
            <div className="flex justify-between items-center py-1.5 border-b border-dashed border-ledger-outline/15">
              <span>Focus</span>
              <span className="text-fg-contrast font-bold">
                Systems & Craft
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-dashed border-ledger-outline/15">
              <span>Stack</span>
              <span className="text-fg-contrast font-bold">
                TS / React / Rust
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-dashed border-ledger-outline/15">
              <span>Timezone</span>
              <span className="text-fg-contrast font-bold">GMT +5:30</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-dashed border-ledger-outline/15">
              <span>Revision</span>
              <span className="text-fg-contrast font-bold font-mono">
                v4.0.26
              </span>
            </div>
          </div>

          {/* Graphic Grid Placeholder */}
          <div className="mt-8 border border-dashed border-ledger-outline/35 aspect-[3/1] flex items-center justify-center text-accent/50">
            <svg
              className="w-full h-full opacity-30 text-ledger-outline"
              stroke="currentColor"
              strokeWidth="0.8"
            >
              <line x1="0" y1="0" x2="100%" y2="100%" />
              <line x1="100%" y1="0" x2="0" y2="100%" />
              <circle
                cx="50%"
                cy="50%"
                r="20"
                fill="none"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </svg>
          </div>
        </div>
      </div>
    </HeroContainer>
  );
};

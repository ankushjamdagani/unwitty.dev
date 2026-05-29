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
/*             1. Blueprint Hero (Technical Drafting Canvas)                 */
/* -------------------------------------------------------------------------- */

const CenterpieceFrame = ({ 
  title, 
  subtitle, 
  hudInfo, 
  children 
}: { 
  title: string; 
  subtitle: string; 
  hudInfo: React.ReactNode; 
  children: React.ReactNode; 
}) => {
  return (
    <div className="relative w-full aspect-square max-w-[360px] flex items-center justify-center border border-ledger-outline/20 bg-canvas-contrast/5 rounded-lg select-none overflow-hidden">
      {/* Matrix dots grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(var(--ledger-outline),0.08)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none opacity-80" />

      {/* Real-time HUD overlays */}
      <div className="absolute top-3 left-4 font-mono text-[6.5px] uppercase tracking-[0.25em] text-fg-muted select-none flex flex-col gap-0.5">
        <span className="font-bold text-accent">{title}</span>
        {hudInfo}
      </div>

      <div className="absolute bottom-3 right-4 font-mono text-[5.5px] tracking-widest text-fg-muted opacity-50 uppercase">
        {subtitle}
      </div>

      {/* Outer framing corner brackets */}
      <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-ledger-outline/30" />
      <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-ledger-outline/30" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-ledger-outline/30" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-ledger-outline/30" />

      {/* Content wrapper */}
      <div className="w-full h-full flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
};

const TechnicalDrafting = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [localPos, setLocalPos] = React.useState({ x: 180, y: 180 });
  const [isInside, setIsInside] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setLocalPos({
      x: Math.max(0, Math.min(rect.width, e.clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, e.clientY - rect.top)),
    });
  };

  const scaleX = (localPos.x * (300 / 360)).toFixed(0);
  const scaleY = (localPos.y * (300 / 360)).toFixed(0);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full cursor-none relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => {
        setIsInside(false);
        setLocalPos({ x: 180, y: 180 });
      }}
    >
      <CenterpieceFrame
        title="// CAD_DRAFTING_WORKBENCH"
        subtitle="CALIBRATION: VECTOR_COORDINATE"
        hudInfo={
          <>
            <span>COORD_X: {scaleX}px</span>
            <span>COORD_Y: {scaleY}px</span>
            <span>STATUS: {isInside ? "ACTIVE_DRAFTING" : "CALIBRATED_REST"}</span>
          </>
        }
      >
        <svg
          className="w-full h-full overflow-visible text-fg"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Centered Personal Typography Stamp */}
          <g className="text-center font-mono opacity-25">
            <rect x="70" y="115" width="160" height="70" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
            <text x="150" y="138" textAnchor="middle" className="text-[7.5px] font-bold fill-fg-contrast tracking-[0.2em]">ANKUSH JAMDAGANI</text>
            <text x="150" y="150" textAnchor="middle" className="text-[6.5px] fill-accent tracking-[0.15em]">AJ // UNWITTY.DEV</text>
            <text x="150" y="162" textAnchor="middle" className="text-[5.5px] fill-fg-muted tracking-[0.25em]">PORTFOLIO_DRAFT_2026</text>
          </g>

          <circle cx="150" cy="150" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ledger-outline/25" strokeDasharray="5 5" />
          <circle cx="150" cy="150" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ledger-outline/20" />

          {localPos && (
            <g className="transition-all duration-75 ease-out">
              <line x1="0" y1={localPos.y * (300/360)} x2="300" y2={localPos.y * (300/360)} stroke="currentColor" strokeWidth="0.5" className="text-accent/30" strokeDasharray="2 2" />
              <line x1={localPos.x * (300/360)} y1="0" x2={localPos.x * (300/360)} y2="300" stroke="currentColor" strokeWidth="0.5" className="text-accent/30" strokeDasharray="2 2" />

              {isInside && (
                <g className="font-mono text-[5.5px] fill-fg-muted font-bold tracking-wider">
                  <text x={(localPos.x * (300/360)) + 6} y={(localPos.y * (300/360)) - 6}>
                    dx: {scaleX}px
                  </text>
                  <text x={(localPos.x * (300/360)) + 6} y={(localPos.y * (300/360)) + 12}>
                    dy: {scaleY}px
                  </text>
                </g>
              )}

              <circle cx={localPos.x * (300/360)} cy={localPos.y * (300/360)} r="10" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-accent" />
              <circle cx={localPos.x * (300/360)} cy={localPos.y * (300/360)} r="4" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
              <circle cx={localPos.x * (300/360)} cy={localPos.y * (300/360)} r="18" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-ledger-outline/40" strokeDasharray="1 2" />

              <line x1={localPos.x * (300/360) - 15} y1={localPos.y * (300/360)} x2={localPos.x * (300/360) + 15} y2={localPos.y * (300/360)} stroke="currentColor" strokeWidth="1" className="text-accent" />
              <line x1={localPos.x * (300/360)} y1={localPos.y * (300/360) - 15} x2={localPos.x * (300/360)} y2={localPos.y * (300/360) + 15} stroke="currentColor" strokeWidth="1" className="text-accent" />
            </g>
          )}
        </svg>
      </CenterpieceFrame>
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
      x: Math.max(0, Math.min(300, (e.clientX - rect.left) * (300 / rect.width))),
      y: Math.max(0, Math.min(300, (e.clientY - rect.top) * (300 / rect.height))),
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

  const activeNodes = points.filter(p => isInside && getDistance(p.x, p.y, mousePos.x, mousePos.y) < 65);

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
          <g stroke="currentColor" strokeWidth="0.3" className="text-ledger-outline/10">
            {Array.from({ length: 8 }).map((_, i) => {
              const pos = startOffset + i * spacing;
              return (
                <g key={i}>
                  <line x1={pos} y1={startOffset} x2={pos} y2={300 - startOffset} />
                  <line x1={startOffset} y1={pos} x2={300 - startOffset} y2={pos} />
                </g>
              );
            })}
          </g>

          {isInside && (
            <g stroke="currentColor" strokeWidth="0.8" className="text-accent/60">
              {activeNodes.map(node => (
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
            {points.map(p => {
              const dist = isInside ? getDistance(p.x, p.y, mousePos.x, mousePos.y) : 999;
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
              <circle cx={mousePos.x} cy={mousePos.y} r="6" fill="none" stroke="currentColor" strokeWidth="1" className="text-accent" />
              <circle cx={mousePos.x} cy={mousePos.y} r="2" fill="currentColor" className="text-accent" />
            </g>
          )}
        </svg>
      </CenterpieceFrame>
    </div>
  );
};

const CalibrationRadar = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 150, y: 150 });
  const [isInside, setIsInside] = React.useState(false);
  const [sweepAngle, setSweepAngle] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      setSweepAngle((a) => (a + 0.035) % (Math.PI * 2));
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
      x: Math.max(0, Math.min(300, (e.clientX - rect.left) * (300 / rect.width))),
      y: Math.max(0, Math.min(300, (e.clientY - rect.top) * (300 / rect.height))),
    });
  };

  const dx = mousePos.x - 150;
  const dy = mousePos.y - 150;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  let cursorAngle = Math.atan2(dy, dx);
  if (cursorAngle < 0) cursorAngle += Math.PI * 2;

  const angleDiff = Math.abs(sweepAngle - cursorAngle);
  const isPinged = isInside && (angleDiff < 0.25 || angleDiff > Math.PI * 2 - 0.25);

  const sweepX = 150 + Math.cos(sweepAngle) * 130;
  const sweepY = 150 + Math.sin(sweepAngle) * 130;

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
    >
      <CenterpieceFrame
        title="// CALIBRATION_SONAR"
        subtitle="SYSTEM: BEACON_SWEEP_SCAN"
        hudInfo={
          <>
            <span>SWEEP_DEG: {((sweepAngle * 180) / Math.PI).toFixed(0)}°</span>
            <span>BEACON_PING: {isPinged ? "LOCKED" : "STANDBY"}</span>
            <span>TARGET_DIST: {isInside ? `${distance.toFixed(0)}m` : "---"}</span>
          </>
        }
      >
        <svg
          className="w-[82%] h-[82%] overflow-visible text-fg"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle cx="150" cy="150" r="130" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-ledger-outline/25" />
          <circle cx="150" cy="150" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ledger-outline/20" strokeDasharray="3 3" />
          <circle cx="150" cy="150" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ledger-outline/20" />
          <circle cx="150" cy="150" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ledger-outline/20" strokeDasharray="3 3" />
          <circle cx="150" cy="150" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ledger-outline/35" />

          <g stroke="currentColor" strokeWidth="0.4" className="text-ledger-outline/20">
            <line x1="20" y1="150" x2="280" y2="150" />
            <line x1="150" y1="20" x2="150" y2="280" />
            <line x1="58" y1="58" x2="242" y2="242" strokeDasharray="2 2" />
            <line x1="242" y1="58" x2="58" y2="242" strokeDasharray="2 2" />
          </g>

          <line 
            x1="150" 
            y1="150" 
            x2={sweepX} 
            y2={sweepY} 
            stroke="currentColor" 
            strokeWidth="1.2" 
            className="text-accent/80" 
          />

          <path
            d={`M 150,150 L ${sweepX},${sweepY} A 130,130 0 0,0 ${150 + Math.cos(sweepAngle - 0.4) * 130},${150 + Math.sin(sweepAngle - 0.4) * 130} Z`}
            fill="currentColor"
            className="text-accent/5 opacity-[0.12]"
          />

          {isInside && (
            <g className="transition-all duration-75 ease-out">
              <circle 
                cx={mousePos.x} 
                cy={mousePos.y} 
                r={isPinged ? 14 : 8} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={isPinged ? 1.5 : 0.8}
                className={isPinged ? "text-accent animate-pulse" : "text-ledger-outline/50"} 
              />
              <circle cx={mousePos.x} cy={mousePos.y} r="2" fill="currentColor" className={isPinged ? "text-accent" : "text-ledger-outline/60"} />

              {isPinged && (
                <g stroke="currentColor" strokeWidth="0.5" className="text-accent">
                  <line x1={mousePos.x - 12} y1={mousePos.y - 12} x2={mousePos.x - 6} y2={mousePos.y - 12} />
                  <line x1={mousePos.x - 12} y1={mousePos.y - 12} x2={mousePos.x - 12} y2={mousePos.y - 6} />
                  <line x1={mousePos.x + 12} y1={mousePos.y - 12} x2={mousePos.x + 6} y2={mousePos.y - 12} />
                  <line x1={mousePos.x + 12} y1={mousePos.y - 12} x2={mousePos.x + 12} y2={mousePos.y - 6} />
                  <line x1={mousePos.x - 12} y1={mousePos.y + 12} x2={mousePos.x - 6} y2={mousePos.y + 12} />
                  <line x1={mousePos.x - 12} y1={mousePos.y + 12} x2={mousePos.x - 12} y2={mousePos.y + 6} />
                  <line x1={mousePos.x + 12} y1={mousePos.y + 12} x2={mousePos.x + 6} y2={mousePos.y + 12} />
                  <line x1={mousePos.x + 12} y1={mousePos.y + 12} x2={mousePos.x + 12} y2={mousePos.y + 6} />
                </g>
              )}
            </g>
          )}
        </svg>
      </CenterpieceFrame>
    </div>
  );
};

const LogicSchematicCircuit = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 150, y: 150 });
  const [isInside, setIsInside] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: Math.max(0, Math.min(300, (e.clientX - rect.left) * (300 / rect.width))),
      y: Math.max(0, Math.min(300, (e.clientY - rect.top) * (300 / rect.height))),
    });
  };

  const nodes = [
    { id: 1, x: 50, y: 50, label: "IN_A" },
    { id: 2, x: 50, y: 150, label: "IN_B" },
    { id: 3, x: 50, y: 250, label: "CLK" },
    { id: 4, x: 130, y: 90, label: "GATE_AND" },
    { id: 5, x: 130, y: 210, label: "GATE_OR" },
    { id: 6, x: 200, y: 150, label: "LATCH" },
    { id: 7, x: 250, y: 90, label: "OUT_Q" },
    { id: 8, x: 250, y: 210, label: "OUT_N" }
  ];

  const paths = [
    { from: 1, to: 4 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 5 },
    { from: 4, to: 6 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 6, to: 8 }
  ];

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  };

  const nearestNode = isInside 
    ? nodes.reduce((nearest, node) => {
        const d = getDistance(node.x, node.y, mousePos.x, mousePos.y);
        return d < nearest.d ? { node, d } : nearest;
      }, { node: nodes[0], d: 999 })
    : null;

  const activeNodeId = nearestNode && nearestNode.d < 50 && nearestNode.node ? nearestNode.node.id : null;

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
    >
      <CenterpieceFrame
        title="// SCHEMATIC_LOGIC_PROBE"
        subtitle="HARDWARE: COMPONENT_FLOW_NET"
        hudInfo={
          <>
            <span>ACTIVE_NODE: {activeNodeId ? nodes[activeNodeId - 1]?.label : "STANDBY"}</span>
            <span>VOLT_GAIN: {activeNodeId ? "+5.00 V" : "+0.12 V"}</span>
            <span>SIGNAL_BUS: {activeNodeId ? "BUS_LOCKED" : "NO_PROBE"}</span>
          </>
        }
      >
        <svg
          className="w-full h-full overflow-visible text-fg"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <g stroke="currentColor" strokeWidth="0.8" className="text-ledger-outline/20">
            {paths.map((p, idx) => {
              const nFrom = nodes[p.from - 1];
              const nTo = nodes[p.to - 1];
              if (!nFrom || !nTo) return null;
              return (
                <line 
                  key={idx} 
                  x1={nFrom.x} 
                  y1={nFrom.y} 
                  x2={nTo.x} 
                  y2={nTo.y} 
                />
              );
            })}
          </g>

          {activeNodeId && (
            <g stroke="currentColor" strokeWidth="1.6" className="text-accent">
              {paths
                .filter(p => p.from === activeNodeId || p.to === activeNodeId)
                .map((p, idx) => {
                  const nFrom = nodes[p.from - 1];
                  const nTo = nodes[p.to - 1];
                  if (!nFrom || !nTo) return null;
                  return (
                    <line 
                      key={idx} 
                      x1={nFrom.x} 
                      y1={nFrom.y} 
                      x2={nTo.x} 
                      y2={nTo.y} 
                      className="animate-pulse" 
                    />
                  );
                })}
            </g>
          )}

          <g stroke="currentColor" strokeWidth="0.8" fill="rgb(var(--canvas))" className="text-ledger-outline/40">
            {nodes.map(n => {
              const isGate = n.label.startsWith("GATE");
              const isLatch = n.label === "LATCH";
              const isActive = activeNodeId === n.id;
              const boxClass = isActive 
                ? "text-accent stroke-accent" 
                : "text-ledger-outline/45";

              if (isGate) {
                return (
                  <rect 
                    key={n.id} 
                    x={n.x - 20} 
                    y={n.y - 12} 
                    width="40" 
                    height="24" 
                    rx="2" 
                    className={boxClass} 
                  />
                );
              }
              if (isLatch) {
                return (
                  <polygon 
                    key={n.id} 
                    points={`${n.x - 18},${n.y - 16} ${n.x + 18},${n.y - 16} ${n.x + 12},${n.y + 16} ${n.x - 12},${n.y + 16}`}
                    className={boxClass}
                  />
                );
              }
              return (
                <circle 
                  key={n.id} 
                  cx={n.x} 
                  cy={n.y} 
                  r="6" 
                  className={boxClass} 
                />
              );
            })}
          </g>

          <g className="font-mono text-[5.5px] fill-fg-muted font-bold tracking-widest select-none">
            {nodes.map(n => {
              const isActive = activeNodeId === n.id;
              const textClass = isActive ? "fill-fg-contrast" : "fill-fg-muted/65";
              return (
                <text 
                  key={n.id} 
                  x={n.x} 
                  y={n.y + 2} 
                  textAnchor="middle" 
                  className={textClass}
                >
                  {n.label}
                </text>
              );
            })}
          </g>

          {isInside && (
            <g className="transition-all duration-75 ease-out">
              <circle cx={mousePos.x} cy={mousePos.y} r="5" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-accent" />
              <line x1={mousePos.x - 8} y1={mousePos.y} x2={mousePos.x + 8} y2={mousePos.y} stroke="currentColor" strokeWidth="0.8" className="text-accent" />
              <line x1={mousePos.x} y1={mousePos.y - 8} x2={mousePos.x} y2={mousePos.y + 8} stroke="currentColor" strokeWidth="0.8" className="text-accent" />
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
      x: Math.max(0, Math.min(300, (e.clientX - rect.left) * (300 / rect.width))),
      y: Math.max(0, Math.min(300, (e.clientY - rect.top) * (300 / rect.height))),
    });
  };

  const gridSize = 4;
  const cellSize = 30;
  
  const cellX = Math.max(0, Math.min(gridSize - 1, Math.floor((mousePos.x - 60) / 45)));
  const cellY = Math.max(0, Math.min(gridSize - 1, Math.floor((mousePos.y - 120) / 30)));
  
  const projHeight = isInside ? Math.max(10, Math.min(100, 120 - mousePos.y * 0.4)) : 45;

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
            <span>GRID_NODE: [{cellX}, {cellY}]</span>
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
          <g stroke="currentColor" strokeWidth="0.5" className="text-ledger-outline/20">
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

                    <line x1={pt1.x} y1={pt1.y} x2={top1.x} y2={top1.y} stroke="currentColor" strokeWidth="0.5" className="text-ledger-outline/40 border-dashed" strokeDasharray="2 2" />
                    <line x1={pt2.x} y1={pt2.y} x2={top2.x} y2={top2.y} stroke="currentColor" strokeWidth="0.5" className="text-ledger-outline/40 border-dashed" strokeDasharray="2 2" />
                    <line x1={pt3.x} y1={pt3.y} x2={top3.x} y2={top3.y} stroke="currentColor" strokeWidth="0.8" className="text-ledger-outline" />
                    <line x1={pt4.x} y1={pt4.y} x2={top4.x} y2={top4.y} stroke="currentColor" strokeWidth="0.8" className="text-accent" />

                    <g stroke="currentColor" strokeWidth="0.5" className="text-accent/60">
                      <line x1={pt3.x + 10} y1={pt3.y} x2={pt3.x + 15} y2={pt3.y} />
                      <line x1={top3.x + 10} y1={top3.y} x2={top3.x + 15} y2={top3.y} />
                      <line x1={pt3.x + 13} y1={pt3.y} x2={top3.x + 13} y2={top3.y} />
                    </g>
                    <text x={pt3.x + 20} y={pt3.y - projHeight/2 + 2} className="font-mono text-[5px] fill-accent font-bold tracking-wider">
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

const IsometricCity = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 150, y: 150 });
  const [isInside, setIsInside] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: Math.max(0, Math.min(300, (e.clientX - rect.left) * (300 / rect.width))),
      y: Math.max(0, Math.min(300, (e.clientY - rect.top) * (300 / rect.height))),
    });
  };

  const gridSize = 4;
  const spacing = 28;
  const startX = 150;
  const startY = 110;

  const getIsoCoords = (gx: number, gy: number) => {
    return {
      x: startX + (gx - gy) * spacing,
      y: startY + (gx + gy) * spacing * 0.5
    };
  };

  const mCellX = Math.max(0, Math.min(gridSize - 1, Math.floor((mousePos.x - 70) / 40)));
  const mCellY = Math.max(0, Math.min(gridSize - 1, Math.floor((mousePos.y - 90) / 25)));

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
    >
      <CenterpieceFrame
        title="// ISOMETRIC_SKYLINE_PLANNER"
        subtitle="GRID: DYNAMIC_PROXIMITY_RIPPLE"
        hudInfo={
          <>
            <span>FOCUS_NODE: [{mCellX}, {mCellY}]</span>
            <span>SKYLINE_CELLS: 16 // 4x4</span>
            <span>RIPPLE_STATE: {isInside ? "PROXIMITY_WAVE" : "STABLE_PLANE"}</span>
          </>
        }
      >
        <svg
          className="w-full h-full overflow-visible text-fg"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          {Array.from({ length: gridSize }).map((_, r) => {
            return Array.from({ length: gridSize }).map((_, c) => {
              const origin = getIsoCoords(c, r);
              
              const dx = c - mCellX;
              const dy = r - mCellY;
              const cellDist = Math.sqrt(dx * dx + dy * dy);
              const height = isInside 
                ? Math.max(10, 75 - cellDist * 20) 
                : 25;

              const pt1 = origin;
              const pt2 = { x: origin.x + spacing, y: origin.y + spacing * 0.5 };
              const pt3 = { x: origin.x, y: origin.y + spacing };
              const pt4 = { x: origin.x - spacing, y: origin.y + spacing * 0.5 };

              const top1 = { x: pt1.x, y: pt1.y - height };
              const top2 = { x: pt2.x, y: pt2.y - height };
              const top3 = { x: pt3.x, y: pt3.y - height };
              const top4 = { x: pt4.x, y: pt4.y - height };

              const isActive = isInside && c === mCellX && r === mCellY;
              const topColor = isActive ? "text-accent/35 stroke-accent" : "text-accent/10 stroke-accent/40";

              return (
                <g key={`${r}-${c}`} className="transition-all duration-100 ease-out">
                  <polygon 
                    points={`${pt4.x},${pt4.y} ${pt3.x},${pt3.y} ${top3.x},${top3.y} ${top4.x},${top4.y}`}
                    fill="rgb(var(--canvas-contrast))"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-ledger-outline/50"
                  />
                  <polygon 
                    points={`${pt3.x},${pt3.y} ${pt2.x},${pt2.y} ${top2.x},${top2.y} ${top3.x},${top3.y}`}
                    fill="rgb(var(--canvas-raised))"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-ledger-outline/70"
                  />
                  <polygon 
                    points={`${top1.x},${top1.y} ${top2.x},${top2.y} ${top3.x},${top3.y} ${top4.x},${top4.y}`}
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.6"
                    className={topColor}
                  />
                </g>
              );
            });
          })}
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
      x: Math.max(0, Math.min(300, (e.clientX - rect.left) * (300 / rect.width))),
      y: Math.max(0, Math.min(300, (e.clientY - rect.top) * (300 / rect.height))),
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
    const dist = Math.sqrt((gx - (mGridX + mGridY)/2) ** 2 + (gy - (mGridY - mGridX)/2) ** 2);
    return Math.sin(dist * 0.8 - time * 1.5) * 16 * Math.max(0, 1 - dist/6);
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
            <span>EPICENTER: [{mousePos.x.toFixed(0)}, {mousePos.y.toFixed(0)}]</span>
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
              <g stroke="currentColor" strokeWidth="1" className="text-accent/60">
                {Array.from({ length: gridSize }).map((_, r) => {
                  const points = Array.from({ length: gridSize }).map((_, c) => {
                    const z = getVertexHeight(c, r);
                    const pt = getIsoCoords(c, r, z);
                    return `${pt.x},${pt.y}`;
                  });
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

const AscendingSpiralStaircase = ({ currentPos }: { currentPos: { x: number; y: number } }) => {
  const stepsCount = 10;
  const stepGap = 16 + (currentPos.y + 25) * 0.3;
  const baseRotation = (currentPos.x * 1.5);

  return (
    <CenterpieceFrame
      title="// SPIRAL_STAIRCASE_HELIX"
      subtitle="CALIBRATION: AXIAL_RECURSION"
      hudInfo={
        <>
          <span>STEP_GAP_Z: {stepGap.toFixed(1)}px</span>
          <span>HELIX_ANGLE: {baseRotation.toFixed(1)}°</span>
          <span>STEPS_COUNT: 10_UNITS</span>
        </>
      }
    >
      <svg
        className="w-full h-full overflow-visible text-fg"
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <line x1="150" y1="40" x2="150" y2="260" stroke="currentColor" strokeWidth="1.5" className="text-ledger-outline/40" />

        {Array.from({ length: stepsCount }).map((_, i) => {
          const stepIndex = i;
          const y = 240 - stepIndex * stepGap;
          const angleRad = ((stepIndex * 36 + baseRotation) * Math.PI) / 180;
          
          const endX = 150 + Math.cos(angleRad) * 75;
          const endY = y + Math.sin(angleRad) * 35;

          const stepThickness = 5;
          const isActive = i === 5;
          const stepColor = isActive ? "text-accent stroke-accent" : "text-ledger-outline stroke-ledger-outline/60";
          const fillColor = isActive ? "fill-accent/15" : "fill-canvas/80";

          return (
            <g key={i} className="transition-all duration-300 ease-out">
              <polygon
                points={`
                  150,${y} 
                  ${endX},${endY} 
                  ${endX},${endY + stepThickness} 
                  150,${y + stepThickness}
                `}
                stroke="currentColor"
                strokeWidth="0.8"
                className={`${stepColor} ${fillColor}`}
              />
              <circle cx={endX} cy={endY} r="2.5" fill="currentColor" className={isActive ? "text-accent" : "text-accent/40"} />
            </g>
          );
        })}
      </svg>
    </CenterpieceFrame>
  );
};

const GeodesicDomeSlicer = ({ currentPos }: { currentPos: { x: number; y: number } }) => {
  const sliceY = 150 + currentPos.y * 1.6;
  const radius = 90;

  const dy = Math.abs(sliceY - 150);
  const sliceRadius = dy < radius ? Math.sqrt(radius * radius - dy * dy) : 0;

  return (
    <CenterpieceFrame
      title="// GEODESIC_DOME_SLICER"
      subtitle="SYSTEM: PLANISPHERIC_CROSS_SEC"
      hudInfo={
        <>
          <span>SLICE_DEPTH_Z: {(150 - sliceY).toFixed(0)}m</span>
          <span>SLICE_RADIUS: {sliceRadius.toFixed(1)}px</span>
          <span>DOME_RAD: 90.00px</span>
        </>
      }
    >
      <svg
        className="w-full h-full overflow-visible text-fg"
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="150" cy="150" r={radius} fill="none" stroke="currentColor" strokeWidth="0.6" className="text-ledger-outline/25" />
        <ellipse cx="150" cy="150" rx={radius * 0.8} ry={radius} fill="none" stroke="currentColor" strokeWidth="0.4" className="text-ledger-outline/15" />
        <ellipse cx="150" cy="150" rx={radius * 0.4} ry={radius} fill="none" stroke="currentColor" strokeWidth="0.4" className="text-ledger-outline/15" />
        <ellipse cx="150" cy="150" rx={radius} ry={radius * 0.5} fill="none" stroke="currentColor" strokeWidth="0.4" className="text-ledger-outline/15" />

        <g stroke="currentColor" strokeWidth="0.3" className="text-ledger-outline/20" fill="none">
          <path d={`M ${150 - Math.sqrt(radius*radius - 50*50)} 100 A ${radius} ${radius * 0.3} 0 0 0 ${150 + Math.sqrt(radius*radius - 50*50)} 100`} />
          <path d={`M ${150 - Math.sqrt(radius*radius - 50*50)} 200 A ${radius} ${radius * 0.3} 0 0 0 ${150 + Math.sqrt(radius*radius - 50*50)} 200`} />
        </g>

        <line x1="20" y1={sliceY} x2="280" y2={sliceY} stroke="currentColor" strokeWidth="0.8" className="text-accent" strokeDasharray="3 3" />

        {sliceRadius > 0 && (
          <g className="transition-all duration-75 ease-out">
            <ellipse 
              cx="150" 
              cy={sliceY} 
              rx={sliceRadius} 
              ry={sliceRadius * 0.35} 
              fill="currentColor" 
              className="text-accent/15 stroke-accent" 
              strokeWidth="1.4"
            />
            <line x1="150" y1={sliceY} x2={150 + sliceRadius} y2={sliceY} stroke="currentColor" strokeWidth="0.8" className="text-accent" />
            <circle cx={150 + sliceRadius} cy={sliceY} r="2.5" fill="currentColor" className="text-accent" />
          </g>
        )}
      </svg>
    </CenterpieceFrame>
  );
};

const InterlockingCubes = ({ currentPos }: { currentPos: { x: number; y: number } }) => {
  const slideOffset = Math.max(0, Math.min(50, 15 + currentPos.x * 0.8));

  const drawIsoCube = (x: number, y: number, size: number, height: number, colorClass: string, offset = { x: 0, y: 0 }) => {
    const ox = x + offset.x;
    const oy = y + offset.y;

    const pt1 = { x: ox, y: oy };
    const pt2 = { x: ox + size, y: oy + size * 0.5 };
    const pt3 = { x: ox, y: oy + size };
    const pt4 = { x: ox - size, y: oy + size * 0.5 };

    const top1 = { x: pt1.x, y: pt1.y - height };
    const top2 = { x: pt2.x, y: pt2.y - height };
    const top3 = { x: pt3.x, y: pt3.y - height };
    const top4 = { x: pt4.x, y: pt4.y - height };

    return (
      <g stroke="currentColor" strokeWidth="0.8" className="transition-all duration-100 ease-out">
        <polygon points={`${pt4.x},${pt4.y} ${pt3.x},${pt3.y} ${top3.x},${top3.y} ${top4.x},${top4.y}`} fill="rgb(var(--canvas-contrast))" className="text-ledger-outline/50" />
        <polygon points={`${pt3.x},${pt3.y} ${pt2.x},${pt2.y} ${top2.x},${top2.y} ${top3.x},${top3.y}`} fill="rgb(var(--canvas-raised))" className="text-ledger-outline/70" />
        <polygon points={`${top1.x},${top1.y} ${top2.x},${top2.y} ${top3.x},${top3.y} ${top4.x},${top4.y}`} fill="currentColor" className={colorClass} />
      </g>
    );
  };

  return (
    <CenterpieceFrame
      title="// INTERLOCKING_BLOCKS"
      subtitle="ASSEMBLY: MODULAR_JOIN_AXIS"
      hudInfo={
        <>
          <span>ACTIVE_BLOCK: BLOCK_B03</span>
          <span>SHIFT_AXIS_X: {slideOffset.toFixed(0)}px</span>
          <span>ASSEMBLY: PARTIAL_DISENGAGE</span>
        </>
      }
    >
      <svg
        className="w-full h-full overflow-visible text-fg"
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <line x1="60" y1="210" x2="240" y2="120" stroke="currentColor" strokeWidth="0.5" className="text-ledger-outline/25" strokeDasharray="3 3" />
        
        {drawIsoCube(150, 160, 36, 36, "text-ledger-outline/10 stroke-ledger-outline/40")}
        {drawIsoCube(114, 178, 36, 36, "text-ledger-outline/10 stroke-ledger-outline/40")}
        {drawIsoCube(186, 178, 36, 36, "text-accent/20 stroke-accent", { x: slideOffset * 0.8, y: slideOffset * 0.4 })}
        {drawIsoCube(150, 124, 36, 36, "text-ledger-outline/15 stroke-ledger-outline/45")}

        {slideOffset > 10 && (
          <g stroke="currentColor" strokeWidth="0.5" className="text-accent">
            <line x1="202" y1="196" x2={202 + slideOffset * 0.8} y2={196 + slideOffset * 0.4} />
            <circle cx={202 + slideOffset * 0.8} cy={196 + slideOffset * 0.4} r="2" fill="currentColor" />
            
            <text x={202 + slideOffset * 0.4 + 10} y={196 + slideOffset * 0.2 + 10} className="font-mono text-[4.5px] fill-accent font-bold">
              GAP:{slideOffset.toFixed(0)}px
            </text>
          </g>
        )}
      </svg>
    </CenterpieceFrame>
  );
};

const BlueprintHero = ({ text }: { text: React.ReactNode }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [rightVariant, setRightVariant] = useState<"drafting" | "network" | "radar" | "circuit" | "projection" | "city" | "terrain" | "helix" | "dome" | "blocks">("projection");

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

  // Smooth lerping for cursor parallax
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

  return (
    <HeroContainer className="w-full">
      {/* Decorative center divider matching welcome screen */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-ledger-outline/10 pointer-events-none select-none z-0" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full relative z-base">
        {/* Text Section */}
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

        {/* Blueprint Centerpiece with Segmented Selector */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative max-w-[400px] mx-auto w-full">
          <div className="w-full aspect-square flex items-center justify-center">
            {rightVariant === "drafting" && <TechnicalDrafting />}
            {rightVariant === "network" && <GenerativeGrid />}
            {rightVariant === "radar" && <CalibrationRadar />}
            {rightVariant === "circuit" && <LogicSchematicCircuit />}
            {rightVariant === "projection" && <ArchitecturalProjection />}
            {rightVariant === "city" && <IsometricCity />}
            {rightVariant === "terrain" && <TopographicWireframe />}
            {rightVariant === "helix" && <AscendingSpiralStaircase currentPos={currentPos} />}
            {rightVariant === "dome" && <GeodesicDomeSlicer currentPos={currentPos} />}
            {rightVariant === "blocks" && <InterlockingCubes currentPos={currentPos} />}
          </div>

          {/* Sleek Segmented Switcher Pill */}
          <div className="flex flex-wrap items-center justify-center gap-1 bg-canvas border border-ledger-outline/25 p-0.5 rounded-full shadow-md z-[10] mt-6 max-w-sm">
            {(["drafting", "network", "radar", "circuit", "projection", "city", "terrain", "helix", "dome", "blocks"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setRightVariant(v)}
                className={`px-2.5 py-1 rounded-full text-[6.5px] font-mono uppercase tracking-[0.08em] transition-all duration-300 font-bold ${
                  rightVariant === v 
                    ? "bg-fg-contrast text-canvas shadow-sm scale-[1.03]" 
                    : "text-fg-muted hover:text-fg-contrast"
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
              <span className="text-fg-contrast font-bold">Systems & Craft</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-dashed border-ledger-outline/15">
              <span>Stack</span>
              <span className="text-fg-contrast font-bold">TS / React / Rust</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-dashed border-ledger-outline/15">
              <span>Timezone</span>
              <span className="text-fg-contrast font-bold">GMT +5:30</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-dashed border-ledger-outline/15">
              <span>Revision</span>
              <span className="text-fg-contrast font-bold font-mono">v4.0.26</span>
            </div>
          </div>

          {/* Graphic Grid Placeholder */}
          <div className="mt-8 border border-dashed border-ledger-outline/35 aspect-[3/1] flex items-center justify-center text-accent/50">
            <svg className="w-full h-full opacity-30 text-ledger-outline" stroke="currentColor" strokeWidth="0.8">
              <line x1="0" y1="0" x2="100%" y2="100%" />
              <line x1="100%" y1="0" x2="0" y2="100%" />
              <circle cx="50%" cy="50%" r="20" fill="none" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
          </div>
        </div>
      </div>
    </HeroContainer>
  );
};

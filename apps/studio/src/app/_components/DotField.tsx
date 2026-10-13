"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** "top": fades out below the hero. "center": a soft field around the middle of the section. */
  fade: "top" | "center";
};

// Literal class names so Tailwind keeps them (dynamic names would be purged).
const FADE: Record<Props["fade"], string> = {
  top: "dot-field-top",
  center: "dot-field-center",
};

const PITCH = 20; // Pin matrix pitch in pixels (crisp, dense, architectural)

type Ripple = {
  x: number;
  y: number;
  startTime: number;
};

/**
 * Tactile 3D Pin-Screen Matrix
 * Precision-machined physical pin bed with realistic spring-mass damping:
 * - Recessed socket wells in the substrate
 * - Physical pin stems, rounded caps, and ambient drop shadows
 * - Smooth multi-frequency mechanical surface waves
 * - Interactive Gaussian spring depression and wake impulse on hover
 * - Expanding tactile concentric shockwaves on click
 * - Directional lighting with top-left specular highlights
 */
export function DotField({ fade }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let isIntersecting = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse coordinates in local canvas space
    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      active: false,
    };
    let mouseTimeout: ReturnType<typeof setTimeout> | undefined;

    // Click shockwave ripples
    const ripples: Ripple[] = [];

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Pin grid state (Float32Arrays for cache locality and zero GC in 60/120fps render loop)
    let count = 0;
    let baseX = new Float32Array(0);
    let baseY = new Float32Array(0);
    let currentZ = new Float32Array(0);
    let velocityZ = new Float32Array(0);
    let phase = new Float32Array(0);
    let seedSpeed = new Float32Array(0);

    // Pre-rendered socket background layer for maximum performance
    let socketPath = new Path2D();

    function initPins(w: number, h: number) {
      const cols = Math.ceil(w / PITCH) + 2;
      const rows = Math.ceil(h / PITCH) + 2;
      count = cols * rows;

      baseX = new Float32Array(count);
      baseY = new Float32Array(count);
      currentZ = new Float32Array(count);
      velocityZ = new Float32Array(count);
      phase = new Float32Array(count);
      seedSpeed = new Float32Array(count);

      const offsetX = (w % PITCH) / 2 - PITCH;
      const offsetY = (h % PITCH) / 2 - PITCH;

      socketPath = new Path2D();

      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * PITCH + offsetX;
          const by = r * PITCH + offsetY;
          baseX[idx] = bx;
          baseY[idx] = by;
          currentZ[idx] = 0;
          velocityZ[idx] = 0;
          phase[idx] = bx * 0.014 + by * 0.016;
          seedSpeed[idx] = 1.0 + Math.random() * 0.25;

          // Socket well in substrate
          socketPath.moveTo(bx + 1.6, by);
          socketPath.arc(bx, by, 1.6, 0, Math.PI * 2);

          idx++;
        }
      }
    }

    function renderFrame(now: number) {
      if (!isIntersecting || !ctx) return;

      const t = now * 0.001;

      // Clean up old click ripples (alive for 2.2 seconds)
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r]!;
        if (now - rip.startTime > 2200) {
          ripples.splice(r, 1);
        }
      }
      const rippleCount = ripples.length;

      // Batched draw paths for 4 layers: sockets, shadows, stems, caps, highlights
      const pathShadows = new Path2D();
      const pathStems = new Path2D();
      const pathCaps = new Path2D();
      const pathHighlights = new Path2D();

      for (let i = 0; i < count; i++) {
        const bx = baseX[i]!;
        const by = baseY[i]!;
        const p = phase[i]!;
        const sp = seedSpeed[i]!;

        // 1. Multi-frequency mechanical surface wave
        const wave1 = Math.sin(t * 1.35 * sp + p) * 3.6;
        const wave2 = Math.cos(t * 0.95 - bx * 0.011 + by * 0.018) * 2.2;
        const wave3 = Math.sin(t * 0.55 + (bx - by) * 0.015) * 1.3;
        let targetZ = wave1 + wave2 + wave3;

        // 2. Interactive Gaussian depression and dynamic wake under cursor
        if (mouse.active) {
          const dx = bx - mouse.x;
          const dy = by - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 140;

          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            // Smooth Gaussian dip (depresses down into the substrate)
            const depress = Math.exp(-distSq / (2 * 48 * 48)) * -18;

            // Subtle wake impulse pushing adjacent pins in mouse movement direction
            let wake = 0;
            const mouseSpeed = Math.hypot(mouse.vx, mouse.vy);
            if (mouseSpeed > 0.4 && dist > 15) {
              const dotProduct =
                (dx * mouse.vx + dy * mouse.vy) / (dist * mouseSpeed);
              wake = dotProduct * Math.pow(1 - dist / maxDist, 2) * 5;
            }

            targetZ += depress + wake;
          }
        }

        // 3. Propagating concentric shockwaves from clicks/taps
        if (rippleCount > 0) {
          for (let r = 0; r < rippleCount; r++) {
            const rip = ripples[r]!;
            const rElapsed = (now - rip.startTime) * 0.001;
            const rDist = Math.hypot(bx - rip.x, by - rip.y);
            const waveSpeed = 260; // px/sec
            const waveFront = rElapsed * waveSpeed;
            const deltaDist = rDist - waveFront;

            if (Math.abs(deltaDist) < 60) {
              const envelope = Math.pow(
                Math.max(0, 1 - Math.abs(deltaDist) / 60),
                2,
              );
              const decay = Math.max(0, 1 - rElapsed / 2.0);
              const rippleZ =
                Math.sin(deltaDist * 0.12) * 12 * envelope * decay;
              targetZ += rippleZ;
            }
          }
        }

        // 4. Spring-mass-damper physics
        // Hooke's spring constant k=0.12, damping=0.84
        const cz = currentZ[i]!;
        const vz = velocityZ[i]!;
        const az = (targetZ - cz) * 0.12;
        const newVz = (vz + az) * 0.84;
        const newZ = cz + newVz;

        velocityZ[i] = newVz;
        currentZ[i] = newZ;

        // 5. Geometry projection (elevation shifts head upward along screen Y)
        const headX = bx;
        const headY = by - newZ * 0.9;

        // 6. Cast drop shadow (light from upper-left)
        const shadowX = bx + 2.0 + Math.max(-2, newZ) * 0.08;
        const shadowY = by + 2.6 + Math.max(-2, newZ) * 0.18;
        const shadowRadiusX = Math.max(1.5, 2.5 + Math.max(0, newZ) * 0.1);
        const shadowRadiusY = Math.max(0.9, 1.4 + Math.max(0, newZ) * 0.05);

        pathShadows.moveTo(shadowX + shadowRadiusX, shadowY);
        pathShadows.ellipse(
          shadowX,
          shadowY,
          shadowRadiusX,
          shadowRadiusY,
          0,
          0,
          Math.PI * 2,
        );

        // 7. Pin stem extrusion (visible when pin is elevated above socket)
        if (newZ > 0.8) {
          pathStems.moveTo(headX, headY);
          pathStems.lineTo(bx, by);
        }

        // 8. Tactile pin button cap
        // Cap radius breathes subtly with elevation
        const capRadius = Math.max(1.8, Math.min(2.6, 2.15 + newZ * 0.03));
        pathCaps.moveTo(headX + capRadius, headY);
        pathCaps.arc(headX, headY, capRadius, 0, Math.PI * 2);

        // 9. Directional specular catchlight on top-left of cap
        const highlightRadius = Math.max(0.5, capRadius * 0.38);
        const hlX = headX - capRadius * 0.32;
        const hlY = headY - capRadius * 0.32;
        pathHighlights.moveTo(hlX + highlightRadius, hlY);
        pathHighlights.arc(hlX, hlY, highlightRadius, 0, Math.PI * 2);
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Substrate socket wells
      ctx.fillStyle = "rgba(10, 10, 10, 0.032)";
      ctx.fill(socketPath);

      // 2. Cast drop shadows
      ctx.fillStyle = "rgba(10, 10, 10, 0.052)";
      ctx.fill(pathShadows);

      // 3. Pin cylindrical stems
      ctx.strokeStyle = "rgba(10, 10, 10, 0.048)";
      ctx.lineWidth = 0.9;
      ctx.stroke(pathStems);

      // 4. Tactile pin caps
      ctx.fillStyle = "rgba(10, 10, 10, 0.135)";
      ctx.fill(pathCaps);

      // 5. Specular top-left catchlights
      ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
      ctx.fill(pathHighlights);

      animId = requestAnimationFrame(renderFrame);
    }

    function renderStatic() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(10, 10, 10, 0.032)";
      ctx.fill(socketPath);

      const pathCaps = new Path2D();
      for (let i = 0; i < count; i++) {
        const bx = baseX[i]!;
        const by = baseY[i]!;
        pathCaps.moveTo(bx + 2.1, by);
        pathCaps.arc(bx, by, 2.1, 0, Math.PI * 2);
      }
      ctx.fillStyle = "rgba(10, 10, 10, 0.11)";
      ctx.fill(pathCaps);
    }

    function resize() {
      if (!container || !canvas || !ctx) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initPins(width, height);

      if (prefersReducedMotion) {
        renderStatic();
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      if (mouse.prevX !== -9999) {
        mouse.vx = localX - mouse.prevX;
        mouse.vy = localY - mouse.prevY;
      }
      mouse.prevX = localX;
      mouse.prevY = localY;

      mouse.x = localX;
      mouse.y = localY;
      mouse.active = true;

      if (mouseTimeout) clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouse.active = false;
        mouse.vx = 0;
        mouse.vy = 0;
      }, 2500);
    }

    function handlePointerLeave() {
      mouse.active = false;
      mouse.vx = 0;
      mouse.vy = 0;
      mouse.prevX = -9999;
      mouse.prevY = -9999;
    }

    function handlePointerDown(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      ripples.push({
        x: localX,
        y: localY,
        startTime: performance.now(),
      });
      if (ripples.length > 5) ripples.shift();
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && !prefersReducedMotion) {
          cancelAnimationFrame(animId);
          animId = requestAnimationFrame(renderFrame);
        } else {
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(container);

    resize();
    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(renderFrame);
    }

    return () => {
      cancelAnimationFrame(animId);
      if (mouseTimeout) clearTimeout(mouseTimeout);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden className={`dot-field ${FADE[fade]}`}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full pointer-events-none"
      />
    </div>
  );
}

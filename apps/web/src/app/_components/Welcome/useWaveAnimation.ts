"use client";

import { useEffect, useRef, useState } from "react";

type WavePaths = { wave: string | null; echo: string | null };

function makeWavyBottom(
  amp: number,
  waves: number,
  samples: number,
  phase: number,
): string {
  const cx = 300;
  const cy = 300;
  const r = 220;
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const angle = Math.PI + t * Math.PI;
    const env = Math.pow(Math.sin(t * Math.PI), 1.3);
    const wob = amp * env * Math.sin(t * waves * Math.PI * 2 + phase);
    const ar = r + wob;
    const x = cx + ar * Math.cos(angle);
    const y = cy - ar * Math.sin(angle);
    d += (i === 0 ? "M " : " L ") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return d;
}

export function useWaveAnimation(active: boolean): WavePaths {
  const [paths, setPaths] = useState<WavePaths>({ wave: null, echo: null });
  const stateRef = useRef({
    amp: 0,
    target: 0,
    phase: 0,
    raf: null as number | null,
  });

  useEffect(() => {
    const s = stateRef.current;
    s.target = active ? 18 : 0;
    if (s.raf !== null) return;

    const tick = () => {
      s.amp += (s.target - s.amp) * 0.12;
      s.phase += 0.045;
      const d1 = makeWavyBottom(s.amp, 5, 96, s.phase);
      const d2 = makeWavyBottom(s.amp * 0.6, 7, 96, s.phase * 1.35 + 1.4);
      setPaths({ wave: d1, echo: d2 });

      if (Math.abs(s.target - s.amp) > 0.02 || s.target > 0.001) {
        s.raf = requestAnimationFrame(tick);
      } else {
        s.raf = null;
        s.amp = 0;
        setPaths({ wave: null, echo: null });
      }
    };
    s.raf = requestAnimationFrame(tick);
  }, [active]);

  useEffect(() => {
    return () => {
      const s = stateRef.current;
      if (s.raf !== null) cancelAnimationFrame(s.raf);
    };
  }, []);

  return paths;
}

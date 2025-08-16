import type { Point, BinaryMask, MedianPCASettings } from "../types";
import { clamp, normalize, smoothOnce, rdpSimplify } from "./geometry";
import { pointsFromMask } from "./components";

/**
 * Compute median path of given points using PCA axis projection.
 * Produces simplified/smoothed central line.
 */
export function computeMedianPathPCA(
  points: ReadonlyArray<Point>,
  settings: MedianPCASettings,
  W: number,
  H: number
): { points: Point[] } {
  const N = points.length;
  if (N === 0) return { points: [] };
  let mx = 0,
    my = 0;
  for (let i = 0; i < N; i++) {
    mx += points[i].x;
    my += points[i].y;
  }
  mx /= N;
  my /= N;
  let sxx = 0,
    syy = 0,
    sxy = 0;
  for (let i = 0; i < N; i++) {
    const dx = points[i].x - mx;
    const dy = points[i].y - my;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  sxx /= N;
  syy /= N;
  sxy /= N;
  const tr = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lambda1 = 0.5 * (tr + Math.sqrt(disc));
  const evx = sxy;
  const evy = lambda1 - sxx;
  let u = normalize(
    Math.abs(evx) + Math.abs(evy) < 1e-8 ? { x: 1, y: 0 } : { x: evx, y: evy }
  );
  const v = { x: -u.y, y: u.x };
  const ts = new Array<number>(N),
    ss = new Array<number>(N);
  let tMin = Infinity,
    tMax = -Infinity;
  for (let i = 0; i < N; i++) {
    const dx = points[i].x - mx;
    const dy = points[i].y - my;
    const t = dx * u.x + dy * u.y;
    const s = dx * v.x + dy * v.y;
    ts[i] = t;
    ss[i] = s;
    if (t < tMin) tMin = t;
    if (t > tMax) tMax = t;
  }
  const B = Math.max(10, Math.min(1000, settings.bins ?? 120));
  const binW = (tMax - tMin) / B;

  function buildMedPts(minPerBin: number): Point[] {
    const arr: Point[] = [];
    for (let b = 0; b < B; b++) {
      const t0 = tMin + b * binW;
      const t1 = t0 + binW;
      let sumT = 0;
      let count = 0;
      const sVals: number[] = [];
      for (let i = 0; i < N; i++) {
        const t = ts[i];
        if (t >= t0 && t < t1) {
          sumT += t;
          count++;
          sVals.push(ss[i]);
        }
      }
      if (count >= minPerBin) {
        const tC = sumT / count;
        sVals.sort((a, b) => a - b);
        const mid = (sVals.length - 1) / 2;
        const sMed =
          sVals.length % 2 === 1
            ? sVals[mid | 0]
            : 0.5 * (sVals[mid | 0] + sVals[(mid + 1) | 0]);
        const px = mx + u.x * tC + v.x * sMed;
        const py = my + u.y * tC + v.y * sMed;
        arr.push({ x: clamp(px, 0, W - 1), y: clamp(py, 0, H - 1) });
      }
    }
    return arr;
  }

  const minPerBin = settings.minPerBin ?? 30;
  let medPts = buildMedPts(minPerBin);
  if (medPts.length < 3) {
    medPts = buildMedPts(Math.max(1, Math.floor(minPerBin / 3)));
    if (medPts.length < 3) medPts = buildMedPts(1);
  }

  let P: Point[] = medPts;
  for (let it = 0; it < (settings.smoothIter ?? 0); it++) P = smoothOnce(P);
  if ((settings.epsilon ?? 0) > 0 && P.length > 2)
    P = rdpSimplify(P, settings.epsilon!);
  return { points: P };
}

/** Compute PCA basis vectors on mask (debug helper) */
export function computePCAOnMask(mask: BinaryMask, bins: number) {
  const pts = pointsFromMask(mask);
  const N = pts.length;
  if (N === 0) return null;
  let mx = 0,
    my = 0;
  for (const p of pts) {
    mx += p.x;
    my += p.y;
  }
  mx /= N;
  my /= N;
  let sxx = 0,
    syy = 0,
    sxy = 0;
  for (const p of pts) {
    const dx = p.x - mx,
      dy = p.y - my;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  sxx /= N;
  syy /= N;
  sxy /= N;
  const tr = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lambda1 = 0.5 * (tr + Math.sqrt(disc));
  const evx = sxy,
    evy = lambda1 - sxx;
  const u = normalize(
    Math.abs(evx) + Math.abs(evy) < 1e-8 ? { x: 1, y: 0 } : { x: evx, y: evy }
  );
  const v = { x: -u.y, y: u.x };
  let tMin = Infinity,
    tMax = -Infinity;
  for (const p of pts) {
    const dx = p.x - mx,
      dy = p.y - my;
    const t = dx * u.x + dy * u.y;
    if (t < tMin) tMin = t;
    if (t > tMax) tMax = t;
  }
  return { mx, my, u, v, tMin, tMax, bins } as const;
}

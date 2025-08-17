import type { Point } from "../types";

/** Clamp number between two bounds */
export function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

/** Smooth polyline once using weighted average */
export function smoothOnce(P: ReadonlyArray<Point>): Point[] {
  if (P.length <= 2) return P.slice();

  const pFirst = P.at(0)!;
  const pLast = P.at(-1)!;

  const Q: Point[] = [pFirst];
  for (let i = 1; i < P.length - 1; i++) {
    const curr = P[i];
    const prev = P[i - 1];
    const next = P[i + 1];

    if (!prev || !curr || !next) continue;

    Q.push({
      x: (prev.x + 2 * curr.x + next.x) / 4,
      y: (prev.y + 2 * curr.y + next.y) / 4,
    });
  }

  Q.push(pLast);

  return Q;
}

/** Normalize vector to unit length */
export function normalize(v: Point): Point {
  const n = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / n, y: v.y / n };
}

/** Simplify polyline using Ramer–Douglas–Peucker algorithm */
export function rdpSimplify(pts: ReadonlyArray<Point>, eps: number): Point[] {
  const dmax = (p: Point, a: Point, b: Point): number => {
    const ABx = b.x - a.x,
      ABy = b.y - a.y;
    const len2 = ABx * ABx + ABy * ABy || 1e-9;
    let t = ((p.x - a.x) * ABx + (p.y - a.y) * ABy) / len2;
    t = Math.max(0, Math.min(1, t));
    const X = a.x + t * ABx,
      Y = a.y + t * ABy;
    return Math.hypot(p.x - X, p.y - Y);
  };
  function rdp(arr: ReadonlyArray<Point>): Point[] {
    if (arr.length <= 2) return arr.slice() as Point[];

    const pFirst = arr[0]!;
    const pLast = arr[arr.length - 1]!;

    let idx = -1;
    let maxd = -1;

    for (let i = 1; i < arr.length - 1; i++) {
      const pt = arr[i];
      if (!pt) continue;

      const d = dmax(pt, pFirst, pLast);
      if (d > maxd) {
        maxd = d;
        idx = i;
      }
    }

    if (maxd > eps) {
      const L = rdp(arr.slice(0, idx + 1));
      const R = rdp(arr.slice(idx));
      return L.slice(0, -1).concat(R);
    } else return [pFirst, pLast];
  }
  return rdp(pts);
}

/** Convert points to SVG polyline path string */
export function polylinePath(pts: ReadonlyArray<Point>): string {
  if (!pts.length) return "";

  const pFirst = pts[0]!;
  let d = `M ${pFirst.x.toFixed(2)} ${pFirst.y.toFixed(2)}`;

  for (let i = 1; i < pts.length; i++) {
    const ptI = pts[i];
    if (!ptI) continue;

    d += ` L ${ptI.x.toFixed(2)} ${ptI.y.toFixed(2)}`;
  }
  return d;
}

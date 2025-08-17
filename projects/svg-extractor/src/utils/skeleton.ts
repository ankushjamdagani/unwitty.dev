import type { BinaryMask, Skeleton, Point } from "../types";

/** Perform Zhang–Suen thinning on binary mask */
export function zhangSuenThinning(mask: BinaryMask): Skeleton {
  const { w, h } = mask;
  let data = mask.data.slice();
  let changed: boolean;
  const idx = (x: number, y: number) => y * w + x;
  const Nsum = (x: number, y: number): number => {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (dx || dy) {
          const nx = x + dx,
            ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < w && ny < h)
            n += data[idx(nx, ny)] ? 1 : 0;
        }
      }
    return n;
  };
  const Atrans = (x: number, y: number): number => {
    const p = (dx: number, dy: number) => {
      const nx = x + dx,
        ny = y + dy;
      return nx >= 0 && ny >= 0 && nx < w && ny < h ? data[idx(nx, ny)] : 0;
    };
    const p2 = p(0, -1),
      p3 = p(1, -1),
      p4 = p(1, 0),
      p5 = p(1, 1),
      p6 = p(0, 1),
      p7 = p(-1, 1),
      p8 = p(-1, 0),
      p9 = p(-1, -1);
    const seq = [p2, p3, p4, p5, p6, p7, p8, p9, p2];
    let A = 0;
    for (let i = 0; i < seq.length - 1; i++)
      if (seq[i] === 0 && seq[i + 1] === 1) A++;
    return A;
  };
  do {
    changed = false;
    const del: number[] = [];
    for (let y = 1; y < h - 1; y++)
      for (let x = 1; x < w - 1; x++) {
        if (!data[idx(x, y)]) continue;
        const N = Nsum(x, y);
        if (N < 2 || N > 6) continue;
        const A = Atrans(x, y);
        if (A !== 1) continue;
        const p2 = data[idx(x, y - 1)]!,
          p4 = data[idx(x + 1, y)]!,
          p6 = data[idx(x, y + 1)]!,
          p8 = data[idx(x - 1, y)]!;
        if (p2 * p4 * p6 !== 0) continue;
        if (p4 * p6 * p8 !== 0) continue;
        del.push(idx(x, y));
      }
    for (const i of del) data[i] = 0;
    if (del.length) changed = true;
    const del2: number[] = [];
    for (let y = 1; y < h - 1; y++)
      for (let x = 1; x < w - 1; x++) {
        if (!data[idx(x, y)]) continue;
        const N = Nsum(x, y);
        if (N < 2 || N > 6) continue;
        const A = Atrans(x, y);
        if (A !== 1) continue;
        const p2 = data[idx(x, y - 1)]!,
          p4 = data[idx(x + 1, y)]!,
          p6 = data[idx(x, y + 1)]!,
          p8 = data[idx(x - 1, y)]!;
        if (p2 * p4 * p8 !== 0) continue;
        if (p2 * p6 * p8 !== 0) continue;
        del2.push(idx(x, y));
      }
    for (const i of del2) data[i] = 0;
    if (del2.length) changed = true;
  } while (changed);
  return { w, h, data };
}

/** Find longest path across skeleton (endpoints to endpoints) */
export function longestSkeletonPath(sk: Skeleton): Point[] {
  const { w, h, data } = sk;
  const idx = (x: number, y: number) => y * w + x;
  const neighbors = (x: number, y: number): Point[] => {
    const out: Point[] = [];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx,
          ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (data[idx(nx, ny)]) out.push({ x: nx, y: ny });
      }
    return out;
  };
  const nodes: Point[] = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[idx(x, y)]) {
        const deg = neighbors(x, y).length;
        if (deg !== 2) nodes.push({ x, y });
      }
  let seed: Point | null = null;
  for (const n of nodes) {
    const deg = neighbors(n.x, n.y).length;
    if (deg === 1) {
      seed = n;
      break;
    }
  }
  if (!seed) {
    for (let y = 0; y < h && !seed; y++)
      for (let x = 0; x < w; x++)
        if (data[idx(x, y)]) {
          seed = { x, y };
          break;
        }
    if (!seed) return [];
  }
  const a = farthestFrom(seed);
  const b = farthestFrom(a.node);
  return reconstructPath(a.node, b.node);

  function farthestFrom(start: Point): { node: Point; prev: Int32Array } {
    const q: number[] = [];
    const seen = new Int8Array(w * h);
    const prev = new Int32Array(w * h);
    prev.fill(-1);
    const sidx = idx(start.x, start.y);
    q.push(sidx);
    seen[sidx] = 1;
    let last = sidx;
    while (q.length) {
      const cur = q.shift()!;
      last = cur;
      const cx = cur % w,
        cy = (cur / w) | 0;
      const nb = neighbors(cx, cy);
      for (const p of nb) {
        const id = idx(p.x, p.y);
        if (!seen[id]) {
          seen[id] = 1;
          prev[id] = cur;
          q.push(id);
        }
      }
    }
    const lx = last % w,
      ly = (last / w) | 0;
    return { node: { x: lx, y: ly }, prev };
  }
  function reconstructPath(start: Point, end: Point): Point[] {
    const q: number[] = [];
    const seen = new Int8Array(w * h);
    const prev = new Int32Array(w * h);
    prev.fill(-1);
    const sidx = idx(start.x, start.y),
      eidx = idx(end.x, end.y);
    q.push(sidx);
    seen[sidx] = 1;
    while (q.length) {
      const cur = q.shift()!;
      if (cur === eidx) break;
      const cx = cur % w,
        cy = (cur / w) | 0;
      const nb = neighbors(cx, cy);
      for (const p of nb) {
        const id = idx(p.x, p.y);
        if (!seen[id]) {
          seen[id] = 1;
          prev[id] = cur;
          q.push(id);
        }
      }
    }
    const path: Point[] = [];
    let cur = eidx;
    if (prev[cur] === -1 && cur !== sidx) {
      return path;
    }
    while (cur !== -1) {
      const cx = cur % w,
        cy = (cur / w) | 0;
      path.push({ x: cx, y: cy });
      if (cur === sidx) break;
      cur = prev[cur]!;
    }
    path.reverse();
    const step = Math.max(1, Math.floor(path.length / 800));
    const out: Point[] = [];
    for (let i = 0; i < path.length; i += step) out.push(path[i]!);
    return out;
  }
}

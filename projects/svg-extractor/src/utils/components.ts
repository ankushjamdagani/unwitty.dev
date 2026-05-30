import type { BinaryMask, ConnectedComponents } from "../types";

/** Convert mask into list of coordinates where mask==1 */
export function pointsFromMask(mask: BinaryMask) {
  const { w, h, data } = mask;
  const pts: { x: number; y: number }[] = [];
  let i = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++, i++) if (data[i]) pts.push({ x, y });
  return pts;
}

/** Create binary mask by selecting pixels belonging to given labels */
export function maskFromLabels(
  cc: ConnectedComponents,
  set: Set<number>,
): BinaryMask {
  const out = new Uint8Array(cc.w * cc.h);
  for (let i = 0; i < out.length; i++) {
    const labelItem = cc.labels[i];
    if (labelItem && set.has(labelItem)) out[i] = 1;
  }
  return { w: cc.w, h: cc.h, data: out };
}

/** Find connected components in a binary mask */
export function connectedComponents(mask: BinaryMask): ConnectedComponents {
  const { w, h, data } = mask;
  const labels = new Int32Array(w * h);
  labels.fill(0);
  const sizes: number[] = [0];
  let label = 0;
  const qx = new Int32Array(w * h),
    qy = new Int32Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!data[idx] || labels[idx]) continue;
      label++;
      let head = 0,
        tail = 0;
      labels[idx] = label;
      qx[tail] = x;
      qy[tail] = y;
      tail++;
      let area = 0;
      while (head < tail) {
        const cx = qx[head];
        const cy = qy[head];
        if (!cx || !cy) continue;

        head++;
        area++;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = cx + dx,
              ny = cy + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const nidx = ny * w + nx;
            if (data[nidx] && !labels[nidx]) {
              labels[nidx] = label;
              qx[tail] = nx;
              qy[tail] = ny;
              tail++;
            }
          }
      }
      sizes[label] = area;
    }
  return { w, h, labels, sizes };
}

import type { BinaryMask } from "./types";

export function erode(mask: BinaryMask): BinaryMask {
  const { w, h, data } = mask;
  const out = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      let ok = 1;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (data[(y + dy) * w + (x + dx)] === 0) {
            ok = 0;
            break;
          }
        }
        if (!ok) break;
      }
      out[y * w + x] = ok as 0 | 1;
    }
  return { w, h, data: out };
}

export function dilate(mask: BinaryMask): BinaryMask {
  const { w, h, data } = mask;
  const out = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      let any = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (data[(y + dy) * w + (x + dx)]) {
            any = 1;
            break;
          }
        }
        if (any) break;
      }
      out[y * w + x] = any as 0 | 1;
    }
  return { w, h, data: out };
}

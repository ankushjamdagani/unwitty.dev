// ======================= mask.ts =======================
import type { RasterData, BinaryMask, MetricColor } from "../types";
import { hexToRgbObj, rgbToLab, deltaE00, deltaE76 } from "./color";

/**
 * Build a binary mask where pixels are selected if their color is close
 * to any of the target hex colors within tolerance.
 */
export function selectColorMaskMulti(
  imgData: RasterData,
  hexList: ReadonlyArray<string>,
  tol: number,
  metric: MetricColor,
  invert: boolean,
): BinaryMask & {
  de: Float32Array;
  minDE: number;
  maxDE: number;
} {
  const w = imgData.width,
    h = imgData.height,
    data = imgData.data;
  const out = new Uint8Array(w * h);
  const de = new Float32Array(w * h);
  const labs = hexList.map((hx) =>
    rgbToLab(...(Object.values(hexToRgbObj(hx)) as [number, number, number])),
  );
  let iPix = 0;
  let minDE = Number.POSITIVE_INFINITY,
    maxDE = Number.NEGATIVE_INFINITY;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++, iPix++) {
      const i = (y * w + x) * 4;
      const r = data[i]!,
        g = data[i + 1]!,
        b = data[i + 2]!,
        a = data[i + 3]!;

      if (a <= 10) {
        de[iPix] = 0;
        out[iPix] = 0;
        continue;
      }
      let dMin = 1e9;
      const lab = rgbToLab(r, g, b);
      for (const t of labs) {
        const d = metric === "de2000" ? deltaE00(lab, t) : deltaE76(lab, t);
        if (d < dMin) dMin = d;
      }
      de[iPix] = dMin;
      if (dMin < minDE) minDE = dMin;
      if (dMin > maxDE) maxDE = dMin;
      const match = dMin <= tol;
      const keep = invert ? !match : match;
      out[iPix] = keep ? 1 : 0;
    }
  }
  return { w, h, data: out, de, minDE, maxDE };
}

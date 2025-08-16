import { describe, expect, test } from "vitest";

import {
  rgbToHex,
  hexToRgbObj,
  rgbToLab,
  deltaE00,
  deltaE76,
  clamp,
  normalize,
  smoothOnce,
  rdpSimplify,
  polylinePath,
  connectedComponents,
  maskFromLabels,
  pointsFromMask,
  erode,
  dilate,
  selectColorMaskMulti,
  computeMedianPathPCA,
  zhangSuenThinning,
  longestSkeletonPath,
  extractPathsFromFinalMask,
} from "../";

import type { RasterData } from "../../types";

function mkMask(w: number, h: number, ones: Array<[number, number]>) {
  const data = new Uint8Array(w * h);
  for (const [x, y] of ones) data[y * w + x] = 1;
  return { w, h, data } as const;
}

function horizLineMask(w: number, h: number, y: number) {
  const data = new Uint8Array(w * h);
  for (let x = 1; x < w - 1; x++) data[y * w + x] = 1; // avoid borders to simplify
  return { w, h, data } as const;
}

function blockMask(
  w: number,
  h: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  const data = new Uint8Array(w * h);
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) data[y * w + x] = 1;
  return { w, h, data } as const;
}

describe("color utils", () => {
  test("rgb<->hex roundtrip", () => {
    const hex = rgbToHex(12, 34, 56);
    expect(hex).toBe("#0c2238");
    const { r, g, b } = hexToRgbObj(hex);
    expect([r, g, b]).toEqual([12, 34, 56]);
  });

  test("deltaE zero for identical colors", () => {
    const lab = rgbToLab(255, 0, 0);
    expect(deltaE00(lab, lab)).toBe(0);
    expect(deltaE76(lab, lab)).toBe(0);
  });

  test("deltaE symmetry and magnitude", () => {
    const a = rgbToLab(255, 0, 0);
    const b = rgbToLab(0, 255, 0);
    const d1 = deltaE00(a, b);
    const d2 = deltaE00(b, a);
    expect(Math.abs(d1 - d2)).toBeLessThan(1e-7);
    expect(d1).toBeGreaterThan(50); // very different colors
  });
});

describe("geometry", () => {
  test("clamp works", () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });

  test("normalize gives unit length (or handles zero)", () => {
    const n = normalize({ x: 3, y: 4 });
    expect(Math.hypot(n.x, n.y)).toBeCloseTo(1, 6);
    const z = normalize({ x: 0, y: 0 });
    expect(z).toEqual({ x: 0, y: 0 });
  });

  test("smoothOnce preserves endpoints", () => {
    const pts = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ];
    const s = smoothOnce(pts);
    expect(s[0]).toEqual(pts[0]);
    expect(s[s.length - 1]).toEqual(pts[pts.length - 1]);
  });

  test("rdpSimplify reduces points while keeping endpoints", () => {
    const pts = [
      { x: 0, y: 0 },
      { x: 0.1, y: 0.01 },
      { x: 1, y: 0 },
    ];
    const out = rdpSimplify(pts, 0.05);
    expect(out[0]).toEqual(pts[0]);
    expect(out[out.length - 1]).toEqual(pts[pts.length - 1]);
    expect(out.length).toBeLessThanOrEqual(pts.length);
  });

  test("polylinePath outputs M/L commands", () => {
    const path = polylinePath([
      { x: 0, y: 0 },
      { x: 1, y: 2 },
    ]);
    expect(path.startsWith("M ")).toBe(true);
    expect(path.includes(" L ")).toBe(true);
  });
});

describe("connected components", () => {
  test("finds two separate blobs", () => {
    const m = mkMask(5, 3, [
      [0, 0],
      [1, 0],
      [3, 2],
      [4, 2],
    ]);
    const cc = connectedComponents(m);
    // labels start at 1; background 0, sizes[0] is placeholder
    const areas = cc.sizes.slice(1);
    expect(areas.reduce((a, b) => a + b, 0)).toBe(4);
    const mask1 = maskFromLabels(cc, new Set([1]));
    const pts1 = pointsFromMask(mask1);
    expect(pts1.length).toBeGreaterThan(0);
  });
});

describe("morphology", () => {
  test("dilate grows a single pixel", () => {
    const m = mkMask(5, 5, [[2, 2]]);
    const d = dilate(m);
    // center plus neighbors should be set
    expect(d.data[2 * 5 + 2]).toBe(1);
    expect(d.data[(2 - 1) * 5 + 2]).toBe(1);
    expect(d.data[(2 + 1) * 5 + 2]).toBe(1);
    expect(d.data[2 * 5 + (2 - 1)]).toBe(1);
    expect(d.data[2 * 5 + (2 + 1)]).toBe(1);
  });

  test("erode removes isolated pixel", () => {
    const m = mkMask(5, 5, [[2, 2]]);
    const e = erode(m);
    expect(e.data[2 * 5 + 2]).toBe(0);
  });
});

function solidRaster(
  w: number,
  h: number,
  rgba: [number, number, number, number]
): RasterData {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    data[i * 4 + 0] = rgba[0];
    data[i * 4 + 1] = rgba[1];
    data[i * 4 + 2] = rgba[2];
    data[i * 4 + 3] = rgba[3];
  }
  return { width: w, height: h, data };
}

describe("mask selection", () => {
  test("selects solid red with tight tolerance", () => {
    const raster = solidRaster(4, 4, [255, 0, 0, 255]);
    const res = selectColorMaskMulti(raster, ["#ff0000"], 2, "de2000", false);
    expect(res.data.every((v) => v === 1)).toBe(true);
  });

  test("inverts selection when invert=true", () => {
    const raster = solidRaster(2, 2, [0, 255, 0, 255]);
    const res = selectColorMaskMulti(raster, ["#00ff00"], 2, "de2000", true);
    expect(res.data.every((v) => v === 0)).toBe(true);
  });
});

function linePoints(n = 50) {
  const pts = [] as { x: number; y: number }[];
  for (let i = 0; i < n; i++) pts.push({ x: i, y: i * 0.1 });
  return pts;
}

describe("PCA median path", () => {
  test("returns non-empty simplified path", () => {
    const pts = linePoints();
    const out = computeMedianPathPCA(
      pts,
      { bins: 16, minPerBin: 3, smoothIter: 1, epsilon: 0.1 },
      100,
      100
    );
    expect(out.points.length).toBeGreaterThan(2);
  });
});

describe("skeleton", () => {
  test("thinning keeps a 1px line unchanged", () => {
    const m = horizLineMask(12, 6, 3);
    const sk = zhangSuenThinning(m);
    expect(sk.data).toEqual(m.data);
  });

  test("longest path spans the line", () => {
    const m = horizLineMask(20, 7, 3);
    const sk = zhangSuenThinning(m);
    const path = longestSkeletonPath(sk);
    expect(path.length).toBeGreaterThan(0);
    // first and last should lie on same row
    expect(new Set(path.map((p) => p.y)).size).toBe(1);
  });
});

describe("extract orchestrator", () => {
  test("returns at least one path using PCA", () => {
    const m = blockMask(20, 10, 5, 3, 14, 6);
    const { dList, pointsList } = extractPathsFromFinalMask(
      m as any,
      "pca",
      { smoothIter: 1, epsilon: 0.5 },
      m.w,
      m.h
    );
    expect(dList.length).toBeGreaterThan(0);
    expect(pointsList.length).toBeGreaterThan(0);
  });
});

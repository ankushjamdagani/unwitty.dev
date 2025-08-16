import type { RGB, XYZ, Lab } from "./types";

/** Convert RGB integers to HEX string */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Parse HEX color string into RGB object */
export function hexToRgbObj(hex: string): RGB {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return { r: 0, g: 0, b: 0 };
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Convert sRGB component to linear space */
export function srgbToLinear(c: number): number {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Convert RGB to XYZ color space */
export function rgbToXyz(r: number, g: number, b: number): XYZ {
  const R = srgbToLinear(r),
    G = srgbToLinear(g),
    B = srgbToLinear(b);
  const X = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
  const Y = R * 0.2126729 + G * 0.7151522 + B * 0.072175;
  const Z = R * 0.0193339 + G * 0.119192 + B * 0.9503041;
  return { X, Y, Z };
}

/** Convert XYZ to Lab color space */
export function xyzToLab(X: number, Y: number, Z: number): Lab {
  const Xn = 0.95047,
    Yn = 1.0,
    Zn = 1.08883;
  let x = X / Xn,
    y = Y / Yn,
    z = Z / Zn;
  const e = 216 / 24389,
    k = 24389 / 27;
  function f(t: number): number {
    return t > e ? Math.cbrt(t) : (k * t + 16) / 116;
  }
  const fx = f(x),
    fy = f(y),
    fz = f(z);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/** Convert RGB directly to Lab */
export function rgbToLab(r: number, g: number, b: number): Lab {
  const xyz = rgbToXyz(r, g, b);
  return xyzToLab(xyz.X, xyz.Y, xyz.Z);
}

/** Compute DeltaE 1976 between two Lab colors */
export function deltaE76(l1: Lab, l2: Lab): number {
  const dL = l1.L - l2.L,
    da = l1.a - l2.a,
    db = l1.b - l2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

/** Compute DeltaE 2000 between two Lab colors */
export function deltaE00(lab1: Lab, lab2: Lab): number {
  const { L: L1, a: a1, b: b1 } = lab1,
    { L: L2, a: a2, b: b2 } = lab2;
  const avgLp = (L1 + L2) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1),
    C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;
  const G =
    0.5 *
    (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
  const a1p = (1 + G) * a1,
    a2p = (1 + G) * a2;
  const C1p = Math.sqrt(a1p * a1p + b1 * b1),
    C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const avgCp = (C1p + C2p) / 2;
  const h1p = Math.atan2(b1, a1p);
  const h2p = Math.atan2(b2, a2p);
  const h1pDeg = ((h1p >= 0 ? h1p : h1p + 2 * Math.PI) * 180) / Math.PI;
  const h2pDeg = ((h2p >= 0 ? h2p : h2p + 2 * Math.PI) * 180) / Math.PI;
  let dhp = h2pDeg - h1pDeg;
  if (dhp > 180) dhp -= 360;
  if (dhp < -180) dhp += 360;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 180 / 2);
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  const avgHp =
    Math.abs(h1pDeg - h2pDeg) > 180
      ? (h1pDeg + h2pDeg + 360) / 2
      : (h1pDeg + h2pDeg) / 2;
  const T =
    1 -
    0.17 * Math.cos(((avgHp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * avgHp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * avgHp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * avgHp - 63) * Math.PI) / 180);
  const Sl =
    1 +
    (0.015 * Math.pow(avgLp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp - 50, 2));
  const Sc = 1 + 0.045 * avgCp;
  const Sh = 1 + 0.015 * avgCp * T;
  const delTheta = 30 * Math.exp(-Math.pow((avgHp - 275) / 25, 2));
  const Rc =
    2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const Rt = -Rc * Math.sin((2 * delTheta * Math.PI) / 180);
  return Math.sqrt(
    Math.pow(dLp / Sl, 2) +
      Math.pow(dCp / Sc, 2) +
      Math.pow(dHp / Sh, 2) +
      Rt * (dCp / Sc) * (dHp / Sh)
  );
}

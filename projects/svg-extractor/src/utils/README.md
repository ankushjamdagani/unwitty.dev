# Color Mask Utils

Robust TypeScript utilities for color conversion, color-difference (ΔE) metrics, binary mask creation, morphology, connected-components, skeletonization, PCA-based median path extraction, and SVG polyline generation.

## ✨ Features

- sRGB ↔ XYZ → Lab conversions, ΔE76 & ΔE00
- Multi-target color masking from image pixels (tolerance + metric)
- Erode/Dilate morphology on binary masks
- Fast 8-neighborhood connected components
- Zhang–Suen thinning (skeletonization)
- Longest skeleton path tracing
- PCA-based median path extraction from point clouds
- Polyline smoothing & RDP simplification → SVG path output
- DOM-agnostic types (works in browser & Node/canvas)

## Folder Structure

```
color-mask-utils/
├─ types.ts           # Shared types/interfaces
├─ color.ts           # Color conversions & ΔE metrics
├─ mask.ts            # Color-based mask selection
├─ morphology.ts      # Erode/Dilate
├─ components.ts      # CC labeling + helpers
├─ skeleton.ts        # Zhang–Suen + longest-path
├─ geometry.ts        # Math helpers & polyline utils
├─ pca.ts             # PCA median path & debug
├─ extract.ts         # Orchestration (skeleton/PCA)
└─ index.ts           # Barrel exports
```

## Quick Start

Mask pixels near a given color and trace a path via PCA:

```ts
import {
  selectColorMaskMulti,
  connectedComponents,
  maskFromLabels,
  pointsFromMask,
  computeMedianPathPCA,
  polylinePath,
  type RasterData,
} from "./color-mask-utils";

// 1) Prepare raster (browser: ImageData; Node: your own)
const raster: RasterData = { width, height, data: rgbaClampedArray };

// 2) Build mask for one or more target colors (HEX)
const {
  w,
  h,
  data: maskData,
} = selectColorMaskMulti(
  raster,
  ["#ff0000", "#00ff00"], // targets
  12, // tolerance in ΔE units
  "de2000", // metric: "de2000" | "de1976"
  false // invert selection
);

// 3) Extract a central path with PCA
const cc = connectedComponents({ w, h, data: maskData });
const label = cc.sizes.findIndex(
  (s, i) => i > 0 && s === Math.max(...cc.sizes)
);
const single = maskFromLabels(cc, new Set([label]));
const pts = pointsFromMask(single);
const { points } = computeMedianPathPCA(
  pts,
  { bins: 120, minPerBin: 30, smoothIter: 2, epsilon: 1.5 },
  w,
  h
);
const d = polylinePath(points); // SVG path string (M/L only)
```

Trace via **skeleton** instead:

```ts
import { extractPathsFromFinalMask } from "./color-mask-utils";
const { dList } = extractPathsFromFinalMask(
  { w, h, data: maskData },
  "skeleton",
  { smoothIter: 1, epsilon: 1.0 },
  w,
  h
);
```

## API Overview

### `color.ts`

- `rgbToHex(r,g,b)` → `#rrggbb`
- `hexToRgbObj(hex)` → `{ r,g,b }`
- `srgbToLinear(c)` → linearized channel
- `rgbToXyz(...)`, `xyzToLab(...)`, `rgbToLab(...)`
- `deltaE76(lab1, lab2)` / `deltaE00(lab1, lab2)`

### `mask.ts`

- `selectColorMaskMulti(raster, hexList, tol, metric, invert)` → `{ w, h, data, de, minDE, maxDE }`

### `morphology.ts`

- `erode(mask)` / `dilate(mask)` → new masks

### `components.ts`

- `connectedComponents(mask)` → `{ labels, sizes }`
- `maskFromLabels(cc, set)` → binary mask of chosen labels
- `pointsFromMask(mask)` → `{x,y}[]`

### `skeleton.ts`

- `zhangSuenThinning(mask)` → skeleton mask
- `longestSkeletonPath(sk)` → ordered points along longest path

### `geometry.ts`

- `clamp(v,a,b)`
- `smoothOnce(points)`
- `normalize(v)`
- `rdpSimplify(points, eps)`
- `polylinePath(points)` → SVG `d` string (M/L only)

### `pca.ts`

- `computeMedianPathPCA(points, settings, W, H)` → `{ points }`
- `computePCAOnMask(mask, bins)` → PCA basis + extents (debug)

### `extract.ts`

- `extractPathsFromFinalMask(mask, method, settings, W, H)` → `{ dList, pointsList, skeletonForDebug }`

## Types

- `RasterData` — `{ width, height, data: Uint8ClampedArray }`
- `BinaryMask` — `{ w, h, data: Uint8Array }` (0/1)
- `Metric` — `"de2000" | "de1976"`

## Notes & Tips

- ΔE tolerance is domain-specific: start around 8–15 for DE2000 and tune.
- Pre-blur images if your targets are noisy to stabilize masks.
- For long polylines, set `epsilon` ≈ 0.5–2.0 to simplify without losing shape.
- Skeleton mode works best when foreground thickness is \~3–8 px after morphology.

## License

MIT (adjust as needed).

// Added JSDoc comments across all modules
// ======================= types.ts =======================
/** Basic RGB triplet */
export type RGB = { r: number; g: number; b: number };
/** CIE XYZ color space */
export type XYZ = { X: number; Y: number; Z: number };
/** CIE Lab color space */
export type Lab = { L: number; a: number; b: number };
/** 2D point */
export type Point = { x: number; y: number };
/** Polyline made of points */
export type Polyline = ReadonlyArray<Point>;
/** Supported color difference metrics */

export enum MetricColor {
  // p1 = "de76",
  p1 = "de1976",
  p2 = "de2000",
}

export enum ComponentType {
  all = "all",
  largest = "largest",
  manual = "manual",
}

export enum Stats {
  canvas = "canvas",
  pixels = "pixels",
  selected = "selected",
  components = "components",
  segments = "segments",
  targets = "targets",
}

export type MaskBitmap = { w: number; h: number; data: Uint8Array } | null;

export type DEMatrix = {
  w: number;
  h: number;
  de: Float32Array;
  min: number;
  max: number;
} | null;

export type CCResult = {
  w: number;
  h: number;
  labels: Int32Array;
  sizes: number[];
} | null;

export type SkelBitmap = { w: number; h: number; data: Uint8Array } | null;

/** Minimal image-like structure */
export type RasterData = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};
/** Binary mask, each pixel is 0 or 1 */
export interface BinaryMask {
  w: number;
  h: number;
  data: Uint8Array;
}
/** Connected components labelling output */
export interface ConnectedComponents {
  w: number;
  h: number;
  labels: Int32Array;
  sizes: number[];
}
/** Skeleton image as binary mask */
export interface Skeleton extends BinaryMask {}
/** Settings for PCA-based median path extraction */
export interface MedianPCASettings {
  bins?: number;
  minPerBin?: number;
  smoothIter?: number;
  epsilon?: number;
  curved?: boolean;
}
/** Path extraction settings */
export interface ExtractSettings {
  smoothIter: number;
  epsilon: number;
}

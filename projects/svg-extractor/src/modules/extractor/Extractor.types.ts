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

export enum ComponentType {
  all,
  largest,
  manual,
}

export enum MetricColor {
  p1 = "de76",
  p2 = "de2000",
}

export type RGB = { r: number; g: number; b: number };
export type XYZ = { X: number; Y: number; Z: number };
export type Lab = { L: number; a: number; b: number };
export type Point = { x: number; y: number };
export type Polyline = ReadonlyArray<Point>;
export type Metric = "de2000" | "de1976";
export type RasterData = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};
export interface BinaryMask {
  w: number;
  h: number;
  data: Uint8Array;
}
export interface ConnectedComponents {
  w: number;
  h: number;
  labels: Int32Array;
  sizes: number[];
}
export interface Skeleton extends BinaryMask {}
export interface MedianPCASettings {
  bins?: number;
  minPerBin?: number;
  smoothIter?: number;
  epsilon?: number;
  curved?: boolean;
}
export interface ExtractSettings {
  smoothIter: number;
  epsilon: number;
}

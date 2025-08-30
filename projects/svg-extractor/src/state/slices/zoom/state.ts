import { StateCreator } from "zustand";

import { State } from "../../types";
import { ZoomMode, ZoomState } from "./types";
import { computeZoom } from "./utils";

export const createZoomSlice: StateCreator<State, [], [], ZoomState> = (
  set,
  get
) => ({
  zoom: 1,
  zoomIn: (factor: number = 0.1) =>
    set((state) => ({ zoom: state.zoom + factor })),
  zoomOut: (factor: number = 0.1) =>
    set((state) => ({ zoom: state.zoom - factor })),
  zoomByMode: (mode: ZoomMode = ZoomMode.CONTAIN) => {
    const canvasSize = get().canvas.size;
    const imageSize = get().image.size;

    // const scaled = { w: iw * zoom, h: ih * zoom };
    // const offset = { x: (cw - scaled.w) / 2, y: (ch - scaled.h) / 2 };

    set(() => ({ zoom: computeZoom(imageSize, canvasSize, mode) }));
  },
});

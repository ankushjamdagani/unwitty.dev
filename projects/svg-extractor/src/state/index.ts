import { create } from "zustand";

import { createZoomSlice } from "./slices/zoom";
import { createToolModeSlice } from "./slices/tool-mode";
import { createCanvasSlice } from "./slices/canvas";
import { createImageSlice } from "./slices/image";

import { State } from "./types";

export const useStore = create<State>((...args) => ({
  ...createCanvasSlice(...args),
  ...createImageSlice(...args),
  ...createZoomSlice(...args),
  ...createToolModeSlice(...args),
}));

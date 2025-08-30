import { StateCreator } from "zustand";
import { State } from "../../types";
import { CanvasState } from "./types";

export const createCanvasSlice: StateCreator<State, [], [], CanvasState> = (
  set,
  get
) => ({
  canvas: {
    size: [0, 0],
  },
});

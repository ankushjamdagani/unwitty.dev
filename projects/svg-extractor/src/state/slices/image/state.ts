import { StateCreator } from "zustand";
import { State } from "../../types";
import { ImageState } from "./types";

export const createImageSlice: StateCreator<State, [], [], ImageState> = (
  set,
  get
) => ({
  image: {
    size: [0, 0],
  },
});

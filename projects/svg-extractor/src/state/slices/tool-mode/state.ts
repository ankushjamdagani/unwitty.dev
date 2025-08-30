import { StateCreator } from "zustand";
import { State } from "../../types";
import { ToolMode, ToolModeState } from "./types";

export const createToolModeSlice: StateCreator<State, [], [], ToolModeState> = (
  set,
  get
) => ({
  toolMode: ToolMode.SELECT,
  toolModeChange: (mode: ToolMode) => set({ toolMode: mode }),
});

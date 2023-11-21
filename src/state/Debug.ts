import { create } from "zustand";

export enum DebugLevels {
  FULL,
  // PHYSICS,
  // SCENE,
  // OBJECTS,
  NONE,
}

const useDebugState = create((set) => ({
  debugLevel: DebugLevels.FULL,
  setNoDebug: () => set({ debugLevel: DebugLevels.NONE }),
  setFullDebug: () => set({ debugLevel: DebugLevels.FULL }),
}));

export default useDebugState;

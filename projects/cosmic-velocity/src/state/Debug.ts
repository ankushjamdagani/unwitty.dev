import { create } from "zustand";

export enum DebugLevels {
  FULL,
  // PHYSICS,
  // SCENE,
  // OBJECTS,
  NONE,
}

interface DebugState {
  debugLevel: DebugLevels;
  setNoDebug: () => void;
  setFullDebug: () => void;
}

const useDebugState = create<DebugState>((set) => ({
  debugLevel: DebugLevels.FULL,
  setNoDebug: () => set({ debugLevel: DebugLevels.NONE }),
  setFullDebug: () => set({ debugLevel: DebugLevels.FULL }),
}));

export default useDebugState;

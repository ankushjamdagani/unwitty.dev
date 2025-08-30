// ToolMode
export enum ToolMode {
  SELECT,
  POINTS,
  DRAW,
  SHAPE,
  TEXT,
  HAND,
}

export type ToolModeState = { toolMode: ToolMode };

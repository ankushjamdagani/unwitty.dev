// ToolMode
export enum ToolMode {
  SELECT = "select",
  HAND = "hand",
  AREA_SELECT = "area_select",
  POINTS = "points",
  TEXT = "text",
  SHAPE = "shape",
  COLOR = "color",
}

export type ToolModeState = { toolMode: ToolMode };

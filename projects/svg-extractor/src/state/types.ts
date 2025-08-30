import type { ImageState } from "./slices/image/types";
import type { ZoomState } from "./slices/zoom/types";
import type { CanvasState } from "./slices/canvas/types";
import type { ToolModeState } from "./slices/tool-mode/types";

export type State = ToolModeState & ZoomState & ImageState & CanvasState;
// export type State = { toolMode: ToolModeState } & { zoom: ZoomState } & {
//   image: ImageState;
// } & { canvas: CanvasState };
export type AnyState = ToolModeState | ZoomState | ImageState | CanvasState;

enum ActionType {
  MODE,
  ZOOM,
  EDIT,
  GROUP,
  HALIGN,
  VALIGN,
  BOOLEAN,
  FILE,
  OPEN,
  PALETTE,
}

enum ModeType {
  SELECT,
  NODE,
  PEN,
  SHAPE,
  TEXT,
  HAND,
  EYEDROP,
  MEASURE,
}

enum ZoomType {
  IN,
  OUT,
  RESET,
}

enum EditType {
  UNDO,
  REDO,
  COPY,
  PASTE,
  DELETE,
  CUT,
}

enum GroupType {
  GROUP,
  UNGROUP,
}

enum HAlignType {
  LEFT,
  CENTER,
  RIGHT,
}

enum VAlignType {
  TOP,
  MIDDLE,
  BOTTOM,
}

enum BooleanType {
  COMBINE,
  SUBTRACT,
  INTERSECT,
  DIVIDE,
}

enum ColourType {
  STYLE,
}

type ActionGroup = {};

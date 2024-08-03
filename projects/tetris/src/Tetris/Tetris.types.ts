/** * * * * * * * * * * */
/** * T_E_T_R_I_S * * */
/** 
/** @todo
/** - what if there is no space for controls panel? Priority of `resolution` vs `layout`. 
/** 
/* * * * * * * * * * * */
export interface TetrisProps {
  /**
   * @desc
   * - number of blocks in x-axis
   * - y-axis will be deduced automatically
   *
   * @todo
   * - should it be multiple of 10?
   */
  resolution: number;

  /**
   * @desc Game layout of canvas and controls panel
   */
  layout: Layout;

  /**
   * @desc Pre-defined set of themes
   */
  theme: Theme;

  /**
   * @desc Listeners for user actions
   */
  onAction: (
    type: Actions,
    state: {
      data: any; // event data
      game: {
        _instance: any;
        score: number;
        level: number;
      };
    }
  ) => void;

  /**
   * @desc Listeners for game-play events
   */
  onEvent: (
    type: Events,
    state: {
      data: any; // event data
      game: {
        _instance: any;
        score: number;
        level: number;
      };
    }
  ) => void;
}

export type Layout = "auto" | "landscape" | "portrait" | "square";

export type Theme =
  | "dark"
  | "light"
  | "orange"
  | "multicolor-vintage"
  | "multicolor-futuristic";

export interface ThemeConfig {
  type: Theme;
  // For each piece - colors for each state (empty, disabled, etc)
  pieceColors: Record<number, string>;
}

export type Actions = "KEY_PRESSED" | "CLICKED";

export type Events =
  | "GAME_START"
  | "GAME_PAUSE"
  | "GAME_RESUME"
  | "GAME_END"
  | "GAME_RENDER"
  | "LEVEL_CHANGE";

// ------- Board

export enum BoardPixel {
  Filled = 1,
  Empty = 0,
  Disabled = -1,
  Corrupt = -2,
}

export type Board = BoardPixel[][];

// ------- Piece

export enum PieceType {
  "I", // hero
  "J", // blue ricky
  "L", // orange ricky
  "O", // smashboy
  "T", // teewee
  "S", // rhode island
  "Z", // cleveland
}

// 90deg rotation
export type PieceRotation = 1 | 2 | 3 | 4;

export interface Piece {
  type: PieceType;
  rotation: PieceRotation;
  // position of top-left
  position: [number, number];
  // color?: ThemeConfig["pieceColors"];
}

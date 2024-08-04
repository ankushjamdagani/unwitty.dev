export enum Resolution {
  XS = 5,
  MD = 10,
  LG = 20,
}

export enum Layout {
  AUTO,
  LANDSCAPE,
  PORTRAIT,
  SQUARE,
}

export enum Actions {
  KEY_PRESSED,
  CLICKED,
}

export enum Events {
  GAME_START,
  GAME_PAUSE,
  GAME_RESUME,
  GAME_END,
  GAME_RENDER,
  LEVEL_CHANGE,
}

export enum BoardPixel {
  FILLED = 1,
  EMPTY = 0,
  DISABLED = -1,
  CORRUPT = -2,
}

// 90deg rotation
export enum PieceRotation {
  "0Deg",
  "90Deg",
  "180Deg",
  "270Deg",
}

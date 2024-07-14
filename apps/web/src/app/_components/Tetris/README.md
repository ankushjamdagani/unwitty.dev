# Tetris

## Features

- Tetris logic
  - Misc *
    - Ground shrinking
    - Multiplayer
      - Lines cut are added as disabled blocks for opponents
      - 2d game-play
    - Random disabled blocks
    - Glitch in movements and colors
- Random glitch with random movements and colors
- Adaptive layouts
- Game themes

## System Design

### Interface

```js
/** * * * * * * * * * * */
/** * T_E_T_R_I_S * * */
/** 
/** @todo
/** - what if there is no space for controls panel? Priority of `resolution` vs `layout`. 
/** 
/* * * * * * * * * * * */
interface Tetris {
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
  layout: 'auto' | 'landscape' | 'portrait' | 'square';

  /** 
   * @desc Pre-defined set of themes
   */
  theme: Theme;

  /**
   * @desc Listeners for user actions
   */
  onAction: (type: 'KEY_PRESSED' 
    | 'CLICKED', 
    state: {
      data: any, // event data
      game: {
        _instance: any,
        score: number,
        level: number,
      }
    }) => void;

  /**
   * @desc Listeners for game-play events
   */
  onEvent: (
    type: 'GAME_START' 
    | 'GAME_PAUSE' 
    | 'GAME_RESUME' 
    | 'GAME_END' 
    | 'GAME_RENDER'
    | 'LEVEL_CHANGE', 
    state: {
      data: any, // event data
      game: {
        _instance: any,
        score: number,
        level: number,
      }
    }
  ) => void;
}

type Theme = 'dark' 
    | 'light' 
    | 'orange' 
    | 'multicolor-vintage' 
    | 'multicolor-futuristic'

type ThemeConfig {
  type: Theme,
  pieceColors: Record<number, string>,
}

enum PieceType {
  "I", // hero
  "J", // blue ricky
  "L", // orange ricky
  "O", // smashboy
  "T", // teewee
  "S", // rhode island
  "Z", // cleveland
}

const PieceColors: Record<PieceType, ThemePieceColors>

interface Piece {
  type: PieceType, 
  rotation: 1 | 2 | 3 | 4, // 90deg rotation
  position: [number,number],  // position of top-left
  color?: keyof ThemeConfig.pieceColors
}

type PixelEmpty = 0
type PixelDisabled = -1
type PixelColored = number // positive numbers
type PixelCorrupt = -number // negative numbers

type Board = (PixelEmpty | PixelDisabled | PixelColored | PixelCorrupt)[][]

```

### Tetris

Handles game logic

- props
  - theme
  - resolution
  - layout
  - onAction
  - onEvent
- useGame
  - state
    - game state = Start | Play | Pause | End
    - score = f(eliminatedHeap, currentHeap, time)
  - saveGame
  - checkGameEnd
    - changeGameState
  - updateScore
  - getLeaderBoard
- useGameLoop
  - state
    - speed
    - tick
  - nextTick
- usePiece
  - state
    - activePiece: Piece
    - nextPiece: Piece
  - setNextPiece
    - update activePiece - orientation and type
  - rotatePiece
    - shift piece if it's out of view
  - movePiece
- useHeap
  - state
    - heap: Board
    - heapHistory Piece[]
  - checkHeapCollision
    - addToHeap
  - checkHeapCollapse
    - removeRowsFromHeap
- useActions
- useEvents
- exportGameState

```js
  <div id="game-root" className={`layout-${layout}`}>
    <Theme>
        <GameBoard />
        <ScoreBoard />
        <GameMenu>
        <GameEnvironment>
    </Theme>
  </div id="game-root">
```

### Root

Handles layout of components

-

### GameBoard

Renders and animate game board, heap and piece

- state
  - canvasRef
- drawGameBoard
  - clears game board affected area and renders it
- drawHeap
- drawPiece
- animatePiece
- animateGameBoard
- animateHeap

```js
<Canvas ref={canvasRef} onReady />
```

### Canvas

Handles unit level canvas functionalities like rendering pixel, etc.

- state
  - canvas attributes
- renderPixel
- renderShape
- renderText
- animate

### GameEnvironment

Renders surrounding environment of game like branding, background, etc.

### ScoreBoard

Renders and animates score related stats - score, topScore, level, lines, nextPiece

## TODOs

- Tetris history - release, piece names, dark past, etc
- Type of rotation is different for original and nintendo - [Link](https://strategywiki.org/wiki/Tetris/Rotation_systems)
- Tetris modes and graphics ideas - [Link](https://www.youtube.com/watch?v=dgt1kWq2_7c)

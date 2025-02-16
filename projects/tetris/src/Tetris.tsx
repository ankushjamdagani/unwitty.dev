import { useEffect, useRef } from "react";

import { Action, Event, Layout, Resolution } from "./constants";

import ThemeProvider, { Theme } from "./components/ThemeProvider";

import { useGameLoop } from "./hooks/useGameLoop";
import { usePlayState, PlayState } from "./hooks/usePlayState";
import { useScore } from "./hooks/useScore";
import { usePiece } from "./hooks/usePiece";
import { MovementDirection } from "./types/common";
import { useGameBoard } from "./hooks/useGameBoard";

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
   */
  resolution?: Resolution;

  /**
   * @desc Game layout of canvas and controls panel
   */
  layout?: Layout;

  /**
   * @desc Pre-defined set of themes
   */
  theme?: Theme;

  /**
   * @desc Listeners for user actions
   */
  onAction?: (
    type: Action,
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
  onEvent?: (
    type: Event,
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

const keyCodeToPieceMovementDirection = {
  ArrowLeft: MovementDirection.LEFT,
  ArrowRight: MovementDirection.RIGHT,
  ArrowDown: MovementDirection.DOWN,
};

export function Tetris(props: TetrisProps) {
  const {
    theme = Theme.LIGHT,
    resolution = Resolution.MD,
    layout = Layout.AUTO,
    onAction,
    onEvent,
  } = {
    ...props,
  };

  const gameRootRef = useRef<HTMLDivElement>(null);

  const {
    tick,
    speed,
    setSpeed,
    increaseSpeed,
    reset: resetGameLoop,
  } = useGameLoop({});

  const {
    playState,
    endGame,
    pauseGame,
    playGame,
    restartGame,
    reset: resetGamePlayState,
  } = usePlayState({});

  const { score, scoreBoard, saveToScoreBoard, reset } = useScore({});

  const {
    activePiece,
    nextPiece,
    setNextPiece,
    rotatePiece,
    movePiece,
    reset: resetPiece,
  } = usePiece({ resolution });

  const {
    board,
    checkBoardCollision,
    addToBoard,
    isBoardHeightFilled,
    reset: resetGameBoard,
  } = useGameBoard({
    resolution,
    tick,
  });

  useEffect(() => {
    const element = document.body;

    function onKeyDown(this: HTMLElement, evt: KeyboardEvent) {
      switch (evt.code) {
        case "ArrowRight":
        case "ArrowLeft":
        case "ArrowDown":
          if (playState === PlayState.GAME_PLAY) {
            movePiece(keyCodeToPieceMovementDirection[evt.code]);
          }
          break;
        case "Enter":
          if (playState === PlayState.GAME_IDLE) {
            setNextPiece();
            setSpeed(1);
            playGame();
          }
          break;
        case "Space":
          if (playState === PlayState.GAME_PLAY) {
            setSpeed(0);
            pauseGame();
          }
          if (playState === PlayState.GAME_PAUSE) {
            setSpeed(1);
            playGame();
          }
          break;
      }
    }

    element?.addEventListener("keydown", onKeyDown);

    return () => {
      element?.removeEventListener("keydown", onKeyDown);
    };
  }, [playGame, pauseGame, movePiece, playState, setSpeed, setNextPiece]);

  useEffect(() => {
    if (playState === PlayState.GAME_PLAY) {
      movePiece(MovementDirection.DOWN);
    }
  }, [tick, movePiece, playState]);

  useEffect(() => {
    if (!activePiece) {
      return;
    }
    if (checkBoardCollision(activePiece)) {
      addToBoard(activePiece);
      if (isBoardHeightFilled()) {
        setSpeed(0);
        resetPiece();
        endGame();
        console.log("Game Over");
      } else {
        setNextPiece();
      }
    }
  }, [
    activePiece,
    checkBoardCollision,
    addToBoard,
    setNextPiece,
    resetPiece,
    isBoardHeightFilled,
    endGame,
    setSpeed,
  ]);

  return (
    <div id="game-root" ref={gameRootRef} className={`layout-${layout}`}>
      <ThemeProvider>
        <h1>Tetris</h1>
        <pre>
          {board.map((row) => JSON.stringify(row)).join(`
`)}
          <br />
          tick - {tick} <br />
          speed - {speed} <br />
          playState - {playState} <br />
          activePiece position - {JSON.stringify(activePiece?.position)} <br />
          score - {score} <br />
        </pre>
      </ThemeProvider>
    </div>
  );
}

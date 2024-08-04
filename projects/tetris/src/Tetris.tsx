import { useCallback, useEffect, useRef } from "react";

import { Actions, Events, Layout, Resolution } from "./constants";
import { numberInRange } from "./helpers/math";

import ThemeProvider, { Theme } from "./components/ThemeProvider";

import { useGameLoop } from "./hooks/useGameLoop";
import { usePlayState, PlayState } from "./hooks/usePlayState";
import { useScore } from "./hooks/useScore";
import { PieceMovementDirection, usePiece } from "./hooks/usePiece";

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
  onEvent?: (
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

const keyCodeToPieceMovementDirection = {
  ArrowLeft: PieceMovementDirection.LEFT,
  ArrowRight: PieceMovementDirection.RIGHT,
  ArrowDown: PieceMovementDirection.DOWN,
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

  const keepInRange = useCallback(
    (position: [number, number]): [number, number] => {
      return [
        numberInRange(-resolution / 2, resolution / 2, position[0]),
        // TODO: y-axis range is between 0 and next heap cell
        numberInRange(0, resolution, position[1]),
      ];
    },
    [resolution]
  );

  const { activePiece, nextPiece, setNextPiece, rotatePiece, movePiece } =
    usePiece({ keepInRange });

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
  }, [playGame, pauseGame, movePiece, playState, setSpeed]);

  useEffect(() => {
    movePiece(PieceMovementDirection.DOWN);
  }, [tick, movePiece]);

  return (
    <div id="game-root" ref={gameRootRef} className={`layout-${layout}`}>
      <ThemeProvider>
        <h1>Tetris</h1>
        <pre>
          tick - {tick} <br />
          speed - {speed} <br />
          playState - {playState} <br />
          activePiece - {activePiece.position} <br />
          score - {score}
        </pre>
      </ThemeProvider>
    </div>
  );
}

import { useCallback, useEffect, useRef } from "react";

import { Actions, Events, Layout, Resolution } from "./constants";
import { numberInRange } from "./helpers/math";

import ThemeProvider, { Theme } from "./components/ThemeProvider";

import { useGameLoop } from "./hooks/useGameLoop";
import { usePlayState, PlayState } from "./hooks/usePlayState";
import { useScore } from "./hooks/useScore";
import { usePiece } from "./hooks/usePiece";

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
    []
  );

  const { activePiece, nextPiece, setNextPiece, rotatePiece, movePiece } =
    usePiece({ keepInRange });

  useEffect(() => {
    if (playState === PlayState.GAME_PLAY) {
      setSpeed(speed || 1);
    } else {
      setSpeed(0);
    }
  }, [playState, setSpeed, speed]);

  return (
    <div id="game-root" ref={gameRootRef} className={`layout-${layout}`}>
      <ThemeProvider>
        <h1>Tetris</h1>
      </ThemeProvider>
    </div>
  );
}

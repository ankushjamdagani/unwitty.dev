import { Actions, Events, Layout, Resolution } from "./constants";

import useGameLoop from "./hooks/useGameLoop";

import ThemeProvider, { Theme } from "./components/ThemeProvider";

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

const defaultTetrisProps: TetrisProps = {
  resolution: Resolution.MD,
  theme: Theme.LIGHT,
  layout: Layout.AUTO,
};

export function Tetris(props: TetrisProps) {
  const { theme, resolution, layout, onAction, onEvent } = {
    ...defaultTetrisProps,
    ...props,
  };

  const gameLoopState = useGameLoop();

  return (
    <div id="game-root" className={`layout-${layout}`}>
      <ThemeProvider>
        <h1>Tetris</h1>
        <div>
          <h2>useGameLoop</h2>
          {JSON.stringify(gameLoopState, undefined, 4)}{" "}
          <button onClick={() => gameLoopState.increaseSpeed()}>
            Speed ++
          </button>
        </div>
      </ThemeProvider>
    </div>
  );
}

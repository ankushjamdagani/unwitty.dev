import { RefObject, useCallback, useEffect, useState } from "react";

export enum PlayState {
  GAME_IDLE = "GAME_IDLE",
  GAME_PLAY = "GAME_PLAY",
  GAME_PAUSE = "GAME_PAUSE",
  GAME_OVER = "GAME_OVER",
}

interface useGameProps {
  containerElement?: RefObject<HTMLElement>;
  defaultState?: {
    playState: PlayState;
  };
}

const DefaultState = {
  playState: PlayState.GAME_IDLE,
};

export function usePlayState({
  containerElement,
  defaultState = DefaultState,
}: useGameProps) {
  const [state, setState] = useState(defaultState);

  const playGame = useCallback(() => {
    setState((state) => ({ ...state, playState: PlayState.GAME_PLAY }));
  }, []);

  const pauseGame = useCallback(() => {
    setState((state) => ({ ...state, playState: PlayState.GAME_PAUSE }));
  }, []);

  const restartGame = useCallback(() => {
    setState((state) => ({ ...state, playState: PlayState.GAME_IDLE }));
  }, []);

  const endGame = useCallback(() => {
    setState((state) => ({ ...state, playState: PlayState.GAME_OVER }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
  }, [defaultState]);

  useEffect(() => {
    const element = containerElement?.current || document.body;

    function onKeyDown(this: HTMLElement, evt: KeyboardEvent) {
      setState((state) => {
        let { playState } = state;

        switch (playState) {
          case PlayState.GAME_IDLE:
            if (evt.code === "Enter") {
              playState = PlayState.GAME_PLAY;
            }
            break;
          case PlayState.GAME_PLAY:
            if (evt.code === "Space") {
              playState = PlayState.GAME_PAUSE;
            }
            break;
          case PlayState.GAME_PAUSE:
            if (evt.code === "Space") {
              playState = PlayState.GAME_PLAY;
            }
            break;
          case PlayState.GAME_OVER:
            break;

          default:
            break;
        }

        return { ...state, playState };
      });
    }

    element?.addEventListener("keydown", onKeyDown);

    return () => {
      element?.removeEventListener("keydown", onKeyDown);
    };
  }, [containerElement]);

  return {
    state,
    playGame,
    restartGame,
    pauseGame,
    endGame,
    reset,
  };
}

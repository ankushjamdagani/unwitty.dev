import { useCallback, useState } from "react";

export enum PlayState {
  GAME_IDLE = "GAME_IDLE",
  GAME_PLAY = "GAME_PLAY",
  GAME_PAUSE = "GAME_PAUSE",
  GAME_OVER = "GAME_OVER",
}

interface useGameProps {
  defaultState?: {
    playState: PlayState;
  };
}

const DefaultState = {
  playState: PlayState.GAME_IDLE,
};

export function usePlayState({ defaultState = DefaultState }: useGameProps) {
  const [state, setState] = useState(defaultState);
  const { playState } = state;

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

  return {
    playState,
    playGame,
    restartGame,
    pauseGame,
    endGame,
    reset,
  };
}

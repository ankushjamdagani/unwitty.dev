import { RefObject, useCallback, useEffect, useState } from "react";

export enum PlayState {
  GAME_IDLE = "GAME_IDLE",
  GAME_PLAY = "GAME_PLAY",
  GAME_PAUSE = "GAME_PAUSE",
  GAME_OVER = "GAME_OVER",
}

interface useGameProps {
  containerElement?: RefObject<HTMLElement>;
  gamePlayState?: PlayState;
}

export default function useGamePlayState({
  containerElement,
  gamePlayState: initialGamePlayState = PlayState.GAME_IDLE,
}: useGameProps) {
  const [gamePlayState, setGamePlayState] = useState(initialGamePlayState);

  const playGame = useCallback(() => {
    setGamePlayState(PlayState.GAME_PLAY);
  }, []);

  const pauseGame = useCallback(() => {
    setGamePlayState(PlayState.GAME_PAUSE);
  }, []);

  const restartGame = useCallback(() => {
    setGamePlayState(PlayState.GAME_IDLE);
  }, []);

  const endGame = useCallback(() => {
    setGamePlayState(PlayState.GAME_OVER);
  }, []);

  useEffect(() => {
    const element = containerElement?.current || document.body;

    function onKeyDown(this: HTMLElement, evt: KeyboardEvent) {
      setGamePlayState((state) => {
        console.log("-----", evt.code, state);
        if (evt.code === "Space") {
          if (state === PlayState.GAME_PLAY) {
            return PlayState.GAME_PAUSE;
          }
          if (state === PlayState.GAME_PAUSE) {
            return PlayState.GAME_PLAY;
          }
        }
        if (evt.code === "Enter") {
          if (state === PlayState.GAME_IDLE) {
            return PlayState.GAME_PLAY;
          }
        }
        return state;
      });
    }

    element?.addEventListener("keydown", onKeyDown);

    return () => {
      element?.removeEventListener("keydown", onKeyDown);
    };
  }, [containerElement]);

  return {
    gamePlayState,
    playGame,
    restartGame,
    pauseGame,
    endGame,
  };
}

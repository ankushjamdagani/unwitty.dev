import { useCallback, useState } from "react";

type ScoreBoardItem = { timestamp: number; score: number };

interface useScoreProps {
  defaultState?: {
    score: number;
  };
}

const DefaultState = {
  score: 0,
};

// 1 point for blocks eliminated
export function useScore({ defaultState = DefaultState }: useScoreProps) {
  const [state, setState] = useState(defaultState);
  const { score } = state;

  const [scoreBoard, setScoreBoard] = useState<ScoreBoardItem[]>([]);

  const addToScore = useCallback((score: number) => {
    setState((state) => ({ ...state, score: state.score + score }));
  }, []);

  const saveToScoreBoard = useCallback(() => {
    setScoreBoard((state) => [
      ...state,
      { timestamp: Date.now(), score: score },
    ]);
  }, [score]);

  const reset = useCallback(() => {
    setState(defaultState);
  }, [defaultState]);

  return { score, scoreBoard, addToScore, saveToScoreBoard, reset };
}

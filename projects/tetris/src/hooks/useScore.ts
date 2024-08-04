import { useCallback, useEffect, useState } from "react";

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

  const addToScore = useCallback((score: number) => {
    setState((state) => ({ ...state, score: state.score + score }));
  }, []);

  return { state, addToScore };
}

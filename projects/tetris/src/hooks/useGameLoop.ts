import { useCallback, useEffect, useRef, useState } from "react";
import { numberInRange } from "../helpers/math";

interface useGameLoopProps {
  defaultState?: {
    tick: number;
    speed: number;
  };
}

const DefaultState = { tick: 0, speed: 0 };

const MIN_SPEED = 0;
const MAX_SPEED = 10;
const DELTA_SPEED = 1;
const MIN_TIME = 100;
const MAX_TIME = 1000;

function speedToTime(speed: number) {
  if (speed === 0) return 0;

  // Ensure the speed is within the defined range
  if (speed < MIN_SPEED || speed > MAX_SPEED) {
    throw new Error("Speed must be between 1 and 10");
  }

  // Calculate the time based on the speed using the interpolation formula
  const time =
    ((MAX_TIME - MIN_TIME) / (MAX_SPEED - MIN_SPEED)) * (MAX_SPEED - speed) +
    MIN_TIME;

  return time;
}

export function useGameLoop({ defaultState = DefaultState }: useGameLoopProps) {
  const [state, setState] = useState(defaultState);
  const { speed, tick } = state;

  const timeStep = speedToTime(speed);
  const rafIdRef = useRef(0);
  const prevTimeRef = useRef(0.0);
  const deltaTimeRef = useRef(0.0);

  const setSpeed = useCallback((speed: number) => {
    setState((state) => ({ ...state, speed: speed }));
  }, []);

  const increaseSpeed = useCallback(() => {
    setState((state) => ({
      ...state,
      speed: numberInRange(MIN_SPEED, MAX_SPEED, state.speed + DELTA_SPEED),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
  }, [defaultState]);

  useEffect(() => {
    if (timeStep <= 0) {
      return;
    }

    prevTimeRef.current = Date.now();

    function gameLoop() {
      const currTime = Date.now();
      const currDeltaTime = currTime - prevTimeRef.current;
      deltaTimeRef.current += currDeltaTime;

      while (deltaTimeRef.current > timeStep) {
        setState((state) => ({ ...state, tick: state.tick + 1 }));
        deltaTimeRef.current -= timeStep;
      }

      prevTimeRef.current = currTime;
      rafIdRef.current = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [timeStep]);

  return { speed, tick, increaseSpeed, setSpeed, reset };
}

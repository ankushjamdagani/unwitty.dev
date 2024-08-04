import { useCallback, useEffect, useRef, useState } from "react";

interface useGameLoopProps {
  defaultState?: {
    tick: number;
    speed: number;
  };
}

const DefaultState = { tick: 0, speed: 0 };

function speedToTime(speed: number) {
  if (speed === 0) return 0;

  // Define the minimum and maximum values for speed and time
  const minSpeed = 1;
  const maxSpeed = 10;
  const maxTime = 1000;
  const minTime = 100;

  // Ensure the speed is within the defined range
  if (speed < minSpeed || speed > maxSpeed) {
    throw new Error("Speed must be between 1 and 10");
  }

  // Calculate the time based on the speed using the interpolation formula
  const time =
    ((maxTime - minTime) / (maxSpeed - minSpeed)) * (maxSpeed - speed) +
    minTime;

  return time;
}

export default function useGameLoop({
  defaultState = DefaultState,
}: useGameLoopProps) {
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
    setState((state) => ({ ...state, speed: Math.min(10, state.speed + 1) }));
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

  return { state, increaseSpeed, setSpeed, reset };
}

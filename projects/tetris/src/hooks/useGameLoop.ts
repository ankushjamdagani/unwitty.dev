import { useCallback, useEffect, useRef, useState } from "react";

interface useGameLoopProps {
  tick?: number;
  speed?: number;
}

export default function useGameLoop({
  tick: initialTick = 0,
  speed: initialSpeed = 0,
}: useGameLoopProps) {
  const [tick, setTick] = useState(initialTick);
  const [speed, setSpeed] = useState(initialSpeed);

  const timeStep = 100 * (10 - speed);
  const rafIdRef = useRef(0);
  const prevTimeRef = useRef(0.0);
  const deltaTimeRef = useRef(0.0);

  const increaseSpeed = useCallback(() => {
    setSpeed((speed) => (speed + 1 > 10 ? 10 : speed + 1));
  }, []);

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
        setTick((tick) => tick + 1);
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

  return { tick, speed, increaseSpeed };
}

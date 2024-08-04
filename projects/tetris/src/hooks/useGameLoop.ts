import { useCallback, useEffect, useRef, useState } from "react";

export default function useGameLoop(initialSpeed: number = 0) {
  const [tick, setTick] = useState(0);
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

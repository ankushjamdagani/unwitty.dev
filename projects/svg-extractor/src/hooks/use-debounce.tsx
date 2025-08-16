import { useRef, useCallback } from "react";

function useDebounce() {
  const tRef = useRef<number>(0);
  const debounced = useCallback((fn: Function, wait = 120) => {
    clearTimeout(tRef.current);
    tRef.current = setTimeout(fn, wait);
  }, []);

  return debounced;
}

export default useDebounce;

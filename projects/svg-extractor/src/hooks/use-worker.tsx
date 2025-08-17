"use client";

import { useRef, useCallback, useState } from "react";

function useWorker(workerPath: string) {
  const workerRef = useRef<any>(null);
  const [hasWorker, setHasWorker] = useState(false);
  const jobIdRef = useRef({ next: 1, current: 0 });

  const initWorker = useCallback(() => {
    if (!workerPath || typeof ComlinkWorker === "undefined") return;

    try {
      const w = new ComlinkWorker(new URL(workerPath, import.meta.url));
      workerRef.current = w;
      setHasWorker(true);
      return w;
    } catch (e) {
      console.warn("Worker failed to init", e);
      setHasWorker(false);
      return null;
    }
  }, []);

  const post = useCallback(
    (
      payload: any,
      buffer: ArrayBufferLike,
      onMessage: (evt: MessageEvent<any>, jobId: number) => void,
      onError: (this: AbstractWorker, ev: ErrorEvent) => any
    ) => {
      let w = workerRef.current || initWorker();
      if (!w) return false;
      const jobId = jobIdRef.current.next++;
      jobIdRef.current.current = jobId;
      w.onmessage = (e: MessageEvent<any>) => onMessage && onMessage(e, jobId);
      w.onerror =
        onError || ((err: ErrorEvent) => console.error("Worker error", err));
      try {
        w.postMessage({ type: "compute", jobId, payload, buffer }, [buffer]);
        return true;
      } catch (e) {
        console.warn("postMessage failed; disabling worker", e);
        setHasWorker(false);
        return false;
      }
    },
    [initWorker]
  );

  return { hasWorker, post };
}

export default useWorker;

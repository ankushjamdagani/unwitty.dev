import { useRef, useCallback, useState } from "react";

function useWorker() {
  const workerRef = useRef<Worker>(null);
  const [hasWorker, setHasWorker] = useState(false);
  const jobIdRef = useRef({ next: 1, current: 0 });

  const initWorker = useCallback(() => {
    try {
      const w = new Worker("/worker.js");
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
    (payload, buffer, onMessage, onError) => {
      let w = workerRef.current || initWorker();
      if (!w) return false;
      const jid = jobIdRef.current.next++;
      jobIdRef.current.current = jid;
      w.onmessage = (e) => onMessage && onMessage(e, jid);
      w.onerror = onError || ((err) => console.error("Worker error", err));
      try {
        w.postMessage({ type: "compute", jobId: jid, payload, buffer }, [
          buffer,
        ]);
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

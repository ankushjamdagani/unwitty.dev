import { useEffect, useState } from "react";

type useFileDropProps = {
  containerRef: React.RefObject<HTMLElement | null>;
  onFile: (f: File) => void;
};

function useFileDrop({ containerRef, onFile }: useFileDropProps) {
  const [isDragging, setDragging] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const over = (e: DragEvent) => {
      e.preventDefault();
      setDragging(true);
    };
    const leave = (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
    };
    const drop = (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer?.files?.[0];
      f && onFile(f);
    };
    el.addEventListener("dragenter", over as any);
    el.addEventListener("dragover", over as any);
    el.addEventListener("dragleave", leave as any);
    el.addEventListener("drop", drop as any);
    return () => {
      el.removeEventListener("dragenter", over as any);
      el.removeEventListener("dragover", over as any);
      el.removeEventListener("dragleave", leave as any);
      el.removeEventListener("drop", drop as any);
    };
  }, [containerRef, onFile]);

  return { isDragging };
}

export default useFileDrop;

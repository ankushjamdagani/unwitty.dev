import React from "react";

import useFileDrop from "../../../../hooks/use-file-drop";
import "./styles.css";

type DropzoneProps = {
  containerRef: React.RefObject<HTMLElement | null>;
  onFile: (f: File) => void;
};

function Dropzone({ onFile, containerRef }: DropzoneProps) {
  const { isDragging } = useFileDrop({ containerRef, onFile });
  return (
    <div
      className="dropzone"
      style={{ borderColor: isDragging ? "#4fd1ff" : undefined }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>
          Drop an image here or use the input →
        </div>
        <div className="small" style={{ marginTop: 6 }}>
          Click image to set current color. <b>Shift+Click</b> to add another
          target. <b>Space</b> to pan, <b>Ctrl/⌘ + Wheel</b> to zoom.
        </div>
      </div>
    </div>
  );
}

export default Dropzone;

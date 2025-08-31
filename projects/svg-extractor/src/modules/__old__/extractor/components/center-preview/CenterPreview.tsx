import { Legend } from "../legend";
import LoadingBusy from "../../../../../components/loading-busy";
import { DropZone } from "../drop-zone";

import "./styles.css";

type CenterPreviewProps = {
  previewRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  imgCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  maskCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  debugCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  overlaySvgRef: React.RefObject<SVGSVGElement | null>;
  viewMask: boolean;
  viewPath: boolean;
  onFile: (f: File) => void;
  loadedFile: boolean;
  busyMessage: string;
};

const legendOptions = [
  {
    label: "Mask",
    color: "#fff",
  },
  {
    label: "Polyline Path(s)",
    color: "#6be675",
  },
  {
    label: "Debug",
    color: "#4fd1ff",
  },
];

function CenterPreview({
  previewRef,
  stageRef,
  imgCanvasRef,
  maskCanvasRef,
  debugCanvasRef,
  overlaySvgRef,
  viewMask,
  viewPath,
  onFile,
  busyMessage,
  loadedFile,
}: CenterPreviewProps) {
  return (
    <div className="preview-container">
      <div className="preview" ref={previewRef}>
        {!loadedFile && <DropZone containerRef={previewRef} onFile={onFile} />}
        <div id="stage" ref={stageRef}>
          <canvas id="imgCanvas" ref={imgCanvasRef} />
          <canvas
            id="maskCanvas"
            ref={maskCanvasRef}
            style={{ display: viewMask ? "block" : "none" }}
          />
          <canvas id="debugCanvas" ref={debugCanvasRef} />
          <svg
            id="overlaySvg"
            ref={overlaySvgRef}
            style={{ display: viewPath ? "block" : "none" }}
          />
        </div>
        <LoadingBusy busyMessage={busyMessage} />
      </div>
      <Legend options={legendOptions} />
    </div>
  );
}

export default CenterPreview;

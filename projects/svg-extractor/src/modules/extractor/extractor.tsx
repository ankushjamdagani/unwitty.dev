import { useState, useRef } from "react";
import { CenterPreview } from "./components/center-preview";
import "./styles.css";

const kpiOptions = [
  {
    label: "Canvas",
    value: "canvas width*height",
  },
  {
    label: "Pixels",
    value: "pixels",
  },
  {
    label: "Matched",
    value: "selected",
  },
  {
    label: "Components",
    value: "components",
  },
  {
    label: "Segments",
    value: "segments",
  },
  {
    label: "Targets",
    value: "targets",
  },
];

function Extractor() {
  // Refs
  const previewRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const imgCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlaySvgRef = useRef<SVGSVGElement>(null);

  // state
  const [viewMask, setViewMask] = useState(false);
  const [viewPath, setViewPath] = useState(false);
  const [busyMessage, setBusyMessage] = useState("");
  const [pathLines, setPathLines] = useState<string[]>([]);

  const onFile = console.log;

  return (
    <div className="extractor-container">
      <h1>SVG Editor (Polyline)</h1>
      <div className="sub">
        Drop an image → choose one or more target colors → tune tolerance. Paths
        use only <b>M/L</b>. Region picking and alignment snapping are removed.
      </div>
      <div className="panels-container">
        <div className="panel-container panel-left"></div>
        <div className="panel-container panel-center">
          <CenterPreview
            previewRef={previewRef}
            stageRef={stageRef}
            imgCanvasRef={imgCanvasRef}
            maskCanvasRef={maskCanvasRef}
            debugCanvasRef={debugCanvasRef}
            overlaySvgRef={overlaySvgRef}
            onFile={onFile}
            viewMask={viewMask}
            viewPath={viewPath}
            busyMessage={busyMessage}
            kpiOptions={kpiOptions}
            pathLines={pathLines}
          />
        </div>
        <div className="panel-container panel-right"></div>
      </div>
    </div>
  );
}

export default Extractor;

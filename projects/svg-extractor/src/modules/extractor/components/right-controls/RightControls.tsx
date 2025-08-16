import Panel from "../../../../components/panel";
import useCopy from "../../../../hooks/use-copy";
import { MaskBitmap, SkelBitmap } from "../../Extractor.types";

type RightControlsProps = {
  // Refs
  miniSvgRef: React.RefObject<SVGSVGElement | null>;
  imgCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  maskCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  debugCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  overlaySvgRef: React.RefObject<SVGSVGElement | null>;

  erodeIter: number;
  setErodeIter: (n: number) => void;
  dilateIter: number;
  setDilateIter: (n: number) => void;
  method: "skeleton" | "pca";
  setMethod: (v: "skeleton" | "pca") => void;
  smoothIter: number;
  setSmoothIter: (n: number) => void;
  epsilon: number;
  setEpsilon: (n: number) => void;

  viewMask: boolean;
  setViewMask: (b: boolean) => void;
  viewPath: boolean;
  setViewPath: (b: boolean) => void;
  viewComponents: boolean;
  setViewComponents: (b: boolean) => void;
  viewPoints: boolean;
  setViewPoints: (b: boolean) => void;
  viewSkeleton: boolean;
  setViewSkeleton: (b: boolean) => void;
  dbgEndpoints: boolean;
  setDbgEndpoints: (b: boolean) => void;
  dbgHeatmap: boolean;
  setDbgHeatmap: (b: boolean) => void;
  dbgPCA: boolean;
  setDbgPCA: (b: boolean) => void;
  heatOpacity: number;
  setHeatOpacity: (n: number) => void;

  busyMessage: string;
  pathLines: string[];
  setPathLines: (arr: string[]) => void;
  // Actions

  debouncedCompute: (wantPath?: boolean) => void;

  // Debug/state readbacks
  lastMask: MaskBitmap;
  lastSkel: SkelBitmap;
};

function RightControls({
  erodeIter,
  setErodeIter,
  dilateIter,
  setDilateIter,
  method,
  setMethod,
  smoothIter,
  setSmoothIter,
  epsilon,
  setEpsilon,
  viewMask,
  setViewMask,
  viewPath,
  setViewPath,
  viewComponents,
  setViewComponents,
  viewPoints,
  setViewPoints,
  viewSkeleton,
  setViewSkeleton,
  dbgEndpoints,
  setDbgEndpoints,
  dbgHeatmap,
  setDbgHeatmap,
  dbgPCA,
  setDbgPCA,
  heatOpacity,
  setHeatOpacity,
  debouncedCompute,
  pathLines,
  miniSvgRef,
  imgCanvasRef,
  maskCanvasRef,
  debugCanvasRef,
  overlaySvgRef,
  lastMask,
  lastSkel,
  setPathLines,
}: RightControlsProps) {
  const { copied, copy } = useCopy();

  const downloadSkeleton = ({ lastSkel }: any) => {
    const s = lastSkel;
    if (!s) {
      alert("No skeleton yet.");
      return;
    }
    const { w, h, data } = s;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const cx = c.getContext("2d")!;
    cx.fillStyle = "#ffffff";
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) if (data[y * w + x]) cx.fillRect(x, y, 1, 1);
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "skeleton.png";
    a.click();
  };

  const downloadSvg = ({ pathLines, imgCanvasRef }: any) => {
    const w = imgCanvasRef.current?.width || 0;
    const h = imgCanvasRef.current?.height || 0;

    if (!pathLines.length) return;
    const paths = pathLines
      .map(
        (d: string) =>
          `<path d="${d}" fill="none" stroke="#6be675" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
      )
      .join("\r\n");
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  ${paths}
  </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "median-paths.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const downloadMask = ({ lastMask }: any) => {
    const m = lastMask;
    if (!m) {
      alert("No mask yet.");
      return;
    }
    const { w, h, data } = m;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const cx = c.getContext("2d")!;
    const id = cx.createImageData(w, h);
    for (let i = 0; i < w * h; i++) {
      const on = data[i] ? 255 : 0;
      id.data[i * 4 + 0] = on;
      id.data[i * 4 + 1] = on;
      id.data[i * 4 + 2] = on;
      id.data[i * 4 + 3] = on;
    }
    cx.putImageData(id, 0, 0);
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "mask.png";
    a.click();
  };

  const clear = () => {
    const cx = imgCanvasRef.current?.getContext("2d");
    const mx = maskCanvasRef.current?.getContext("2d");
    const dx = debugCanvasRef.current?.getContext("2d");
    if (cx && imgCanvasRef.current)
      cx.clearRect(
        0,
        0,
        imgCanvasRef.current.width,
        imgCanvasRef.current.height
      );
    if (mx && maskCanvasRef.current)
      mx.clearRect(
        0,
        0,
        maskCanvasRef.current.width,
        maskCanvasRef.current.height
      );
    if (dx && debugCanvasRef.current)
      dx.clearRect(
        0,
        0,
        debugCanvasRef.current.width,
        debugCanvasRef.current.height
      );
    if (overlaySvgRef.current) overlaySvgRef.current.innerHTML = "";

    setPathLines([]);
  };

  return (
    <>
      <Panel title="Path Preview" open>
        <svg ref={miniSvgRef} />
      </Panel>
      <Panel title="🧽 Mask cleanup" open>
        <div className="grid-2">
          <div>
            <div className="small">Erode</div>
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={erodeIter}
              onChange={(e) => {
                setErodeIter(Number(e.target.value));
                debouncedCompute();
              }}
            />
          </div>
          <div>
            <div className="small">Dilate</div>
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={dilateIter}
              onChange={(e) => {
                setDilateIter(Number(e.target.value));
                debouncedCompute();
              }}
            />
          </div>
        </div>
      </Panel>
      <Panel title="🧠 Extraction & shaping" open>
        <div className="grid-2">
          <div className="small">Method</div>
          <select
            value={method}
            onChange={(e) => {
              setMethod(e.target.value as any);
              debouncedCompute(true);
            }}
          >
            <option value="skeleton">Skeleton (thinning)</option>
            <option value="pca">PCA Median</option>
          </select>
          <label className="small">
            Smooth (iterations): <span>{smoothIter}</span>
          </label>
          <input
            type="range"
            min={0}
            max={8}
            step={1}
            value={smoothIter}
            onChange={(e) => {
              setSmoothIter(Number(e.target.value));
              debouncedCompute();
            }}
          />
          <label className="small">
            Simplify (RDP epsilon px): <span>{Number(epsilon).toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={epsilon}
            onChange={(e) => {
              setEpsilon(Number(e.target.value));
              debouncedCompute();
            }}
          />
        </div>
      </Panel>
      <Panel title="👁️ View & Debug" open>
        <div className="content grid-2">
          <label className="small">
            <input
              type="checkbox"
              checked={viewMask}
              onChange={(e) => setViewMask(e.target.checked)}
            />{" "}
            Mask
          </label>
          <label className="small">
            <input
              type="checkbox"
              checked={viewPath}
              onChange={(e) => setViewPath(e.target.checked)}
            />{" "}
            Path
          </label>
          <label className="small">
            <input
              type="checkbox"
              checked={viewComponents}
              onChange={(e) => setViewComponents(e.target.checked)}
            />{" "}
            Components
          </label>
          <label className="small">
            <input
              type="checkbox"
              checked={viewPoints}
              onChange={(e) => setViewPoints(e.target.checked)}
            />{" "}
            Points
          </label>
          <label className="small">
            <input
              type="checkbox"
              checked={viewSkeleton}
              onChange={(e) => setViewSkeleton(e.target.checked)}
            />{" "}
            Skeleton
          </label>
          <label className="small">
            <input
              type="checkbox"
              checked={dbgEndpoints}
              onChange={(e) => setDbgEndpoints(e.target.checked)}
            />{" "}
            Endpoints
          </label>
          <label className="small">
            <input
              type="checkbox"
              checked={dbgHeatmap}
              onChange={(e) => setDbgHeatmap(e.target.checked)}
            />{" "}
            ΔE heatmap
          </label>
          <label className="small">
            <input
              type="checkbox"
              checked={dbgPCA}
              onChange={(e) => setDbgPCA(e.target.checked)}
            />{" "}
            PCA axis & bins
          </label>
          <div className="small">
            Heatmap opacity (<span className="small">{heatOpacity}%</span>)
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={heatOpacity}
            onChange={(e) => setHeatOpacity(Number(e.target.value))}
          />
        </div>
      </Panel>
      <Panel title="📤 Exports" open>
        <div className="content grid-2 btnrow">
          <button
            className="primary"
            onClick={() => downloadSvg({ pathLines, imgCanvasRef })}
            disabled={!pathLines.length}
          >
            Download SVG
          </button>
          <button
            onClick={() => copy(pathLines.join("\r\n"))}
            disabled={!pathLines.length}
          >
            {copied ? "Copied!" : 'Copy path "d"'}
          </button>
          <button onClick={() => debouncedCompute(true)}>Extract Now</button>

          <button onClick={() => downloadMask({ lastMask })}>
            Download Mask
          </button>
          <button onClick={() => downloadSkeleton({ lastSkel })}>
            Download Skeleton
          </button>

          <button onClick={clear}>Clear</button>
        </div>
      </Panel>
    </>
  );
}

export default RightControls;

import Panel from "../../../../components/panel";
import { CCResult, ComponentType, MetricColor } from "../../Extractor.types";
import { ComponentsPanel } from "../components-panel";
import { TargetsControls } from "../targets-controls";

type LeftControlsProps = {
  processScale: number;
  setProcessScale: React.Dispatch<React.SetStateAction<number>>;
  livePreview: boolean;
  setLivePreview: React.Dispatch<React.SetStateAction<boolean>>;
  zoomPct: number;
  setZoom: (pct: number) => void;
  doZoomFit: () => void;
  debouncedCompute: (wantPath?: boolean) => void;
  onFile: (file?: File) => void;
  compMode: ComponentType;
  setCompMode: React.Dispatch<React.SetStateAction<ComponentType>>;
  selectedLabels: Set<number>;
  setSelectedLabels: React.Dispatch<React.SetStateAction<Set<number>>>;
  lastCC: React.RefObject<CCResult>;
  invertMask: boolean;
  setInvertMask: React.Dispatch<React.SetStateAction<boolean>>;
  maskOpacity: number;
  setMaskOpacity: React.Dispatch<React.SetStateAction<number>>;
  colorMetric: MetricColor;
  setColorMetric: React.Dispatch<React.SetStateAction<MetricColor>>;
  tolerance: number;
  setTolerance: React.Dispatch<React.SetStateAction<number>>;
  primaryColor: string;
  setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;
  extraTargets: string[];
  setExtraTargets: React.Dispatch<React.SetStateAction<string[]>>;
};

function LeftControls({
  processScale,
  setProcessScale,
  livePreview,
  setLivePreview,
  zoomPct,
  setZoom,
  doZoomFit,
  debouncedCompute,
  onFile,
  compMode,
  setCompMode,
  selectedLabels,
  setSelectedLabels,
  lastCC,
  invertMask,
  setInvertMask,
  maskOpacity,
  setMaskOpacity,
  colorMetric,
  setColorMetric,
  tolerance,
  setTolerance,
  primaryColor,
  setPrimaryColor,
  extraTargets,
  setExtraTargets,
}: LeftControlsProps) {
  return (
    <div className="controls">
      <Panel title="🔼 Live preview & Image" open>
        <div className="grid-2">
          <div className="small">Upload Image (PNG/JPG)</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0] || undefined)}
          />
          <div className="small">
            Zoom (<span className="small">{zoomPct}%</span>)
          </div>
          <div>
            <input
              type="range"
              min={25}
              max={400}
              step={5}
              value={zoomPct}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <div>
              <button className="small" onClick={doZoomFit}>
                Fit
              </button>
              <button className="small" onClick={() => setZoom(100)}>
                100%
              </button>
            </div>
          </div>
          <div className="small">
            Process Scale (% of original):{" "}
            <span className="small">{processScale}%</span>
          </div>
          <input
            type="range"
            min={20}
            max={100}
            step={5}
            value={processScale}
            onChange={(e) => {
              setProcessScale(Number(e.target.value));
              if (livePreview) debouncedCompute(true);
            }}
          />
          <div className="small">Update mask/path as you tweak</div>
          <input
            type="checkbox"
            checked={livePreview}
            onChange={(e) => setLivePreview(e.target.checked)}
          />
        </div>
      </Panel>
      <TargetsControls
        livePreview={livePreview}
        debouncedCompute={debouncedCompute}
        invertMask={invertMask}
        setInvertMask={setInvertMask}
        maskOpacity={maskOpacity}
        setMaskOpacity={setMaskOpacity}
        colorMetric={colorMetric}
        setColorMetric={setColorMetric}
        tolerance={tolerance}
        setTolerance={setTolerance}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
        extraTargets={extraTargets}
        setExtraTargets={setExtraTargets}
      />
      <ComponentsPanel
        livePreview={livePreview}
        debouncedCompute={debouncedCompute}
        compMode={compMode}
        setCompMode={setCompMode}
        selectedLabels={selectedLabels}
        setSelectedLabels={setSelectedLabels}
        lastCC={lastCC}
      />
    </div>
  );
}

export default LeftControls;

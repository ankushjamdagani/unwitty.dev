import { useRef } from "react";
import Panel from "../../../../../components/panel";
import { MetricColor } from "../../../../../types";

type TargetsControlsProps = {
  livePreview: boolean;
  debouncedCompute: (wantPath?: boolean) => void;

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

function TargetsControls({
  invertMask,
  setInvertMask,
  maskOpacity,
  setMaskOpacity,
  colorMetric,
  setColorMetric,
  tolerance,
  setTolerance,
  livePreview,
  debouncedCompute,
  primaryColor,
  setPrimaryColor,
  extraTargets,
  setExtraTargets,
}: TargetsControlsProps) {
  const currentColor = useRef<string>("");

  const getColor = (color: string): [string, boolean] => {
    const hex = (color || "").toString().trim().toLowerCase();
    const validColor = /^#([0-9a-f]{6})$/.test(hex);

    return [hex, validColor];
  };

  const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const [color, validColor] = getColor(inputValue);
    currentColor.current = inputValue;

    if (validColor) {
      setPrimaryColor(color);
      debouncedCompute(livePreview);
    }
  };

  const addTarget = () => {
    const [color, validColor] = getColor(primaryColor);

    if (validColor && !extraTargets.includes(color)) {
      setExtraTargets([...extraTargets, color]);
      debouncedCompute(livePreview);
    }
  };

  return (
    <Panel title="🎯 Targets & Color matching" open>
      <div className="rowline">
        <label className="small">
          <input
            type="checkbox"
            checked={invertMask}
            onChange={(e) => {
              setInvertMask(e.target.checked);
              debouncedCompute(livePreview);
            }}
          />{" "}
          Invert mask
        </label>
        <div style={{ flex: 1 }} />
      </div>
      <div className="grid-2">
        <input type="color" value={primaryColor} onChange={onColorChange} />
        <input
          type="text"
          defaultValue={primaryColor}
          onChange={onColorChange}
        />
        <div>
          <button className="small" onClick={addTarget}>
            Add target
          </button>
          <button
            className="small"
            onClick={() => {
              setExtraTargets([]);
              debouncedCompute(livePreview);
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="targets">
        {extraTargets.map((hex, idx) => (
          <span className="pill" key={hex + idx}>
            <span className="swatch" style={{ background: hex }} />
            <span>{hex}</span>
            <button
              style={{ padding: "2px 6px" }}
              onClick={() => {
                const next = extraTargets.filter((_, i) => i !== idx);
                setExtraTargets(next);
                debouncedCompute(livePreview);
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="grid-2">
        <div className="small">Color distance</div>
        <select
          value={colorMetric}
          onChange={(e) => {
            setColorMetric(e.target.value as any);
            debouncedCompute(livePreview);
          }}
        >
          <option value="de76">ΔE76</option>
          <option value="de2000">ΔE2000</option>
        </select>
        <div className="small">
          Tolerance (ΔE): <span className="small">{tolerance}</span>
        </div>
        <input
          type="range"
          min={2}
          max={60}
          step={1}
          value={tolerance}
          onChange={(e) => {
            setTolerance(Number(e.target.value));
            debouncedCompute(livePreview);
          }}
        />
        <div className="small">Mask overlay opacity</div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={maskOpacity}
          onChange={(e) => setMaskOpacity(Number(e.target.value))}
        />
      </div>
    </Panel>
  );
}

export default TargetsControls;

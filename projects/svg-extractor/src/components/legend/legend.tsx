import "./styles.css";

type LegendProps = {
  options: {
    color: string;
    label: string;
  }[];
};

const defaultOptions = [
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

function Legend({ options = defaultOptions }: LegendProps) {
  return (
    <div className="legend">
      {options.map((op) => (
        <span className="chip">
          <span className="dot" style={{ background: op.color }}></span>
          <span className="small">{op.label}</span>
        </span>
      ))}
    </div>
  );
}

export default Legend;

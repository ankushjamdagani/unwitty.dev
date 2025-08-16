import "./styles.css";

type LegendProps = {
  options: {
    color: string;
    label: string;
  }[];
};

function Legend({ options }: LegendProps) {
  return (
    <div className="legend">
      {options.map((op) => (
        <span className="chip" key={op.label}>
          <span className="dot" style={{ background: op.color }}></span>
          <span className="small">{op.label}</span>
        </span>
      ))}
    </div>
  );
}

export default Legend;

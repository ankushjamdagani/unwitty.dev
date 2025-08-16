import "./styles.css";

export type KPIProps = {
  stats: {
    label: string;
    value: any;
  }[];
};

function KPI({ stats }: KPIProps) {
  return (
    <div className="kpi">
      {stats.map((op) => (
        <div key={op.value}>
          {op.label}: {op.value}
        </div>
      ))}
    </div>
  );
}

export default KPI;

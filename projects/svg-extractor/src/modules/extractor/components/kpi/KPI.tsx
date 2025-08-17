import { Stats } from "../../../../types";
import "./styles.css";

export type KPIProps = {
  stats: {
    label: string;
    key: Stats;
    value: any;
  }[];
};

function KPI({ stats }: KPIProps) {
  return (
    <div className="kpi">
      {stats.map((op) => (
        <div key={op.key}>
          {op.label}: {op.value}
        </div>
      ))}
    </div>
  );
}

export default KPI;

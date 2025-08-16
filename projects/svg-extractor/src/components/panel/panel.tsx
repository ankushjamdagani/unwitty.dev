import "./styles.css";

type PanelProps = {
  title: string;
  children: React.JSX.Element;
  open: boolean;
};

function Panel({ title, children, open = true }: PanelProps) {
  return (
    <details className="panel" open={open}>
      <summary>{title}</summary>
      <div className="content">{children}</div>
    </details>
  );
}

export default Panel;

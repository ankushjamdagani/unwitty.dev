import "./path-io.css";

type PathIOProps = {
  pathLines: string[];
};

function PathIO({ pathLines }: PathIOProps) {
  return (
    <div className="path-io">
      <label className="small">SVG Path "d" (one per line)</label>
      <textarea
        readOnly
        value={pathLines.join("")}
        placeholder="Load an image to start…"
      />
    </div>
  );
}

export default PathIO;

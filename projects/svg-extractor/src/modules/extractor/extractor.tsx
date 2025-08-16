import "./styles.css";

function Extractor() {
  return (
    <div className="extractor-container">
      <h1>SVG Editor (Polyline)</h1>
      <div className="sub">
        Drop an image → choose one or more target colors → tune tolerance. Paths
        use only <b>M/L</b>. Region picking and alignment snapping are removed.
      </div>
      <div className="panels-container">
        <div className="panel-container panel-left"></div>
        <div className="panel-container panel-center"></div>
        <div className="panel-container panel-right"></div>
      </div>
    </div>
  );
}

export default Extractor;

import "./styles.css";

import { Extractor } from "../extractor";

function SvgEditor() {
  return (
    <article className="svg-editor">
      <header className="controls-panel controls-panel-primary">
        <button className="menu-toggle">
          <img src="/icon-menu.svg" />
        </button>
        <div className="controls-list">
          <button
            className="control-item anim-scale"
            onClick={() => {
              document.body.style = "filter: hue-rotate(35deg)";
            }}
          >
            A
          </button>
          <button
            className="control-item anim-pop-out"
            onClick={() => {
              document.body.style = "filter: hue-rotate(70deg)";
            }}
          >
            B
          </button>
          <button
            className="control-item anim-border"
            onClick={() => {
              document.body.style = "filter: hue-rotate(105deg)";
            }}
          >
            C
          </button>
          <button
            className="control-item anim-up"
            onClick={() => {
              document.body.style = "filter: hue-rotate(140deg)";
            }}
          >
            D
          </button>
          <button
            className="control-item"
            onClick={() => {
              document.body.style = "filter: hue-rotate(180deg)";
            }}
          >
            E
          </button>
          <button
            className="control-item"
            onClick={() => {
              document.body.style = "filter: hue-rotate(270deg)";
            }}
          >
            F
          </button>
          <button
            className="control-item"
            onClick={() => {
              document.body.style = "filter: invert(0.85) hue-rotate(211deg)";
            }}
          >
            Dark Theme
          </button>
        </div>
      </header>
      <main className="svg-canvas">
        <Extractor />
      </main>
      <footer className="controls-panel controls-panel-status"></footer>
    </article>
  );
}

export default SvgEditor;

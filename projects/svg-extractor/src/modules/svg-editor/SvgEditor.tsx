import { FaPlus } from "react-icons/fa";

import { FaPenNib } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { PiSelectionBackgroundBold } from "react-icons/pi";
import { FaDrawPolygon } from "react-icons/fa";
import { MdUnfoldMore } from "react-icons/md";
import { MdViewList } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";

import "./styles.css";

import { Extractor } from "../extractor";

function SvgEditor() {
  return (
    <article className="svg-editor">
      <header className="controls-panel controls-panel-primary">
        <button className="menu-toggle">
          {/* <img src="/icon-menu.svg" /> */}
          <FaPlus size={18} />
        </button>
        <div className="controls-list">
          <button
            className="control-item anim-scale"
            onClick={() => {
              document.body.style = "filter: hue-rotate(35deg)";
            }}
          >
            <FaPenNib size={18} />
          </button>
          <button
            className="control-item anim-pop-out"
            onClick={() => {
              document.body.style = "filter: hue-rotate(70deg)";
            }}
          >
            <FaPencilAlt size={18} />
          </button>
          <button
            className="control-item anim-border"
            onClick={() => {
              document.body.style = "filter: hue-rotate(105deg)";
            }}
          >
            <PiSelectionBackgroundBold size={18} />
          </button>
          <div className="v-separator" />
          <button
            className="control-item anim-up"
            onClick={() => {
              document.body.style = "filter: hue-rotate(140deg)";
            }}
          >
            <FaDrawPolygon size={18} />
          </button>
          <button
            className="control-item"
            onClick={() => {
              document.body.style = "filter: hue-rotate(180deg)";
            }}
          >
            <IoIosColorPalette size={18} />
          </button>
          <div className="v-separator" />
          <button
            className="control-item"
            onClick={() => {
              document.body.style = "filter: hue-rotate(270deg)";
            }}
          >
            <MdViewList size={18} />
          </button>
          <button
            className="control-item"
            onClick={() => {
              document.body.style = "filter: invert(0.85) hue-rotate(211deg)";
            }}
          >
            Dark Theme
          </button>
          <button
            className="control-item"
            onClick={() => {
              document.body.style = "filter: invert(0.85) hue-rotate(211deg)";
            }}
          >
            <MdUnfoldMore size={18} />
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

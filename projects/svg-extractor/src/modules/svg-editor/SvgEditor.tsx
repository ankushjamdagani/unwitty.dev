import { FaPlus } from "react-icons/fa";

import "./styles.css";

import { Extractor } from "../extractor";
import PrimaryPanel from "./panels/PrimaryPanel";
import { ActionButton } from "../../components/control-items";

function SvgEditor() {
  return (
    <article className="svg-editor">
      <header className="controls-panel controls-panel-primary">
        <ActionButton
          onClick={console.log}
          icon={FaPlus}
          extraStyles="control-item-primary"
        />
        <PrimaryPanel />
      </header>
      <main className="svg-canvas">
        <Extractor />
      </main>
      <footer className="controls-panel controls-panel-status"></footer>
    </article>
  );
}

export default SvgEditor;

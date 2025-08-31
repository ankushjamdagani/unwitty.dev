import { FaPlus } from "react-icons/fa";
import { LuMoonStar } from "react-icons/lu";

import "./styles.css";

import { PrimaryPanel } from "./panels/primary-panel";
import { ActionButton } from "../../components/control-items";
import { FloatingPanelContainer } from "../../components/floating-panel";

function SvgEditor() {
  return (
    <article className="svg-editor-container bg-gray-100 relative w-full h-full flex dark:invert dark:hue-rotate-90">
      <FloatingPanelContainer>
        <div className="col-start-1 col-end-2 -row-start-1 -row-end-2 self-end">
          <ActionButton
            onClick={console.log}
            className="h-14 relative bg-indigo-400 border-8 border-indigo-300 text-white after:absolute after:-left-2 after:-right-2 after:-top-2 after:-bottom-2 after:rounded-4xl after:animate-ping after:bg-indigo-200 after:border after:-z-1"
          >
            <FaPlus className="h-4 w-4" />
          </ActionButton>
        </div>
        <div className="col-start-1 -col-end-1 -row-start-1 -row-end-2 self-end justify-self-center">
          <PrimaryPanel />
        </div>
        <div className="-col-start-1 -col-end-3 -row-start-1 -row-end-2 self-end justify-self-end">
          <ActionButton
            onClick={() => {
              // document.body.style = "filter: invert(0.85) hue-rotate(211deg)";
              document.body.classList.toggle("dark");
            }}
          >
            <LuMoonStar className="h-4 w-4" />
          </ActionButton>
        </div>
      </FloatingPanelContainer>
      <main className="p-5 flex flex-1">
        <div className="flex items-center justify-center flex-1 bg-gray-50 border border-gray-300 border-dashed rounded-xl">
          <div>Hello</div>
        </div>
      </main>
    </article>
  );
}

export default SvgEditor;

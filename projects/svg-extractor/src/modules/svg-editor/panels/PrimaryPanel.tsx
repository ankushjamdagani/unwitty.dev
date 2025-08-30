import {
  LuHand,
  LuMoonStar,
  LuMousePointer2,
  LuPenTool,
  LuShapes,
  LuType,
} from "react-icons/lu";
import { MdUnfoldMore } from "react-icons/md";

import ActionButton from "../../../components/control-items/ActionButton.jsx";

function PrimaryPanel() {
  return (
    <div className="controls-list">
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(70deg)";
        }}
        icon={LuMousePointer2}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(35deg)";
        }}
        icon={LuPenTool}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(140deg)";
        }}
        icon={LuShapes}
      />
      <div className="v-separator" />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(180deg)";
        }}
        icon={LuType}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(270deg)";
        }}
        icon={LuHand}
      />
      <div className="v-separator" />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: invert(0.85) hue-rotate(211deg)";
        }}
        icon={LuMoonStar}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: invert(0.85) hue-rotate(211deg)";
        }}
        icon={MdUnfoldMore}
      />
    </div>
  );
}

export default PrimaryPanel;

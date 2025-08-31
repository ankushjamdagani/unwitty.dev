import {
  LuHand,
  LuMousePointer2,
  LuPenTool,
  LuShapes,
  LuType,
  LuEllipsisVertical,
  LuSquareDashedMousePointer,
  LuPalette,
} from "react-icons/lu";

import { ActionButton } from "../../../../components/control-items";

function PrimaryPanel() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 border border-gray-200 bg-gray-100 rounded-4xl">
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(70deg)";
        }}
        icon={LuMousePointer2}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(270deg)";
        }}
        icon={LuHand}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(200deg)";
        }}
        icon={LuSquareDashedMousePointer}
      />
      <div className="h-6 border border-gray-200" />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(35deg)";
        }}
        icon={LuPenTool}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(90deg)";
        }}
        icon={LuType}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(110deg)";
        }}
        icon={LuShapes}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(140deg)";
        }}
        icon={LuPalette}
      />
      <div className="h-6 border border-gray-200" />

      <ActionButton
        onClick={() => {
          document.body.style = "filter: invert(0.85) hue-rotate(211deg)";
        }}
        icon={LuEllipsisVertical}
      />
    </div>
  );
}

export default PrimaryPanel;

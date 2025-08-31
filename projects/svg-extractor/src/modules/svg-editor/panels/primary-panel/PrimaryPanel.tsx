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

import { Toggle } from "@base-ui-components/react/toggle";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";

import { ActionButton } from "../../../../components/control-items";
import { useState } from "react";
import { ToolMode } from "../../../../state/slices/tool-mode";

function PrimaryPanel() {
  const [option, changeOption] = useState(ToolMode.SELECT);

  console.log("option", option);

  return (
    <ToggleGroup
      className="flex items-center gap-2 px-2 py-1.5 border border-gray-200 bg-gray-100 rounded-4xl"
      onValueChange={(v) => v[0] && changeOption(v[0])}
      value={[option]}
    >
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(70deg)";
        }}
        icon={LuMousePointer2}
        value={ToolMode.SELECT}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(270deg)";
        }}
        icon={LuHand}
        value={ToolMode.HAND}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(200deg)";
        }}
        icon={LuSquareDashedMousePointer}
        value={ToolMode.AREA_SELECT}
      />
      <div className="h-6 border border-gray-200" />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(35deg)";
        }}
        icon={LuPenTool}
        value={ToolMode.POINTS}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(90deg)";
        }}
        icon={LuType}
        value={ToolMode.TEXT}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(110deg)";
        }}
        icon={LuShapes}
        value={ToolMode.SHAPE}
      />
      <ActionButton
        onClick={() => {
          document.body.style = "filter: hue-rotate(140deg)";
        }}
        icon={LuPalette}
        value={ToolMode.COLOR}
      />
      <div className="h-6 border border-gray-200" />

      <ActionButton
        onClick={() => {
          document.body.style = "filter: invert(0.85) hue-rotate(211deg)";
        }}
        icon={LuEllipsisVertical}
      />
    </ToggleGroup>
  );
}

export default PrimaryPanel;

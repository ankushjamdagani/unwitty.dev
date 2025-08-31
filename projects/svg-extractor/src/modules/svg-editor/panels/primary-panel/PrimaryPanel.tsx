import {
  LuHand,
  LuMousePointer2,
  LuPenTool,
  LuShapes,
  LuType,
  LuEllipsisVertical,
  LuSquareDashedMousePointer,
} from "react-icons/lu";

import { Toolbar } from "@base-ui-components/react/toolbar";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";
import { Menu } from "@base-ui-components/react/menu";
import { Input } from "@base-ui-components/react/input";

import { ActionButton } from "../../../../components/control-items";
import { useState } from "react";
import { ToolMode } from "../../../../state/slices/tool-mode";

function PrimaryPanel() {
  const [option, changeOption] = useState(ToolMode.SELECT);
  const [color, changeColor] = useState("#0de3a3");

  return (
    <Toolbar.Root className="px-2 py-1.5 border border-gray-200 bg-gray-100 rounded-4xl">
      <ToggleGroup
        onValueChange={(v) => v[0] && changeOption(v[0])}
        value={[option]}
        className={"flex items-center gap-2"}
      >
        <Toolbar.Button
          render={<ActionButton />}
          onClick={() => {
            document.body.style = "filter: hue-rotate(70deg)";
          }}
          value={ToolMode.SELECT}
        >
          <LuMousePointer2 className="h-4 w-4" />
        </Toolbar.Button>
        <Toolbar.Button
          render={<ActionButton />}
          onClick={() => {
            document.body.style = "filter: hue-rotate(270deg)";
          }}
          value={ToolMode.HAND}
        >
          <LuHand className="h-4 w-4" />
        </Toolbar.Button>
        <Toolbar.Button
          render={<ActionButton />}
          onClick={() => {
            document.body.style = "filter: hue-rotate(200deg)";
          }}
          value={ToolMode.AREA_SELECT}
        >
          <LuSquareDashedMousePointer className="h-4 w-4" />
        </Toolbar.Button>
        <Toolbar.Separator className="h-6 border border-gray-200" />
        <Toolbar.Button
          render={<ActionButton />}
          onClick={() => {
            document.body.style = "filter: hue-rotate(35deg)";
          }}
          value={ToolMode.POINTS}
        >
          <LuPenTool className="h-4 w-4" />
        </Toolbar.Button>
        <Toolbar.Button
          render={<ActionButton />}
          onClick={() => {
            document.body.style = "filter: hue-rotate(90deg)";
          }}
          value={ToolMode.TEXT}
        >
          <LuType className="h-4 w-4" />
        </Toolbar.Button>
        <Toolbar.Button
          render={<ActionButton />}
          onClick={() => {
            document.body.style = "filter: hue-rotate(110deg)";
          }}
          value={ToolMode.SHAPE}
        >
          <LuShapes className="h-4 w-4" />
        </Toolbar.Button>
        <Toolbar.Button
          render={
            <label className="relative cursor-pointer border border-gray-300 rounded-4xl bg-gray-200 h-10 aspect-square flex items-center justify-center transition-transform hover:scale-110 overflow-hidden">
              <Input
                type="color"
                className="cursor-pointer absolute w-12 h-12 appearance-none"
                value={color}
                onChange={(e) => changeColor(e.target.value)}
              />
              {/* <LuPalette className="h-4 w-4" /> */}
            </label>
          }
          // onr
          value={ToolMode.COLOR}
        />
        <Toolbar.Separator className="h-6 border border-gray-200" />
        <Menu.Root openOnHover>
          <Toolbar.Button
            render={
              <Menu.Trigger
                render={
                  <button className="cursor-pointer border border-gray-300 rounded-4xl bg-gray-200 h-10 aspect-square flex items-center justify-center transition-transform" />
                }
              />
            }
          >
            <LuEllipsisVertical className="h-4 w-4" />
          </Toolbar.Button>
          <Menu.Portal>
            <Menu.Positioner side="top" align="end" sideOffset={12}>
              <Menu.Popup className="outline-0 focus-visible:outline border border-gray-200 bg-gray-100 rounded-xl p-1">
                {/* <Menu.Arrow>Arrow</Menu.Arrow> */}
                <Menu.Item className="outline-0 focus-visible:outline hover:bg-gray-200 px-2 py-1 cursor-pointer rounded">
                  Menu Item A
                </Menu.Item>
                <Menu.Item className="outline-0 focus-visible:outline hover:bg-gray-200 px-2 py-1 cursor-pointer rounded">
                  Menu Item B
                </Menu.Item>
                <Menu.Separator className=" w-fill m-1 border border-gray-200" />
                <Menu.Item className="outline-0 focus-visible:outline hover:bg-gray-200 px-2 py-1 cursor-pointer rounded">
                  Menu Item C
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </ToggleGroup>
    </Toolbar.Root>
  );
}

export default PrimaryPanel;

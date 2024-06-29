"use client";

import { Leva } from "leva";
import { useSearchParams } from "next/navigation";

export function LevaDebugger() {
  const searchParams = useSearchParams();
  const enableDebugger = searchParams.get("debugger");

  return (
    <Leva
      // theme={myTheme} // you can pass a custom theme (see the styling section)
      // fill // default = false,  true makes the pane fill the parent dom node it's rendered in
      flat // default = false,  true removes border radius and shadow
      // oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
      // hideTitleBar // default = false, hides the GUI header
      collapsed // default = false, when true the GUI is collpased
      hidden={enableDebugger != "true"} // default = false, when true the GUI is hidden
    />
  );
}

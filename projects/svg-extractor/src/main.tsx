import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./main.css";
import { SvgEditor } from "./modules/svg-editor";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SvgEditor />
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SvgExtractor from "./svg-extractor";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SvgExtractor />
  </StrictMode>
);

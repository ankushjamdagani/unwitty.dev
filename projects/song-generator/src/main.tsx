import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SongGenerator from "./SongGenerator";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SongGenerator />
  </StrictMode>
);

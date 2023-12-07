import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/global.css";

import AppCanvas from "./AppCanvas.tsx";
import AppUI from "./AppUI.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <>
      <AppCanvas />
      <AppUI />
    </>
  </React.StrictMode>
);

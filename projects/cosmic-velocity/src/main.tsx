import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/global.css";

import AppCanvas from "./AppCanvas";
import AppUI from "./AppUI";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <>
      <AppCanvas />
      <AppUI />
    </>
  </React.StrictMode>
);

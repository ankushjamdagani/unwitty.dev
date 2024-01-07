"use client";

import { useEffect, useRef } from "react";

import "./Cursor.styles.css";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.cursor = "none";

    function mouseHandler(evt: MouseEvent) {
      console.log("evt", evt, evt.clientX, evt.clientY);

      cursorRef.current?.animate(
        {
          left: `${evt.pageX}px`,
          top: `${evt.pageY}px`,
        },
        {
          duration: 200,
          fill: "forwards",
        }
      );
    }

    window.addEventListener("mousemove", mouseHandler);
    return () => window.removeEventListener("mousemove", mouseHandler);
  }, []);

  return <div id="cursor" ref={cursorRef}></div>;
}

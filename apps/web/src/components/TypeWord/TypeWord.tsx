"use client";

import React, { useEffect, useState } from "react";
import "./TypeWord.styles.css";
import { TypeWordCursor } from "./TypeWord.constants";

const typeToClassName = {
  [TypeWordCursor.UNDERSCORE]: "underscore",
  [TypeWordCursor.VERT_THIN]: "vertical",
  [TypeWordCursor.VERT_THICK]: "fat",
  [TypeWordCursor.VERT_THICK_BORDERED]: "fat-bordered",
};

export function TypeWord({
  children,
  time,
  cursorType = TypeWordCursor.UNDERSCORE,
}: {
  children: string;
  time: number;
  cursorType?: TypeWordCursor;
}) {
  const characters = children;
  const totalItems = characters.length;

  const [visibleItems, setVisibileItems] = useState(0);

  useEffect(() => {
    const timePerItem = time / totalItems;
    const timeout = setTimeout(() => {
      setVisibileItems((items) => Math.min(items + 1, totalItems));
    }, timePerItem);

    return () => {
      clearTimeout(timeout);
    };
  }, [totalItems, time, visibleItems]);

  return (
    <>
      {characters.slice(0, visibleItems)}
      <span
        className={`typing-indicator ${typeToClassName[cursorType]} ${
          visibleItems == totalItems ? "blink" : ""
        }`}
      ></span>
    </>
  );
}

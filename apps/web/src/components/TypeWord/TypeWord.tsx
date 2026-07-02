"use client";

import React, { useEffect, useState } from "react";
import { TypeWordCursor } from "./TypeWord.constants";

const typeToClassName = {
  [TypeWordCursor.UNDERSCORE]: "h-[0.125em] w-[0.75em] bottom-0 left-[0.25em]",
  [TypeWordCursor.VERT_THIN]:
    "h-[1.25em] w-[0.125em] top-[0.25em] left-[0.25em]",
  [TypeWordCursor.VERT_THICK]:
    "h-[1.25em] w-[0.375em] top-[0.25em] left-[0.25em]",
  [TypeWordCursor.VERT_THICK_BORDERED]:
    "h-[1.25em] w-[0.375em] top-[0.25em] left-[0.25em] bg-canvas-contrast border border-solid",
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
        className={`bg-fg-contrast relative inline-flex ${typeToClassName[cursorType]} ${
          visibleItems == totalItems
            ? "animate-[blink-animation_1s_steps(5,start)_infinite]"
            : ""
        }`}
      ></span>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { PolymorphicComponent } from "@/types/PolymorphicComponent";

type Word = React.ReactNode;

type ComponentProps = {
  words: Word[];
  startIndex?: number;
  /**
   * in milliseconds
   */
  transitionTime: number;
  /**
   * in milliseconds
   */
  delayTime?: number;
};

export function AnimatedWordList<T extends React.ElementType = "span">(
  props: PolymorphicComponent<T, ComponentProps>
) {
  const {
    words,
    startIndex = 0,
    transitionTime,
    delayTime = 0,
    as: Component = "span",
    ...restProps
  } = props;

  const [currentIndex, setCurrentIndex] = useState(startIndex || 0);
  const activeWord = words.at(currentIndex % words.length);

  useEffect(() => {
    let transitionTimer: NodeJS.Timeout;

    const delayTimer = setTimeout(() => {
      transitionTimer = setInterval(() => {
        setCurrentIndex((curr) => curr + 1);
      }, transitionTime);
    }, delayTime);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(transitionTimer);
    };
  }, [delayTime, transitionTime]);

  return <Component {...restProps}>{activeWord}</Component>;
}

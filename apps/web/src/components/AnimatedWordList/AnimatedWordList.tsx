"use client";

import { useEffect, useState } from "react";

type Word = string | JSX.Element;

type AnimatedWordListProps = {
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

export function AnimatedWordList(props: AnimatedWordListProps) {
  const { words, startIndex = 0, transitionTime, delayTime = 0 } = props;

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

  return <>{activeWord}</>;
}

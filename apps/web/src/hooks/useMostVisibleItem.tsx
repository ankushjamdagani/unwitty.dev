import { useEffect, useState } from "react";

import throttle from "@/utils/throttle";

export default function useMostVisibileItemOnScroll<T extends HTMLElement>(
  selector: string,
  updateDelay: number = 100
) {
  const [mostVisibleElement, setMostVisibleElement] = useState<T | null>(null);

  useEffect(() => {
    const allSections = document.querySelectorAll(selector) as unknown as T[];

    function updateActiveLink() {
      const sectionVisible: number[] = [];

      allSections.forEach((section) => {
        const elementTop = section.offsetTop;
        const elementBottom = elementTop + section.clientHeight;

        const visibleTop = window.scrollY;
        const visibleBottom = window.scrollY + window.innerHeight;

        let overlap: number;
        if (elementTop > visibleBottom || elementBottom < visibleTop) {
          overlap = 0;
        } else {
          overlap =
            Math.min(elementBottom, visibleBottom) -
            Math.max(elementTop, visibleTop);
        }

        sectionVisible.push(overlap);
      });

      const maxVisibleSection = sectionVisible.indexOf(
        Math.max(...sectionVisible)
      );

      const activeSection = allSections[maxVisibleSection];
      if (activeSection) {
        setMostVisibleElement(activeSection);
      }
    }

    const throttledScrollHandler = throttle(updateActiveLink, updateDelay);

    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
    };
  }, [selector, updateDelay]);

  return mostVisibleElement;
}

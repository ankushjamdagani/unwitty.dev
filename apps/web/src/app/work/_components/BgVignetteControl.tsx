"use client";

import { useEffect } from "react";
import { useControls } from "leva";

export function BgVignetteControl() {
  const { bgVignetteVisible } = useControls({
    bgVignetteVisible: {
      value: true,
      label: "BG Vignette",
    },
  });

  useEffect(() => {
    const root = document.documentElement;
    if (bgVignetteVisible) {
      root.removeAttribute("data-vignette");
    } else {
      root.setAttribute("data-vignette", "off");
    }
    return () => {
      root.removeAttribute("data-vignette");
    };
  }, [bgVignetteVisible]);

  return null;
}

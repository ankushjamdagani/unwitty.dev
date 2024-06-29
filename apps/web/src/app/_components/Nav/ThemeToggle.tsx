"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

enum themeOptions {
  light = "light",
  dark = "dark",
}

function getDefaultTheme(): themeOptions {
  const localStorageTheme = localStorage.getItem("theme") as themeOptions;

  if (localStorageTheme !== null && localStorageTheme in themeOptions) {
    return localStorageTheme;
  }

  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

  if (systemSettingDark.matches) {
    return themeOptions.dark;
  }

  return themeOptions.light;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<themeOptions>(getDefaultTheme);
  const ariaLabel =
    theme === "dark" ? "Change to light theme" : "Change to dark theme";

  function toggleTheme() {
    const newTheme =
      theme === themeOptions.light ? themeOptions.dark : themeOptions.light;
    setTheme(newTheme);

    localStorage.setItem("theme", newTheme);
  }

  useEffect(() => {
    const htmlElem = document.querySelector("html");

    if (htmlElem) {
      htmlElem.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return (
    <div id="theme-switcher">
      <button aria-label={ariaLabel} onClick={toggleTheme}>
        {theme == themeOptions.light ? <FaMoon /> : <FaSun />}
      </button>
    </div>
  );
}

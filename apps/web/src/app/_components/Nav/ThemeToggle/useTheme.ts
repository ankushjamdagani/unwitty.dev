"use client";

import { useCallback, useEffect, useState } from "react";

export const THEMES = ["warm", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "theme";

function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isTheme(stored)) return stored;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    const initial = readInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  useEffect(() => {
    if (!theme) return;
    const handler = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && isTheme(event.newValue)) {
        setThemeState(event.newValue);
        applyTheme(event.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: next })
      );
    } catch {
      /* localStorage may be unavailable */
    }
  }, []);

  const cycleTheme = useCallback(() => {
    const current = theme ?? "light";
    const idx = THEMES.indexOf(current);
    const next = THEMES[(idx + 1) % THEMES.length]!;
    setTheme(next);
  }, [theme, setTheme]);

  return { theme, setTheme, cycleTheme };
}

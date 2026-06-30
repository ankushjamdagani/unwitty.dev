import React from "react";
import { FaMoon } from "react-icons/fa6";
import { LuFlame, LuSun } from "react-icons/lu";

import type { Theme } from "./useTheme";

export type ThemeOption = {
  theme: Theme;
  label: string;
  Icon: React.ElementType;
};

export const THEME_OPTIONS: ThemeOption[] = [
  { theme: "warm", label: "Warm", Icon: LuFlame },
  { theme: "light", label: "Light", Icon: LuSun },
  { theme: "dark", label: "Dark", Icon: FaMoon },
];

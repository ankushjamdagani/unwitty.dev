import { ReactNode, useState, createContext } from "react";

export enum Theme {
  // DARK = "DARK",
  LIGHT = "LIGHT",
  // ORANGE = "ORANGE",
  // VINTAGE = "VINTAGE",
  // FUTURISTIC = "FUTURISTIC",
}

export const ThemeConfig = {
  [Theme.LIGHT]: {
    board: {
      background: "#000",
    },
    piece: {},
  },
};

export const ThemeContext = createContext({});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<typeof ThemeConfig[Theme]>(ThemeConfig[Theme.LIGHT]);

  function updateTheme(theme: Theme) {
    setTheme(ThemeConfig[theme]);
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

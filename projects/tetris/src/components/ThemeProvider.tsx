import { ReactNode, useState, createContext } from "react";
import { PieceType } from "../hooks/usePiece";

export enum Theme {
  // DARK = "DARK",
  LIGHT = "LIGHT",
  // ORANGE = "ORANGE",
  // VINTAGE = "VINTAGE",
  // FUTURISTIC = "FUTURISTIC",
}

type ColorIndex = number;
export type Color = string;

export type ThemeConfig = {
  board: {
    background: ColorIndex;
  };
  piece: Record<PieceType, ColorIndex | (() => ColorIndex)>;
  colors: Record<ColorIndex, Color>;
};

export const ThemeConfigMap: Record<Theme, ThemeConfig> = {
  [Theme.LIGHT]: {
    board: {
      background: 0,
    },
    piece: {
      [PieceType.I]: 1,
      [PieceType.J]: 1,
      [PieceType.L]: 1,
      [PieceType.O]: 1,
      [PieceType.S]: () => 2,
      [PieceType.T]: 1,
      [PieceType.Z]: 1,
    },
    colors: {
      0: "#000",
      1: "red",
      2: "blue",
      3: "green",
    },
  },
};

export const ThemeContext = createContext({});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<(typeof ThemeConfigMap)[Theme]>(
    ThemeConfigMap[Theme.LIGHT]
  );

  function updateTheme(theme: Theme) {
    setTheme(ThemeConfigMap[theme]);
  }

  function getPieceColor(theme: ThemeConfig, piece: PieceType) {
    const colorIndex =
      typeof theme.piece[piece] === "function"
        ? theme.piece[piece]()
        : theme.piece[piece];
    return theme.colors[colorIndex];
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, getPieceColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

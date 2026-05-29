"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type LedgerTheme = "blueprint" | "editorial" | "structural" | "hybrid";

type LedgerThemeContextType = {
  theme: LedgerTheme;
  setTheme: (theme: LedgerTheme) => void;
};

const LedgerThemeContext = createContext<LedgerThemeContextType | undefined>(
  undefined,
);

export const LedgerThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setThemeState] = useState<LedgerTheme>("blueprint");

  // Read initial layout theme from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("ledger-schema-theme") as LedgerTheme;
    if (saved && ["blueprint", "editorial", "structural", "hybrid"].includes(saved)) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: LedgerTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("ledger-schema-theme", newTheme);
  };

  return (
    <LedgerThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </LedgerThemeContext.Provider>
  );
};

export const useLedgerTheme = () => {
  const context = useContext(LedgerThemeContext);
  if (context === undefined) {
    throw new Error("useLedgerTheme must be used within a LedgerThemeProvider");
  }
  return context;
};

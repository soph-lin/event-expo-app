import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Theme, ThemeColors } from "@/types/theme";
import { THEMES } from "@/utils/themes";
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(THEMES[0]);

  useEffect(() => {
    // Load saved theme
    AsyncStorage.getItem("theme").then((savedTheme) => {
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
      }
    });
  }, []);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    AsyncStorage.setItem("theme", JSON.stringify(newTheme));
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: handleThemeChange, colors: theme.colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

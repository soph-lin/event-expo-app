import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ThemeColors = {
  background: string;
  text: string;
  card: string;
  cardText: string;
  gradient: [string, string];
};

export type Theme = {
  name: string;
  colors: ThemeColors;
  icon: string;
};

export const THEMES: Theme[] = [
  {
    name: "Strawberry",
    colors: {
      background: "#FF6B6B",
      text: "#FFFFFF",
      card: "#4ECDC4",
      cardText: "#2C3E50",
      gradient: ["#FF6B6B", "#FFB6C1"] as [string, string],
    },
    icon: "sunny",
  },
  {
    name: "Neon",
    colors: {
      background: "#2C3E50",
      text: "#FFFFFF",
      card: "#9B59B6",
      cardText: "#FFFFFF",
      gradient: ["#2C3E50", "#3498DB"] as [string, string],
    },
    icon: "moon",
  },
  {
    name: "Coffee Shop",
    colors: {
      background: "#F4ECD8",
      text: "#5B4036",
      card: "#E6D5C3",
      cardText: "#5B4036",
      gradient: ["#F4ECD8", "#E6D5C3"] as [string, string],
    },
    icon: "cafe",
  },
];

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

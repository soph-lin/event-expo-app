import { Theme } from "@/types/theme";

export const THEMES: Theme[] = [
  {
    name: "Sakura",
    colors: {
      background: "#F8E8EE",
      text: "#867070",
      card: "#ffb6c1",
      cardText: "#867070",
      gradient: ["#F8E8EE", "#ffb6c1"] as [string, string],
    },
    icon: "flower",
  },
  {
    name: "Nature",
    colors: {
      background: "#E8F5E9",
      text: "#1B5E20",
      card: "#C8E6C9",
      cardText: "#1B5E20",
      gradient: ["#E8F5E9", "#C8E6C9"] as [string, string],
    },
    icon: "leaf",
  },
  {
    name: "Sepia",
    colors: {
      background: "#F4ECD8",
      text: "#5B4036",
      card: "#E6D5C3",
      cardText: "#5B4036",
      gradient: ["#F4ECD8", "#E6D5C3"] as [string, string],
    },
    icon: "cafe",
  },
  {
    name: "Sunny",
    colors: {
      background: "#FFF9C4",
      text: "#F57F17",
      card: "#FFEB3B",
      cardText: "#F57F17",
      gradient: ["#FFF9C4", "#FFEB3B"] as [string, string],
    },
    icon: "sunny",
  },
  {
    name: "Night",
    colors: {
      background: "#2C1B47",
      text: "#E1E1E1",
      card: "#4A2B6B",
      cardText: "#E1E1E1",
      gradient: ["#2C1B47", "#4A2B6B"] as [string, string],
    },
    icon: "moon",
  },
]; 
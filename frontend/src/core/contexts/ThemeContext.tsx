"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type ColorTheme =
  | "default"
  | "original"
  | "nature"
  | "fresh"
  | "forest"
  | "ocean"
  | "vibrant";

// Centralized theme configuration - update colors here for the entire app
export const themeConfig = {
  light: {
    // Background colors - Minimal white and light gray
    background: {
      primary: "#ffffff", // Pure white
      secondary: "#f8f9fa", // Very light gray
      tertiary: "#e9ecef", // Light gray
      card: "#ffffff", // White cards
      cardHover: "#f8f9fa", // Light hover
      modal: "#ffffff", // White modals
      modalOverlay: "rgba(0, 0, 0, 0.1)", // Semi-transparent black
    },
    // Text colors - Black and dark gray
    text: {
      primary: "#000000", // Black (main text)
      secondary: "#495057", // Dark gray
      tertiary: "#6c757d", // Medium gray
      muted: "#adb5bd", // Light gray
      inverse: "#ffffff", // White text on dark backgrounds
    },
    // Border colors - Single consistent color
    border: {
      primary: "#dee2e6", // Light gray borders
      secondary: "#dee2e6", // Same as primary
      accent: "#08CB00", // Green accent borders
      focus: "#08CB00", // Green focus borders
    },
    // Accent colors - Green only
    accent: {
      primary: "#08CB00", // Green (main accent)
      secondary: "#08CB00", // Green (secondary)
      success: "#08CB00", // Green (success)
      warning: "#ffc107", // Yellow warning
      error: "#dc3545", // Red error
      info: "#6c757d", // Gray info
    },
    // Navigation colors
    navigation: {
      background: "#ffffff", // White nav background
      border: "#dee2e6", // Consistent border color
      text: "#000000", // Black text
      textHover: "#08CB00", // Green hover text
      buttonHover: "#08CB00", // Green hover background
      linkHover: "#08CB00", // Green link hover
    },
    // Button colors
    button: {
      primary: "#08CB00", // Green primary buttons
      primaryHover: "#06a800", // Darker green hover
      secondary: "#e9ecef", // Light gray secondary
      secondaryHover: "#dee2e6", // Medium gray hover
      outline: "#dee2e6", // Light gray outline
      outlineHover: "#ced4da", // Medium gray outline hover
    },
    // Shadow colors
    shadow: {
      small: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // Subtle shadows
      medium: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", // Medium shadows
      large: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", // Large shadows
    },
  },
  dark: {
    // Background colors - Dark and black
    background: {
      primary: "#222222", // Dark gray background
      secondary: "#1a1a1a", // Very dark gray
      tertiary: "#2d2d2d", // Dark gray
      card: "#222222", // Dark card background
      cardHover: "#2d2d2d", // Darker hover
      modal: "#222222", // Dark modal background
      modalOverlay: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
    },
    // Text colors - White and light gray
    text: {
      primary: "#ffffff", // White (main text)
      secondary: "#e9ecef", // Light gray
      tertiary: "#ced4da", // Medium light gray
      muted: "#adb5bd", // Medium gray
      inverse: "#000000", // Black text on light backgrounds
    },
    // Border colors - Single consistent color
    border: {
      primary: "#495057", // Dark gray borders
      secondary: "#495057", // Same as primary
      accent: "#08CB00", // Green accent borders
      focus: "#08CB00", // Green focus borders
    },
    // Accent colors - Green only
    accent: {
      primary: "#08CB00", // Green (main accent)
      secondary: "#08CB00", // Green (secondary)
      success: "#08CB00", // Green (success)
      warning: "#ffc107", // Yellow warning
      error: "#dc3545", // Red error
      info: "#6c757d", // Gray info
    },
    // Navigation colors
    navigation: {
      background: "#222222", // Dark gray background
      border: "#495057", // Consistent border color
      text: "#ffffff", // White text
      textHover: "#08CB00", // Green hover
      buttonHover: "#08CB00", // Green button hover
      linkHover: "#08CB00", // Green link hover
    },
    // Button colors
    button: {
      primary: "#08CB00", // Green primary buttons
      primaryHover: "#06a800", // Darker green hover
      secondary: "#2d2d2d", // Dark gray secondary
      secondaryHover: "#495057", // Medium dark gray hover
      outline: "#495057", // Dark gray outline
      outlineHover: "#6c757d", // Medium gray outline hover
    },
    // Shadow colors
    shadow: {
      small: "0 1px 2px 0 rgba(0, 0, 0, 0.3)", // ⚫ Dark shadows
      medium: "0 4px 6px -1px rgba(0, 0, 0, 0.4)", // ⚫ Medium dark shadows
      large: "0 10px 15px -3px rgba(0, 0, 0, 0.4)", // ⚫ Large dark shadows
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setColorTheme: (theme: ColorTheme) => void;
  isDarkMode: boolean;
  colors: typeof themeConfig.light | typeof themeConfig.dark;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("default");

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("pineder-theme") as Theme;
    const savedColorTheme = localStorage.getItem(
      "pineder-color-theme"
    ) as ColorTheme;

    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;

    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }

    // Apply color theme
    root.setAttribute("data-color-theme", colorTheme);

    // Save to localStorage
    localStorage.setItem("pineder-theme", theme);
    localStorage.setItem("pineder-color-theme", colorTheme);
  }, [theme, colorTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const changeColorTheme = (newColorTheme: ColorTheme) => {
    setColorTheme(newColorTheme);
  };

  // Get current theme colors
  const colors = theme === "light" ? themeConfig.light : themeConfig.dark;

  const value: ThemeContextType = {
    theme,
    colorTheme,
    toggleTheme,
    setColorTheme: changeColorTheme,
    isDarkMode: theme !== "light",
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

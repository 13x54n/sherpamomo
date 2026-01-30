// Dark E-commerce Theme
export const colors = {
  // Background colors
  background: "#0a0a0a",
  surface: "#141414",
  surfaceElevated: "#1a1a1a",
  
  // Primary accent (warm amber/gold)
  primary: "#f59e0b",
  primaryDark: "#d97706",
  primaryLight: "#fbbf24",
  
  // Text colors
  textPrimary: "#ffffff",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
  
  // Border colors
  border: "#27272a",
  borderLight: "#3f3f46",
  
  // Status colors
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  
  // Overlay
  overlay: "rgba(0, 0, 0, 0.5)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
  },
};

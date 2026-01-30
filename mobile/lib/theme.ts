// Light (white) e-commerce theme
export const colors = {
  // Background colors
  background: "#ffffff",
  surface: "#f8f9fa",
  surfaceElevated: "#f1f3f5",

  // Primary (black buttons)
  primary: "#000000",
  primaryDark: "#1a1a1a",
  primaryLight: "#262626",

  // Text colors
  textPrimary: "#111827",
  textSecondary: "#4b5563",
  textMuted: "#6b7280",

  // Border colors
  border: "#e5e7eb",
  borderLight: "#f3f4f6",

  // Status colors
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",

  // Overlay
  overlay: "rgba(0, 0, 0, 0.4)",
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

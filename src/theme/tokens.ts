// Figma Design Tokens - RunWave Dark Theme for React Native
// Android/iOS 모두 동일하게 보이도록 설계

export const colors = {
  // Primary Colors
  primary: {
    light: "#0A84FF",
    dark: "#0066CC",
  },
  danger: {
    light: "#FF6B6B",
    dark: "#FF8E53",
  },
  success: {
    light: "#4CAF50",
    dark: "#66BB6A",
  },
  purple: {
    light: "#9C27B0",
    dark: "#BA68C8",
  },
  gray: {
    100: "#F0F4FF",
    200: "#EEF0F5",
    300: "#6A6F80",
    900: "#0A0A0A",
  },
  white: "#FFFFFF",
  // Background Colors
  background: "#0A0A0A",
  card: "#1C1C1E",
  cardBorder: "#2C2C2E",
  // Text Colors
  textStrong: "#FFFFFF",
  text: "#EBEBF5",
  textLight: "#8E8E93",
  textMuted: "#6A6F80",
  // Status Colors
  error: "#FF3B30",
  warning: "#FF9800",
  info: "#2196F3",
};

// Gradient Arrays for expo-linear-gradient
export const gradients = {
  primary: ["#0A84FF", "#0066CC"],
  orange: ["#FF6B6B", "#FF8E53"],
  green: ["#4CAF50", "#66BB6A"],
  purple: ["#9C27B0", "#BA68C8"],
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "800" as const,
    letterSpacing: -0.02,
    lineHeight: 38.4,
  },
  h2: {
    fontSize: 20,
    fontWeight: "600" as const,
    letterSpacing: -0.01,
    lineHeight: 26,
  },
  body: {
    fontSize: 15,
    fontWeight: "500" as const,
    lineHeight: 22.5,
  },
  caption: {
    fontSize: 13,
    fontWeight: "500" as const,
    lineHeight: 18.2,
  },
  small: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16.8,
  },
  stat: {
    fontSize: 26,
    fontWeight: "800" as const,
    letterSpacing: -0.01,
    lineHeight: 31.2,
  },
  statLarge: {
    fontSize: 28,
    fontWeight: "800" as const,
    letterSpacing: -0.01,
    lineHeight: 33.6,
  },
  statXLarge: {
    fontSize: 48,
    fontWeight: "800" as const,
    letterSpacing: -0.02,
    lineHeight: 57.6,
  },
};

// React Native Shadow Styles
// Figma shadow를 React Native shadowColor + shadowOffset + shadowOpacity + elevation로 변환
export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Android
  },
  hero: {
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12, // Android
  },
  heroBlue: {
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12, // Android
  },
  goal: {
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10, // Android
  },
  challenge: {
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12, // Android
  },
  fab: {
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 16, // Android
  },
};

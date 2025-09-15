// src/theme/theme.ts
import { colors as baseColors } from "./colors";



export const theme = {

  
  


  colors: {
    ...baseColors,
    white: "#FFFFFF",
    black: "#000000",
    grayLight: "#F1F5F9",
    grayMedium: "#CBD5E1",
    grayDark: "#475569",
    purpleLight: "#A78BFA",
    purpleDark: "#7C3AED",
  },

  typography: {
    heading1: { fontSize: 28, fontWeight: "bold" as const, lineHeight: 36 },
    heading2: { fontSize: 24, fontWeight: "bold" as const, lineHeight: 32 },
    heading3: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
    small: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
    label: { fontSize: 12, fontWeight: "500" as const, lineHeight: 16 },
  },
  

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },

  shadows: {
    light: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    heavy: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 6,
    },
  },

  gradients: {
    purple: ["#A78BFA", "#7C3AED"],
    dailyStrength: ["#7C3AED", "#6D28D9"],
    prayerCard: ["#FFFFFF", "#F8FAFC"],
  },
};


export type ThemeType = typeof theme;

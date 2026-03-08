// Official clean academic emerald palette
export const colors = {
  primary: {
    DEFAULT: "#059669", // emerald-600, official and clean
    dark: "#047857", // emerald-700
    light: "#34d399", // emerald-400
    foreground: "#FFFFFF",
    muted: "#ecfdf5", // emerald-50
  },
  accent: "#10b981", // emerald-500
  background: "#FFFFFF", // pure white for clean look
  surface: "#F9FAFB", // gray-50 for cards
  border: "#E5E7EB", // gray-200
  text: {
    primary: "#111827", // gray-900 (near-black)
    secondary: "#4B5563", // gray-600
  },
  status: {
    active: "#059669",
    completed: "#6B7280",
    warning: "#D97706",
    error: "#DC2626",
    info: "#059669",
  },
  hero: "#F3F4F6", // very light gray for hero background
} as const;

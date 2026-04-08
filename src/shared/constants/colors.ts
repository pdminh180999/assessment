export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    700: '#15803d',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    700: '#b91c1c',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    700: '#b45309',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    500: '#6b7280',
    700: '#374151',
    900: '#111827',
  },
} as const

export const getThemeClasses = (isDark: boolean = true) => ({
  bgOverlay: isDark ? 'bg-black/40' : 'bg-black/20',
  modalBg: isDark ? 'bg-gray-900/90' : 'bg-white/10',
  dockBg: isDark ? 'bg-gray-900/80' : 'bg-white/10',
  textColor: isDark ? 'text-white' : 'text-white',
  inputBg: isDark ? 'bg-gray-800/80' : 'bg-white/10',
  borderColor: isDark ? 'border-gray-700/50' : 'border-white/20',
  cardBg: isDark ? 'bg-gray-800' : 'bg-white',
  cardText: isDark ? 'text-white' : 'text-gray-900',
  cardSubtext: isDark ? 'text-gray-400' : 'text-gray-600',
});

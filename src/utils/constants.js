export const getThemeClasses = (isDark) => ({
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

import React from 'react'
import { Search } from 'lucide-react'
import { getThemeClasses } from '@/shared/constants'

interface SearchBarProps {
  show: boolean
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  theme: 'light' | 'dark'
}

export const SearchBar: React.FC<SearchBarProps> = ({ show, value, onChange, onKeyDown, theme }: SearchBarProps) => {
  if (!show) return null

  const isDark = theme === 'dark'
  const themeClasses = getThemeClasses(isDark)
  const { dockBg, borderColor, textColor } = themeClasses

  return (
    <div className="pointer-events-auto fixed bottom-36 left-1/2 -translate-x-1/2 z-30">
      <div className={`${dockBg} backdrop-blur-xl rounded-full px-6 py-3 border ${borderColor} shadow-xl w-80`}>
        <div className="flex items-center gap-3">
          <Search className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-white/70'}`} />
          <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="Filter stacks"
            className={`flex-1 bg-transparent ${textColor} placeholder-${isDark ? 'gray-500' : 'white/50'} outline-none`}
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}

import { Wishlist } from '@/shared/types'
import { StackZone } from '@/features/dnd/components'
import React, { useEffect, useRef, useState } from 'react'
import { getThemeClasses } from '@/shared/constants'
import { generateCover } from '@/shared/utils'
import { Ellipsis, Pencil, Trash2 } from 'lucide-react'

interface WishlistCardProps {
  active: boolean
  stack: Wishlist
  theme: 'light' | 'dark'
  isDark: boolean
  onStackClick: (stack: Wishlist) => void
  onEdit: (stack: Wishlist) => void
  onDelete: (id: string) => void
}

export const WishlistButton: React.FC<WishlistCardProps> = ({
                                                              active,
                                                              stack,
                                                              theme,
                                                              isDark,
                                                              onStackClick,
                                                              onEdit,
                                                              onDelete,
                                                            }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const themeClasses = getThemeClasses(theme === 'dark')
  const { borderColor } = themeClasses

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <StackZone stack={stack}>
      <div className="relative flex flex-col gap-1 items-center w-16" ref={ref}>
        <button
          key={stack.id}
          onClick={() => onStackClick(stack)}
          className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-transform ${active ? 'ring-2 ring-white scale-110' : ''}`}
          style={{ background: stack.cover ? stack.cover : generateCover() }}
        >
                <span className="text-white text-xl font-bold">
                  {stack.name.charAt(0).toUpperCase()}
                </span>
          {stack.items.length > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                        {stack.items.length}
                    </span>
          )}
        </button>
        <div className="relative flex gap-2 items-center justify-center w-14">
          <span className="text-[12px] text-white truncate text-center">{stack.name}</span>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-0.5 rounded hover:bg-white/20 transition-colors"
            aria-label="Wishlist options menu"
          >
            <Ellipsis className="w-[12px] h-[12px] text-white" />
          </button>
        </div>
        {open && (
          <div
            className={`absolute -top-8 right-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-2 w-40 z-50 border ${borderColor}`}>
            <button
              onClick={() => {
                onEdit(stack)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg text-left transition-colors`}
              aria-label="Edit wishlist"
            >
              <Pencil className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span
                className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit</span>
            </button>
            <button
              onClick={() => {
                onDelete(stack.id)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-50'} rounded-lg text-left transition-colors`}
              aria-label="Delete wishlist"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-500">Delete</span>
            </button>
          </div>
        )}
      </div>
    </StackZone>
  )
}

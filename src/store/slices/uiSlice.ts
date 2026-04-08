import { StateCreator } from 'zustand'

export interface UISlice {
  isLoading: boolean
  isCreateModalOpen: boolean
  isDockOpen: boolean
  isSearchOpen: boolean
  error: string | null
  setLoading: (isLoading: boolean) => void
  setCreateModalOpen: (isOpen: boolean) => void
  setDockOpen: (isOpen: boolean) => void
  setSearchOpen: (isOpen: boolean) => void
  setError: (error: string | null) => void
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  isLoading: false,
  isCreateModalOpen: false,
  isDockOpen: false,
  isSearchOpen: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
  setDockOpen: (isOpen) => set({ isDockOpen: isOpen }),
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  setError: (error) => set({ error }),
})

import { StateCreator } from 'zustand'

export interface FilterSlice {
  searchQuery: string
  setSearchQuery: (query: string) => void
  resetFilters: () => void
}

export const createFilterSlice: StateCreator<FilterSlice> = (set) => ({
  searchQuery: '',
  filterType: 'all',
  sortOrder: 'desc',

  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set({ searchQuery: '' }),
})

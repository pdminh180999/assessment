import { useMemo } from 'react'
import { useStore } from '@/store'
import { useDebounce } from '@/shared/hooks'

export const useSearch = () => {
  const wishlists = useStore((state) => state.wishlists)
  const searchQuery = useStore((state) => state.searchQuery)
  const setSearchQuery = useStore((state) => state.setSearchQuery)

  // Debounce search query for better performance
  const debouncedQuery = useDebounce(searchQuery, 300)

  const filteredWishlists = useMemo(() => {
    let filtered = [...wishlists]

    // Search by name
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase()
      filtered = filtered.filter((wishlist) => {
        return wishlist.name.toLowerCase().includes(query)
      })
    }

    return filtered
  }, [wishlists, debouncedQuery])

  return {
    searchQuery,
    setSearchQuery,
    filteredWishlists,
  }
}

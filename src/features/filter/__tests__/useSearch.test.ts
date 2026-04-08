import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSearch } from '@/features'
import { useStore } from '@/store'

describe('useSearch', () => {
  beforeEach(() => {
    const { setWishlists } = useStore.getState()
    setWishlists([
      {
        id: '1',
        cover: 'https://example.com/cover1.jpg',
        name: 'Birthday Gifts',
        items: [
          { id: 'i1', title: 'Book', description: 'Novel', createdAt: new Date().toISOString(), wishlistId: '1' },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        cover: 'https://example.com/cover2.jpg',
        name: 'Vacation Items',
        items: [
          { id: 'i2', title: 'Camera', description: 'DSLR', createdAt: new Date().toISOString(), wishlistId: '2' },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  })

  it('should filter wishlists by search query', () => {
    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setSearchQuery('Birthday')
    })

    // Wait for debounce
    setTimeout(() => {
      expect(result.current.filteredWishlists).toHaveLength(1)
      expect(result.current.filteredWishlists[0]?.name).toBe('Birthday Gifts')
    }, 400)
  })
})
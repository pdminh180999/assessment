import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from '@/store'
import { wishlistRepository } from '@/services'
import { useToast } from '@/shared/components/Toast'
import { useWishlist } from '@/features'

vi.mock('@/store', () => ({
  useStore: vi.fn(),
}))

vi.mock('@/services', () => ({
  wishlistRepository: {
    getAll: vi.fn(),
  },
}))

vi.mock('@/shared/components/Toast', () => ({
  useToast: vi.fn(),
}))

describe('useWishlist', () => {
  let storeMock: any
  let toastMock: any

  beforeEach(() => {
    storeMock = {
      wishlists: [],
      setWishlists: vi.fn(),
      currentWishlist: null,
      setCurrentWishlist: vi.fn(),
      currentItem: null,
      setCurrentItem: vi.fn(),
      addWishlist: vi.fn(),
      updateWishlist: vi.fn(),
      deleteWishlist: vi.fn(),
      addItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
      moveItem: vi.fn(),
      swipeIndex: 0,
      setSwipeIndex: vi.fn(),
      swipeLeft: vi.fn(),
      swipeRight: vi.fn(),
    }

    toastMock = {
      success: vi.fn(),
      error: vi.fn(),
    }

    ;(useStore as any).mockReturnValue(storeMock)
    ;(useToast as any).mockReturnValue(toastMock)
  })

  it('should load wishlists successfully', async () => {
    const data = [{ id: '1' }]
    ;(wishlistRepository.getAll as any).mockResolvedValue(data)

    const { result } = renderHook(() => useWishlist())

    await act(async () => {
      await result.current.loadWishlists()
    })

    expect(storeMock.setWishlists).toHaveBeenCalledWith(data)
  })

  it('should show error toast when load fails', async () => {
    ;(wishlistRepository.getAll as any).mockRejectedValue(new Error())

    const { result } = renderHook(() => useWishlist())

    await act(async () => {
      await result.current.loadWishlists()
    })

    expect(toastMock.error).toHaveBeenCalledWith('Failed to load wishlists')
  })

  it('should create wishlist', async () => {
    const { result } = renderHook(() => useWishlist())

    await act(async () => {
      await result.current.createWishlist({ name: 'Test' } as any)
    })

    expect(storeMock.addWishlist).toHaveBeenCalled()
    expect(toastMock.success).toHaveBeenCalledWith('Wishlist created successfully')
  })

  it('should handle create wishlist error', async () => {
    storeMock.addWishlist.mockImplementation(() => {
      throw new Error()
    })

    const { result } = renderHook(() => useWishlist())

    await act(async () => {
      await result.current.createWishlist({ name: 'Test' } as any)
    })

    expect(toastMock.error).toHaveBeenCalledWith('Failed to create wishlist')
  })

  it('should delete wishlist', async () => {
    const { result } = renderHook(() => useWishlist())

    await act(async () => {
      await result.current.removeWishlist('1')
    })

    expect(storeMock.deleteWishlist).toHaveBeenCalledWith('1')
    expect(toastMock.success).toHaveBeenCalledWith('Wishlist deleted')
  })

  it('should add item', async () => {
    const { result } = renderHook(() => useWishlist())

    await act(async () => {
      await result.current.createItem('1', { name: 'Item' } as any)
    })

    expect(storeMock.addItem).toHaveBeenCalled()
    expect(toastMock.success).toHaveBeenCalledWith('Item added to wishlist')
  })

  it('should remove item', async () => {
    const { result } = renderHook(() => useWishlist())

    await act(async () => {
      await result.current.removeItem('1', 'item-1')
    })

    expect(storeMock.deleteItem).toHaveBeenCalledWith('1', 'item-1')
    expect(toastMock.success).toHaveBeenCalledWith('Item removed')
  })

  it('should move item', async () => {
    const { result } = renderHook(() => useWishlist())

    await act(async () => {
      await result.current.relocateItem('1', '2', 'item-1')
    })

    expect(storeMock.moveItem).toHaveBeenCalledWith('1', '2', 'item-1')
    expect(toastMock.success).toHaveBeenCalledWith('Item moved')
  })

  it('should handle move error', async () => {
    storeMock.moveItem.mockImplementation(() => {
      throw new Error()
    })

    const { result } = renderHook(() => useWishlist())

    await act(async () => {
      await result.current.relocateItem('1', '2', 'item-1')
    })

    expect(toastMock.error).toHaveBeenCalledWith('Failed to move item')
  })
})

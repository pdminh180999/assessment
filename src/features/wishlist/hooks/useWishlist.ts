import { useStore } from '@/store'
import { wishlistRepository } from '@/services'
import { useToast } from '@/shared/components/Toast'
import { Wishlist, WishlistItem } from '@/shared/types/common.types'

export const useWishlist = () => {
  const toast = useToast()
  const {
    wishlists,
    setWishlists,
    currentWishlist,
    setCurrentWishlist,
    currentItem,
    setCurrentItem,
    addWishlist,
    updateWishlist,
    deleteWishlist,
    addItem,
    updateItem,
    deleteItem,
    moveItem,
    swipeIndex,
    setSwipeIndex,
    swipeLeft,
    swipeRight
  } = useStore()

  const loadWishlists = async () => {
    try {
      const data = await wishlistRepository.getAll()
      setWishlists(data)
    } catch (error) {
      toast.error('Failed to load wishlists')
    }
  }

  const createWishlist = async (data: Omit<Wishlist, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      addWishlist(data)
      toast.success('Wishlist created successfully')
    } catch (error) {
      toast.error('Failed to create wishlist')
    }
  }

  const removeWishlist = async (id: string) => {
    try {
      deleteWishlist(id)
      toast.success('Wishlist deleted')
    } catch (error) {
      toast.error('Failed to delete wishlist')
    }
  }

  const createItem = async (
    wishlistId: string,
    item: Omit<WishlistItem, 'id' | 'createdAt'>,
  ) => {
    try {
      addItem(wishlistId, item)
      toast.success('Item added to wishlist')
    } catch (error) {
      toast.error('Failed to add item')
    }
  }

  const removeItem = async (wishlistId: string, itemId: string) => {
    try {
      deleteItem(wishlistId, itemId)
      toast.success('Item removed')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const relocateItem = async (fromId: string, toId: string, id: string) => {
    try {
      moveItem(fromId, toId, id)
      toast.success('Item moved')
    } catch (error) {
      toast.error('Failed to move item')
    }
  }

  return {
    wishlists,
    loadWishlists,
    currentWishlist,
    setCurrentWishlist,
    currentItem,
    setCurrentItem,
    createWishlist,
    updateWishlist,
    removeWishlist,
    createItem,
    updateItem,
    removeItem,
    relocateItem,
    swipeIndex,
    setSwipeIndex,
    swipeLeft,
    swipeRight
  }
}

import { StateCreator } from 'zustand'
import { Wishlist, WishlistItem } from '@/shared/types/common.types'
import { generateId } from '@/shared/utils'

export interface WishlistSlice {
  wishlists: Wishlist[]
  setWishlists: (wishlists: Wishlist[]) => void
  currentWishlist: Wishlist | null
  setCurrentWishlist: (wishlists: Wishlist | null) => void
  currentItem: WishlistItem | null
  setCurrentItem: (item: WishlistItem | null) => void
  addWishlist: (data: Omit<Wishlist, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateWishlist: (id: string, updates: Partial<Wishlist>) => void
  deleteWishlist: (id: string) => void
  addItem: (wishlistId: string, item: Omit<WishlistItem, 'id' | 'createdAt'>) => void
  updateItem: (wishlistId: string, itemId: string, updates: Partial<WishlistItem>) => void
  deleteItem: (wishlistId: string, itemId: string) => void
  moveItem: (fromWishlistId: string, toWishlistId: string, itemId: string) => void
  swipeIndex: number
  setSwipeIndex: (index: number) => void
  swipeLeft: () => void
  swipeRight: () => void
}

export const createWishlistSlice: StateCreator<WishlistSlice> = (set, get) => ({
  wishlists: [],

  setWishlists: (wishlists) => set({ wishlists }),

  currentWishlist: null,

  setCurrentWishlist: (currentWishlist) => set({ currentWishlist }),

  currentItem: null,

  setCurrentItem: (currentItem) => set({ currentItem }),

  addWishlist: (data) =>
    set((state) => ({
      wishlists: [
        ...state.wishlists,
        {
          id: generateId(),
          name: data.name,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          cover: data.cover,
        },
      ],
    })),

  updateWishlist: (id, updates) =>
    set((state) => ({
      wishlists: state.wishlists.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w,
      ),
    })),

  deleteWishlist: (id) =>
    set((state) => ({
      wishlists: state.wishlists.filter((w) => w.id !== id),
    })),

  addItem: (wishlistId, item) =>
    set((state) => ({
      wishlists: state.wishlists.map((w) =>
        w.id === wishlistId
          ? {
            ...w,
            items: [
              ...w.items,
              {
                ...item,
                id: generateId(),
                createdAt: new Date().toISOString(),
              },
            ],
            updatedAt: new Date().toISOString(),
          }
          : w,
      ),
    })),

  updateItem: (wishlistId, itemId, updates) =>
    set((state) => ({
      wishlists: state.wishlists.map((w) =>
        w.id === wishlistId
          ? {
            ...w,
            items: w.items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item,
            ),
            updatedAt: new Date().toISOString(),
          }
          : w,
      ),
    })),

  deleteItem: (wishlistId, itemId) =>
    set((state) => ({
      wishlists: state.wishlists.map((w) =>
        w.id === wishlistId
          ? {
            ...w,
            items: w.items.filter((item) => item.id !== itemId),
            updatedAt: new Date().toISOString(),
          }
          : w,
      ),
    })),

  moveItem: (fromWishlistId, toWishlistId, itemId) =>
    set((state) => {
      let movedItem: WishlistItem | undefined = undefined
      let currentList: Wishlist | undefined = undefined
      const wishlistsAfterRemove = state.wishlists.map((w) => {
        if (w.id === fromWishlistId) {
          const items = w.items.filter((item) => {
            if (item.id === itemId) {
              movedItem = { ...item, wishListId: toWishlistId }
              return false
            }
            return true
          })
          currentList = {
            ...w,
            items,
            updatedAt: new Date().toISOString(),
          }
          return { ...w, items, updatedAt: new Date().toISOString() }
        }
        return w
      })
      const finalWishlists = wishlistsAfterRemove.map((w) => {
        if (w.id === toWishlistId && movedItem) {
          return {
            ...w,
            items: [...w.items, movedItem],
          }
        }
        return w
      })
      return {
        wishlists: finalWishlists,
        currentWishlist: currentList ?? state.currentWishlist,
      }
    }),

  swipeIndex: 0,

  setSwipeIndex: (index) => set({ swipeIndex: index }),

  swipeLeft: () => {
    const { currentWishlist, swipeIndex } = get()
    if (!currentWishlist) return

    const next = (swipeIndex + 1) % currentWishlist.items.length
    set({ swipeIndex: next })
  },

  swipeRight: () => {
    const { currentWishlist, swipeIndex } = get()
    if (!currentWishlist) return

    const prev =
      (swipeIndex - 1 + currentWishlist.items.length) %
      currentWishlist.items.length

    set({ swipeIndex: prev })
  },
})

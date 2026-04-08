import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import {
  createFilterSlice,
  createUISlice,
  createWishlistSlice,
  FilterSlice,
  UISlice,
  WishlistSlice,
} from '@/store/slices'

type StoreState = WishlistSlice & UISlice & FilterSlice

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (...a) => ({
        ...createWishlistSlice(...a),
        ...createUISlice(...a),
        ...createFilterSlice(...a),
      }),
      {
        name: 'wishlists',
      },
    ),
  ),
)

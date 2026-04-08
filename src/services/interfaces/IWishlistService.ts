import { Wishlist } from '@/shared/types/common.types'

export interface IWishlistService {
  getAll(): Promise<Wishlist[]>

  getById(id: string): Promise<Wishlist | null>

  create(wishlist: Omit<Wishlist, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wishlist>

  update(id: string, wishlist: Partial<Wishlist>): Promise<Wishlist>

  delete(id: string): Promise<void>
}

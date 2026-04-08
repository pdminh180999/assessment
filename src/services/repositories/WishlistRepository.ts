import { IWishlistService } from '@/services'
import { Wishlist } from '@/shared/types/common.types'

export class WishlistRepository {
  constructor(private service: IWishlistService) {
  }

  async getAll(): Promise<Wishlist[]> {
    try {
      return await this.service.getAll()
    } catch (error) {
      console.error('Failed to fetch wishlists:', error)
      throw new Error('Failed to fetch wishlists')
    }
  }

  async getById(id: string): Promise<Wishlist | null> {
    try {
      return await this.service.getById(id)
    } catch (error) {
      console.error(`Failed to fetch wishlist ${id}:`, error)
      throw new Error('Failed to fetch wishlist')
    }
  }

  async create(
    wishlist: Omit<Wishlist, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Wishlist> {
    try {
      return await this.service.create(wishlist)
    } catch (error) {
      console.error('Failed to create wishlist:', error)
      throw new Error('Failed to create wishlist')
    }
  }

  async update(id: string, updates: Partial<Wishlist>): Promise<Wishlist> {
    try {
      return await this.service.update(id, updates)
    } catch (error) {
      console.error(`Failed to update wishlist ${id}:`, error)
      throw new Error('Failed to update wishlist')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.service.delete(id)
    } catch (error) {
      console.error(`Failed to delete wishlist ${id}:`, error)
      throw new Error('Failed to delete wishlist')
    }
  }
}

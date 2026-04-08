import { IWishlistService } from '@/services'
import { Wishlist } from '@/shared/types/common.types'
import { APP_CONFIG } from '@/shared/constants'
import { storage, generateId } from '@/shared/utils'

export class LocalStorageAdapter implements IWishlistService {
  private readonly STORAGE_KEY = APP_CONFIG.STORAGE_KEY

  async getAll(): Promise<Wishlist[]> {
    const data: any = storage.get(this.STORAGE_KEY)
    return data?.state?.wishlists || []
  }

  async getById(id: string): Promise<Wishlist | null> {
    const wishlists = await this.getAll()
    return wishlists.find((w) => w.id === id) || null
  }

  async create(wishlist: Omit<Wishlist, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wishlist> {
    const wishlists = await this.getAll()
    const newWishlist: Wishlist = {
      ...wishlist,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    wishlists.push(newWishlist)
    storage.set(this.STORAGE_KEY, wishlists)
    return newWishlist
  }

  async update(id: string, updates: Wishlist): Promise<Wishlist> {
    const wishlists = await this.getAll()
    const index = wishlists.findIndex((w) => w.id === id)
    if (index === -1) throw new Error(`Wishlist with id ${id} not found`)

    const updated = {
      ...wishlists[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    wishlists[index] = updated
    storage.set(this.STORAGE_KEY, wishlists)
    return updated
  }

  async delete(id: string): Promise<void> {
    const wishlists = await this.getAll()
    const filtered = wishlists.filter((w) => w.id !== id)
    storage.set(this.STORAGE_KEY, filtered)
  }
}

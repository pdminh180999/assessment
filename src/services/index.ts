import { LocalStorageAdapter } from './adapters/LocalStorageAdapter'
import { WishlistRepository } from './repositories/WishlistRepository'

// Initialize service with LocalStorage adapter
const localStorageService = new LocalStorageAdapter()
export const wishlistRepository = new WishlistRepository(localStorageService)

export * from './interfaces/IWishlistService'
export * from './adapters/LocalStorageAdapter'
export * from './repositories/WishlistRepository'
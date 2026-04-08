export interface Wishlist {
  id: string
  name: string
  items: WishlistItem[]
  createdAt: string
  updatedAt: string
  cover: string
}

export interface WishlistItem {
  id: string
  wishlistId: string
  title: string
  description?: string
  imageUrl?: string
  createdAt: string
}

export interface ApiResponse<T> {
  data: T
  error?: string
  success: boolean
}

export interface DragState {
  isDragging: boolean
  isOverDelete: boolean
  targetStack: Wishlist | null
  offsetX: number
  offsetY: number
}

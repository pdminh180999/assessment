import {
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  DragCancelEvent,
} from '@dnd-kit/core'
import { useState } from 'react'
import { DragState, WishlistItem } from '@/shared/types'

interface Props {
  onDelete: (stackId: string, cardId: string) => void
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onMoveToStack: (fromStackId: string, toStackId: string, cardId: string) => void
}

export const useDragDrop = ({
                              onDelete,
                              onSwipeLeft,
                              onSwipeRight,
                              onMoveToStack,
                            }: Props) => {
  const [activeCard, setActiveCard] = useState<WishlistItem | null>(null)
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isOverDelete: false,
    targetStack: null,
    offsetX: 0,
    offsetY: 0,
  })

  const handleDragStart = (event: DragStartEvent) => {
    const card = event.active.data.current?.card as WishlistItem
    setActiveCard(card)
    setDragState(prev => ({ ...prev, isDragging: true }))
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { over } = event
    setDragState(prev => ({
      ...prev,
      isOverDelete: event.over?.id === 'delete-zone',
      targetStack:
        over?.data?.current?.type === 'stack'
          ? over.data.current.stack
          : null,
    }))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event
    const card = active.data.current?.card as WishlistItem

    if (!card) return

    const fromStackId = card.wishlistId

    if (over?.id === 'delete-zone') {
      onDelete(card.wishlistId, card.id)
    } else if (over?.id === 'move-left-zone') {
      onSwipeLeft()
    } else if (over?.id === 'move-right-zone') {
      onSwipeRight()
    } else if (over?.data?.current?.type === 'stack') {
      const toStackId = dragState.targetStack?.id

      if (toStackId && toStackId !== fromStackId) {
        onMoveToStack(fromStackId, toStackId, card.id)
      }
    }

    reset()
  }

  const handleDragCancel = (_: DragCancelEvent) => {
    reset()
  }

  const reset = () => {
    setActiveCard(null)
    setDragState({
      isDragging: false,
      isOverDelete: false,
      targetStack: null,
      offsetX: 0,
      offsetY: 0,
    })
  }

  return {
    activeCard,
    dragState,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
  }
}

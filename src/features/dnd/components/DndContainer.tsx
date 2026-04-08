import React, { ReactNode } from 'react'
import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { WishlistItem } from '@/shared/types'

interface DndContainerProps {
  children: ReactNode
  onDragStart?: (event: DragStartEvent) => void
  onDragMove?: (event: DragMoveEvent) => void
  onDragEnd?: (event: DragEndEvent) => void
  onDragCancel?: (event: DragCancelEvent) => void
  activeCard: WishlistItem | null
  renderOverlay?: (card: WishlistItem) => React.ReactNode
}

export const DndContainer = ({
                               children,
                               onDragStart,
                               onDragMove,
                               onDragEnd,
                               onDragCancel,
                               activeCard,
                               renderOverlay,
                             }: DndContainerProps) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      {children}

      <DragOverlay
        dropAnimation={{
          duration: 300,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {activeCard ? renderOverlay?.(activeCard) : null}
      </DragOverlay>
    </DndContext>
  )
}

import { ReactNode } from 'react'
import { Wishlist } from '@/shared/types'
import { useDroppable } from '@dnd-kit/core'

interface MoveZoneProps {
  children: ReactNode
  stack: Wishlist
}

export const StackZone = ({ children, stack }: MoveZoneProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `stack-${stack.id}`,
    data: {
      type: 'stack',
      stack: stack
    }
  });

  return (
    <div
      ref={setNodeRef}
      className="relative"
      style={{
        transform: isOver ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.2s ease'
      }}
    >
      {children}
      {isOver && (
        <div className="absolute inset-0 rounded-2xl border-4 border-blue-400 pointer-events-none animate-pulse" />
      )}
    </div>
  );
}
